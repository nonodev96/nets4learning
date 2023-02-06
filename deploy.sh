#!/bin/bash
#Creación del build
#npm run build

#Compresión del build
zip -r build.zip build

#Copia en el servidor
echo "¿Con qué usuario vas a copiar?"
read usuario



echo $usuario
scp build.zip $usuario@simidat.ujaen.es:/home/$usuario

#Ver el contenedor que necesitamos
ssh -t $usuario@simidat.ujaen.es "sudo docker ps"

#Copiar archivo en contenedor
echo "¿En que contenedor quieres copiar el archivo?"
read contenedor

ssh -t $usuario@simidat.ujaen.es "sudo docker cp build.zip "  $contenedor " /usr/src/app"

#Descomprimir archivo en contenedor
ssh -t $usuario@simidat.ujaen.es "sudo docker exec " $contenedor  " unzip build.zip"

#Levantar servicio
ssh -t $usuario@simidat.ujaen.es "sudo docker exec "  $contenedor  " serve ."