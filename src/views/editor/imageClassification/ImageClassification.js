import { useState, useEffect } from 'react'
import { Col, Row, Form, CloseButton, Button, Container, Card } from 'react-bootstrap'
import * as tf from '@tensorflow/tfjs'
import * as numberClass from '../../../modelos/ClassificationHelper_MNIST'
import CustomCanvasDrawer from '../../../utils/customCanvasDrawer'
import GraphicRed from '../../../utils/graphicRed/GraphicRed'
import LayerEdit from './LayerEdit'
import * as alertHelper from "../../../utils/alertHelper";
import { DATASET_DESCRIPTION, LIST_MODEL_OPTIONS } from "../../../DATA_MODEL";
import {
  TYPE_CLASS,
  TYPE_OPTIMIZER,
  TYPE_LOSSES,
  TYPE_METRICS, TYPE_ACTIVATION
} from "../../../modelos/ArchitectureTypesHelper";

export default function ImageClassification(props) {
  const { dataSet } = props

  // TODO: DEPENDIENDO DEL TIPO QUE SEA SE PRE CARGAN UNOS AJUSTES U OTROS
  const [nLayer, setNLayer] = useState(0)
  const [Layer, setLayer] = useState([])
  const [ActiveLayer, setActiveLayer] = useState()
  const [Contador, setContador] = useState(0)
  const [UploadedArchitecture, setUploadedArchitecture] = useState(false)
  const NumberEpochs = 15
  const learningValue = 1
  const [Optimizer, setOptimizer] = useState('Adam')
  const [LossValue, setLossValue] = useState('CategoricalCrossentropy')
  const [MetricsValue, setMetricsValue] = useState('Accuracy')
  const [Model, setModel] = useState()
  const [string, setString] = useState('0.1;4.3;2.1;0.2')
  const [NoEpochs, setNoEpochs] = useState(15)
  const [Recarga, setRecarga] = useState(false)
  const [ImageUploaded, setImageUploaded] = useState(false)

  useEffect(() => {
    if (Recarga) {
      console.log(Layer)
    } else {
      const uploadedArchitecture = localStorage.getItem('custom-architectureIMG')
      if (uploadedArchitecture !== 'nothing') {
        setLayer([
          {
            class            : 'Conv2D',
            kernelSize       : 5,
            filters          : 10,
            strides          : 1,
            activation       : 'Sigmoid',
            kernelInitializer: 'varianceScaling',
          },
          {
            class   : 'MaxPooling2D',
            poolSize: [2, 2],
            strides2: [2, 2]
          },
          {
            class            : 'Conv2D',
            kernelSize       : 5,
            filters          : 16,
            strides          : 1,
            activation       : 'relu',
            kernelInitializer: 'varianceScaling',
          },
          {
            class   : 'MaxPooling2D',
            poolSize: [2, 2],
            strides2: [2, 2]
          },
        ])
        setNLayer(4)
        setRecarga(true)
        setActiveLayer(0)
      } else {
        setLayer([
          {
            class            : 'Conv2D',
            kernelSize       : 5,
            filters          : 10,
            strides          : 1,
            activation       : 'Sigmoid',
            kernelInitializer: 'varianceScaling',
          },
          {
            class   : 'MaxPooling2D',
            poolSize: [2, 2],
            strides2: [2, 2]
          },
          {
            class            : 'Conv2D',
            kernelSize       : 5,
            filters          : 16,
            strides          : 1,
            activation       : 'relu',
            kernelInitializer: 'varianceScaling',
          },
          {
            class   : 'MaxPooling2D',
            poolSize: [2, 2],
            strides2: [2, 2]
          },
        ])
        setNLayer(4)
        setRecarga(true)
        setActiveLayer(0)
      }
    }
  }, [Contador])

  // CREACIÓN DEL MODELO Y TESTEO
  const handleClickPlay = async (event) => {
    event.preventDefault()
    if (Layer[0].class === 'Conv2D') {
      const model = await numberClass.MNIST_run(
        parseInt(NoEpochs),
        document.getElementById('FormOptimizer').value,
        Layer,
        LossValue,
        MetricsValue,
      )
      setModel(model)
      await alertHelper.alertSuccess("Modelo entrenado con éxito")
    } else {
      await alertHelper.alertWarning('La primera capa debe de ser tel tipo Conv2D',)
    }
  }

  const handleVectorTest = async () => {
    if (Model === undefined) {
      await alertHelper.alertWarning('Antes debes de crear y entrenar el modelo.')
    } else {
      // var canvas
      // canvas = document.getElementById('drawCanvas')

      const smallcanvas = document.getElementById('smallcanvas')
      const ctx2 = smallcanvas.getContext('2d')
      // numberClass.resample_single(canvas, 28, 28, smallcanvas)

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

      arr = [arr] // Meter el arreglo en otro arreglo porque si no tio tensorflow se enoja >:(
      // Nah básicamente Debe estar en un arreglo nuevo en el índice 0, por ser un tensor4d en forma 1, 28, 28, 1
      const tensor4 = tf.tensor4d(arr)
      const resultados = Model.predict(tensor4).dataSync()
      const mayorIndice = resultados.indexOf(Math.max.apply(null, resultados))

      console.log('Predicción', mayorIndice)
      // document.getElementById('demo').innerHTML = mayorIndice

      await alertHelper.alertInfo('¿El número es un ' + mayorIndice + '?', mayorIndice)
    }
  }

  const handleVectorTestImageUpload = async () => {
    if (Model === undefined) {
      await alertHelper.alertWarning('Antes debes de crear y entrenar el modelo.')
    } else {
      const canvas = document.getElementById('imageCanvas')
      const smallcanvas = document.getElementById('smallcanvas')
      const ctx2 = smallcanvas.getContext('2d')
      numberClass.resample_single(canvas, 28, 28, smallcanvas)

      const imgData = ctx2.getImageData(0, 0, 28, 28)
      let arr = [] //El arreglo completo
      let arr28 = [] //Al llegar a 28 posiciones se pone en 'arr' como un nuevo índice
      for (let p = 0; p < imgData.data.length; p += 4) {
        let valor = imgData.data[p + 3] / 255
        arr28.push([valor]) //Agregar al arr28 y normalizar a 0-1. Aparte guarda dentro de un arreglo en el indice 0... again
        if (arr28.length === 28) {
          arr.push(arr28)
          arr28 = []
        }
      }

      arr = [arr] //Meter el arreglo en otro arreglo porque si no tio tensorflow se enoja >:(
      //Nah básicamente Debe estar en un arreglo nuevo en el índice 0, por ser un tensor4d en forma 1, 28, 28, 1
      const tensor4 = tf.tensor4d(arr)
      const resultados = Model.predict(tensor4).dataSync()
      const mayorIndice = resultados.indexOf(Math.max.apply(null, resultados))

      console.log('Predicción', mayorIndice)
      // document.getElementById('demo').innerHTML = mayorIndice

      await alertHelper.alertInfo('¿El número es un ' + mayorIndice + '?', mayorIndice)
    }
  }

  const handleClick_DownloadModel = () => {
    Model.save('downloads://mymodel')
  }

  // CONTROL DE LAS CAPAS
  const handlerAddLayer = async () => {
    let array = Layer
    if (array.length < 10) {
      array.push({
        class            : 'Conv2D',
        kernelSize       : 0,
        filters          : 0,
        strides          : 0,
        activation       : 'sigmoid',
        kernelInitializer: 'varianceScaling',
      })
      setLayer(array)
      setNLayer(nLayer + 1)
    } else {
      await alertHelper.alertWarning("No se pueden añadir más capas")
    }
  }

  const handle_RemoveLayer = async (idLayer) => {
    let array = Layer
    let array2 = []
    if (array.length === 1) {
      await alertHelper.alertWarning('No puedes eliminar la última capa')
    } else {
      for (let i = 0; i < array.length; i++) {
        if (i !== idLayer) array2.push(array[i])
      }
      if (ActiveLayer === idLayer && idLayer > 0) setActiveLayer(idLayer - 1)
      setLayer(array2)
      setNLayer(nLayer - 1)
    }
  }

  //PARÁMETROS DE LAS CAPAS
  const handleChange_Kernel = (index) => {
    let array = Layer
    array[index].kernelSize = parseInt(
      document.getElementById(`formKernelLayer${index}`).value,
    )
    setLayer(array)
  }

  const handleChange_Filters = (index) => {
    let array = Layer
    array[index].filters = parseInt(
      document.getElementById(`formFiltersLayer${index}`).value,
    )
    setLayer(array)
  }

  const handleChange_Strides = (index) => {
    let array = Layer
    array[index].strides = parseInt(
      document.getElementById(`formStridesLayer${index}`).value,
    )
    setLayer(array)
  }

  const handleChange_PoolSize = (index, id) => {
    let array = Layer
    array[index].poolSize[id] = parseInt(
      document.getElementById(`formPoolSize${id}Layer${index}`).value,
    )
    setLayer(array)
  }

  const handleChange_StridesMax = (index, id) => {
    let array = Layer
    array[index].strides[id] = parseInt(
      document.getElementById(`formStrides${id}Layer${index}`).value,
    )
    setLayer(array)
  }

  const handleChangeClass = (index) => {
    let array = Layer
    array[index].class = document.getElementById(`formClass${index}`).value
    if (array[index].class === 'Conv2D') {
      array[index].kernelSize = 5
      array[index].filters = 10
      array[index].strides = 1
      array[index].activation = 'Sigmoid'
      array[index].kernelInitializer = 'varianceScaling'
    } else {
      array[index].poolSize = [2, 2]
      array[index].strides = [2, 2]
    }
    setLayer(array)
    let aux = Contador
    setContador(aux++)
  }

  const handleChange_Class = (e) => {
    const option = e.target.value
    let a = Contador
    a = a + 1
    let array = Layer
    array[ActiveLayer].class = option
    if (option === 'Conv2D') {
      array[ActiveLayer] = {
        class            : 'Conv2D',
        kernelSize       : 5,
        filters          : 10,
        strides          : 1,
        activation       : 'Sigmoid',
        kernelInitializer: 'varianceScaling',
      }
    } else {
      array[ActiveLayer] = {
        class   : 'MaxPooling2D',
        poolSize: [2, 2],
        strides2: [2, 2],
      }
    }
    setContador(a)
    setLayer(array)
  }

  const handleChange_Activation = (index) => {
    let array = Layer
    array[index].activation = document.getElementById(`formActivationLayer${index}`,).value
    setLayer(array)
  }

  // PARÁMETROS GENERALES
  const handleChange_NumberEpochs = () => {
    let aux = document.getElementById('FormNumberOfEpochs').value
    setNoEpochs(aux)
  }

  const handleChange_Loss = () => {
    let aux = document.getElementById('FormLoss').value
    if (aux !== undefined) {
      setLossValue(aux)
    }
  }

  const handleChange_Optimization = () => {
    let aux = document.getElementById('FormOptimizer').value
    if (aux !== undefined) {
      setOptimizer(aux)
    }
  }

  const handleChange_Metrics = () => {
    let aux = document.getElementById('FormMetrics').value
    if (aux !== undefined) {
      setMetricsValue(aux)
    }
  }

  const handleChangeFileUpload = async (e) => {
    const tgt = e.target || window.event.srcElement
    const files = tgt.files

    const canvas = document.getElementById('imageCanvas')
    const ctx = canvas.getContext('2d')

    function draw() {
      canvas.width = 200
      canvas.height = 200
      ctx.drawImage(this, 0, 0)
      setImageUploaded(true)
    }

    function failed() {
      console.error("The provided file couldn't be loaded as an Image media")
    }

    const img = new Image()
    img.onload = draw
    img.onerror = failed
    img.src = URL.createObjectURL(files[0])
  }

  // const handleChangeTestInput = () => {
  //   setstring(document.getElementById(`formTestInput`).value)
  // }

  return (
    <>
      <Form onSubmit={handleClickPlay} id={"MnistImageClassification"}>
        <Container>
          <Row>
            <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
              <Card>
                <Card.Header><h3>ImageClassification</h3></Card.Header>
                <Card.Body>
                  <Card.Text>A continuación se ha pre cargado una arquitectura.</Card.Text>
                  <Card.Text>Programa dentro de la función "createArchitecture".</Card.Text>
                  <Card.Text>
                    A esta función se el pasa un array preparado que continue la información del conjunto de datos.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <hr/>


            <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
              <Card>
                <Card.Header><h3>{LIST_MODEL_OPTIONS[3][dataSet]}</h3></Card.Header>
                <Card.Body>
                  {DATASET_DESCRIPTION[3][dataSet]}
                </Card.Body>
              </Card>

              <Card>
                <Card.Header><h3>Manual</h3></Card.Header>
                <Card.Body>
                  <ul>
                    <li>Interfaz de edición de arquitectura.</li>

                    <li>
                      <b>A la izquierda:</b><br/>
                      Se pueden ver las capas de neuronas, puedes agregar tantas como desees pulsando el botón "Añadir
                      capa". <br/>
                      Puedes modificar dos parámetros:
                    </li>
                    <ul>
                      <li><b>Unidades de la capa:</b><br/>Cuantas unidades deseas que tenga esa capa.</li>
                      <li><b>Función de activación:</b><br/>Función de activación para esa capa.</li>
                    </ul>

                    <li>
                      <b>A la derecha </b><br/>
                      Se pueden ver parámetros generales necesarios para la creación del modelo. <br/>
                      Estos parámetros son:
                    </li>
                    <ul>
                      <li>
                        <b>Tasa de entrenamiento:</b><br/>
                        Valor entre 0 y 100 el cual indica a la red qué cantidad de datos debe usar para el entrenamiento
                        y reglas para el test.
                      </li>
                      <li>
                        <b>Nº de iteraciones:</b><br/>
                        Cantidad de ciclos que va a realizar la red (a mayor número, más tiempo tarda en entrenar).
                      </li>
                      <li>
                        <b>Optimizador:</b><br/>
                        Es una función que como su propio nombre indica se usa para optimizar los modelos.
                        Esto es frecuentemente usado para evitar estancarse en un máximo local.
                      </li>
                      <li>
                        <b>Función de pérdida:</b><br/>
                        Es un método para evaluar qué tan bien un algoritmo específico modela los datos otorgados.
                      </li>
                      <li>
                        <b>Métrica:</b><br/>
                        Es evaluación para valorar el rendimiento de un modelo de aprendizaje automático.
                      </li>
                    </ul>

                    <li>
                      <b>Crear y entrenar modelo.</b><br/>
                      Una vez se han rellenado todos los campos anteriores podemos crear el modelo pulsando el botón.
                    </li>

                    <li>
                      <b>Exportar modelo. </b><br/>
                      Si hemos creado el modelo correctamente nos aparece este botón que nos permite exportar el modelo y
                      guardarlo localmente.
                    </li>

                    <li>
                      <b>Resultado. </b><br/>
                      Un formulario que nos permite predecir el valor de salida a partir de los valores de entrada que
                      introducimos, para ver la salida solamente hay que pulsar "Ver resultado".
                    </li>
                  </ul>
                </Card.Body>
              </Card>
            </Col>

            {/* BLOCK 1 */}
            <Container>
              {/* <div className="column"> */}
              <GraphicRed layer={Layer} setActiveLayer={setActiveLayer} tipo={1}/>
              <Row>
                {/* SPECIFIC PARAMETERS */}
                <Col xl className="col-specific">
                  <div className="container-fluid container-fluid-w1900">
                    {ActiveLayer !== undefined ? (
                      <div key={'Capa' + ActiveLayer}>
                        <div className="container pane-imgc borde">
                          <div className="title-pane">
                            Capa {ActiveLayer + 1}
                            <CloseButton onClick={() => handle_RemoveLayer(ActiveLayer)}/>
                          </div>
                          {/* UNITS */}
                          <Form.Group className="mb-3"
                                      controlId={'formClass' + ActiveLayer}>
                            <Form.Label>Clase de la capa</Form.Label>
                            <Form.Select aria-label="Selecciona la clase de la capa"
                                         defaultValue={Layer[ActiveLayer].class}
                                         onChange={handleChange_Class}>
                              {TYPE_CLASS.map(({ key, label }, index) => {
                                return (<option key={index} value={key}>{label}</option>)
                              })}
                            </Form.Select>
                          </Form.Group>
                          <LayerEdit index={ActiveLayer}
                                     item={Layer[ActiveLayer]}
                                     handler_RemoveLayer={handle_RemoveLayer}
                                     handleChange_Kernel={handleChange_Kernel}
                                     handleChange_Activation={handleChange_Activation}
                                     handleChange_Filters={handleChange_Filters}
                                     handleChange_Strides={handleChange_Strides}
                                     handleChange_PoolSize={handleChange_PoolSize}
                                     handleChange_StridesMax={handleChange_StridesMax}
                                     ACTIVATION_TYPE={TYPE_ACTIVATION}
                                     CLASS_TYPE={TYPE_CLASS}/>
                        </div>
                      </div>
                    ) : (
                      ','
                    )}

                    {/* ADD LAYER */}
                    <Button className="btn-add-layer"
                            type="button"
                            onClick={() => handlerAddLayer()}
                            variant="primary">
                      Añadir capa
                    </Button>
                  </div>
                </Col>

                {/* GENERAL PARAMETERS */}
                <Col xl className="col-general">
                  <div className="container borde general-settings">
                    {/* LEARNING RATE */}
                    <Form.Group className="mb-3" controlId="formTrainRate">
                      <Form.Label>Tasa de entrenamiento</Form.Label>
                      <Form.Control type="number"
                                    placeholder="Introduce la tasa de entrenamiento"
                                    defaultValue={learningValue}/>
                      <Form.Text className="text-muted">
                        Recuerda que debe ser un valor entre 0 y 100 (es un porcentaje)
                      </Form.Text>
                    </Form.Group>

                    {/* Nº OF ITERATIONS */}
                    <Form.Group className="mb-3" controlId="FormNumberOfEpochs">
                      <Form.Label>Nº de iteraciones</Form.Label>
                      <Form.Control type="number"
                                    placeholder="Introduce el número de iteraciones"
                                    defaultValue={NumberEpochs}
                                    onChange={handleChange_NumberEpochs}/>
                      <Form.Text className="text-muted">
                        *Mientras más alto sea, mas tardará en ejecutarse el entrenamiento
                      </Form.Text>
                    </Form.Group>

                    {/* OPTIMIZATION FUNCTION */}
                    <Form.Group className="mb-3" controlId="FormOptimizer">
                      <Form.Label>Selecciona el optimizador</Form.Label>
                      <Form.Select aria-label="Selecciona el optimizador"
                                   defaultValue={Optimizer}
                                   onChange={handleChange_Optimization}>
                        {TYPE_OPTIMIZER.map((item, id) => {
                          return (<option key={id} value={item}>{item}</option>)
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
                                   defaultValue={LossValue}
                                   onChange={handleChange_Loss}>
                        {TYPE_LOSSES.map((item, id) => {
                          return (<option key={id} value={item}>{item}</option>)
                        })}
                      </Form.Select>
                      <Form.Text className="text-muted">
                        Será la perdida que se usará para la evaluación
                      </Form.Text>
                    </Form.Group>

                    {/* METRICS FUNCTION */}
                    <Form.Group className="mb-3" controlId="FormMetrics">
                      <Form.Label>Selecciona la métrica</Form.Label>
                      <Form.Select aria-label="Selecciona la métrica"
                                   defaultValue={MetricsValue}
                                   onChange={handleChange_Metrics}>
                        {TYPE_METRICS.map((item, id) => {
                          return (<option key={id} value={item}>{item}</option>)
                        })}
                      </Form.Select>
                      <Form.Text className="text-muted">
                        Será la métrica que se usará para la evaluación
                      </Form.Text>
                    </Form.Group>
                  </div>
                </Col>
              </Row>
              {/* </div> */}

              {/* INFO ADDITIONAL LAYERS */}
              <Card>
                <Card.Header><h3>Información adicional capas</h3></Card.Header>
                <Card.Body>
                  <p>
                    Adicionalmente hay dos capas más que son comunes al resto de redes de aprendizaje automático enfocadas
                    en la clasificación de imágenes
                  </p>
                  <ul>
                    <li>
                      <b>flatten_Flatten:</b><br/>
                      Esta capa aplana la salida 2D en un vector 1D preparando el modelo para entrar en la
                      última capa.
                    </li>
                    <li>
                      <b>dense_Dense1:</b><br/>
                      Es la última capa y tiene 10 unidades de salida, una por cada posible valor (del 0 al 9)
                    </li>
                  </ul>
                </Card.Body>
              </Card>

              {/* BLOCK  BUTTON */}
              <div className="col-specific cen">
                <Button variant="primary"
                        onClick={() => {
                          console.log("TODO")
                        }}>
                  Crear y entrenar modelo
                </Button>
              </div>

              <div className="header-model-editor mt-3">
                <p>Para <b>ocultar y mostrar</b> el panel lateral pulsa la tecla <b>ñ</b>.</p>
              </div>

              <div className="header-model-editor mt-3">
                <p>
                  Ahora puedes probar este modelo de dos formas, dibujando con el ratón o subiendo una imagen desde tu
                  equipo.
                </p>
              </div>

              <div id="salida"></div>

              {Model === undefined ? ('') : (
                <Button type="button"
                        onClick={handleClick_DownloadModel}
                        variant="primary">
                  Exportar modelo
                </Button>
              )}
            </Container>

            {/* BLOCK 2 */}
            <Container>
              <div className="container-fluid container-fluid-w1900">
                <div className="container borde">
                  <div className="title-pane">Resultado</div>
                  {/* VECTOR TEST */}
                  <Row>
                    <Col className={"mt-3 d-flex justify-content-center flex-column"}>
                      <CustomCanvasDrawer submitFunction={handleVectorTest}/>
                    </Col>
                    <Col className={"mt-3 d-flex justify-content-center flex-column"}>
                      <input style={{ marginBottom: '2rem' }}
                             type="file"
                             name="doc"
                             onChange={handleChangeFileUpload}></input>

                      <canvas height="200" width="200" id="imageCanvas"></canvas>
                      <button type="button"
                              onClick={handleVectorTestImageUpload}
                              className="btn-custom-canvas green">
                        Validar
                      </button>
                    </Col>
                  </Row>

                  <canvas id="smallcanvas"
                          width="28"
                          height="28"
                          style={{ display: 'none' }}></canvas>
                  <div id="resultado"></div>
                  {/* SUBMIT BUTTON */}
                </div>
              </div>
              <div className="header-model-editor mt-3">
                <p>
                  Ten en cuenta que no se han usado todos los datos para entrenar la red y puede que sus predicciones no
                  sean correctas.
                </p>
              </div>
            </Container>

          </Row>
        </Container>
      </Form>
    </>
  )
}
