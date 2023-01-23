const MODEL_UPLOAD = "UPLOAD"

const MODEL_CAR = "CAR"
const MODEL_IRIS = "IRIS"

const MODEL_FACE_MESH = "FACE-MESH"
const MODEL_FACE_DETECTION = "FACE-DETECTION"
const MODEL_MOVE_NET = "MOVE-NET"
const MODEL_COCO_SSD = "COCO-SSD"

const MODEL_IMAGE_MNIST = "MNIST"
const MODEL_IMAGE_MOBILENET = "MOBILE-NET"
const MODEL_IMAGE_RESNET = "RES-NET"

const LIST_MODELS_CLASSIC_CLASSIFICATION = [
  MODEL_UPLOAD,
  MODEL_CAR,
  MODEL_IRIS
]

const LIST_MODELS_OBJECT_DETECTION = [
  MODEL_UPLOAD,
  MODEL_FACE_DETECTION,
  MODEL_FACE_MESH,
  MODEL_MOVE_NET,
  MODEL_COCO_SSD
]

const LIST_MODELS_IMAGE_CLASSIFICATION = [
  MODEL_UPLOAD,
  MODEL_IMAGE_MNIST,
  MODEL_IMAGE_MOBILENET,
  MODEL_IMAGE_RESNET
]

const LIST_TYPE_MODELS = [
  'Clasificación clásica',
  'Regresión lineal',
  'Identificación de objetos',
  'Clasificador de imágenes',
]

const LIST_TYPE_MODELS_DESCRIPTION = [
  "Empieza de cero y crea tu propia arquitectura",
  "Edita una arquitectura hecho por tí o facilitado por nosotros",
  "Entrena un modelo hecho por tí o  si no tienes, no te preocupes te prestamos uno :)",
  "Ejecutar un modelo hecho por tí o facilitado por nosotros"
];

const LIST_MODELS = [
  [
    'SUBIR MODELO PROPIO',
    'CLASIFICACIÓN DE COCHES',
    'IRIS-DATA - CLASIFICACIÓN DE PLANTA IRIS'
  ],
  [],
  [
    'SUBIR MODELO PROPIO',
    'GEOMETRÍA FACIAL',
    "FACE MESH",
    "DETECTOR DE ARTICULACIONES",
    "DETECTOR DE OBJETOS"
  ],
  [
    'SUBIR MODELO PROPIO',
    'MNIST - CLASIFICACIÓN DE NÚMEROS',
    'CLASIFICADOR DE IMÁGENES - MOBILENET',
    'CLASIFICADOR DE IMÁGENES - RESNET V2'
  ],
]

const getNameDatasetByID_ClassicClassification = (dataSet) => {
  switch (dataSet) {
    case '0':
      return MODEL_UPLOAD
    case '1':
      return MODEL_CAR
    case '2':
      return MODEL_IRIS
  }
}


const getNameDatasetByID_ObjectDetection = (dataSet) => {
  switch (dataSet) {
    case '0':
      return MODEL_UPLOAD
    case '1':
      return MODEL_FACE_DETECTION
    case '2':
      return MODEL_FACE_MESH
    case '3':
      return MODEL_MOVE_NET
    case '4':
      return MODEL_COCO_SSD
  }
}
// TODO
const getNameDatasetByID_ImageClassification = (dataSet) => {
  switch (dataSet) {
    case '0':
      return MODEL_UPLOAD
    case '1':
      return MODEL_IMAGE_MNIST
    case '2':
      return MODEL_IMAGE_MOBILENET
    case '3':
      return MODEL_IMAGE_RESNET
  }
}

export {
  getNameDatasetByID_ClassicClassification,
  getNameDatasetByID_ObjectDetection,
  getNameDatasetByID_ImageClassification,
  LIST_MODELS,
  LIST_TYPE_MODELS,
  LIST_TYPE_MODELS_DESCRIPTION,
  // Genérico para todos
  MODEL_UPLOAD,
  // Clasificación clásica
  LIST_MODELS_CLASSIC_CLASSIFICATION,
  MODEL_CAR,
  MODEL_IRIS,
  // Identificación de objetos
  LIST_MODELS_OBJECT_DETECTION,
  MODEL_FACE_DETECTION,
  MODEL_FACE_MESH,
  MODEL_MOVE_NET,
  MODEL_COCO_SSD,
  // Clasificación por imágenes
  LIST_MODELS_IMAGE_CLASSIFICATION,
  MODEL_IMAGE_MNIST,
  MODEL_IMAGE_MOBILENET,
  MODEL_IMAGE_RESNET
}