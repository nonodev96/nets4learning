import { MODEL_CAR, MODEL_IRIS, MODEL_LYMPHOGRAPHY } from "./core/nn-review-models";

const MODEL_UPLOAD = "UPLOAD"

const MODEL_FACE_MESH = "FACE-MESH"
const MODEL_FACE_DETECTION = "FACE-DETECTION"
const MODEL_MOVE_NET_POSE_NET = "MOVE-NET-POSE-NET"
const MODEL_COCO_SSD = "COCO-SSD"

const MODEL_IMAGE_MNIST = "MNIST"
const MODEL_IMAGE_MOBILENET = "MOBILE-NET"
const MODEL_IMAGE_RESNET = "RES-NET"

const LIST_MODELS_CLASSIC_CLASSIFICATION = [
  MODEL_UPLOAD,
  MODEL_CAR.KEY,
  MODEL_IRIS.KEY,
  MODEL_LYMPHOGRAPHY.KEY
]

const LIST_MODELS_OBJECT_DETECTION = [
  MODEL_UPLOAD,
  MODEL_FACE_DETECTION,
  MODEL_FACE_MESH,
  MODEL_MOVE_NET_POSE_NET,
  MODEL_COCO_SSD
]

const LIST_MODELS_IMAGE_CLASSIFICATION = [
  MODEL_UPLOAD,
  MODEL_IMAGE_MNIST,
  MODEL_IMAGE_MOBILENET,
  MODEL_IMAGE_RESNET
]

const LIST_TYPE_MODELS = [
  'Clasificación tabular',
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
    'SUBIR CONJUNTO DE DATOS PROPIO',
    'Clasificación de coches',
    'Clasificación de flor iris',
    'Clasificación de linfomas',
  ],
  [],
  [
    'SUBIR MODELO PROPIO',
    'FACE DETECTOR - Geometría facial',
    "FACE MESH - Malla facial",
    "MOVE NET - Detector de articulaciones",
    "COCO SSD - Detector de objetos"
  ],
  [
    'SUBIR MODELO PROPIO',
    'MNIST - Clasificación de números',
    'MOBILENET - Clasificador de imágenes',
    // TODO :3
    // 'RESNET V2 - Clasificador de imágenes'
  ],
]


export const LIST_MODEL_OPTIONS_IDS = {
  CLASSIC_CLASSIFICATION: {
    // 0
    0: MODEL_UPLOAD,
    1: MODEL_CAR.KEY,
    2: MODEL_IRIS.KEY,
    3: MODEL_LYMPHOGRAPHY.KEY,
  },
  LINEAR_REGRESSION     : {
    // 1
  },
  OBJECT_DETECTION      : {
    // 2
    0: MODEL_UPLOAD,
    1: MODEL_FACE_MESH,
    2: MODEL_FACE_MESH,
    3: MODEL_MOVE_NET_POSE_NET,
    4: MODEL_COCO_SSD
  },
  IMAGE_CLASSIFICATION  : {
    // 3
    0: MODEL_UPLOAD,
    1: MODEL_IMAGE_MNIST,
    2: MODEL_IMAGE_MOBILENET,
    3: MODEL_IMAGE_RESNET
  }
}

