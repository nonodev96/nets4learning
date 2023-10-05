import React, { useEffect, useRef, useState } from 'react'
import { Accordion, Button, Card, Col, Container, Form, Row } from 'react-bootstrap'
import { Trans, useTranslation } from 'react-i18next'
import * as tf from '@tensorflow/tfjs'
import * as tfvis from '@tensorflow/tfjs-vis'
import ReactGA from 'react-ga4'

import N4LLayerDesign from '@components/neural-network/N4LLayerDesign'
import N4LJoyride from "@components/joyride/N4LJoyride";
import alertHelper from '@utils/alertHelper'
import {
  MODEL_IMAGE_MNIST,
} from '@/DATA_MODEL'
import { TYPE_CLASS, TYPE_LOSSES, TYPE_METRICS, TYPE_OPTIMIZER } from '@core/nn-utils/ArchitectureTypesHelper'

import LayerEdit from './LayerEdit'
import * as ImageClassificationUtils from './utils/utils'
import * as TrainMNIST from './custom/Train_MNIST'
import { I_MODEL_IMAGE_CLASSIFICATION } from './models/_model'
import ImageClassificationClassify from '@pages/playground/3_ImageClassification/ImageClassificationClassify'

const DEFAULT_NUMBER_EPOCHS = 5
const DEFAULT_LEARNING_RATE = 1

const DEFAULT_ID_OPTIMIZATION = 'adam'
const DEFAULT_ID_LOSS = 'metrics-categoricalCrossentropy'
const DEFAULT_ID_METRICS = 'categoricalCrossentropy'

const DEFAULT_LAYER = {
  _class           : 'Conv2D',
  kernelSize       : 0,
  filters          : 0,
  strides          : 0,
  activation       : 'sigmoid',
  kernelInitializer: 'varianceScaling',
  // Not used because the class is Conv2D
  poolSize: [2, 2],
  strides2: [2, 2]
}

const DEFAULT_LAYERS = [
  {
    _class           : 'Conv2D',
    kernelSize       : 5,
    filters          : 10,
    strides          : 1,
    activation       : 'Sigmoid',
    kernelInitializer: 'varianceScaling',
    // Not used because the class is Conv2D
    poolSize: [2, 2],
    strides2: [2, 2]
  },
  {
    _class  : 'MaxPooling2D',
    poolSize: [2, 2],
    strides2: [2, 2],
    // Not used because the class is MaxPooling2D
    kernelSize       : 5,
    filters          : 10,
    strides          : 1,
    activation       : 'Sigmoid',
    kernelInitializer: 'varianceScaling',
  },
  {
    _class           : 'Conv2D',
    kernelSize       : 5,
    filters          : 16,
    strides          : 1,
    activation       : 'relu',
    kernelInitializer: 'varianceScaling',
    // Not used because the class is Conv2D
    poolSize: [2, 2],
    strides2: [2, 2]
  },
  {
    _class  : 'MaxPooling2D',
    poolSize: [2, 2],
    strides2: [2, 2],
    // Not used because the class is MaxPooling2D
    kernelSize       : 5,
    filters          : 16,
    strides          : 1,
    activation       : 'relu',
    kernelInitializer: 'varianceScaling',
  },
]

