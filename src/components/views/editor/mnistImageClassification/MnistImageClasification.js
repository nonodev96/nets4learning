import { React, useState, useEffect } from 'react'
import * as tf from '@tensorflow/tfjs'
import { Col, Row, CloseButton } from 'react-bootstrap'
import { Form } from 'react-bootstrap'
import * as numberClass from '../../../../modelos/NumberClasificatorHelper.js'
import CustomCanvasDrawer from '../../../../utils/customCanvasDrawer.js'
import {
  dataSetList,
  dataSetDescription,
} from '../../uploadArcitectureMenu/UploadArchitectureMenu.js'
import LayerEdit from './LayerEdit.js'
import GraphicRed from '../../../../utils/graphicRed/GraphicRed.js'
import './MnistImageClasification.css'
import * as alertHelper from "../../../../utils/alertHelper"


export default function MnistImageClassification(props) {
  const { dataSet } = props

  //TODO: DEPENDIENDO DEL TIPO QUE SEA SE PRECARGAN UNOS AJUSTRS U OTROS
  const [nLayer, setNLayer] = useState()
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
  const [string, setstring] = useState('0.1;4.3;2.1;0.2')
  const [NoEpochs, setNoEpochs] = useState(15)
  const [Recarga, setRecarga] = useState(false)
  const [ImageUploaded, setImageUploaded] = useState(false)

  const OPTIMIZER_TYPE = [
    'Sgd',
    'Momentum',
    'Adagrag',
    'Adadelta',
    'Adam',
    'Adamax',
    'Rmsprop',
  ]

  const LOSS_TYPE = [
    'AbsoluteDifference',
    'ComputeWeightedLoss',
    'CosineDistance',
    'HingeLoss',
    'HuberLoss',
    'LogLoss',
    'MeanSquaredError',
    'SigmoidCrossEntropy',
    'SoftmaxCrossEntropy',
    'CategoricalCrossentropy',
  ]

  const METRICS_TYPE = [
    'BinaryAccuracy',
    'BinaryCrossentropy',
    'CategoricalAccuracy',
    'CategoricalCrossentropy',
    'CosineProximity',
    'MeanAbsoluteError',
    'MeanAbsolutePercentageErr',
    'MeanSquaredError',
    'Precision',
    'Recall',
    'SparseCategoricalAccuracy',
    'Accuracy',
  ]

  const ACTIVATION_TYPE = ['Sigmoid', 'Relu']
  const CLASS_TYPE = ['Conv2D', 'MaxPooling2D']

  useEffect(() => {
    if (Recarga) {
      console.log(Layer)
    } else {
      const uploadedArchitecture = localStorage.getItem(
        'custom-architectureIMG',
      )
      if (uploadedArchitecture != 'nothing') {
        setLayer([
          {
            class: 'Conv2D',
            kernelSize: 5,
            filters: 10,
            strides: 1,
            activation: 'Sigmoid',
            kernelInitializer: 'varianceScaling',
          },
          { class: 'MaxPooling2D', poolSize: [2, 2], strides2: [2, 2] },
          {
            class: 'Conv2D',
            kernelSize: 5,
            filters: 16,
            strides: 1,
            activation: 'relu',
            kernelInitializer: 'varianceScaling',
          },
          { class: 'MaxPooling2D', poolSize: [2, 2], strides2: [2, 2] },
        ])
        setNLayer(4)
        setRecarga(true)
        setActiveLayer(0)
      } else {
        setLayer([
          {
            class: 'Conv2D',
            kernelSize: 5,
            filters: 10,
            strides: 1,
            activation: 'Sigmoid',
            kernelInitializer: 'varianceScaling',
          },
          { class: 'MaxPooling2D', poolSize: [2, 2], strides2: [2, 2] },
          {
            class: 'Conv2D',
            kernelSize: 5,
            filters: 16,
            strides: 1,
            activation: 'relu',
            kernelInitializer: 'varianceScaling',
          },
          { class: 'MaxPooling2D', poolSize: [2, 2], strides2: [2, 2] },
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
      const model = await numberClass.run(
        parseInt(NoEpochs),
        document.getElementById('FormOptimizer').value,
        Layer,
        LossValue,
        MetricsValue,
      )
      setModel(model)
      alertHelper.alertSuccess("Modelo entrenado con éxito")
    } else {
      alertHelper.alertWarning('La primera capa debe de ser tel tipo Conv2D',)
    }
  }

  const handleVectorTest = async () => {
    if (Model === undefined) {
      alertHelper.alertWarning('Antes debes de crear y entrenar el modelo.')
    } else {
      // var canvas
      // canvas = document.getElementById('bigcanvas')

      var smallcanvas = document.getElementById('smallcanvas')
      var ctx2 = smallcanvas.getContext('2d')
      // numberClass.resample_single(canvas, 28, 28, smallcanvas)
      
      var imgData = ctx2.getImageData(0, 0, 28, 28)
      var arr = [] //El arreglo completo
      var arr28 = [] //Al llegar a 28 posiciones se pone en 'arr' como un nuevo indice
      for (var p = 0; p < imgData.data.length; p += 4) {
        var valor = imgData.data[p + 3] / 255
        arr28.push([valor]) //Agregar al arr28 y normalizar a 0-1. Aparte queda dentro de un arreglo en el indice 0... again
        if (arr28.length == 28) {
          arr.push(arr28)
          arr28 = []
        }
      }

      arr = [arr] //Meter el arreglo en otro arreglo por que si no tio tensorflow se enoja >:(
      //Nah basicamente Debe estar en un arreglo nuevo en el indice 0, por ser un tensor4d en forma 1, 28, 28, 1
      var tensor4 = tf.tensor4d(arr)
      var resultados = Model.predict(tensor4).dataSync()
      var mayorIndice = resultados.indexOf(Math.max.apply(null, resultados))

      console.log('Prediccion', mayorIndice)
      // document.getElementById('demo').innerHTML = mayorIndice

      alertHelper.alertInfo('¿El número es un ' + mayorIndice + '?', mayorIndice)
    }
  }

  const handleVectorTestImageUpload = async () => {
    if (Model === undefined) {
      alertHelper.alertWarning('Antes debes de crear y entrenar el modelo.')
    } else {
      var canvas
      canvas = document.getElementById('imageCanvas')
      var smallcanvas = document.getElementById('smallcanvas')
      var ctx2 = smallcanvas.getContext('2d')
      numberClass.resample_single(canvas, 28, 28, smallcanvas)

      var imgData = ctx2.getImageData(0, 0, 28, 28)
      var arr = [] //El arreglo completo
      var arr28 = [] //Al llegar a 28 posiciones se pone en 'arr' como un nuevo indice
      for (var p = 0; p < imgData.data.length; p += 4) {
        var valor = imgData.data[p + 3] / 255
        arr28.push([valor]) //Agregar al arr28 y normalizar a 0-1. Aparte queda dentro de un arreglo en el indice 0... again
        if (arr28.length == 28) {
          arr.push(arr28)
          arr28 = []
        }
      }

      arr = [arr] //Meter el arreglo en otro arreglo por que si no tio tensorflow se enoja >:(
      //Nah basicamente Debe estar en un arreglo nuevo en el indice 0, por ser un tensor4d en forma 1, 28, 28, 1
      var tensor4 = tf.tensor4d(arr)
      var resultados = Model.predict(tensor4).dataSync()
      var mayorIndice = resultados.indexOf(Math.max.apply(null, resultados))

      console.log('Prediccion', mayorIndice)
      // document.getElementById('demo').innerHTML = mayorIndice

      alertHelper.alertInfo('¿El número es un ' + mayorIndice + '?', mayorIndice)
    }
  }

  const handleDownloadModel = () => {
    Model.save('downloads://mymodel')
  }

  // CONTROL DE LAS CAPAS
  const handlerAddLayer = async () => {
    let array = Layer
    if (array.length<10){

    array.push({
      class: 'Conv2D',
      kernelSize: 0,
      filters: 0,
      strides: 0,
      activation: 'Sigmoid',
      kernelInitializer: 'varianceScaling',
    })
    setLayer(array)
    setNLayer(nLayer + 1)
  }else{
    alertHelper.alertWarning("No se pueden añadir más capas")
  }
  }

  const handlerRemoveLayer = (idLayer) => {
    let array = Layer
    let array2 = []
    if (array.length === 1) {
      alertHelper.alertWarning('No puedes eliminar la última capa')
    } else {
      var i
      for (i = 0; i < array.length; i++) {
        if (i !== idLayer) array2.push(array[i])
      }
      if (ActiveLayer === idLayer && idLayer > 0) setActiveLayer(idLayer - 1)
      setLayer(array2)
      setNLayer(nLayer - 1)
    }
  }

  //PARÁMETROS DE LAS CAPAS
  const handleChangeKernel = (index) => {
    let array = Layer
    array[index].kernelSize = parseInt(
      document.getElementById(`formKernelLayer${index}`).value,
    )
    setLayer(array)
  }

  const handleChangeFilters = (index) => {
    let array = Layer
    array[index].filters = parseInt(
      document.getElementById(`formFiltersLayer${index}`).value,
    )
    setLayer(array)
  }

  const handleChangeStrides = (index) => {
    let array = Layer
    array[index].strides = parseInt(
      document.getElementById(`formStridesLayer${index}`).value,
    )
    setLayer(array)
  }

  const handleChangePoolSize = (index, id) => {
    let array = Layer
    array[index].poolSize[id] = parseInt(
      document.getElementById(`formPoolSize${id}Layer${index}`).value,
    )
    setLayer(array)
  }

  const handleChangeStridesMax = (index, id) => {
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

  const handleCambio = (e) => {
    const option = e.target.value
    let a = Contador
    a = a + 1
    let array = Layer
    array[ActiveLayer].class = option
    if (option === 'Conv2D') {
      array[ActiveLayer] = {
        class: 'Conv2D',
        kernelSize: 5,
        filters: 10,
        strides: 1,
        activation: 'Sigmoid',
        kernelInitializer: 'varianceScaling',
      }
    } else {
      array[ActiveLayer] = {
        class: 'MaxPooling2D',
        poolSize: [2, 2],
        strides2: [2, 2],
      }
    }
    setContador(a)
    setLayer(array)
  }

  const handleChangeActivation = (index) => {
    let array = Layer
    array[index].activation = document.getElementById(
      `formActivationLayer${index}`,
    ).value
    setLayer(array)
  }

  // PARÁMETROS GENERALES
  const handleChangeNoEpochs = () => {
    let aux = document.getElementById('formNumberOfEpochs').value
    setNoEpochs(aux)
  }

  const handleChangeLoss = () => {
    let aux = document.getElementById('FormLoss').value
    if (aux !== undefined) {
      setLossValue(aux)
    } else {
    }
  }

  const handleChangeOptimization = () => {
    let aux = document.getElementById('FormOptimizer').value
    if (aux !== undefined) {
      setOptimizer(aux)
    } else {
    }
  }

  const handleChangeMetrics = () => {
    let aux = document.getElementById('FormMetrics').value
    if (aux !== undefined) {
      setMetricsValue(aux)
    } else {
    }
  }

  const handleChangeFileUpload = async (e) => {
    var tgt = e.target || window.event.srcElement,
      files = tgt.files

    var canvas = document.getElementById('imageCanvas')
    var ctx = canvas.getContext('2d')

    function draw() {
      canvas.width = 200
      canvas.height = 200
      ctx.drawImage(this, 0, 0)
      setImageUploaded(true)
    }

    function failed() {
      console.error("The provided file couldn't be loaded as an Image media")
    }

    var img = new Image()
    img.onload = draw
    img.onerror = failed
    img.src = URL.createObjectURL(files[0])
  }

  // const handleChangeTestInput = () => {
  //   setstring(document.getElementById(`formTestInput`).value)
  // }

  return (
    <>
      <Form onSubmit={handleClickPlay}>
        <div className="container">
          <div className="header-model-editor">
            <p>
              A continuación se ha precargado una arquitectura. Programa dentro
              de la función "createArchitecture". A esta función se el pasa un
              array preparado que contine la información del dataset.
            </p>
          </div>
          {/* {numberClass.start()} */}
        </div>

        <div className="container">
          <h2>{dataSetList[3][dataSet]}</h2>
        </div>

        <div className="container">
          <div className="header-model-editor">
            {dataSetDescription[3][dataSet]}
          </div>

          {/* {numberClass.start()} */}
          <div className="header-model-editor">
            <br />
            <p>Ahora vamos a ver la interfaz de edición de arquitectura. </p>
            <ul>
              <br /> <b>A la izquierda </b>se pueden ver las capas de neuronas,
              puedes agregar tantas como desees pulsando el botón "Añadir capa".
              Puedes modificar dos parámetros:
              <ul>
                <li>
                  Unidades de la capa: cuantas unidades deseas que tenga esa
                  capa
                </li>
                <li>
                  Función de activación: función de activación para esa capa
                </li>
              </ul>
              <br />
              <b>A la derecha </b>se pueden ver parámetros generales necesarios
              para la creación del modelo. Estos parámetros son:
              <ul>
                <li>
                  Tasa de entrenamiento: Valor entre 0 y 100 el cual indica a la
                  red qué cantidad de datos debe usar para el entreneamiento y
                  cules para el test
                </li>
                <li>
                  Nº de iteraciones: cantidad de ciclos que va a realizar la red
                  (a mayor número, más tiempo tarda en entrenar)
                </li>
                <li>
                  Optimizador: Es una función que como su propio nombre indica
                  se usa para optimizar los modelos. Esto es frecuentemente
                  usado para evitar estancarse en un máximo local.
                </li>
                <li>
                  Función de pérdida: Es un método para evaluar qué tan bien un
                  algoritmo específico modela los datos otorgados
                </li>
                <li>
                  Métrica: es evaluación para valorar el rendimiento de un
                  modelo de aprendizaje automático
                </li>
              </ul>
              <br />
              <b>Crear y entrenar modelo. </b>Una vez se han rellenado todos los
              campos anteriores podemos crear el modelo pulsando el botón.
              <br />
              <b>Exportar modelo. </b>Si hemos creado el modelo correctamente
              nos aparece este botón que nos permite exportar el modelo y
              guardarlo localmente.
              <br />
              <b>Resultado. </b> Un formulario que nos permite predecir el valor
              de salida a partir de los valores de entrada que introducimos,
              para ver la salida solamente hay que pulsar "Ver resultado".
              <br />
            </ul>
          </div>
        </div>

        {/* BLOCK 1 */}
        <div className="container">
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
                        <CloseButton
                          onClick={() => handlerRemoveLayer(ActiveLayer)}
                        />
                      </div>
                      {/* UNITS */}
                      <Form.Group
                        className="mb-3"
                        controlId={'formClass' + ActiveLayer}
                      >
                        <Form.Label>Clase de la capa</Form.Label>
                        <Form.Select
                          aria-label="Default select example"
                          defaultValue={Layer[ActiveLayer].class}
                          onChange={handleCambio}
                        >
                          <option>Selecciona la clase de la capa</option>
                          {CLASS_TYPE.map((itemAct, indexAct) => {
                            return (
                              <option key={indexAct} value={itemAct}>
                                {itemAct}
                              </option>
                            )
                          })}
                        </Form.Select>
                      </Form.Group>
                      <LayerEdit
                        index={ActiveLayer}
                        item={Layer[ActiveLayer]}
                        handlerRemoveLayer={handlerRemoveLayer}
                        handleChangeKernel={handleChangeKernel}
                        handleChangeActivation={handleChangeActivation}
                        handleChangeFilters={handleChangeFilters}
                        handleChangeStrides={handleChangeStrides}
                        handleChangePoolSize={handleChangePoolSize}
                        handleChangeStridesMax={handleChangeStridesMax}
                        ACTIVATION_TYPE={ACTIVATION_TYPE}
                        CLASS_TYPE={CLASS_TYPE}
                      />
                    </div>
                  </div>
                ) : (
                  ','
                )}

                {/* ADD LAYER */}
                <button
                  className="btn-add-layer"
                  type="button"
                  onClick={() => handlerAddLayer()}
                  variant="primary"
                >
                  Añadir capa
                </button>
              </div>
            </Col>

            {/* GENERAL PARAMETERS */}
            <Col xl className="col-general">
              <div className="container borde general-settings">
                {/* LEARNING RATE */}
                <Form.Group className="mb-3" controlId="formTrainRate">
                  <Form.Label>Tasa de entrenamiento</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Introduce la tasa de entrenamiento"
                    defaultValue={learningValue}
                  />
                  <Form.Text className="text-muted">
                    Recuerda que debe ser un valor entre 0 y 100 (es un
                    porcentaje)
                  </Form.Text>
                </Form.Group>

                {/* Nº OT ITERATIONS */}
                <Form.Group className="mb-3" controlId="formNumberOfEpochs">
                  <Form.Label>Nº de iteraciones</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Introduce el número de iteraciones"
                    defaultValue={NumberEpochs}
                    onChange={handleChangeNoEpochs}
                  />
                  <Form.Text className="text-muted">
                    *Mientras más alto sea, mas taradará en ejecutarse el
                    entrenamiento
                  </Form.Text>
                </Form.Group>

                {/* OPTIMIZATION FUNCTION */}
                <Form.Group className="mb-3" controlId="FormOptimizer">
                  <Form.Label>Selecciona el optimizador</Form.Label>
                  <Form.Select
                    aria-label="Default select example"
                    defaultValue={Optimizer}
                    onChange={handleChangeOptimization}
                  >
                    <option>Selecciona el optimizador</option>
                    {OPTIMIZER_TYPE.map((item, id) => {
                      return (
                        <option key={id} value={item}>
                          {item}
                        </option>
                      )
                    })}
                  </Form.Select>
                  <Form.Text className="text-muted">
                    Será el optimizador que se usará para activar la funcion
                  </Form.Text>
                </Form.Group>
                {/* LOSS FUNCTION */}
                <Form.Group className="mb-3" controlId="FormLoss">
                  <Form.Label>Selecciona la función de pérdida</Form.Label>
                  <Form.Select
                    aria-label="Default select example"
                    defaultValue={LossValue}
                    onChange={handleChangeLoss}
                  >
                    <option>Selecciona la función de pérdida</option>
                    {LOSS_TYPE.map((item, id) => {
                      return (
                        <option key={id} value={item}>
                          {item}
                        </option>
                      )
                    })}
                  </Form.Select>
                  <Form.Text className="text-muted">
                    Será el optimizador que se usará para activar la funcion
                  </Form.Text>
                </Form.Group>

                {/* METRICS FUNCTION */}
                <Form.Group className="mb-3" controlId="FormMetrics">
                  <Form.Label>Selecciona la métrica</Form.Label>
                  <Form.Select
                    aria-label="Default select example"
                    defaultValue={MetricsValue}
                    onChange={handleChangeMetrics}
                  >
                    <option>Selecciona la métrica</option>
                    {METRICS_TYPE.map((item, id) => {
                      return (
                        <option key={id} value={item}>
                          {item}
                        </option>
                      )
                    })}
                  </Form.Select>
                  <Form.Text className="text-muted">
                    Será el optimizador que se usará para activar la funcion
                  </Form.Text>
                </Form.Group>
              </div>
            </Col>
          </Row>
          {/* </div> */}

          {/* INFO ADDITIONAL LAYERS */}
          <div className="header-model-editor mg-top">
            <p>
              Adiccionalmente hay dos capas más que son comunes al resto de
              redes de aprendizaje automático enfocadas en la clasificación de
              imágenes
            </p>
            <ul>
              <li>
                flatten_Flatten: Esta capa aplana la salida 2D en un vector 1D
                preprando el modelo para entrar en la última capa.
              </li>
              <li>
                dense_Dense1: Es la última capa y tiene 10 unidades de salida,
                una por cada posible valor (del 0 al 9)
              </li>
            </ul>
          </div>

          {/* BLOCK  BUTTON */}
          <div className="col-specific cen">
            <button
              className="btn-add-layer"
              type="submit"
              // onClick=
              variant="primary"
            >
              Crear y entrenar modelo
            </button>
          </div>

          <div className="header-model-editor mg-top">
            <p>
              Para <b>ocultar y mostrar</b> el panel lateral pulsa la tecla{' '}
              <b>ñ</b>.
            </p>
          </div>

          <div className="header-model-editor mg-top">
            <p>
              Ahora puedes probar este modelo de dos formas, dibujando con el
              ratón o subiendo una imagen desde tu equipo.
            </p>
          </div>

          <div id="salida"></div>

          {Model === undefined ? (
            ''
          ) : (
            <button
              className="btn-add-layer"
              type="button"
              onClick={handleDownloadModel}
              variant="primary"
            >
              Exportar modelo
            </button>
          )}
        </div>

        {/* BLOCK 2 */}
        <div className="container">
          <div className="container-fluid container-fluid-w1900">
            <div className="container borde">
              <div className="title-pane">Resultado</div>
              {/* VECTOR TEST */}
              <Row>
                <Col
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}
                >
                  <CustomCanvasDrawer submitFunction={handleVectorTest} />
                </Col>
                <Col
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'column',
                    marginBottom: '2rem',
                  }}
                >
                  <input
                    style={{ marginBottom: '2rem' }}
                    type="file"
                    name="doc"
                    onChange={handleChangeFileUpload}
                  ></input>
                  <canvas height="200" width="200" id="imageCanvas"></canvas>
                  <button
                    type="button"
                    onClick={handleVectorTestImageUpload}
                    className="btn-custom-canvas green"
                  >
                    Validar
                  </button>
                </Col>
              </Row>

              <canvas
                id="smallcanvas"
                width="28"
                height="28"
                style={{ display: 'none' }}
              ></canvas>
              <div id="resultado"></div>
              {/* SUBMIT BUTOON */}
            </div>
          </div>
        </div>

        <div className="header-model-editor mg-top">
          <p>
            Ten en cuenta que no se han usado todos los datos para entrenar la
            red y puede que sus predicciones no sean correctas.
          </p>
        </div>

        {/* BLOCK 3 */}
        {/* <div className="resultados">
          <Row>
            <Col>
              <div
                id="demo"
                className="borde console"
                width="100%"
                height="100%"
              >
                Aquí se muestran los resultados
              </div>
            </Col>
          </Row>
        </div> */}
      </Form>
    </>
  )
}
