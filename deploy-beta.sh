#!/bin/bash

npm run build:simidat-beta
zip -r build.zip build
scp build.zip "amm002200@simidat.ujaen.es:/home/amm002200"

ssh -t amm002200@simidat.ujaen.es "sudo docker ps"
ssh -t amm002200@simidat.ujaen.es "sudo docker cp ./build.zip container_n4l_beta:/usr/src/app"
ssh -t amm002200@simidat.ujaen.es "sudo docker exec container_n4l_beta pkill node"
ssh -t amm002200@simidat.ujaen.es "sudo docker exec container_n4l_beta rm -rf /usr/src/app/server-document-root/"
ssh -t amm002200@simidat.ujaen.es "sudo docker exec container_n4l_beta mkdir /usr/src/app/server-document-root/"
ssh -t amm002200@simidat.ujaen.es "sudo docker exec container_n4l_beta unzip /usr/src/app/build.zip -d /usr/src/app/server-document-root/"
ssh -t amm002200@simidat.ujaen.es "sudo docker exec container_n4l_beta serve /usr/src/app/server-document-root/build/"
