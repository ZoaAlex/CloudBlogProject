FROM ghost:5-alpine

# Copie du thème personnalisé dans l'image
COPY content/themes/ /var/lib/ghost/content/themes/

# Ghost écoute sur le port 2368
EXPOSE 2368
