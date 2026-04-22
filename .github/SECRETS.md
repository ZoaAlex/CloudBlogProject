# Secrets GitHub Actions requis

À configurer dans : **Settings → Secrets and variables → Actions**

## Docker Hub

| Secret | Description |
|---|---|
| `DOCKER_USERNAME` | Ton nom d'utilisateur Docker Hub |
| `DOCKER_PASSWORD` | Ton token Docker Hub (pas le mot de passe) |

## Serveur de production

| Secret | Description |
|---|---|
| `SSH_HOST` | IP ou domaine du serveur |
| `SSH_USER` | Utilisateur SSH (ex: `ubuntu`, `deploy`) |
| `SSH_PRIVATE_KEY` | Clé privée SSH (contenu du fichier `~/.ssh/id_rsa`) |
| `SSH_PORT` | Port SSH (optionnel, défaut : `22`) |
| `DEPLOY_PATH` | Chemin du projet sur le serveur (ex: `/home/ubuntu/ghost-blog`) |

## Générer une clé SSH dédiée au déploiement

```bash
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/deploy_key -N ""
# Ajouter deploy_key.pub dans ~/.ssh/authorized_keys sur le serveur
# Copier le contenu de deploy_key dans le secret SSH_PRIVATE_KEY
```