export default function ImageClassification (props) {
  const { dataset } = props
  const { t } = useTranslation()
  const [iModelInfo, set_IModelInfo] = useState(new I_MODEL_IMAGE_CLASSIFICATION(t))

  const prefix = 'pages.playground.generator.'

  // TODO: DEPENDIENDO DEL TIPO QUE SEA SE PRE CARGAN UNOS AJUSTES U OTROS

  /**
   * @typedef {Object} Layer_t
   * @property {string} _class // MaxPooling2D or Conv2D
   * // if _class === Conv2D
   * @property {number} kernelSize
   * @property {number} filters
   * @property {number} strides
   * @property {string} activation
   *
   * @property {string} kernelInitializer
   * @property {[number, number]} poolSize
   * @property {[number, number]} strides2
   */
  const [Layers, setLayers] = useState(/**@type Array<Layer_t>*/[])
  const [Contador, setContador] = useState(0)

  const [idOptimizer, setIdOptimizer] = useState(DEFAULT_ID_OPTIMIZATION)
  const [idLoss, setIdLoss] = useState(DEFAULT_ID_LOSS)
  const [idMetrics, setIdMetrics] = useState(DEFAULT_ID_METRICS)
  const [NumberEpochs, setNumberEpochs] = useState(DEFAULT_NUMBER_EPOCHS)
  const [LearningRate, setLearningRate] = useState(DEFAULT_LEARNING_RATE)
  const refJoyrideButton = useRef({})
  /**
   * @typedef {tf.Sequential} Model_t
   */
  const [Model, setModel] = useState(/**@type {Model_t}*/null)

  const [Recarga, setRecarga] = useState(false)
  /**
   * @typedef {Object} GeneratedModels_t
   * @property {string} optimizer
   * @property {string} loss
   * @property {string} metric
   */
  const [GeneratedModels, setGeneratedModels] = useState(/**@type Array<GeneratedModels_t> */[])

  useEffect(() => {
    ReactGA.send({ hitType: 'pageview', page: '/ImageClassification/' + dataset, title: dataset })
    switch (dataset) {
      case MODEL_IMAGE_MNIST.KEY: {
        set_IModelInfo(new MODEL_IMAGE_MNIST(t))
        break
      }
      default: {
        console.error('Error, option not valid')
      }
    }

  }, [dataset, t])

  useEffect(() => {
    if (!Recarga) {
      setLayers(DEFAULT_LAYERS)
      setRecarga(true)
    }
  }, [Contador, Recarga])

  // region CREACIÓN DEL MODELO
  const handleSubmit_Play = async (event) => {
    event.preventDefault()
    const params = {
      LearningRate
    }
    if (Layers[0]._class === 'Conv2D') {
      const model = await TrainMNIST.MNIST_run({
        numberOfEpoch: NumberEpochs,
        idLoss       : idLoss,
        idOptimizer  : idOptimizer,
        idMetrics    : idMetrics,
        layerList    : Layers,
        params       : params,
      })
      setModel(model)
      setGeneratedModels(oldModels => [...oldModels, {
        optimizer: idOptimizer,
        metric   : idMetrics,
        loss     : idLoss,
        model    : model
      }])
      await alertHelper.alertSuccess('Modelo entrenado con éxito')
    } else {
      await alertHelper.alertWarning('La primera capa debe de ser tel tipo Conv2D',)
    }
  }
  // endregion

  // region PRUEBA DEL MODELO
  const handleSubmit_VectorTest = async () => {
    if (Model === undefined) {
      await alertHelper.alertWarning('Antes debes de crear y entrenar el modelo.')
    } else {
      const canvas = document.getElementById('drawCanvas')
      const smallcanvas = document.getElementById('smallcanvas')
      const ctx2 = smallcanvas.getContext('2d')
      ImageClassificationUtils.resample_single(canvas, 28, 28, smallcanvas)

      const imgData = ctx2.getImageData(0, 0, 28, 28)
      let arr = [] // El arreglo completo
      let arr28 = [] //Al llegar a 28 posiciones se pone en 'arr' como un nuevo índice
      for (let p = 0; p < imgData.data.length; p += 4) {
        let valor = imgData.data[p + 3] / 255
        arr28.push([valor]) //Agregar al arr28 y normalizar a 0-1. Aparte guarda dentro de un arreglo en el índice 0... again
        if (arr28.length === 28) {
          arr.push(arr28)
          arr28 = []
        }
      }

      arr = [arr]
      // Meter el arreglo en otro arreglo porque si no tio tensorflow se enoja >:(
      // Nah básicamente Debe estar en un arreglo nuevo en el índice 0, por ser un tensor4d en forma 1, 28, 28, 1
      const tensor4 = tf.tensor4d(arr)
      const resultados = Model.predict(tensor4).dataSync()
      const mayorIndice = resultados.indexOf(Math.max.apply(null, resultados))

      console.log('Predicción', { resultados, mayorIndice })
      // document.getElementById('demo').innerHTML = mayorIndice

      await alertHelper.alertInfo('¿El número es un ' + mayorIndice + '?', mayorIndice)
    }
  }

  const handleSubmit_VectorTestImageUpload = async () => {
    if (Model === undefined) {
      await alertHelper.alertWarning('Antes debes de crear y entrenar el modelo.')
    } else {
      const canvas = document.getElementById('imageCanvas')
      const smallcanvas = document.getElementById('smallcanvas')
      const ctx2 = smallcanvas.getContext('2d')
      ImageClassificationUtils.resample_single(canvas, 28, 28, smallcanvas)

      const imgData = ctx2.getImageData(0, 0, 28, 28)
      let arr = [] //El arreglo completo
      let arr28 = [] //Al llegar a 28 posiciones se pone en 'arr' como un nuevo índice
      for (let p = 0; p < imgData.data.length; p += 4) {
        let valor = imgData.data[p + 3] / 255
        arr28.push([valor])
        // Agregar al arr28 y normalizar a 0-1. Aparte guarda dentro de un arreglo en el indice 0... again
        if (arr28.length === 28) {
          arr.push(arr28)
          arr28 = []
        }
      }

      arr = [arr]
      // Meter el arreglo en otro arreglo porque si no tio tensorflow se enoja >:(
      //Nah básicamente Debe estar en un arreglo nuevo en el índice 0, por ser un tensor4d en forma 1, 28, 28, 1
      const tensor4 = tf.tensor4d(arr)
      const resultados = Model.predict(tensor4).dataSync()
      const mayorIndice = resultados.indexOf(Math.max.apply(null, resultados))

      console.log('Predicción', mayorIndice)
      // document.getElementById('demo').innerHTML = mayorIndice

      await alertHelper.alertInfo('¿El número es un ' + mayorIndice + '?', mayorIndice)
    }
  }
  // endregion

  // region CONTROL DE LAS CAPAS
  const handleClick_AddLayer_Start = async () => {
    if (Layers.length < 10) {
      setLayers(oldLayers => [DEFAULT_LAYER, ...oldLayers])
    } else {
      await alertHelper.alertWarning(t('warning.not-more-layers'))
    }
  }
  const handleClick_AddLayer_End = async () => {
    if (Layers.length < 10) {
      setLayers(oldLayers => [...oldLayers, DEFAULT_LAYER])
    } else {
      await alertHelper.alertWarning(t('warning.not-more-layers'))
    }
  }

  const handleClick_RemoveLayer = async (idLayer) => {
    let array = Layers
    let array2 = []
    if (array.length === 1) {
      await alertHelper.alertWarning(t('warning.error-layers'))
    } else {
      for (let i = 0; i < array.length; i++) {
        if (i !== idLayer) array2.push(array[i])
      }
      setLayers(array2)
    }
  }

  const handleChange_Class = (e, indexLayer) => {
    const option = e.target.value
      Layers[indexLayer] = {
        // Conv2D
        //_class           : 'Conv2D',
        kernelSize       : 5,
        filters          : 10,
        strides          : 1,
        activation       : 'Sigmoid',
        kernelInitializer: 'varianceScaling',

        // MaxPooling2D
        // _class  : 'MaxPooling2D',
        poolSize: [2, 2],
        strides2: [2, 2],
      }
    Layers[indexLayer]._class = option
    setLayers(Layers)
    setContador(Contador + 1)
  }
  // endregion

  // region PARÁMETROS DE LAS CAPAS
  const handleChange_Attr = (e, indexLayer, _param_name_) => {
    const updatedLayers = [...Layers];
    updatedLayers[indexLayer] = {
      ...updatedLayers[indexLayer],
      [_param_name_]: parseInt(e.target.value)
    };
    setLayers(updatedLayers);
  }

  const handleChange_AttrArray = (e, indexLayer, _param_name_, id) => {
    const updatedLayers = [...Layers];
    updatedLayers[indexLayer] = {
      ...updatedLayers[indexLayer],
      [_param_name_]: [...updatedLayers[indexLayer][_param_name_]]
    };
    updatedLayers[indexLayer][_param_name_][id] = parseInt(e.target.value);
    setLayers(updatedLayers);
  }

  // endregion

  // region PARÁMETROS GENERALES
  const handleChange_LearningRate = (e) => {
    setLearningRate(parseInt(e.target.value))
  }
  const handleChange_NumberEpochs = (e) => {
    setNumberEpochs(parseInt(e.target.value))
  }

  const handleChange_Loss = (e) => {
    setIdLoss(e.target.value)
  }

  const handleChange_Optimization = (e) => {
    setIdOptimizer(e.target.value)
  }

  const handleChange_Metrics = (e) => {
    setIdMetrics(e.target.value)
  }
  // endregion

  // region UTILS
  const handleChange_FileUpload = async (e) => {
    const tgt = e.target || window.event.srcElement
    const files = tgt.files

    const canvas = document.getElementById('imageCanvas')
    const ctx = canvas.getContext('2d')

    function draw () {
      canvas.width = 200
      canvas.height = 200
      ctx.drawImage(this, 0, 0)
    }

    function failed () {
      console.error('The provided file couldn\'t be loaded as an Image media')
    }

    const img = new Image()
    img.onload = draw
    img.onerror = failed
    img.src = URL.createObjectURL(files[0])
  }

  const handleClick_DownloadModel = (index) => {
    GeneratedModels[index].model.save('downloads://my-model').then(() => {
      console.log('downloaded my-model')
    })
  }
  // endregion

  console.log("render ImageClassification")
  return (
    <>
      <N4LJoyride refJoyrideButton={refJoyrideButton}
                  JOYRIDE_state={iModelInfo.JOYRIDE()}
                  KEY={'ImageClassification'}
      />

      {/* MANUAL */}
      <Container>
        <Row className={'mt-3'}>
          <Col xl={12}>
            <div className="d-flex justify-content-between">
              <h1><Trans i18nKey={'modality.3'} /></h1>
              <Button size={'sm'}
                      variant={'outline-primary'}
                      onClick={refJoyrideButton.current.handleClick_StartJoyride}>
                <Trans i18nKey={'datasets-models.3-image-classification.joyride.title'} />
              </Button>
            </div>
          </Col>
        </Row>

        <div className={'mt-2 mb-4 n4l-hr-row'}>
          <span className={'n4l-hr-title'}>
            <Trans i18nKey={'hr.information'} />
          </span>
        </div>

        <Row className={'mt-3'}>
          <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
            <Accordion>
              <Accordion.Item className={'joyride-step-1-manual'}  eventKey={'manual'}>
                <Accordion.Header><h3>Manual</h3></Accordion.Header>
                <Accordion.Body>
                  <ul>
                    <li>Interfaz de edición de arquitectura.</li>

                    <li>
                      <b>A la izquierda:</b><br />
                      Se pueden ver las capas de neuronas, puedes agregar tantas como desees pulsando el botón "Añadir capa". <br />
                      Puedes modificar dos parámetros:
                    </li>
                    <ul>
                      <li><b>Unidades de la capa:</b><br />Cuantas unidades deseas que tenga esa capa.</li>
                      <li><b>Función de activación:</b><br />Función de activación para esa capa.</li>
                    </ul>

                    <li>
                      <b>A la derecha </b><br />
                      Se pueden ver parámetros generales necesarios para la creación del modelo. <br />
                      Estos parámetros son:
                    </li>
                    <ul>
                      <li>
                        <b>Tasa de entrenamiento:</b><br />
                        Valor entre 0 y 100 el cual indica a la red qué cantidad de datos debe usar para el entrenamiento
                        y reglas para el test.
                      </li>
                      <li>
                        <b>Número de iteraciones:</b><br />
                        Cantidad de ciclos que va a realizar la red (a mayor número, más tiempo tarda en entrenar).
                      </li>
                      <li>
                        <b>Optimizador:</b><br />
                        Es una función que como su propio nombre indica se usa para optimizar los modelos.
                        Esto es frecuentemente usado para evitar estancarse en un máximo local.
                      </li>
                      <li>
                        <b>Función de pérdida:</b><br />
                        Es un método para evaluar qué tan bien un algoritmo específico modela los datos otorgados.
                      </li>
                      <li>
                        <b>Métrica:</b><br />
                        Es evaluación para valorar el rendimiento de un modelo de aprendizaje automático.
                      </li>
                    </ul>

                    <li>
                      <b>Crear y entrenar modelo.</b><br />
                      Una vez se han rellenado todos los campos anteriores podemos crear el modelo pulsando el botón.
                    </li>

                    <li>
                      <b>Exportar modelo. </b><br />
                      Si hemos creado el modelo correctamente nos aparece este botón que nos permite exportar el modelo y
                      guardarlo localmente.
                    </li>

                    <li>
                      <b>Resultado. </b><br />
                      Un formulario que nos permite predecir el valor de salida a partir de los valores de entrada que
                      introducimos, para ver la salida solamente hay que pulsar "Ver resultado".
                    </li>
                  </ul>
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey={'description-dataset'}>
                <Accordion.Header>
                  <h3>
                    <Trans i18nKey={dataset !== '0' ? iModelInfo.TITLE : prefix + 'dataset.upload-dataset'} />
                  </h3>
                </Accordion.Header>
                <Accordion.Body>
                  {iModelInfo.DESCRIPTION()}
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey={'info'}>
                <Accordion.Header><h3>Información adicional capas</h3></Accordion.Header>
                <Accordion.Body>
                  <p>
                    Adicionalmente hay dos capas más que son comunes al resto de redes de aprendizaje automático enfocadas en la clasificación de imágenes
                  </p>
                  <ul>
                    <li>
                      <b>flatten_Flatten:</b><br />
                      Esta capa aplana la salida 2D en un vector 1D preparando el modelo para entrar en la última capa.
                    </li>
                    <li>
                      <b>dense_Dense1:</b><br />
                      Es la última capa y tiene 10 unidades de salida, una por cada posible valor (del 0 al 9)
                    </li>
                  </ul>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Col>
        </Row>

        <div className={`mt-3 mb-4 n4l-hr-row`}>
          <span className={'n4l-hr-title'}>
            <Trans i18nKey={'hr.model'} />
          </span>
        </div>

        {/* EDITOR */}
        <Form onSubmit={handleSubmit_Play} id={'ImageClassification'}>

          <Row className={'mt-3'}>
            <Col xl={12}>
              <N4LLayerDesign layers={Layers} />
            </Col>
          </Row>

          <Row>
            {/* Layers PARAMETERS */}
            <Col xl={6} className={'mt-3'}>
              <Card>
                <Card.Header className={'d-flex align-items-center justify-content-between'}>
                  <h3><Trans i18nKey={prefix + 'editor-layers.title'} /></h3>
                  <div className={'d-flex'}>
                    <Button variant={'outline-primary'}
                            size={'sm'}
                            onClick={() => handleClick_AddLayer_Start()}>
                      <Trans i18nKey={prefix + 'editor-layers.add-layer-start'} />
                    </Button>
                    <Button variant={'outline-primary'}
                            size={'sm'}
                            className={'ms-3'}
                            onClick={() => handleClick_AddLayer_End()}>
                      <Trans i18nKey={prefix + 'editor-layers.add-layer-end'} />
                    </Button>
                  </div>
                </Card.Header>
                <Card.Body>
                  <Accordion>
                    {Layers.map((item, index) => {
                      return <Accordion.Item key={index} eventKey={index.toString()}>
                        <Accordion.Header>
                          <Trans i18nKey={prefix + 'editor-layers.layer-id'}
                                 values={{ index: index + 1 }} />
                        </Accordion.Header>
                        <Accordion.Body>
                          <div className="d-grid gap-2">
                            <Button variant={'outline-danger'}
                                    onClick={() => handleClick_RemoveLayer(index)}>
                              <Trans i18nKey={prefix + 'editor-layers.delete-layer'}
                                     values={{ index: index + 1 }} />
                            </Button>
                          </div>

                          {/* CLASS */}
                          <Form.Group className="mt-3"
                                      controlId={'formClass' + index}>
                            <Form.Label>Clase de la capa</Form.Label>
                            <Form.Select aria-label="Selecciona la clase de la capa"
                                         value={Layers[index]._class}
                                         onChange={(e) => handleChange_Class(e, index)}>
                              {TYPE_CLASS.map(({ key, label }, index) => {
                                return (<option key={index} value={key}>{label}</option>)
                              })}
                            </Form.Select>
                          </Form.Group>

                          <hr />

                          <LayerEdit item={Layers[index]}
                                     indexLayer={index}
                                     handleChange_Attr={handleChange_Attr}
                                     handleChange_AttrArray={handleChange_AttrArray}
                          />
                        </Accordion.Body>
                      </Accordion.Item>
                    })}
                  </Accordion>
                </Card.Body>
                <Card.Footer>

                </Card.Footer>
              </Card>
            </Col>

            {/* GENERAL PARAMETERS */}
            <Col xl={6} className={'mt-3'}>
              <Card className={'sticky-top'} style={{ zIndex: 10 }}>
                <Card.Header><h3><Trans i18nKey={prefix + 'general-parameters.title'} /></h3></Card.Header>
                <Card.Body>
                  {/* LEARNING RATE */}
                  <Form.Group className="mb-3" controlId="formTrainRate">
                    <Form.Label>Tasa de entrenamiento</Form.Label>
                    <Form.Control type="number"
                                  placeholder="Introduce la tasa de entrenamiento"
                                  defaultValue={DEFAULT_LEARNING_RATE}
                                  onChange={(e) => handleChange_LearningRate(e)} />
                    <Form.Text className="text-muted">
                      Recuerda que debe ser un valor entre 0 y 100 (es un porcentaje)
                    </Form.Text>
                  </Form.Group>

                  {/* Número OF ITERATIONS */}
                  <Form.Group className="mb-3" controlId="FormNumberOfEpochs">
                    <Form.Label>Número de iteraciones</Form.Label>
                    <Form.Control type="number"
                                  placeholder="Introduce el número de iteraciones"
                                  defaultValue={DEFAULT_NUMBER_EPOCHS}
                                  onChange={(e) => handleChange_NumberEpochs(e)}
                    />
                    <Form.Text className="text-muted">
                      Mientras más alto sea, mas tardará en ejecutarse el entrenamiento
                    </Form.Text>
                  </Form.Group>

                  {/* OPTIMIZATION FUNCTION */}
                  <Form.Group className="mb-3" controlId="FormOptimizer">
                    <Form.Label>Selecciona el optimizador</Form.Label>
                    <Form.Select aria-label="Selecciona el optimizador"
                                 defaultValue={idOptimizer}
                                 onChange={handleChange_Optimization}>
                      {TYPE_OPTIMIZER.map(({ key, label }, _index) => {
                        return (<option key={_index} value={key}>{label}</option>)
                      })}
                    </Form.Select>
                    <Form.Text className="text-muted">
                      Será el optimizador que se usará para activar la función
                    </Form.Text>
                  </Form.Group>
                  {/* LOSS FUNCTION */}
                  <Form.Group className="mb-3" controlId="FormLoss">
                    <Form.Label>Selecciona la función de pérdida</Form.Label>
                    <Form.Select aria-label="Selecciona la función de pérdida"
                                 defaultValue={idLoss}
                                 onChange={handleChange_Loss}>
                      <optgroup label={'Losses'}>
                        {TYPE_LOSSES.map(({ key, label }, index) => {
                          return (<option key={index} value={'losses-' + key}>{label}</option>)
                        })}
                      </optgroup>
                      <optgroup label={'Metrics'}>
                        {TYPE_METRICS.map(({ key, label }, index) => {
                          return (<option key={index} value={'metrics-' + key}>{label}</option>)
                        })}
                      </optgroup>
                    </Form.Select>
                    <Form.Text className="text-muted">
                      Será la perdida que se usará para la evaluación
                    </Form.Text>
                  </Form.Group>

                  {/* METRICS FUNCTION */}
                  <Form.Group className="mb-3" controlId="FormMetrics">
                    <Form.Label>Selecciona la métrica</Form.Label>
                    <Form.Select aria-label="Selecciona la función de métrica"
                                 defaultValue={idMetrics}
                                 onChange={(e) => handleChange_Metrics(e)}>
                      {TYPE_METRICS.map(({ key, label }, _index) => {
                        return (<option key={_index} value={key}>{label}</option>)
                      })}
                    </Form.Select>
                    <Form.Text className="text-muted">
                      Será la métrica que se usará para la evaluación
                    </Form.Text>
                  </Form.Group>
                </Card.Body>
                <Card.Footer>

                </Card.Footer>
              </Card>
            </Col>
          </Row>

          <Row className={'mt-3'}>
            <Col>
              {/* BLOCK  BUTTON */}
              <div className="d-grid gap-2">
                <Button variant={'primary'}
                        size={'lg'}
                        type={'submit'}>
                  <Trans i18nKey={prefix + 'models.button-submit'} />
                </Button>
              </div>
            </Col>
          </Row>

        </Form>

        <div className={'mt-4 mb-4 n4l-hr-row'}>
          <span className={'n4l-hr-title'}>
            <Trans i18nKey={'hr.generated-models'} />
          </span>
        </div>

        {/* GENERATED MODELS */}
        <Row className={'mt-3'}>
          <Col>
            <Card>
                <Card.Header className={'d-flex align-items-center justify-content-between'}>
                <h3><Trans i18nKey={prefix + 'models.title'} /> | {GeneratedModels.length + 1}</h3>
                <div className={'d-flex'}>
                  <Button variant={'outline-primary'}
                          size={'sm'}
                          className={'ms-3'}
                          onClick={() => {
                            tfvis.visor().open()
                          }}>
                    <Trans i18nKey={prefix + 'models.open-visor'} />
                  </Button>
                  <Button variant={'outline-primary'}
                          size={'sm'}
                          className={'ms-1'}
                          onClick={() => {
                            tfvis.visor().close()
                          }}>
                    <Trans i18nKey={prefix + 'models.close-visor'} />
                  </Button>
                </div>
              </Card.Header>
              <Card.Body>

                <div id="resultado"></div>
                <div id="salida"></div>
                <div id="demo"></div>

              </Card.Body>
            </Card>
          </Col>
        </Row>

        <div className={'mt-4 mb-4 n4l-hr-row'}>
          <span className={'n4l-hr-title'}>
            <Trans i18nKey={'hr.classify'} />
          </span>
        </div>

        {/* BLOCK 2 */}
        <Row className={'mt-3'}>
          <Col>
            <ImageClassificationClassify handleSubmit_VectorTest={handleSubmit_VectorTest}
                                         handleChange_FileUpload={handleChange_FileUpload}
                                         handleSubmit_VectorTestImageUpload={handleSubmit_VectorTestImageUpload}/>
          </Col>
        </Row>
      </Container>
    </>
  )
}
