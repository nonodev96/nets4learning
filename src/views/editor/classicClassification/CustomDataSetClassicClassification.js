import React, { useEffect, useState } from 'react'
import * as tf from '@tensorflow/tfjs'
import * as tfvis from '@tensorflow/tfjs-vis'
import { Accordion, Button, Card, Col, Container, Form, Row } from 'react-bootstrap'
import {
  getHTML_DATASET_DESCRIPTION,
  getNameDatasetByID_ClassicClassification,
  LIST_MODEL_OPTIONS,
  MODEL_UPLOAD,
  MODEL_CAR,
  MODEL_IRIS,
  MODEL_HEPATITIS_C
} from "../../../DATA_MODEL";
import {
  createClassicClassificationCustomDataSet,
  TYPE_ACTIVATION,
  TYPE_OPTIMIZER,
  TYPE_LOSSES,
  TYPE_METRICS,
} from '../../../modelos/ArchitectureHelper'
import cars_json from "../../../modelos/plantilla_car.json";
import iris_json from "../../../modelos/plantilla_iris.json";
import hepatitis_c_json from '../../../modelos/plantilla_hepatitisC.json'
import * as alertHelper from '../../../utils/alertHelper'
import DragAndDrop from "../../../components/dragAndDrop/DragAndDrop";
import GraphicRed from '../../../utils/graphicRed/GraphicRed'
import { CONSOLE_LOG_h3 } from "../../../Constantes";
import './ClassicClassification.css'

