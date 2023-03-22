## INSTALL

```bash
npm install
```

## BUILD

```env
NODE_OPTIONS=--max-old-space-size=4096
```

```bash
npm run build:simidat
```


## MODELS

1. Tabular classification
   - [MODEL_CAR.js](src/pages/playground/0_TabularClassification/models/MODEL_CAR.js)
   - [MODEL_IRIS.js](src/pages/playground/0_TabularClassification/models/MODEL_IRIS.js)
   - [MODEL_LYMPHOGRAPHY.js](src/pages/playground/0_TabularClassification/models/MODEL_LYMPHOGRAPHY.js)
2. Linear regression
   - TODO
3. Object detection
   - [MODEL_FACE_DETECTOR.js](src/pages/playground/2_ObjectDetection/models/MODEL_FACE_DETECTOR.js)
   - [MODEL_FACE_MESH.js](src/pages/playground/2_ObjectDetection/models/MODEL_FACE_MESH.js)
   - [MODEL_MOVE_NET_POSE_NET.js](src/pages/playground/2_ObjectDetection/models/MODEL_MOVE_NET_POSE_NET.js)
   - [MODEL_COCO_SSD.js](src/pages/playground/2_ObjectDetection/models/MODEL_COCO_SSD.js)
4. Image classifier
   - [MODEL_MNIST.js](src/pages/playground/3_ImageClassification/models/MODEL_MNIST.js)
   - [MODEL_MOBILENET.js](src/pages/playground/3_ImageClassification/models/MODEL_MOBILENET.js)

## i18n

### Install

```bash
npm install -g i18n-json-to-xlsx-converter
```



```
i18n-json-to-xlsx-converter --convert translation.json

Processing!
Converting JSON to XLSX for the file
translation.json

Output file name is translation.xlsx
Location of the created file is
/path/to/nets4learning/public/locales/translation.json
```

### Convert json to xlsx

```bash
i18n-json-to-xlsx-converter --convert translation.json
```

### Convert xlsx to multiples json

| key          | en_US | es_ES |
|--------------|-------|-------|
| example.text | Text  | Texto |

```bash
i18n-json-to-xlsx-converter --convert translations.xlsx
```

```
Processing!
Converting XLSX to JSON for the file
translations.xlsx

Output file name for es_ES is es_es.json
Location of the created file is
/path/to/nets4learning/public/locales/es/es_es.json

Output file name for en_US is en_us.json
Location of the created file is
/path/to/nets4learning/public/locales/es/en_us.json

File conversion is successful!
```