import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import Footer from '../../footer/Footer'
import NavBar from '../../navBar/NavBar'
import { modelsType } from '../initialMenu/InitialMenu'
import { useHistory } from 'react-router-dom'
import * as alertHelper from '../../../utils/alertHelper'

export const dataSetList = [
  ['SUBIR DATASET PROPIO', 'EVALUACIÓN DE COCHES', 'IRIS-DATA'],
  [],
  [
    'SUBIR DATASET PROPIO',
    'DETECCIÓN DE CARA Y GEOMETRÍA FACIAL',
    'MALLA DE CARA',
  ],
  ['SUBIR DATASET PROPIO', 'MNIST - CLASIFICADOR DE NÚMEROS'],
]
export const dataSetDescription = [
  [
    'DATASET PROPIO',
    <>
      <ul>
        <br /> El dataSet Car Evaluation permite evaluar vehículos a través de
        la siguiente estructura:<li> CAR Acecptación del vehículo</li>
        <li>
          {' '}
          PRICE precio en general
          <ul>
            <li> BUTING precio de compra</li>
            <li> MAINT costo del mantenimiento</li>
          </ul>
        </li>
        <li>
          {' '}
          TECH Características técnicas
          <ul>
            <li> COMFORT comfort</li>
            <ul>
              <li> DOORS nº de puertas</li>
              <li> PERSONS nº de plazas</li>
              <li>LUG_BOOT tamaño del maletero</li>
            </ul>
          </ul>
          <ul>
            <li> SAFETY seguridad estimada del vehículo</li>
          </ul>
        </li>
      </ul>
      <ul>
        Por último los posibles valores que puede dar son:
        <li>UNACC - Inaccesible</li>
        <li>ACC - Accesible</li>
        <li>GOOD - Bien</li>
        <li>VGOOD - Muy bien</li>
      </ul>
      <ul>
        Estos son los valores de entrada que podrá tomar la red.
        <li>buying: vhigh, high, med, low.</li>
        <li>maint: vhigh, high, med, low.</li>
        <li>doors: 2, 3, 4, 5more.</li>
        <li>persons: 2, 4, more.</li>
        <li>lug_boot: small, med, big.</li>
        <li>safety: low, med, high.</li>
      </ul>
      <br />
      Para obtener más información acerca de este dataSet visita{' '}
      <a
        href="https://archive.ics.uci.edu/ml/datasets/Car+Evaluation"
        rel="noreferrer"
        target="_blank"
      >
        esta web
      </a>
    </>,
    <>
      <ul>
        <br /> El dataSet Iris-Data permite detectar que tipo de planra iris es
        a partir de altitud y longitud de su pétalo y sépalo. Tiene la siguiente
        estructura:
        <li> Longitud del sépalo en cm</li>
        <li>Anchura del sépalo en cm</li>
        <li>Longitud del pétalo en cm</li>
        <li>Anchura del pétalo en cm</li>
      </ul>
      <ul>
        Por último los posibles valores que puede dar son:
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
      <ul>
        <br />{' '}
        <p>
          Este modelo es proporcionado por el hub de modelos de tensorflow. Este
          modelo lo podemos encontrar{' '}
          <a
            target="blank"
            href="https://tfhub.dev/mediapipe/tfjs-model/facemesh/1/default/1"
          >
            aquí
          </a>
          . Este modelo a partir de una imagen o vídeo de entrada, es capaz de
          reconocer diferentes puntos de la cara para finalmente hacer una malla
          de la misma.
        </p>
        <p> Datos de entrada:</p>
        <li>
          <p>Imagen o vídeo de entrada.</p>
        </li>
        <p> Datos de salida:</p>
        <li>
          <p>
            Misma elemento de entrada con una serie de puntos que delimitan la
            malla de la cara.
          </p>
        </li>
      </ul>
    </>,
    <>
      <ul>
        <br />{' '}
        <p>
          Este modelo es proporcionado por el hub de modelos de tensorflow. Este
          modelo lo podemos encontrar{' '}
          <a
            target="blank"
            href="https://tfhub.dev/mediapipe/tfjs-model/face_detection/short/1"
          >
            aquí
          </a>
          . Este modelo es capaz de reconocer a partir de una imagen o vídeo de
          entrada diferentes partes de la cara, como los ojos, orejas, nariz y
          boca.
        </p>
        <p> Datos de entrada:</p>
        <li>
          <p>Imagen o vídeo.</p>
        </li>
        <p> Datos de salida:</p>
        <li>
          <p>
            Misma elemento de entrada con una serie de puntos que delimitan las
            diferentes partes de la cara.
          </p>
        </li>
      </ul>
    </>,
    <>
      <ul>
        <br />{' '}
        <p>
          PoseNet es un modelo de aprendizaje automático capaz de reconocer la
          pose del cuerpo en tiempo real. Se puede usar para estimar una sola
          pose o varias a la vez. En el siguiente ejemplo, para que su impacto
          en el rendimiento sea menor solamente detecta una pose a la vez.
        </p>
        <p> Datos de entrada:</p>
        <li>
          <p>Imágen o vídeo(webcam) a color.</p>
        </li>
        <p> Datos de salida:</p>
        <li>
          <p>
            Misma elemento de entrada con una serie de puntos y líneas que
            delimitan diferentes puntos de la cara ademas de hombros, codos,
            manos, pies, rodillas y cadera.
          </p>
        </li>
      </ul>
    </>,
  ],
  [
    'DATASET PROPIO',
    <>
      <ul>
        <br />{' '}
        <p>
          La base de datos <b>MNIST</b> es una gran base de datos de dígitos
          escritos a mano. La base de datos se usa ampliamente para capacitación
          y pruebas en el campo del aprendizaje automático. Fue creado
          "re-mezclando" las muestras de los conjuntos de datos originales del
          NIST. El conjunto de datos de capacitación del NIST se tomó de la
          Oficina del Censo de los Estados Unidos. Además, las imágenes en
          blanco y negro del NIST se normalizaron para encajar en un cuadro
          delimitador de <b>28x28 píxeles</b> y se suavizaron , lo que introdujo
          niveles de escala de grises.
        </p>
        <p> Datos de entrada:</p>
        <li>
          <p>Imágen en escala de grises y con un tamañao de 28x28 píxeles</p>
        </li>
        <p> Por último los posibles valores que puede dar son:</p>
        <li>
          <p>Un número entre 0 y 9</p>
        </li>
      </ul>
    </>,
    <>
      <ul>
        <br />{' '}
        <p>
          MobileNet V2 es una familia de arquitecturas de redes neuronales para
          la clasificacion de imágenes y tareas similares. Originalmente fue
          publicado por Mark Sandler, Andrew Howard, Menglong Zhu, Andrey
          Zhmoginov, Liang-Chieh Chen: "
          <a
            target="_blank"
            rel="noreferrer"
            href="https://arxiv.org/abs/1801.04381"
          >
            Inverted Residuals and Linear Bottlenecks: Mobile Networks for
            Classification, Detection and Segmentation
          </a>
          ", 2018.
        </p>
        <p> Datos de entrada:</p>
        <li>
          <p>Imágen con valores de color entre [0,1] de 224x224 píxeles.</p>
        </li>
        <p> Por último los posibles valores que puede dar son:</p>
        <li>
          <p>
            Un número de 0 a 1001 que son cada una de las catergorías de esta{' '}
            <a
              rel="noreferrer"
              target="_blank"
              href="https://storage.googleapis.com/download.tensorflow.org/data/ImageNetLabels.txt"
            >
              lista
            </a>
          </p>
        </li>
      </ul>
    </>,
    <>
      <ul>
        <br />{' '}
        <p>
          ResNet V2 es una familiar de redes de arquitecturas para la
          clasificación de imágenes con un número variable de capas. Están
          basadas en la arquitectura ResNet original publicada por Kaiming He,
          Xiangyu Zhang, Shaoqing Ren, Jian Sun:{' '}
          <a
            href="https://arxiv.org/abs/1512.03385"
            rel="noreferrer"
            target={'_blank'}
          >
            "Deep Residual Learning for Image Recognition"
          </a>
          , 2015.
        </p>
        <p>
          La variación "V2" utilizada en el modelo que vamos a usar fue
          realizada por Kaiming He, Xiangyu Zhang, Shaoqing Ren, Jian Sun:{' '}
          <a
            href="https://arxiv.org/abs/1603.05027"
            rel="noreferrer"
            target={'_blank'}
          >
            "Identity Mappings in Deep Residual Networks"
          </a>
          , 2016.
        </p>
        <p>
          La diferencia con ResNet V1 es el uso de la normalizacion por lotes
          antes de cada capa de peso. El modelo cargado usa un total de 50
          capas.
        </p>
        <p> Datos de entrada:</p>
        <li>
          <p>Imágen con valores de color entre [0,1] de 224x224 píxeles.</p>
        </li>
        <p> Por último los posibles valores que puede dar son:</p>
        <li>
          <p>
            Un número de 0 a 1001 que son cada una de las catergorías de esta{' '}
            <a
              rel="noreferrer"
              target="_blank"
              href="https://storage.googleapis.com/download.tensorflow.org/data/ImageNetLabels.txt"
            >
              lista
            </a>
          </p>
        </li>
      </ul>
    </>,
  ],
]

