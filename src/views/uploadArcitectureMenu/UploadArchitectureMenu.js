import React, { useState } from 'react'
import { Form, Button, Row, Col, Container, Card } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import N4LFooter from '../../components/footer/N4LFooter'
import N4LNavBar from '../../components/navBar/N4LNavBar'
import DragAndDrop from "../../components/dragAndDrop/DragAndDrop";
import { modelsType } from '../initialMenu/InitialMenu'
import { useHistory } from 'react-router-dom'
import * as alertHelper from '../../utils/alertHelper'

export const dataSetList = [
  [
    'SUBIR DATASET PROPIO',
    'EVALUACIÓN DE COCHES',
    'IRIS-DATA'],
  [],
  [
    'SUBIR DATASET PROPIO',
    'DETECCIÓN DE CARA Y GEOMETRÍA FACIAL',
    'MALLA DE CARA',
  ],
  [
    'SUBIR DATASET PROPIO',
    'MNIST - CLASIFICADOR DE NÚMEROS'
  ],
]
export const dataSetDescription = [
  [
    'DATASET PROPIO',
    <>
      <p>El DataSet "Car Evaluation" permite evaluar vehículos a través de la siguiente estructura:</p>
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

      <p>Por último los posibles valores que puede dar son:</p>
      <ul>
        <li><b>UNACC</b> - Inaccesible</li>
        <li><b>ACC</b> - Accesible</li>
        <li><b>GOOD</b> - Bien</li>
        <li><b>VGOOD</b> - Muy bien</li>
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

      <p>
        Para obtener más información acerca de este dataSet visita{" "}
        <a target="_blank" href="https://archive.ics.uci.edu/ml/datasets/Car+Evaluation">esta web</a>{" "}
        (<a target="_blank" href="https://archive.ics.uci.edu/ml/machine-learning-databases/car/">Modelo</a>)
      </p>
    </>,
    <>
      <p>
        El dataSet Iris-Data permite detectar que tipo de planta iris es a partir de altitud y longitud de su pétalo
        y sépalo.
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
        <li>Misma elemento de entrada con una serie de puntos que delimitan la malla de la cara.</li>
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
        <li>Misma elemento de entrada con una serie de puntos que delimitan las diferentes partes de la cara.</li>
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
          Misma elemento de entrada con una serie de puntos y líneas que delimitan diferentes puntos de la cara
          ademas de hombros, codos, manos, pies, rodillas y cadera.
        </li>
      </ul>
    </>,
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
export const getHTML_DataSetDescription = (row, dataset) => {
  return dataSetDescription[row][dataset];
}
/**
 * Parte de la ruta de editar la arquitectura
 *
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export default function UploadArchitectureMenu(props) {
  const { id } = useParams()
  const [DataSet, setDataSet] = useState(-1)
  const [CustomArchitecture, setCustomArchitecture] = useState(false)
  const history = useHistory()

  const handleChangeDataSet = () => {
    let aux = document.getElementById('FormDataSet').value
    if (aux !== undefined) setDataSet(aux)
  }

  // TODO --> MEJORAR
  const handleSubmit = async () => {
    if (DataSet === -1 || DataSet === 'Selecciona un Data Set') {
      await alertHelper.alertWarning('Debes de seleccionar un Dataset')
    } else {
      if (CustomArchitecture) {
        history.push(process.env.REACT_APP_DOMAIN + '/edit-architecture/' + id + '/' + 1 + '/' + DataSet)
      } else {
        localStorage.setItem('custom-architecture', 'nothing')
        history.push(process.env.REACT_APP_DOMAIN + '/edit-architecture/' + id + '/' + 1 + '/' + DataSet)
      }
    }
  }

  const handleChangeArchitectureUpload = async (files) => {
    let reader = new FileReader()
    reader.readAsText(files[0])
    try {
      reader.onload = async (e) => {
        localStorage.setItem('custom-architecture', e.target.result.toString())
        setCustomArchitecture(true)
        await alertHelper.alertSuccess('Fichero cargado con éxito')
      }
    } catch (error) {
      await alertHelper.alertError(error)
    }
  }

  return (
    <>
      <N4LNavBar/>

      <Container id={"UploadArchitectureMenu"}>
        <Row className="mt-3">
          <Col>
            <Card>
              <Card.Header>
                <h1>{modelsType[id]}</h1>
              </Card.Header>
              <Card.Body>
                <Card.Text>
                  Selecciona a continuación el Data Set sobre se va a trabajar o carga tu propio Data Set.
                </Card.Text>
                <Form>
                  {/*FIXME: Remove Row and Col */}
                  <Row className="mt-3">
                    <Col>
                      <Form.Group className="mb-3" controlId="FormDataSet">
                        <Form.Label>Selecciona un Data Set</Form.Label>
                        <Form.Select aria-label="Default select example"
                                     onChange={handleChangeDataSet}>
                          <option>Selecciona un Data Set</option>
                          {dataSetList[id].map((item, id) => {
                            return (<option key={id} value={id}>{item}</option>)
                          })}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row className="mt-3">
                    <Col>
                      <p>
                        Ahora si lo deseas puedes cargar tu propia arquitectura, en caso contrario pulsa en continuar y
                        se cargará una arquitectura por defecto de ejemplo.
                      </p>
                      <p>Carga tu propia arquitectura en formato .json</p>
                      <DragAndDrop name={"doc"}
                                   id={"UploadArchitectureMenu"}
                                   accept={{ 'application/json': ['.json'] }}
                                   text={"Añada el fichero JSON"}
                                   function_DropAccepted={handleChangeArchitectureUpload}
                      />
                      {/*<input type="file"*/}
                      {/*       name="doc"*/}
                      {/*       accept=".json"*/}
                      {/*       onChange={handleChangeArchitectureUpload}></input>*/}
                    </Col>
                  </Row>
                  <Row className="mt-3">
                    <Col>
                      <Button onClick={() => handleSubmit()}>
                        Continuar
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <N4LFooter/>
    </>
  )
}