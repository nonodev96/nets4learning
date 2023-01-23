const MODEL_UPLOAD = "UPLOAD"

const MODEL_CAR = "CAR"
const MODEL_IRIS = "IRIS"

const MODEL_FACE_MESH = "FACE-MESH"
const MODEL_FACE_DETECTION = "FACE-DETECTION"
const MODEL_MOVE_NET = "MOVE-NET"

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
  MODEL_MOVE_NET
]

const LIST_MODELS_IMAGE_CLASSIFICATION = [
  MODEL_UPLOAD,
  MODEL_IMAGE_MNIST,
  MODEL_IMAGE_MOBILENET,
  MODEL_IMAGE_RESNET
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
  // Clasificación por imágenes
  LIST_MODELS_IMAGE_CLASSIFICATION,
  MODEL_IMAGE_MNIST,
  MODEL_IMAGE_MOBILENET,
  MODEL_IMAGE_RESNET
}