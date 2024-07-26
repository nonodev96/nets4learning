ARG ARG_BUILD
FROM node:18-alpine

USER sonarqube

RUN apk --no-cache add bash
RUN apk --no-cache add xsel

ENV NODE_OPTIONS="--max-old-space-size=8192"
RUN npm install -g serve@14.2.1

WORKDIR /usr/src/app
COPY . /usr/src/app

ARG ARG_BUILD
ENV ARG_BUILD=${ARG_BUILD}

RUN npm install
RUN npm run build:${ARG_BUILD}

EXPOSE 3000

CMD bash /usr/src/app/Scripts/n4l_start.sh