export const DATASET_DESCRIPTION = [
  [
    'DATASET PROPIO',
    <>{MODEL_CAR.DESCRIPTION}</>,
    <>{MODEL_IRIS.DESCRIPTION}</>,
    <>{MODEL_LYMPHOGRAPHY.DESCRIPTION}</>
  ],
  [],
  [
    'DATASET PROPIO',
    <>
      <p>
        Este modelo a partir de una imagen o vídeo de entrada, es capaz de reconocer diferentes puntos
        de la cara para finalmente hacer una malla de la misma.
      </p>
      <details>
        <summary>Datos de entrada</summary>
        <ol>
          <li>Imagen o vídeo de entrada.</li>
        </ol>
      </details>
      <details>
        <summary>Datos de salida</summary>
        <ol>
          <li>Mismo elemento de entrada con una serie de puntos que delimitan la malla de la cara.</li>
        </ol>
      </details>
      <details>
        <summary>Referencias</summary>
        <ol>
          <li>
            <a href="https://tfhub.dev/mediapipe/tfjs-model/facemesh/1/default/1" target="_blank" rel="noreferrer">Entrada del modelo en el repositorio de tensorflow</a>
          </li>
        </ol>
      </details>
    </>,
    <>
      <p>
        Este modelo es capaz de reconocer a partir de una imagen o vídeo de entrada diferentes partes de la cara, como
        los ojos, orejas, nariz y boca.
      </p>

      <details>
        <summary>Datos de entrada</summary>
        <ol>
          <li>Imagen o vídeo.</li>
        </ol>
      </details>
      <details>
        <summary>Datos de salida</summary>
        <ol>
          <li>Mismo elemento de entrada con una serie de puntos que delimitan las diferentes partes de la cara.</li>
        </ol>
      </details>
      <details>
        <summary>Referencias</summary>
        <ol>
          <li>
            <a href="https://tfhub.dev/mediapipe/tfjs-model/face_detection/short/1" target="_blank" rel="noreferrer">Entrada del modelo en el repositorio de tensorflow</a>
          </li>
        </ol>
      </details>
    </>,
    <>
      <p>
        PoseNet es un modelo de aprendizaje automático capaz de reconocer la posición del cuerpo en tiempo real.
        Se puede usar para estimar una sola pose o varias a la vez.
      </p>
      <p>
        En el siguiente ejemplo, para que su impacto en el rendimiento sea menor solamente detecta una pose a la vez.
      </p>
      <details>
        <summary>Datos de entrada</summary>
        <ol>
          <li>Imagen o vídeo (webcam) a color.</li>
        </ol>
      </details>
      <details>
        <summary>Datos de salida</summary>
        <ol>
          <li>
            Mismo elemento de entrada con una serie de puntos y líneas que delimitan diferentes puntos de la cara
            ademas de hombros, codos, manos, pies, rodillas y cadera.
          </li>
        </ol>
      </details>
      <details>
        <summary>Referencias</summary>
        <ol>
          <li>
            <a href="https://tfhub.dev/mediapipe/tfjs-model/face_detection/short/1" target="_blank" rel="noreferrer">Paper</a></li>
        </ol>
      </details>
    </>,
    <>
      <p>
        El modelo SSD (Single Shot MultiBox Detection) de detección de objetos pretende localizar e
        identificar múltiples objetos en una sola imagen.
      </p>
      <p>
        Para más información sobre la API de detección de objetos de Tensorflow, consulta este readme en <a
        href="https://github.com/tensorflow/tfjs-models/tree/master/coco-ssd"
        target={"_blank"} rel={"noreferrer"}>tensorflow/object_detection</a>.
      </p>
      <p>
        Este modelo detecta objetos definidos en el conjunto de datos COCO, que es un conjunto de datos de detección,
        segmentación y subtitulado de objetos a gran escala.
        El modelo es capaz de detectar <a
        href="https://github.com/tensorflow/tfjs-models/blob/master/coco-ssd/src/classes.ts">80 clases de objetos</a>.
      </p>
      <p>
        Este ejemplo es una adaptación a TensorFlow.js del modelo COCO-SSD.
      </p>
      <details>
        <summary>Datos de entrada</summary>
        <ol>
          <li>Imagen o vídeo (webcam) a color.</li>
        </ol>
      </details>
      <details>
        <summary>Datos de salida</summary>
        <ol>
          <li>
            Mismo elemento de entrada con una serie de puntos que delimitan los diferentes puntos de los objetos,
            ademas de el nombre del objeto.
          </li>
        </ol>
      </details>
      <details>
        <summary>Referencias</summary>
        <ol>
          <li>Puede encontrar más información <a href="https://cocodataset.org/" target={"_blank"} rel={"noreferrer"}>Coco dataset</a></li>
        </ol>
      </details>
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
        <b> 28 x 28 </b>píxeles y se suavizaron, lo que introdujo niveles de escala de grises.
      </p>

      <details>
        <summary>Datos de entrada</summary>
        <ol>
          <li>Imagen en escala de grises y con un tamaño de <b>28 x 28</b> píxeles</li>
        </ol>
      </details>
      <details>
        <summary>Datos de salida</summary>
        <ol>
          <li>Un número entre 0 y 9</li>
        </ol>
      </details>
    </>,
    <>
      <p>
        MobileNet V2 es una familia de arquitecturas de redes neuronales para la clasificación de imágenes y tareas similares.
      </p>
      <p>
        Este modelo es capaz de diferenciar entre 1001 categorías, identificando el contexto principal de la imagen.
      </p>

      <details>
        <summary>Datos de entrada</summary>
        <ol>
          <li>Imagen con valores de color entre [0,1] de <b> 224 x 224</b> píxeles.</li>
        </ol>
      </details>
      <details>
        <summary>Datos de salida</summary>
        <ol>
          <li>
            Un número de 0 a 1001 que son cada una de las categorías de esta{" "}
            <a rel="noreferrer" target="_blank"
               href="https://storage.googleapis.com/download.tensorflow.org/data/ImageNetLabels.txt">lista</a>
          </li>
        </ol>
      </details>
      <details>
        <summary>Referencias</summary>
        <p>
          Originalmente fue publicado por Mark Sandler, Andrew Howard, Menglong Zhu, Andrey Zhmoginov, Liang-Chieh Chen:
        </p>
        <ol>
          <li>
            <a href="https://arxiv.org/abs/1801.04381" target="_blank" rel="noreferrer">"Inverted Residuals and Linear Bottlenecks: Mobile Networks for Classification, Detection and Segmentation"</a>, 2018.
          </li>
        </ol>
      </details>
    </>,
    <>
      <p>
        ResNet V2 es una familiar de redes de arquitecturas para la clasificación de imágenes con un número variable de capas.
      </p>
      <p>
        Están basadas en la arquitectura ResNet original publicada por Kaiming He, Xiangyu Zhang, Shaoqing Ren, Jian Sun:
        <a href="https://arxiv.org/abs/1512.03385" target={'_blank'} rel="noreferrer">"Deep Residual Learning for Image Recognition"</a>, 2015.
      </p>
      <p>
        La variación "V2" utilizada en el modelo que vamos a usar fue realizada por Kaiming He, Xiangyu Zhang,
        Shaoqing Ren, Jian Sun:{' '}
        <a href="https://arxiv.org/abs/1603.05027" target={'_blank'} rel="noreferrer">"Identity Mappings in Deep Residual Networks"</a>, 2016.
      </p>
      <p>
        La diferencia con ResNet V1 es el uso de la normalización por lotes antes de cada capa de peso. El modelo
        cargado usa un total de 50 capas.
      </p>

      <details>
        <summary>Datos de entrada</summary>
        <ol>
          <li>Imagen con valores de color entre [0,1] de <b> 224 x 224</b> píxeles.</li>
        </ol>
      </details>
      <details>
        <summary>Datos de salida</summary>
        <ol>
          <li>Un número de 0 a 1001 que son cada una de las categorías de esta{" "}
            <a rel="noreferrer" target="_blank"
               href="https://storage.googleapis.com/download.tensorflow.org/data/ImageNetLabels.txt">lista</a>
          </li>
        </ol>
      </details>
    </>,
  ],
]

