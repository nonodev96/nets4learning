import React from "react";

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

const LIST_MODEL_OPTIONS = [
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

export const DATASET_DESCRIPTION = [
  [
    'DATASET PROPIO',
    <>
      <p>El conjunto de datos "Car Evaluation" permite evaluar vehículos a través de la siguiente estructura:</p>
      <ul>
        <li><b>CAR</b> Aceptación del vehículo</li>
        <li>
          <b>PRICE:</b> Precio en general
          <ul>
            <li><b>BUTING:</b> Precio de compra</li>
            <li><b>MAINT:</b> Costo del mantenimiento</li>
          </ul>
        </li>
        <li>
          <b>TECH:</b> Características técnicas
          <ul>
            <li>
              <b>COMFORT:</b> Comfort
              <ul>
                <li><b>DOORS:</b> Nº de puertas</li>
                <li><b>PERSONS:</b> Nº de plazas</li>
                <li><b>LUG_BOOT:</b> Tamaño del maletero</li>
              </ul>
            </li>
            <li><b>SAFETY:</b> Seguridad estimada del vehículo</li>
          </ul>
        </li>
      </ul>

      <p>Estos son los valores de entrada que podrá tomar la red.</p>
      <ul>
        <li><b>buying:</b> vhigh, high, med, low.</li>
        <li><b>maint:</b> vhigh, high, med, low.</li>
        <li><b>doors:</b> 2, 3, 4, 5more.</li>
        <li><b>persons:</b> 2, 4, more.</li>
        <li><b>lug_boot:</b> small, med, big.</li>
        <li><b>safety:</b> low, med, high.</li>
      </ul>

      <p>Por último los posibles valores que puede dar son:</p>
      <ul>
        <li><b>UNACC</b> - Inaccesible</li>
        <li><b>ACC</b> - Accesible</li>
        <li><b>GOOD</b> - Bien</li>
        <li><b>VGOOD</b> - Muy bien</li>
      </ul>

      <p>
        Para obtener más información acerca de este conjunto de datos visita{" "}
        <a target="_blank" href="https://archive.ics.uci.edu/ml/datasets/Car+Evaluation">esta web</a>{" "}
        (<a target="_blank" href="https://archive.ics.uci.edu/ml/machine-learning-databases/car/">Modelo</a>)
      </p>
    </>,
    <>
      <p>
        El conjunto de datos de Iris-Data permite detectar que tipo de planta iris es a partir de altitud y longitud de
        su pétalo y sépalo.
      </p>

      <p>Tiene la siguiente estructura:</p>
      <ul>
        <li>Longitud del sépalo en cm</li>
        <li>Anchura del sépalo en cm</li>
        <li>Longitud del pétalo en cm</li>
        <li>Anchura del pétalo en cm</li>
      </ul>

      <p>Por último los posibles valores que puede dar son:</p>
      <ul>
        <li>Iris Setosa</li>
        <li>Iris Versicolour</li>
        <li>Iris Virginica</li>
      </ul>
    </>,
  ],
  [],
  [
    'DATASET PROPIO',
    <>
      <p>
        Este modelo es proporcionado por el hub de modelos de tensorflow.
        Este modelo lo podemos encontrar <a target="blank"
                                            href="https://tfhub.dev/mediapipe/tfjs-model/facemesh/1/default/1">aquí</a>.
        Este modelo a partir de una imagen o vídeo de entrada, es capaz de reconocer diferentes puntos de la cara para
        finalmente hacer una malla de la misma.
      </p>

      <p>Datos de entrada:</p>
      <ul>
        <li>Imagen o vídeo de entrada.</li>
      </ul>

      <p>Datos de salida:</p>
      <ul>
        <li>Mismo elemento de entrada con una serie de puntos que delimitan la malla de la cara.</li>
      </ul>
    </>,
    <>
      <p>
        Este modelo es proporcionado por el HUB de modelos de tensorflow.
        Este modelo lo podemos encontrar <a target="blank"
                                            href="https://tfhub.dev/mediapipe/tfjs-model/face_detection/short/1">aquí</a>.
        Este modelo es capaz de reconocer a partir de una imagen o vídeo de entrada diferentes partes de la cara, como
        los ojos, orejas, nariz y boca.
      </p>

      <p>Datos de entrada:</p>
      <ul>
        <li>Imagen o vídeo.</li>
      </ul>

      <p>Datos de salida:</p>
      <ul>
        <li>Mismo elemento de entrada con una serie de puntos que delimitan las diferentes partes de la cara.</li>
      </ul>
    </>,
    <>
      <p>
        PoseNet es un modelo de aprendizaje automático capaz de reconocer la pose del cuerpo en tiempo real.
        Se puede usar para estimar una sola pose o varias a la vez.
        En el siguiente ejemplo, para que su impacto en el rendimiento sea menor solamente detecta una pose a la vez.
      </p>

      <p>Datos de entrada:</p>
      <ul>
        <li>Imogen o vídeo(webcam) a color.</li>
      </ul>

      <p>Datos de salida:</p>
      <ul>
        <li>
          Mismo elemento de entrada con una serie de puntos y líneas que delimitan diferentes puntos de la cara
          ademas de hombros, codos, manos, pies, rodillas y cadera.
        </li>
      </ul>
    </>,
    <>
      <p>Pendiente</p>
    </>
  ],
  [
    'DATASET PROPIO',
    <>
      <p>
        La base de datos <b>MNIST</b> es una gran base de datos de dígitos escritos a mano.
        La base de datos se usa ampliamente para capacitación y pruebas en el campo del aprendizaje automático.
      </p>
      <p>
        Fue creado "re-mezclando" las muestras de los conjuntos de datos originales del NIST.
      </p>
      <p>
        El conjunto de datos de capacitación del NIST se tomó de la Oficina del Censo de los Estados Unidos.
        Además, las imágenes en blanco y negro del NIST se normalizaron para encajar en un cuadro delimitador de
        <b> 28x28 píxeles</b> y se suavizaron, lo que introdujo niveles de escala de grises.
      </p>

      <p>Datos de entrada:</p>
      <ul>
        <li>Imogen en escala de grises y con un tamaño de 28x28 píxeles</li>
      </ul>

      <p>Por último los posibles valores que puede dar son:</p>
      <ul>
        <li>Un número entre 0 y 9</li>
      </ul>
    </>,
    <>
      <p>
        MobileNet V2 es una familia de arquitecturas de redes neuronales para la clasificación de imágenes y tareas
        similares. <br/>
        Originalmente fue publicado por Mark Sandler, Andrew Howard, Menglong Zhu, Andrey Zhmoginov, Liang-Chieh Chen:
        <a target="_blank" rel="noreferrer" href="https://arxiv.org/abs/1801.04381">
          "Inverted Residuals and Linear Bottlenecks: Mobile Networks for Classification, Detection and Segmentation"
        </a>, 2018.
      </p>

      <p>Datos de entrada:</p>
      <ul>
        <li>Imogen con valores de color entre [0,1] de 224x224 píxeles.</li>
      </ul>

      <p>Por último los posibles valores que puede dar son:</p>
      <ul>
        <li>
          Un número de 0 a 1001 que son cada una de las categorías de esta
          <a rel="noreferrer" target="_blank"
             href="https://storage.googleapis.com/download.tensorflow.org/data/ImageNetLabels.txt">lista</a>
        </li>
      </ul>
    </>,
    <>
      <p>
        ResNet V2 es una familiar de redes de arquitecturas para la clasificación de imágenes con un número variable
        de capas.
        Están basadas en la arquitectura ResNet original publicada por Kaiming He, Xiangyu Zhang, Shaoqing Ren, Jian
        Sun:
        <a rel="noreferrer" target={'_blank'} href="https://arxiv.org/abs/1512.03385">
          "Deep Residual Learning for Image Recognition"
        </a>, 2015.
      </p>
      <p>
        La variación "V2" utilizada en el modelo que vamos a usar fue realizada por Kaiming He, Xiangyu Zhang,
        Shaoqing Ren, Jian Sun:{' '}
        <a rel="noreferrer" target={'_blank'} href="https://arxiv.org/abs/1603.05027">
          "Identity Mappings in Deep Residual Networks"</a>, 2016.
      </p>
      <p>
        La diferencia con ResNet V1 es el uso de la normalización por lotes antes de cada capa de peso. El modelo
        cargado usa un total de 50 capas.
      </p>

      <p>Datos de entrada:</p>
      <ul>
        <li>Imogen con valores de color entre [0,1] de 224x224 píxeles.</li>
      </ul>

      <p>Por último los posibles valores que puede dar son:</p>
      <ul>
        <li>Un número de 0 a 1001 que son cada una de las categorías de esta
          <a rel="noreferrer" target="_blank"
             href="https://storage.googleapis.com/download.tensorflow.org/data/ImageNetLabels.txt">lista</a>
        </li>
      </ul>
    </>,
  ],
]

export const getHTML_DATASET_DESCRIPTION = (row, dataset) => {
  console.log({ row, dataset })
  return DATASET_DESCRIPTION[row][dataset];
}

const getNameDatasetByID_ClassicClassification = (dataSet) => {
  switch (dataSet) {
    case '0':
      return MODEL_UPLOAD
    case '1':
      return MODEL_CAR
    case '2':
      return MODEL_IRIS
    default:
      console.error("Error, opción no disponible")
  }
}


const getNameDatasetByID_ObjectDetection = (dataSet) => {
  switch (dataSet.toString()) {
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
    default:
      console.error("Error, opción no disponible")
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
    default:
      console.error("Error, opción no disponible")
  }
}


export {
  getNameDatasetByID_ClassicClassification,
  getNameDatasetByID_ObjectDetection,
  getNameDatasetByID_ImageClassification,
  LIST_MODEL_OPTIONS,
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