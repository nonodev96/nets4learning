FROM node
WORKDIR /usr/src/app
COPY deploy.zip .
RUN apt update
RUN apt upgrade -y
RUN apt install zip
RUN unzip deploy.zip
RUN apt install xsel
RUN npm install -g serve
EXPOSE 3000