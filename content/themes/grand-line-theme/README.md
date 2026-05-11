# ⚓ Grand Line — Thème Ghost One Piece

Un thème Ghost premium inspiré de l'univers d'Eiichiro Oda : mer profonde, or du Ponéglyphe, et aventure épique.

## Structure des fichiers

```
grand-line-theme/
├── default.hbs          # Layout de base (toutes les pages)
├── index.hbs            # Page d'accueil
├── post.hbs             # Article individuel
├── page.hbs             # Page statique
├── tag.hbs              # Archive par tag
├── author.hbs           # Archive par auteur
├── error-404.hbs        # Page d'erreur 404
├── package.json         # Métadonnées du thème Ghost
├── partials/
│   ├── navigation.hbs   # Barre de navigation + overlay de recherche
│   ├── footer.hbs       # Pied de page
│   ├── post-card.hbs    # Carte d'article réutilisable
│   └── wave-divider.hbs # Séparateur vague SVG décoratif
└── assets/
    ├── css/
    │   └── screen.css   # Styles complets du thème
    └── js/
        └── main.js      # JavaScript interactif
```

## Palette de couleurs

| Variable             | Valeur    | Usage                        |
|----------------------|-----------|------------------------------|
| `--color-navy`       | `#0a0e1a` | Fond principal               |
| `--color-deep-sea`   | `#0d1b2a` | Fond secondaire / footer     |
| `--color-ocean`      | `#112d45` | Fond des cartes              |
| `--color-gold`       | `#c9922a` | Accents, bordures, tags      |
| `--color-gold-light` | `#f0bc5e` | Liens, titres accentués      |
| `--color-gold-shine` | `#ffd97a` | Hover, highlights            |
| `--color-cream`      | `#f5ead8` | Texte principal              |
| `--color-parchment`  | `#e8d5b0` | Texte secondaire             |

## Typographie

- **Display :** Cinzel Decorative (titres principaux)
- **Heading :** Cinzel (sous-titres, nav, labels)
- **Body :** Crimson Pro (corps de texte)

## Tags suggérés pour Ghost

Crée ces tags dans l'admin Ghost pour bien structurer le contenu :

- `arcs` — Arcs narratifs (East Blue, Alabasta, Marineford…)
- `personnages` — Analyses de personnages
- `theories` — Théories et prédictions
- `nakama` — Les membres de l'équipage Chapeau de Paille
- `fruits-du-demon` — Encyclopédie des Fruits du Démon
- `haki` — Tout sur le Haki
- `monde` — Géographie, histoire, factions
- `anime` — Actualité de l'anime
- `manga` — Analyse des chapitres

## Installation dans Ghost

1. Compresse le dossier `grand-line-theme/` en `.zip`
2. Dans Ghost Admin → Appearance → Upload a theme
3. Active le thème
4. Configure dans Ghost Admin :
   - **Title :** Nom de ton blog (ex: "Grand Line Chronicle")
   - **Description :** Sous-titre accrocheur
   - **Cover image :** Image panoramique (1440×600px recommandé)
   - **Logo :** Logo du blog (PNG transparent recommandé)

## Fonctionnalités

- ✅ Responsive (mobile-first)
- ✅ Barre de progression de lecture
- ✅ Navigation sticky avec effet scroll
- ✅ Overlay de recherche (Ctrl+K)
- ✅ Animations d'entrée au scroll (Intersection Observer)
- ✅ Articles liés automatiques
- ✅ Boîte auteur
- ✅ Bouton copier le code
- ✅ Ghost Members / newsletter intégré
- ✅ Pagination
- ✅ Page 404 thématique
- ✅ SEO (itemprop, meta, structured data)
- ✅ Accessibilité (aria-labels, rôles, tabindex)

---

*One Piece © Eiichiro Oda / Shueisha. Ce thème est un projet fan indépendant.*
