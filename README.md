Nets4Learning
=============

Web platform for the design and execution of deep learning models for learning and initiation in the study of deep learning models.

The tool proposes different classical machine learning problems with known data sets to study and model different neural network architectures and training parameters. The tool addresses different examples of deep learning models such as
tabular classification, image classifier or object identification.

There are some classical problems prepared and reviewed to make predictions, the tool has the feature to pre process data sets that the user uploads, train models and predict in which class it would be classified.

## Datasets and Models

1. Tabular classification
   - [MODEL_CAR.js](src/pages/playground/0_TabularClassification/models/MODEL_CAR.js)
   - [MODEL_IRIS.js](src/pages/playground/0_TabularClassification/models/MODEL_IRIS.js)
   - [MODEL_LYMPHOGRAPHY.js](src/pages/playground/0_TabularClassification/models/MODEL_LYMPHOGRAPHY.js)
2. Regression
   - [MODEL_1_SALARY.js](src/pages/playground/1_Regression/models/MODEL_1_SALARY.js)
   - [MODEL_2_AUTO_MPG.js](src/pages/playground/1_Regression/models/MODEL_2_AUTO_MPG.js)
   - [MODEL_3_HOUSING_PRICES.js](src/pages/playground/1_Regression/models/MODEL_3_HOUSING_PRICES.js)
   - [MODEL_4_BREAST_CANCER.js](src/pages/playground/1_Regression/models/MODEL_4_BREAST_CANCER.js)
   - [MODEL_5_STUDENT_PERFORMANCE.js](src/pages/playground/1_Regression/models/MODEL_5_STUDENT_PERFORMANCE.js) 
   - [MODEL_6_WINE.js](src/pages/playground/1_Regression/models/MODEL_6_WINE.js) 
3. Image classifier
    - [MODEL_IMAGE_MNIST.js](src/pages/playground/3_ImageClassification/models/MODEL_IMAGE_MNIST.js)
    - [MODEL_IMAGE_MOBILENET.js](src/pages/playground/3_ImageClassification/models/MODEL_IMAGE_MOBILENET.js)
4. Object identification
    - [MODEL_1_FACE_DETECTOR.js](src/pages/playground/2_ObjectDetection/models/MODEL_1_FACE_DETECTOR.js)
    - [MODEL_2_FACE_MESH.js](src/pages/playground/2_ObjectDetection/models/MODEL_2_FACE_MESH.js)
    - [MODEL_3_MOVE_NET_POSE_NET.js](src/pages/playground/2_ObjectDetection/models/MODEL_3_MOVE_NET_POSE_NET.js)
    - [MODEL_4_COCO_SSD.js](src/pages/playground/2_ObjectDetection/models/MODEL_4_COCO_SSD.js)
    - [MODEL_5_FACE_API.js](src/pages/playground/2_ObjectDetection/models/MODEL_5_FACE_API.js)
    - [MODEL_6_HAND_SIGN.js](src/pages/playground/2_ObjectDetection/models/MODEL_6_HAND_SIGN.js)

## Install local

```bash
export NODE_OPTIONS="--max-old-space-size=8192"
npm install
npm start
```

### Project environment

Create the files `.env`, `.env.development`, `.env.production`, `.env.simidat`, `.env.simidat-beta`, .

```dosini
WATCHPACK_POLLING=true
FAST_REFRESH=true
NODE_ENV="production"
PUBLIC_URL="https://simidat.ujaen.es/n4l-beta"
REACT_APP_PUBLIC_URL="https://simidat.ujaen.es/n4l-beta"
REACT_APP_PATH="/n4l-beta"
REACT_APP_ENVIRONMENT="production"
REACT_APP_GA_MEASUREMENT_ID="G-XXXXXXXXXX"
REACT_APP_SHOW_NEW_FEATURE="true"
REACT_APP_NEW_FEATURE="linear-regression"
```

## Deploy with Traefik and Docker

<details>
<summary> docker-compose.yml </summary>

```bash
docker compose down n4l
docker compose build n4l
docker compose up n4l
```

```yml
networks:
 - proxy

services:
  # traefik: ...

  n4l:
    container_name: "${PROJECT_NAME}_n4l"
    build:
      context: ./Path/To/n4l-repository/
      dockerfile: Dockerfile
      args:
        ARG_BUILD: simidat
    networks:
      - proxy
    labels:
      - "traefik.http.routers.${PROJECT_NAME}_n4l.entrypoints=https"
      - "traefik.http.routers.${PROJECT_NAME}_n4l.rule=Host(`example.com`) && PathPrefix(`/n4l`)"
      - "traefik.http.routers.${PROJECT_NAME}_n4l.tls=true"
      - "traefik.http.routers.${PROJECT_NAME}_n4l.middlewares=secure-public@file,n4l-stripprefix"
      - "traefik.http.middlewares.n4l-stripprefix.stripprefix.prefixes=/n4l"
      - "traefik.http.services.n4l.loadbalancer.server.port=3000"
```

</details>

### Command matrix

|              | development | build                       |
|--------------|-------------|-----------------------------|
| Development  | `npm start` |                             |
| simidat      |             | `npm run build:simidat`     |
| simidat-beta |             | `npm run build:simidat-beta`|


```bash
node -v 
# v18.16.1
npm -v 
# 9.5.1
```