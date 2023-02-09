#!/bin/bash
#Creación del build
#npm i
npm run build:simidat
mkdir "build/n4l"
mv build/* build/n4l/

#Compresión del build
zip -r deploy.zip build

#Copia en el servidor
echo "¿Con qué usuario vas a copiar?"
read -r usuario
echo "$usuario"

scp deploy.zip "$usuario"@simidat.ujaen.es:/home/"$usuario"

#Ver el contenedor que necesitamos
ssh -t "$usuario"@simidat.ujaen.es "sudo docker ps"

#Copiar archivo en contenedor
echo "¿En que contenedor quieres copiar el archivo?"
read -r contenedor
echo "$contenedor"

ssh -t "$usuario"@simidat.ujaen.es "sudo docker cp ./deploy.zip $contenedor:/usr/src/app"

#Descomprimir archivo en contenedor
# ssh -t "$usuario"@simidat.ujaen.es "sudo docker exec $contenedor "
#Levantar servicio
ssh -t "$usuario"@simidat.ujaen.es "sudo docker exec $contenedor unzip deploy.zip && pkill node && serve /user/src/app/build"