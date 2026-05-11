
---

```markdown
# Processus CI/CD et déploiement de Ghost sur AWS EC2 avec ECR, S3 et SSH

## Architecture cible (simplifiée)

```
┌──────────┐     ┌──────────────┐     ┌────────────┐     ┌──────────┐
│ GitHub   │────▶│ GitHub       │────▶│ Amazon ECR │     │ EC2      │
│ (code)   │     │ Actions      │     │ (image)    │     │ (prod)   │
└──────────┘     └──────────────┘     └────────────┘     └────┬─────┘
                        │                                      │
                        │                                      │ docker pull
                        │                                      ▼
                        │                               ┌─────────────┐
                        └──────────────────────────────▶│ AWS Secrets │
                                           SSH          │ Manager     │
                                                        └─────────────┘
                                                              │
                                                              ▼
                                                        ┌──────────┐
                                                        │   S3     │
                                                        │ (médias) │
                                                        └──────────┘
```

**Flux résumé** :
1. Push du code (thème Ghost, docker-compose.yml, scripts)
2. GitHub Actions construit **une image Docker** à partir de `ghost:5-alpine` + injection du thème personnalisé
3. Image poussée vers **ECR**
4. Connexion **SSH** à l'EC2 depuis le pipeline
5. Sur l'EC2 : `docker pull` depuis ECR puis `docker-compose up -d`
6. Ghost lit ses secrets depuis **AWS Secrets Manager**
7. Les images médias sont stockées sur **S3**

---

## 1. Prérequis AWS

### 1.1 Bucket S3 pour les médias
- Nom : `ghost-media-<projet>`
- Accès public en lecture (ou via CloudFront)


### 1.2 Registre ECR
```bash
aws ecr create-repository --repository-name ghost-app --region eu-west-1
```
→ URI du repo : `<account-id>.dkr.ecr.eu-west-1.amazonaws.com/ghost-app`

### 1.3 Utilisateur IAM pour GitHub Actions
- Nom : `github-actions-ghost`
- Politiques :
  - `AmazonEC2ContainerRegistryFullAccess`
  - `AmazonSSMFullAccess` (optionnel, pour debug)
- Générer des **Access Keys** → secrets GitHub :
  - `AWS_ACCESS_KEY_ID`
  - `AWS_SECRET_ACCESS_KEY`

### 1.4 Clé SSH pour le pipeline
```bash
ssh-keygen -t rsa -b 4096 -f ghost_ci -N ""
```
- Ajouter `ghost_ci.pub` dans `/home/ec2-user/.ssh/authorized_keys` sur l'EC2
- Stocker `ghost_ci` (clé privée) dans GitHub Secrets : `EC2_SSH_PRIVATE_KEY`

### 1.5 Secret AWS pour Ghost
```bash
aws secretsmanager create-secret --name ghost/config --secret-string '{
  "DATASOURCE_USERNAME":"ghost",
  "DATASOURCE_PASSWORD":"securepassword",
  "DATASOURCE_ROOT_PASSWORD":"rootsecure",
  "BREVO_PASSWORD":"xsmtpsib-...",
  "BREVO_USER":"...@smtp-brevo.com",
  "GHOST_URL":"https://votredomaine.com",
  "S3_ACCESS_KEY_ID":"AKIA...",
  "S3_SECRET_ACCESS_KEY":"...",
  "S3_REGION":"eu-west-1",
  "S3_BUCKET":"ghost-media-<projet>"
}'
```

### 1.6 Rôle IAM pour l'EC2
Attacher à l'instance EC2 un rôle avec :
- `SecretsManagerReadWrite` (ou `GetSecretValue`)
- `AmazonS3ReadOnlyAccess` (ou politique spécifique au bucket)

---

## 3. Scripts nécessaires sur l'EC2 (versionnés)



---

## 4. Pipeline CI/CD (GitHub Actions)


---

## 5. Configuration manuelle initiale sur l'EC2

Une seule fois (à faire en Session Manager ou SSH) :

```bash
# Installer Docker, Compose, AWS CLI, jq
sudo dnf install docker jq awscli -y
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ec2-user

# Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Structure du projet
mkdir -p /home/ec2-user/ghost/scripts
cd /home/ec2-user/ghost
git clone https://github.com/votre-org/ghost-deploy.git .
```

---

## 6. Ce qui se passe pendant le déploiement

| Étape | Détail |
|-------|--------|
| 1 | GitHub Actions construit une image **à partir de l'image officielle Ghost** en y injectant le thème personnalisé |
| 2 | L'image est taggée et poussée vers **ECR** |
| 3 | Le pipeline se connecte à l'EC2 via **SSH** (pas Session Manager) |
| 4 | Sur l'EC2 : `docker pull` de la nouvelle image depuis ECR |
| 5 | Le fichier `docker-compose.yml` est mis à jour avec la nouvelle image |
| 6 | Les scripts `load_secrets.sh` et `generate_config.sh` sont exécutés |
| 7 | Les conteneurs sont recréés (`docker-compose down && up -d`) |
| 8 | Ghost redémarre avec la nouvelle image et la config S3 |

---

## 7. Vérifications post-déploiement

```bash
# Depuis l'EC2
docker ps | grep ghost
docker-compose logs --tail=30

