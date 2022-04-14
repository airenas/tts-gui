#!/bin/sh
echo Configuring BASE_HREF to "$BASE_HREF"
sed -i "s|<base href=\"/\">|<base href=\"$BASE_HREF\">|" /usr/share/nginx/html/index.html

echo Configuring MODELS_URL to "$MODELS_URL"
sed -i "s|/synthesis.data/models.json|$MODELS_URL|" /usr/share/nginx/html/index.html
echo Env conf done

echo Configuring SERVICE_URL to "$SERVICE_URL"
sed -i "s|https://sinteze.intelektika.lt|$SERVICE_URL|" /usr/share/nginx/html/index.html
echo Env conf done