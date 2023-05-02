Nets4Learning
=============

Web platform for the design and execution of deep learning models for learning and initiation in the study of deep learning models.

The tool proposes different classical machine learning problems with known data sets to study and model different neural network architectures and training parameters. The tool addresses different examples of deep learning models such as
tabular classification, image classifier or object identification.

There are some classical problems prepared and reviewed to make predictions, the tool has the feature to preprocess data sets that the user uploads, train models and predict in which class it would be classified.

![sitemap](public/sitemap.png)

## MODELS

[//]: # (2. Linear regression)
[//]: # (   - TODO)

1. Tabular classification
    - [MODEL_CAR.js](src/pages/playground/0_TabularClassification/models/MODEL_CAR.js)
    - [MODEL_IRIS.js](src/pages/playground/0_TabularClassification/models/MODEL_IRIS.js)
    - [MODEL_LYMPHOGRAPHY.js](src/pages/playground/0_TabularClassification/models/MODEL_LYMPHOGRAPHY.js)
2. Image classifier
    - [MODEL_MNIST.js](src/pages/playground/3_ImageClassification/models/MODEL_MNIST.js)
    - [MODEL_MOBILENET.js](src/pages/playground/3_ImageClassification/models/MODEL_MOBILENET.js)
3. Object identification
    - [MODEL_FACE_DETECTOR.js](src/pages/playground/2_ObjectDetection/models/MODEL_FACE_DETECTOR.js)
    - [MODEL_FACE_MESH.js](src/pages/playground/2_ObjectDetection/models/MODEL_FACE_MESH.js)
    - [MODEL_MOVE_NET_POSE_NET.js](src/pages/playground/2_ObjectDetection/models/MODEL_MOVE_NET_POSE_NET.js)
    - [MODEL_COCO_SSD.js](src/pages/playground/2_ObjectDetection/models/MODEL_COCO_SSD.js)

## Deploy with docker

```bash
docker-compose up -d
```

## Install local

```bash
npm install
```

```dosini
NODE_OPTIONS=--max-old-space-size=4096
```

### Project environment variables

Create the files `.env.development` or `.env.production`.

```dosini
FAST_REFRESH=true
NODE_ENV="development"
PUBLIC_URL="http://localhost:3000/n4l"
REACT_APP_PUBLIC_URL="http://localhost:3000/n4l"
REACT_APP_PATH="/n4l"
REACT_APP_ENVIRONMENT="development"
REACT_APP_GA_MEASUREMENT_ID="G-XXXXXXXXXX"
GENERATE_SOURCEMAP=false
```

### Development

```bash
npm run start:development
```

### Build

```bash
npm run build:production
```

### Command matrix

|             | development                 | build                      |
|-------------|-----------------------------|----------------------------|
| Development | `npm run start:development` |                            |
| Production  | `npm run start:production`  | `npm run build:production` |
| simidat     |                             | `npm run build:simidat`    |