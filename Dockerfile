FROM ghost:5-alpine

LABEL org.opencontainers.image.title="Grand Line Blog"
LABEL org.opencontainers.image.description="Ghost CMS with One Piece Grand Line theme"
LABEL org.opencontainers.image.source="https://github.com/ZoaAlex/CloudBlogProject"

# Copie du thème custom dans l'image
COPY content/themes/grand-line-theme /var/lib/ghost/content/themes/grand-line-theme

# Copie des routes Ghost
COPY content/settings/routes.yaml /var/lib/ghost/content/settings/routes.yaml

EXPOSE 2368
