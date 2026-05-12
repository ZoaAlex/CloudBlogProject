FROM ghost:5-alpine

# Copie ton thème custom dans l'image
COPY ./content/themes/ /var/lib/ghost/content/themes/