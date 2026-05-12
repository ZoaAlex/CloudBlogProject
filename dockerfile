FROM ghost:5-alpine

# Copie ton thème custom dans l'image
COPY ./content/themes/mon-theme /var/lib/ghost/content/themes/mon-theme