# Depuis votre PC
curl -I https://votredomaine.com/ghost/api/v4/admin/site/
```

---

## 8. Bonnes pratiques et optimisations futures

- **Ne pas tagger `:latest`** : utiliser le commit hash (ex: `sha-7a8f3d1`)
- **Ne pas stocker les clés IAM ou SSH en clair dans GitHub** (toujours via Secrets)
- **Remplacer SSH par AWS Systems Manager Run Command** pour plus de sécurité (pas de port 22 ouvert)
- **Ajouter CloudFront devant S3** pour les images
- **Passer à ECS (Elastic Container Service)** si vous voulez éviter de gérer l'EC2

---

## 9. Problèmes fréquents

| Erreur | Cause | Solution |
|--------|-------|----------|
| `Permission denied (publickey)` | Clé SSH absente de `authorized_keys` | Ajouter `ghost_ci.pub` sur l'EC2 |
| `docker pull` échoue | EC2 pas authentifié sur ECR | Exécuter `aws ecr get-login-password` avant `docker pull` |
| Le thème n'apparaît pas | Thème pas copié dans l'image | Vérifier le `COPY` dans le Dockerfile |
| S3 stockage ne fonctionne pas | Variables d'environnement absentes | Vérifier `generate_config.sh` et le volume monté |

---

## 10. Conclusion

Ce pipeline permet :

- ✅ De versionner le thème Ghost sur GitHub
- ✅ De construire automatiquement une image Docker à chaque push
- ✅ De pousser l'image vers Amazon ECR
- ✅ De déployer sur EC2 via une simple connexion SSH
- ✅ D'utiliser S3 pour les images médias
- ✅ De ne jamais stocker de secrets en clair (AWS Secrets Manager)
```


## Récapitulatif : commandes exécutées sur l'EC2 (Amazon Linux 2023)

### 1. Connexion (depuis ton PC)
```bash
aws ssm start-session --target i-0606e332ea14aec0a
```

### 2. Installation de Docker
```bash
sudo dnf install docker -y
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER
# puis déconnexion/reconnexion ou newgrp docker
```

### 3. Installation de Docker Compose (manuellement)
```bash
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 4. Installation de `jq` (parser JSON)
```bash
sudo dnf install jq -y
```

### 5. Installation de Git
```bash
sudo dnf install git -y
```

### 6. Gestion des secrets via AWS CLI
```bash
# AWS CLI est préinstallé sur Amazon Linux 2023
aws secretsmanager get-secret-value --secret-id ghost/config --region eu-west-1 --query SecretString --output text
```

### 7. Lancement de l'application
```bash
cd /home/ec2-user/ghost
source ./load_secrets.sh
docker-compose up -d
```

---

## Ce qui change selon la distribution Linux

| Opération | Amazon Linux 2023 (ton cas) | Ubuntu/Debian |
|-----------|----------------------------|---------------|
| Gestionnaire de paquets | `dnf` | `apt` |
| Installer Docker | `sudo dnf install docker -y` | `sudo apt install docker.io -y` |
| Installer Docker Compose | Manuel (`curl`) | `sudo apt install docker-compose -y` |
| Installer jq | `sudo dnf install jq -y` | `sudo apt install jq -y` |
| Installer Git | `sudo dnf install git -y` | `sudo apt install git -y` |
| AWS CLI | Préinstallé | À installer manuellement |
| Utilisateur par défaut | `ec2-user` | `ubuntu` |

---

## Tableau de synthèse pour ton rapport

Tu peux ajouter ce tableau dans ton rapport pour lever tout doute :

```markdown
| Opération | Commande sur EC2 (Amazon Linux 2023) |
|-----------|--------------------------------------|
| Se connecter | `aws ssm start-session --target <instance-id>` |
| Installer Docker | `sudo dnf install docker -y` |
| Démarrer Docker | `sudo systemctl start docker` |
| Activer Docker au boot | `sudo systemctl enable docker` |
| Installer Docker Compose | `sudo curl -L ... -o /usr/local/bin/docker-compose` |
| Installer jq | `sudo dnf install jq -y` |
| Installer Git | `sudo dnf install git -y` |
| Lire un secret AWS | `aws secretsmanager get-secret-value --secret-id ghost/config --query SecretString --output text` |
| Lancer Ghost | `docker-compose up -d` |
| Voir les logs | `docker-compose logs -f` |
```

---