export default function UploadArchitectureMenu(props) {
  const { id } = useParams()
  const [DataSet, setDataSet] = useState(-1)
  const [CustomArchitecture, setCustomArchuitecture] = useState(false)
  const history = useHistory()

  const handleChangeDataSet = () => {
    let aux = document.getElementById('FormDataSet').value
    if (aux !== undefined) setDataSet(aux)
  }

  const handleSubmmit = () => {
    if (DataSet === -1 || DataSet === 'Selecciona un Data Set') {
      alertHelper.alertWarning('Debes de seleccionar un Dataset')
    } else {
      if (CustomArchitecture) {
        history.push(process.env.REACT_APP_DOMAIN+'/edit-architecture/' + id + '/' + 1 + '/' + DataSet)
      } else {
        localStorage.setItem('custom-architecture', 'nothing')
        history.push(process.env.REACT_APP_DOMAIN+'/edit-architecture/' + id + '/' + 1 + '/' + DataSet)
      }
    }
  }

  const handleChangeArchitectureUpload = (e) => {
    let files = e.target.files
    let reader = new FileReader()
    reader.readAsText(files[0])
    try {
      reader.onload = (e) => {
        localStorage.setItem('custom-architecture', e.target.result)
        setCustomArchuitecture(true)
        alertHelper.alertSuccess('Fichero cargado con éxito')
      }
    } catch (error) {
      alertHelper.alertError(error)
    }
  }

  return (
    <>
      <NavBar />
      <Form>
        <div className="container">
          <h1>{modelsType[id]}</h1>
          <div className="header-model-editor">
            <p>
              Selecciona a continuación el Data Set sobre se va a trabajar o
              carga tu propio Data Set.
            </p>
          </div>
          {/* {numberClass.start()} */}
        </div>
        <div className="container">
          <Form.Group className="mb-3" controlId="FormDataSet">
            <Form.Label>Selecciona un Data Set</Form.Label>
            <Form.Select
              aria-label="Default select example"
              onChange={handleChangeDataSet}
            >
              <option>Selecciona un Data Set</option>
              {dataSetList[id].map((item, id) => {
                return (
                  <option key={id} value={id}>
                    {item}
                  </option>
                )
              })}
            </Form.Select>
          </Form.Group>
        </div>
        <div className="container">
          <div className="header-model-editor">
            <p>
              Ahora si lo deseas puedes cargar tu propia arquitectura, en caso
              contrario pulsa en continuar y se cargará una arquitectura por
              defecto de ejemplo.
            </p>
          </div>
          <div className="header-model-editor">
            <p>Carga tu propia arquitectura en formato .json </p>
            <input
              style={{ marginLeft: '1rem' }}
              type="file"
              name="doc"
              accept=".json"
              onChange={handleChangeArchitectureUpload}
            ></input>
          </div>
        </div>

        <div className="container">
          <Button
            className="btn-custom-description"
            onClick={() => handleSubmmit()}
          >
            Continuar
          </Button>
        </div>
      </Form>
      <Footer />
    </>
  )
}