export const getHTML_DATASET_DESCRIPTION = (row, dataset) => {
  return DATASET_DESCRIPTION[row][dataset];
}

const getNameDatasetByID_ClassicClassification = (dataset) => {
  switch (dataset.toString()) {
    case '0':
      return MODEL_UPLOAD
    case '1':
      return MODEL_CAR.KEY
    case '2':
      return MODEL_IRIS.KEY
    case '3':
      return MODEL_LYMPHOGRAPHY.KEY
    default:
      console.error("Error, opción no disponible")
  }
}


const getNameDatasetByID_ObjectDetection = (dataset) => {
  switch (dataset.toString()) {
    case '0':
      return MODEL_UPLOAD
    case '1':
      return MODEL_FACE_DETECTION
    case '2':
      return MODEL_FACE_MESH
    case '3':
      return MODEL_MOVE_NET_POSE_NET
    case '4':
      return MODEL_COCO_SSD
    default:
      console.error("Error, opción no disponible")
  }
}
// TODO
const getNameDatasetByID_ImageClassification = (dataset) => {
  switch (dataset.toString()) {
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

const LIST_OF_IMAGES_MNIST = [
  "0_new.png",
  "1_new.png",
  "2_new.png",
  "3_new.png",
  "4_new.png",
  "5_new.png",
  "6_new.png",
  "7_new.png",
  "8_new.png",
  "9_new.png"
]

const LIST_OF_IMAGES_MOBILENET = [
  "beef-burger.jpg",
  "bulldog.jpg",
  "butterfly.jpg",
  "cat.jpg",
  "cheetah.jpg",
  "cruise.jpg",
  "duck.jpg",
  "elephant.jpg",
  "lion.jpg",
]

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
  MODEL_LYMPHOGRAPHY,
  // Identificación de objetos
  LIST_MODELS_OBJECT_DETECTION,
  MODEL_FACE_DETECTION,
  MODEL_FACE_MESH,
  MODEL_MOVE_NET_POSE_NET,
  MODEL_COCO_SSD,
  // Clasificación por imágenes
  LIST_MODELS_IMAGE_CLASSIFICATION,
  MODEL_IMAGE_MNIST,
  MODEL_IMAGE_MOBILENET,
  MODEL_IMAGE_RESNET,

  LIST_OF_IMAGES_MNIST,
  LIST_OF_IMAGES_MOBILENET,
}