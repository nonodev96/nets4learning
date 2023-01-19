const MODEL_UPLOAD = "UPLOAD"
const MODEL_CAR = "CAR"
const MODEL_IRIS = "IRIS"
const MODEL_MULTIPOSE = "MULTIPOSE"
const MODEL_IMAGE = "IMAGE"
const MODEL_MNIST = "MNIST"


const MODEL_FACE_DETECTION = "FACE-DETECTION"
const MODEL_FACE_MESH = "FACE-MESH"
const MODEL_MOVE_NET = "MOVE-NET"

const getNameDatasetByID_ClassicClassification = (dataSet) => {
  switch (dataSet) {
    case '0':
      return MODEL_UPLOAD;
    case '1':
      return MODEL_CAR;
    case '2':
      return MODEL_IRIS;
  }
}


const getNameDatasetByID_ObjectDetection = (dataSet) => {
  switch (dataSet) {
    case '0':
      return MODEL_UPLOAD;
    case '1':
      return MODEL_FACE_DETECTION;
    case '2':
      return MODEL_FACE_MESH;
    case '3':
      return MODEL_MOVE_NET;
  }
}
const getNameDatasetByID_ImageClassification = (dataSet) => {
  switch (dataSet) {
    case '0':
      return MODEL_UPLOAD;
    case '1':
      return MODEL_FACE_DETECTION;
    case '2':
      return MODEL_FACE_MESH;
    case '3':
      return MODEL_MOVE_NET;
  }
}

export {
  getNameDatasetByID_ClassicClassification,
  getNameDatasetByID_ObjectDetection,
  getNameDatasetByID_ImageClassification,

  // Genérico para todos
  MODEL_UPLOAD,
  // Clasificación clásica
  MODEL_CAR,
  MODEL_IRIS,
  // Identificación de objetos
  MODEL_FACE_DETECTION,
  MODEL_FACE_MESH,
  MODEL_MOVE_NET,
  // Clasificación por imágenes
  MODEL_MNIST,
  MODEL_IMAGE,
  MODEL_MULTIPOSE,
}