export default function CustomDataSetClassicClassification(props) {
  const { dataSet } = props

  const isDebug = process.env.REACT_APP_ENVIRONMENT !== "production"

  const LearningRate_default = 1
  const NumberEpochs_default = 50
  const TestSize_default = 10

  const [nLayer, setNLayer] = useState(0)
  const [Layer, setLayer] = useState([])

  // OPTIMIZER
  const [Optimizer, setOptimizer] = useState('adam')
  // LOSS_TYPE
  const [LossValue, setLossValue] = useState('categoricalCrossentropy')
  // METRICS_TYPE
  const [MetricsValue, setMetricsValue] = useState('accuracy')

  const [Model, setModel] = useState(null)
  const [StringTEST, setStringTEST] = useState("")

  const [LearningRate, setLearningRate] = useState(LearningRate_default)
  const [NumberEpochs, setNumberEpochs] = useState(NumberEpochs_default)
  const [TestSize, setTestSize] = useState(TestSize_default)

  const [CustomDataSet, setCustomDataSet] = useState()
  const [DataSetClasses, setDataSetClasses] = useState([])
  const [isUploadedArchitecture, setIsUploadedArchitecture] = useState(false)

  const [TargetSetClasses, setTargetSetClasses] = useState([])

  const [generatedModels, setGeneratedModels] = useState([])
  const [isTraining, setIsTraining] = useState(false)
  const [DisabledDownloadModel, setDisabledDownloadModel] = useState(true)

  useEffect(() => {
    switch (getNameDatasetByID_ClassicClassification(dataSet)) {
      case MODEL_UPLOAD: {
        const uploadedArchitecture = localStorage.getItem('custom-architecture')
        const uploadedJSON = JSON.parse(uploadedArchitecture)
        const auxLayer = uploadedJSON.modelTopology.config.layers
        let _layerArray = []
        for (let i = 0; i < auxLayer.length; i++) {
          _layerArray.push({
            units     : auxLayer[i].config.units,
            activation: auxLayer[i].config.activation,
          })
        }
        setIsUploadedArchitecture(true)
        setLayer(_layerArray)
        setNLayer(_layerArray.length)
        setStringTEST("")
        break
      }
      case MODEL_IRIS.KEY: {
        let layers = [
          { units: 4, activation: 'sigmoid' },
          { units: 3, activation: 'softmax' },
        ]
        setLayer(layers)
        setNLayer(layers.length)
        setStringTEST("5;5;4;2")
        break
      }
      case MODEL_CAR.KEY: {
        let layers = [
          { units: 5, activation: 'sigmoid' },
          { units: 4, activation: 'softmax' },
        ]
        setLayer(layers)
        setNLayer(layers.length)
        setStringTEST('vhigh;vhigh;2;2;big;med')
        break
      }
      case MODEL_HEPATITIS_C.KEY: {
        let layers = [
          { units: 12, activation: 'sigmoid' },
          { units: 10, activation: 'relu' },
          { units: 10, activation: 'relu' },
          { units: 10, activation: 'relu' },
          { units: 5, activation: 'softmax' },
        ]
        setLayer(layers)
        setNLayer(layers.length)
        setStringTEST('32;m;38.5;52.5;18;24.7;3.9;11.17;4.8;74;15.6;76.5')
        break
      }
      default: {
        console.error("Error, opción no permitida")
      }
    }
  }, [])

  const handleClickPlay = async (event) => {
    event.preventDefault()
    console.log('Conjunto de datos: ', { dataSet })
    let _customDataSet

    switch (getNameDatasetByID_ClassicClassification(dataSet)) {
      case MODEL_UPLOAD: {
        console.log({ CustomDataSet })
        if (CustomDataSet === undefined) {
          await alertHelper.alertError('Primero debes de cargar la arquitectura')
          return
        }
        _customDataSet = CustomDataSet
        break;
      }
      case MODEL_CAR.KEY: {
        _customDataSet = cars_json
        break;
      }
      case MODEL_IRIS.KEY: {
        _customDataSet = iris_json
        break;
      }
      case MODEL_HEPATITIS_C.KEY: {
        _customDataSet = hepatitis_c_json
        break;
      }
      default: {
        console.error("Error, opción no disponible")
        return
      }
    }

    try {
      setIsTraining(true)
      let _learningRate = LearningRate / 100
      let _numberOfEpoch = parseInt(NumberEpochs)
      let _testSize = TestSize / 100
      let _idOptimizer = document.getElementById('FormOptimizer').value
      let _layerList = Layer
      let _idLoss = LossValue
      let _idMetrics = MetricsValue
      const [model, TARGET_SET_CLASSES, DATA_SET_CLASSES] = await createClassicClassificationCustomDataSet(
        _learningRate,
        _testSize,
        _numberOfEpoch,
        _idOptimizer,
        _layerList,
        _idLoss,
        _idMetrics,
        _customDataSet
      )
      setGeneratedModels(oldArray => [...oldArray, {
        learningRate : _learningRate,
        testSize     : _testSize,
        numberOfEpoch: _numberOfEpoch,
        layerList    : _layerList,
        idOptimizer  : _idOptimizer,
        idLoss       : _idLoss,
        idMetrics    : _idMetrics,
        customDataSet: _customDataSet
      }])
      setIsTraining(false)
      setDisabledDownloadModel(false)
      setDataSetClasses(DATA_SET_CLASSES)
      setTargetSetClasses(TARGET_SET_CLASSES)
      setModel(model)
      await alertHelper.alertSuccess('Modelo entrenado con éxito')
    } catch (error) {
      console.log(error)
    } finally {
      setIsTraining(false)
    }
  }

  const handleClick_TestVector = async () => {
    if (getNameDatasetByID_ClassicClassification(dataSet) === MODEL_UPLOAD) {
      if (CustomDataSet === undefined) {
        await alertHelper.alertError('Primero debes de cargar un dataSet')
        return
      }
    }
    if (Model === undefined) {
      await alertHelper.alertError('Primero debes de entrenar el modelo')
      return
    }
    // vhigh;vhigh;2;2;big;med
    let input = [[], [1, StringTEST.split(';').length]]
    try {
      switch (getNameDatasetByID_ClassicClassification(dataSet)) {
        case MODEL_UPLOAD: {
          let i = 0
          StringTEST.split(';').forEach((element) => {
            if (isNaN(parseFloat(element))) {
              input[0].push(DataSetClasses[i].get(element))
            } else {
              input[0].push(DataSetClasses[i].get(parseFloat(element)))
            }
            i++
          })
          break
        }
        case MODEL_CAR.KEY: {
          // med;high;4;4;small;high
          for (const element of StringTEST.split(';')) {
            const index = StringTEST.split(';').indexOf(element);
            input[0].push(await MODEL_CAR.function_v_input(element, index, cars_json.attributes[index]))
          }
          break
        }
        case MODEL_IRIS.KEY: {
          for (const element of StringTEST.split(';')) {
            const index = StringTEST.split(';').indexOf(element);
            input[0].push(await MODEL_IRIS.function_v_input(element, index, iris_json.attributes[index]))
          }
          break
        }
        case MODEL_HEPATITIS_C.KEY: {
          for (const element of StringTEST.split(';')) {
            const index = StringTEST.split(';').indexOf(element);
            input[0].push(await MODEL_HEPATITIS_C.function_v_input(element, index, hepatitis_c_json.attributes[index]))
          }
          break
        }
        default: {
          console.error("Error, opción no permitida")
          break
        }
      }
      const tensor = tf.tensor2d(input[0], input[1])
      const prediction = Model.predict(tensor)
      const predictionWithArgMax = prediction.argMax(-1).dataSync()

      console.log('La solución es: ', { predictionWithArgMax, prediction, TargetSetClasses })
      await alertHelper.alertInfo(
        'Tipo: ' + TargetSetClasses[predictionWithArgMax],
        `` + TargetSetClasses[predictionWithArgMax]
      )
    } catch (error) {
      console.error(error)
    }
  }

  const handlerClick_AddLayer = async () => {
    let aux = Layer
    if (aux === undefined) {
      await alertHelper.alertWarning("Error handlerAddLayer")
      return
    }
    if (aux.length < 6) {
      aux.push({
        units     : 10,
        activation: 'sigmoid'
      })
      setLayer(aux)
      setNLayer(aux.length)
    } else {
      await alertHelper.alertWarning("No se pueden añadir más capas")
    }
  }

  const handlerClick_RemoveLayer = async (idLayer) => {
    let aux = Layer
    if (aux === undefined) {
      await alertHelper.alertWarning(`Error handlerRemoveLayer`)
      return
    }
    let new_layer = []
    for (let i = 0; i < idLayer; i++) {
      new_layer.push(aux[i])
    }
    for (let i = idLayer + 1; i < aux.length; i++) {
      document.getElementById(`formUnitsLayer${i - 1}`).value =
        document.getElementById(`formUnitsLayer${i}`).value
      document.getElementById(`formActivationLayer${i - 1}`).value =
        document.getElementById(`formActivationLayer${i}`).value
      new_layer.push(aux[i])
    }
    setLayer(new_layer)
    setNLayer(nLayer - 1)
  }

  const handleChange_Units = async (index) => {
    let aux_layer = Layer
    if (aux_layer === undefined) {
      await alertHelper.alertWarning(`Error handleChangeUnits`)
      return
    }
    aux_layer[index].units = parseInt(document.getElementById(`formUnitsLayer${index}`).value)
    setLayer(aux_layer)
  }

  const handleChange_TestInput = async () => {
    let aux = document.getElementById(`formTestInput`).value
    if (aux === undefined) {
      await alertHelper.alertWarning(`Error handleChangeTestInput`)
      return
    }
    setStringTEST(aux)
  }

  const handleChange_Activation = async (index) => {
    let aux_layer = Layer
    if (aux_layer === undefined) {
      await alertHelper.alertWarning(`Error handleChangeActivation`)
      return
    }
    aux_layer[index].activation = document.getElementById(`formActivationLayer${index}`).value
    setLayer(aux_layer)
  }

  const handleChange_LearningRate = async (e) => {
    let aux = e.target.value
    if (aux === undefined) {
      await alertHelper.alertWarning(`Error handleChange_LearningRate`)
      return
    }
    setLearningRate(parseInt(aux))
  }

  const handleChange_NumberEpochs = async (e) => {
    let aux = e.target.value
    if (aux === undefined) {
      await alertHelper.alertWarning(`Error handleChange_NumberEpochs`)
      return
    }
    setNumberEpochs(parseInt(aux))
  }

  const handleChange_TestSize = async (e) => {
    let aux = e.target.value
    if (aux === undefined) {
      await alertHelper.alertWarning(`Error handleChange_TestSize`)
      return
    }
    setTestSize(parseInt(aux))
  }

  const handleChange_Loss = async () => {
    let aux = document.getElementById('FormLoss').value
    if (aux === undefined) {
      await alertHelper.alertWarning(`Error handleChange_Loss`)
      return
    }
    // console.log({ aux })
    setLossValue(aux)
  }

  const handleChange_Optimization = async () => {
    let aux = document.getElementById('FormOptimizer').value
    if (aux === undefined) {
      await alertHelper.alertWarning(`Error handleChange_Optimization`)
      return
    }
    setOptimizer(aux)
  }

  const handleChange_Metrics = async () => {
    let aux = document.getElementById('FormMetrics').value
    if (aux === undefined) {
      await alertHelper.alertWarning(`Error handleChange_Metrics`)
      return
    }
    // console.log({ aux })
    setMetricsValue(aux)
  }

  const handleDownloadModel = () => {
    Model.save('downloads://mymodel')
  }

  const handleClick_Debug = () => {
    Model.summary()
  }

  const _download = (filename, textInput) => {
    const link = document.createElement('a')
    link.setAttribute('href', 'data:text/plain;charset=utf-8, ' + encodeURIComponent(textInput))
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    link.parentNode.removeChild(link);
  }

  const downloadFile = () => {
    const filename = 'plantilla.json'
    const testInput = `{
  "classes"    : [ "clase_1",    "clase_2",    "clase_3",    "clase__",   "clase_n" ],
  "attributes" : [ "atributo_1", "atributo_2", "atributo__", "atributo_n" ],
  "data"       : [
    ["dato01", "dato_02", "dato_03", "dato_04", "dato_05", "resultado_1"],
    ["dato11", "dato_12", "dato_13", "dato_14", "dato_15", "resultado_2"],
    ["dato21", "dato_22", "dato_23", "dato_24", "dato_25", "resultado_3"],
    ["dato31", "dato_32", "dato_33", "dato_34", "dato_35", "resultado_4"],
    ["dato41", "dato_42", "dato_43", "dato_44", "dato_45", "resultado_5"],
    ["dato51", "dato_52", "dato_53", "dato_54", "dato_55", "resultado_6"]
  ]
}`
    _download(filename, testInput)
  }

  const handleChange_FileUpload = (files) => {
    if (files.length !== 1) {
      console.log("%cError, no se ha podido cargar el fichero", CONSOLE_LOG_h3)
      return;
    }
    try {
      const file_json = new File([files[0]], files[0].name, { type: files[0].type });
      let reader = new FileReader()
      reader.readAsText(file_json)
      reader.onload = (e) => {
        let json = JSON.parse(e.target.result.toString())
        console.log(json)
        setCustomDataSet(json)
      }
    } catch (error) {
      console.error(error)
    }
  }

  console.log("render")
  return (
    <>
      <Form id={"CustomDataSetClassicClassification"}
            onSubmit={handleClickPlay}>
        <Container className={"mb-3"}>
          <Row>
            <Col xl={12} className={"mt-3"}>
              <Accordion defaultActiveKey={["description_architecture_editor"]}
                         alwaysOpen>
                <Accordion.Item key={"0"} eventKey={"description_architecture_editor"}>
                  <Accordion.Header><h3>Manual</h3></Accordion.Header>
                  <Accordion.Body>
                    <p>Ahora vamos a ver la interfaz de edición de arquitectura. </p>
                    <ul>
                      <li>
                        <b>A la izquierda </b><br/>
                        Se pueden ver las capas de neuronas, puedes agregar tantas como desees pulsando el botón "Añadir
                        capa". <br/>
                        Puedes modificar dos parámetros:
                      </li>
                      <ul>
                        <li><b>Unidades de la capa:</b><br/>Cuantas unidades deseas que tenga esa capa</li>
                        <li><b>Función de activación:</b><br/>Función de activación para esa capa</li>
                      </ul>
                      <li>
                        <b>A la derecha </b><br/>
                        Se pueden ver parámetros generales necesarios para la creación del modelo. <br/>
                        Estos parámetros son:
                      </li>
                      <ul>
                        <li>
                          <b>Tasa de entrenamiento:</b><br/>
                          Valor entre 0 y 100 el cual indica a la red qué cantidad de datos debe usar para el
                          entrenamiento y reglas para el test
                        </li>
                        <li>
                          <b>Nº de iteraciones:</b><br/>
                          Cantidad de ciclos que va a realizar la red (a mayor número, más tiempo tarda en entrenar)
                        </li>
                        <li>
                          <b>Optimizador:</b><br/>
                          Es una función que como su propio nombre indica se usa para optimizar los modelos. <br/>
                          Esto es frecuentemente usado para evitar estancarse en un máximo local.
                        </li>
                        <li>
                          <b>Función de pérdida:</b><br/>
                          Es un método para evaluar qué tan bien un algoritmo específico modela los datos otorgados
                        </li>
                        <li>
                          <b>Métrica:</b><br/>
                          Es evaluación para valorar el rendimiento de un modelo de aprendizaje automático
                        </li>
                      </ul>
                      <li>
                        <b>Crear y entrenar modelo.</b><br/>
                        Una vez se han rellenado todos los campos anteriores podemos crear el modelo pulsando el botón.
                      </li>
                      <li>
                        <b>Exportar modelo.</b><br/>
                        Si hemos creado el modelo correctamente nos aparece este botón que nos permite exportar el modelo
                        y guardarlo localmente.
                      </li>
                      <li>
                        <b>Resultado.</b><br/>
                        Un formulario que nos permite predecir el valor de salida a partir de los valores de entrada que
                        introducimos, para ver la salida solamente hay que pulsar "Ver resultado".
                      </li>
                    </ul>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item key={"1"} eventKey={"description_dataset"}>
                  <Accordion.Header><h3>Dataset: {LIST_MODEL_OPTIONS[0][dataSet]}</h3></Accordion.Header>
                  <Accordion.Body>
                    {{
                      '0': <>
                        <DragAndDrop name={"json"}
                                     accept={{ 'application/json': ['.json'] }}
                                     text={"Introduce el fichero de datos plantilla.json"}
                                     labelFiles={"Fichero:"}
                                     function_DropAccepted={handleChange_FileUpload}/>
                        <p className="text-muted">
                          Carga tu propio conjunto de datos con la siguiente estructura, usa está platilla.
                        </p>
                        <p className={"text-center"}>
                          <Button variant={"outline-info"}
                                  size={"sm"}
                                  onClick={downloadFile}>Descargar plantilla</Button>
                        </p>

                      </>
                    }[dataSet]}
                    {dataSet !== '0' ? (
                      // DEFAULT
                      getHTML_DATASET_DESCRIPTION(0, dataSet)
                    ) : ("")}
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Col>

            <Col xl={12} className={"mt-3"}>
              <Card className={"border-info"}>
                <Card.Body>
                  <Card.Text>
                    {isUploadedArchitecture ? (
                      "A continuación se ha pre cargado la arquitectura del fichero importado en la vista anterior."
                    ) : (
                      "A continuación se ha pre cargado una arquitectura."
                    )}
                  </Card.Text>
                  <Card.Text>
                    Modifica los parámetros a tu gusto para jugar con la red y descubrir diferentes comportamientos de
                    la misma.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* BLOCK 1 */}
          <Row className={"mt-3"}>
            <Col xl={12}>
              <Card>
                <Card.Header><h3>Diseño de capas</h3></Card.Header>
                <Card.Body>
                  <GraphicRed layer={Layer}
                              tipo={0}/>
                </Card.Body>
              </Card>
            </Col>

            {/* SPECIFIC PARAMETERS */}
            <Col className={"mt-3"} xl={6}>
              {/* ADD LAYER */}
              <div className="d-grid gap-2">
                <Button type="button"
                        onClick={() => handlerClick_AddLayer()}
                        size={"lg"}
                        variant="primary">
                  Añadir capa
                </Button>
              </div>

              <Accordion className={"mt-3"}
                         defaultActiveKey={["0"]}
                         alwaysOpen>
                {Layer.map((item, index) => {
                  return (
                    <Accordion.Item key={index} eventKey={index.toString()}>
                      <Accordion.Header>
                        Capa {index + 1}
                      </Accordion.Header>

                      <Accordion.Body>
                        <div className="d-grid gap-2">
                          <Button onClick={() => handlerClick_RemoveLayer(index)}
                                  variant={"outline-danger"}>
                            Eliminar capa {index + 1}
                          </Button>
                        </div>
                        {/* UNITS */}
                        <Form.Group className="mt-3"
                                    controlId={'formUnitsLayer' + index}>
                          <Form.Label>Unidades de la capa</Form.Label>
                          <Form.Control type="number"
                                        min={0}
                                        max={12}
                                        placeholder="Introduce el número de unidades de la capa"
                                        defaultValue={item.units}
                                        onChange={() => handleChange_Units(index)}/>
                        </Form.Group>
                        {/* ACTIVATION FUNCTION */}
                        <Form.Group className="m3-3"
                                    controlId={'formActivationLayer' + index}>
                          <Form.Label>Selecciona la función de activación</Form.Label>
                          <Form.Select aria-label={"Default select example: " + item.activation}
                                       defaultValue={item.activation}
                                       onChange={() => handleChange_Activation(index)}>
                            {TYPE_ACTIVATION.map(([key, value], indexAct) => {
                              return (<option key={indexAct} value={key}>{value}</option>)
                            })
                            }
                          </Form.Select>
                          <Form.Text className="text-muted">
                            Será el optimizador que se usará para activar la función
                          </Form.Text>
                        </Form.Group>
                      </Accordion.Body>
                    </Accordion.Item>
                  )
                })}
              </Accordion>
            </Col>

            {/* GENERAL PARAMETERS */}
            <Col className={"mt-3"} xl={6}>
              <Card className={"sticky-top"} style={{ zIndex: 10 }}>
                <Card.Body>
                  {/* LEARNING RATE */}
                  <Form.Group className="mb-3" controlId="formTrainRate">
                    <Form.Label>Tasa de entrenamiento</Form.Label>
                    <Form.Control type="number"
                                  min={1}
                                  max={100}
                                  placeholder="Introduce la tasa de entrenamiento"
                                  defaultValue={LearningRate_default}
                                  onChange={handleChange_LearningRate}/>
                    <Form.Text className="text-muted">
                      Recuerda que debe ser un valor entre 0 y 100 (es un porcentaje)
                    </Form.Text>
                  </Form.Group>

                  {/* Nº OT ITERATIONS */}
                  <Form.Group className="mb-3" controlId="FormNumberOfEpochs">
                    <Form.Label>Nº de iteraciones</Form.Label>
                    <Form.Control type="number"
                                  min={1}
                                  max={100}
                                  placeholder="Introduce el número de iteraciones"
                                  defaultValue={NumberEpochs_default}
                                  onChange={handleChange_NumberEpochs}/>
                    <Form.Text className="text-muted">
                      *Mientras más alto sea, mas tardará en ejecutarse el entrenamiento
                    </Form.Text>
                  </Form.Group>

                  {/* TEST SIZE */}
                  <Form.Group className="mb-3" controlId="formTrainRate">
                    <Form.Label>Tamaño del banco de pruebas</Form.Label>
                    <Form.Control type="number"
                                  min={1}
                                  max={100}
                                  placeholder="Introduce el tamaño del banco de pruebas"
                                  defaultValue={TestSize_default}
                                  onChange={handleChange_TestSize}/>
                    <Form.Text className="text-muted">
                      Recuerda que debe ser un valor entre 0 y 100 (es un porcentaje)
                    </Form.Text>
                  </Form.Group>

                  {/* OPTIMIZATION FUNCTION */}
                  <Form.Group className="mb-3" controlId="FormOptimizer">
                    <Form.Label>Selecciona el optimizador</Form.Label>
                    <Form.Select aria-label="Default select example"
                                 defaultValue={Optimizer}
                                 onChange={handleChange_Optimization}>
                      {TYPE_OPTIMIZER.map(([key, value], id) => {
                        return (<option key={id} value={key}>{value}</option>)
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
                      {TYPE_LOSSES.map(([key, value], id) => {
                        return (<option key={id} value={key}>{value}</option>)
                      })}
                    </Form.Select>
                    <Form.Text className="text-muted">
                      Será la función que se usará.
                    </Form.Text>
                  </Form.Group>

                  {/* METRICS FUNCTION */}
                  <Form.Group className="mb-3" controlId="FormMetrics">
                    <Form.Label>Selecciona la métrica</Form.Label>
                    <Form.Select aria-label="Selecciona la métrica"
                                 defaultValue={MetricsValue}
                                 onChange={handleChange_Metrics}>
                      {TYPE_METRICS.map(([key, value], id) => {
                        return (<option key={id} value={key}>{value}</option>)
                      })}
                    </Form.Select>
                    <Form.Text className="text-muted">
                      Será el tipo de métrica que se usará para la evaluación del entrenamiento
                    </Form.Text>
                  </Form.Group>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* BLOCK  BUTTON */}
          <Row className={"mt-3"}>
            <Col xl={12}>
              <div className="d-grid gap-2">
                <Button type="submit"
                        disabled={isTraining}
                        size={"lg"}
                        variant="primary">
                  Crear y entrenar modelo
                </Button>
              </div>
            </Col>
          </Row>

          {/* SALIDA */}
          <Row className={"mt-3"}>
            <Col xl={12}>
              <Card>
                <Card.Header className={"d-flex"}>
                  <h3>Modelos</h3>
                  <div className={"mt-1"}>
                    <Button variant={"outline-primary"}
                            className={"ms-1"}
                            size={"sm"}
                            onClick={() => {
                              tfvis.visor().open()
                            }}>
                      Abrir visor
                    </Button>
                    <Button variant={"outline-primary"}
                            className={"ms-1"}
                            size={"sm"}
                            onClick={() => {
                              tfvis.visor().close()
                            }}>
                      Cerrar visor
                    </Button>
                  </div>
                </Card.Header>
                <Card.Body>
                  <table className={"table table-sm"}>
                    <thead>
                    <tr>
                      <th>ID</th>
                      <th>Entrenamiento</th>
                      <th>Nº de iteraciones</th>
                      <th>Pruebas</th>
                      <th>Capas</th>
                      <th>Optimizador</th>
                      <th>Perdida</th>
                      <th>Métrica</th>
                      <th>Descargar</th>
                    </tr>
                    </thead>
                    <tbody>
                    {generatedModels.map((value, index) => {
                      // learningRate
                      // testSize
                      // numberOfEpoch
                      // layerList
                      // idOptimizer
                      // idLoss       :
                      // idMetrics
                      // customDataSet
                      return (
                        <tr key={"model_list_row_" + index}>
                          <td>{index}</td>
                          <td>{value.learningRate * 100}%</td>
                          <td>{value.numberOfEpoch}</td>
                          <td>{value.testSize * 100}%</td>
                          <td>
                            {value.layerList.map((value, index) => {
                              return <span key={index}><small>{value.units} - {value.activation}</small><br/></span>
                            })}
                          </td>
                          <td>{value.idOptimizer}</td>
                          <td>{value.idLoss}</td>
                          <td>{value.idMetrics}</td>
                          <td>
                            <Button variant={"outline-info"}
                                    size={"sm"}
                                    onClick={() => {
                                    }}>
                              Descargar
                            </Button>
                          </td>
                        </tr>
                      )
                    })}
                    </tbody>
                  </table>

                  {isTraining ? <p className="placeholder-glow"><span className="placeholder col-12"></span></p> : <></>}

                  <div id="salida"></div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </Form>

      <Container>
        {(Model !== undefined) &&
          <>
            <Row className={"mt-3"}>
              <Col xl={12}>
                <div className="d-grid gap-2">
                  <Button type="button"
                          disabled={DisabledDownloadModel}
                          onClick={handleDownloadModel}
                          size={"lg"}
                          variant="primary">
                    Exportar modelo
                  </Button>
                </div>
              </Col>
            </Row>
          </>
        }

        {/* BLOCK 2 */}
        <Row className={"mt-3"}>
          <Col xl={12}>
            <Card>
              <Card.Header><h3>Resultado</h3></Card.Header>
              <Card.Body>
                {{
                  0: <>
                    <Card.Text>
                      Introduce separado por puto y coma los valores: <br/>
                      <b>(parámetro_1;parámetro_2;parámetro_3; ...).</b>
                    </Card.Text>
                  </>,
                  1: <>
                    <Card.Text>
                      Introduce separado por comas los siguientes valores correspondientes a el coche que se va a evaluar:<br/>
                      <b>(buying;maint;doors;persons;lug_boot;safety).</b>
                    </Card.Text>
                  </>,
                  2: <>
                    <Card.Text>
                      Introduce separado por comas los siguientes valores correspondientes a la planta que se va a evaluar: <br/>
                      <b>(longitud sépalo;anchura sépalo;longitud petalo;anchura petalo).</b>
                    </Card.Text>
                  </>,
                  3: <>
                    <Card.Text>
                      Introduce separado por punto y coma los siguientes valores correspondientes a la planta que se va a evaluar:
                      <br/>
                      <b>(age, sex, alb, alp, alt, ast, bil, che, chol, crea, ggt, prot).</b>
                    </Card.Text>
                  </>
                }[dataSet]}

                <Form onSubmit={(event) => {
                  event.preventDefault()
                }}>
                  <Form.Group className="mb-3" controlId={'formTestInput'}>
                    <Form.Label>Introduce el vector a probar</Form.Label>

                    <Form.Control placeholder="Introduce el vector a probar"
                                  defaultValue={StringTEST}
                                  onChange={() => handleChange_TestInput()}/>
                  </Form.Group>

                  <Container>
                    {isDebug &&
                      <Row>
                        <Col>
                          <h3>Coches</h3>
                          <pre>
<b>0</b> 3;3;3;1;1;0<br/>
<b>0</b> 3;3;3;1;0;0<br/>
<b>0</b> 3;3;3;1;2;0<br/>
<b>1</b> 3;3;3;1;0;1<br/>
<b>2</b> 3;3;3;1;1;2<br/>
<b>2</b> 3;3;3;1;2;2<br/>
<b>3</b> 3;3;3;1;1;1<br/>
<b>3</b> 3;3;3;1;0;2<br/>
<b>3</b> 3;3;3;1;2;1<br/>
</pre>
                        </Col>
                        <Col>
                          <h3>Iris</h3>
                          <pre>
<b>0</b> 3;2;0;0 <br/>
<b>0</b> 14;8;2;0 <br/>
<b>0</b> 4;12;0;0 <br/>
<b>1</b> 15;2;9;6 <br/>
<b>1</b> 16;2;10;7 <br/>
<b>1</b> 17;3;11;7 <br/>
<b>1</b> 23;16;9;13 <br/>
<b>1</b> 16;7;22;8 <br/>
<b>1</b> 27;16;21;6 <br/>
<b>2</b> 25;1;42;21 <br/>
<b>2</b> 19;21;23;16 <br/>
<b>2</b> 18;1;42;19 <br/>
<b>2</b> 26;6;41;21 <br/>
<b>2</b> 21;1;26;12 <br/>
                        </pre>
                        </Col>
                        <Col>
                          <h3>Hepatitis C</h3>
                          <pre>
<b>3</b> 27;0;185;169;330;284;183;397;231;108;145;195 <br/>
<b>3</b> 27;0;182;9;331;285;184;398;307;95;158;123 <br/>
<b>3</b> 29;0;12;82;332;286;164;399;62;109;347;38 <br/>
<b>3</b> 33;0;188;375;333;287;168;167;103;6;348;187 <br/>
<b>3</b> 41;0;186;408;334;288;170;400;90;110;349;196 <br/>
<b>3</b> 10;1;173;95;335;289;173;401;259;111;350;9 <br/>
<b>3</b> 17;1;173;409;336;290;12;289;308;112;351;197 <br/>
<b>3</b> 20;1;12;410;337;34;172;173;309;113;352;198 <br/>
<b>3</b> 26;1;181;411;199;291;120;402;310;62;353;43 <br/>
<b>3</b> 27;1;12;273;27;292;174;403;311;114;354;64 <br/>
<b>3</b> 30;1;162;412;338;293;185;324;143;115;355;123 <br/>
<b>3</b> 32;1;189;413;339;294;186;404;312;13;304;8 <br/>
<b>3</b> 32;1;25;414;340;295;187;405;313;116;133;183 <br/>
<b>3</b> 14;1;173;375;131;259;186;406;29;59;356;27 <br/>
<b>3</b> 27;1;65;375;341;29668;81;50;40;357;88 <br/>
</pre>
                        </Col>
                      </Row>
                    }
                  </Container>

                  {/* SUBMIT BUTTON */}
                  <Button type="button"
                          onClick={handleClick_TestVector}
                          size={"lg"}
                          variant="primary">
                    Predecir
                  </Button>

                  {isDebug &&
                    <Button type="button"
                            className={"ms-3"}
                            onClick={handleClick_Debug}
                            size={"lg"}
                            variant="primary">
                      Debug
                    </Button>
                  }
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>

      </Container>
    </>
  )
}
