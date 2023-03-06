import React, { useEffect, useState } from 'react'
import * as tf from '@tensorflow/tfjs'
import * as tfvis from '@tensorflow/tfjs-vis'
import { Accordion, Button, Card, Col, Container, Form, Row } from 'react-bootstrap'
import { getHTML_DATASET_DESCRIPTION, getNameDatasetByID_ClassicClassification, LIST_MODEL_OPTIONS, MODEL_CAR, MODEL_HEPATITIS_C, MODEL_IRIS, MODEL_UPLOAD } from "../../../DATA_MODEL";
import {
  createClassicClassificationCustomDataSet,
} from '../../../modelos/ArchitectureHelper'
import {
  TYPE_ACTIVATION,
  TYPE_OPTIMIZER,
  TYPE_LOSSES,
  TYPE_METRICS
} from "../../../modelos/ArchitectureTypesHelper";
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
  const NumberEpochs_default = 10
  const TestSize_default = 10

  const [generatedModels, setGeneratedModels] = useState([])

  const [nLayer, setNLayer] = useState(0)
  const [Layer, setLayer] = useState([])

  // OPTIMIZER
  const [idOptimizerValue, setIdOptimizerValue] = useState('adam')
  // LOSS_TYPE
  const [idLossValue, setIdLossValue] = useState('categoricalCrossentropy')
  // METRICS_TYPE
  const [idMetricsValue, setIdMetricsValue] = useState('accuracy')

  const [Model, setModel] = useState(null)
  const [StringTEST, setStringTEST] = useState("")

  const [LearningRate, setLearningRate] = useState(LearningRate_default)
  const [NumberEpochs, setNumberEpochs] = useState(NumberEpochs_default)
  const [TestSize, setTestSize] = useState(TestSize_default)

  const [CustomDataSet_JSON, setCustomDataSet_JSON] = useState()
  const [DataSetClasses, setDataSetClasses] = useState([])
  const [isUploadedArchitecture, setIsUploadedArchitecture] = useState(false)

  const [TargetSetClasses, setTargetSetClasses] = useState([])

  const [isTraining, setIsTraining] = useState(false)
  const [DisabledDownloadModel, setDisabledDownloadModel] = useState(true)

  useEffect(() => {
    switch (getNameDatasetByID_ClassicClassification(dataSet)) {
      case MODEL_UPLOAD: {
        const uploadedArchitecture = localStorage.getItem('custom-architecture')
        const uploadedJSON = JSON.parse(uploadedArchitecture)
        const auxLayer = uploadedJSON?.modelTopology?.config?.layers ?? []
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
      case MODEL_CAR.KEY: {
        let layers = [
          { units: 10, activation: 'sigmoid' },
          { units: 4, activation: 'softmax' },
        ]
        setLayer(layers)
        setNLayer(layers.length)
        setStringTEST('med;med;2;4;big;high')
        break
      }
      case MODEL_IRIS.KEY: {
        let layers = [
          { units: 10, activation: 'sigmoid' },
          { units: 3, activation: 'softmax' },
        ]
        setLayer(layers)
        setNLayer(layers.length)
        setStringTEST("5.9;3;5.1;1.8 ")
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
    console.debug('ID Conjunto de datos: ', { dataSet })
    let _customDataset_JSON

    switch (getNameDatasetByID_ClassicClassification(dataSet)) {
      case MODEL_UPLOAD: {
        console.debug({ CustomDataSet_JSON: CustomDataSet_JSON })
        if (CustomDataSet_JSON === undefined) {
          await alertHelper.alertError('Primero debes de cargar los datos')
          return
        }
        _customDataset_JSON = CustomDataSet_JSON
        break;
      }
      case MODEL_CAR.KEY: {
        _customDataset_JSON = cars_json
        break;
      }
      case MODEL_IRIS.KEY: {
        _customDataset_JSON = iris_json
        break;
      }
      case MODEL_HEPATITIS_C.KEY: {
        _customDataset_JSON = hepatitis_c_json
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
      let _layerList = Layer

      let _idOptimizer = idOptimizerValue
      let _idLoss = idLossValue
      let _idMetrics = idMetricsValue

      const [model, TARGET_SET_CLASSES, DATA_SET_CLASSES] = await createClassicClassificationCustomDataSet({
        learningRate : _learningRate,
        numberOfEpoch: _numberOfEpoch,
        testSize     : _testSize,
        layerList    : _layerList,
        dataset_JSON : _customDataset_JSON,
        idOptimizer  : _idOptimizer,
        idLoss       : _idLoss,
        idMetrics    : _idMetrics
      })
      setGeneratedModels(oldArray => [
        ...oldArray.map((oldModel) => {
          return { ...oldModel, isLoad: false }
        }), {
          idMODEL           : oldArray.length + 1,
          isLoad            : true,
          model             : model,
          TARGET_SET_CLASSES: TARGET_SET_CLASSES,
          DATA_SET_CLASSES  : DATA_SET_CLASSES,

          learningRate : _learningRate,
          testSize     : _testSize,
          numberOfEpoch: _numberOfEpoch,
          layerList    : JSON.parse(JSON.stringify(_layerList)),
          idOptimizer  : _idOptimizer,
          idLoss       : _idLoss,
          idMetrics    : _idMetrics
        }]
      )
      setIsTraining(false)
      setDisabledDownloadModel(false)
      setDataSetClasses(DATA_SET_CLASSES)
      setTargetSetClasses(TARGET_SET_CLASSES)

      setModel(model)
      await alertHelper.alertSuccess('Modelo entrenado con éxito')
    } catch (error) {
      console.error(error)
    } finally {
      setIsTraining(false)
    }
  }

  const handleClick_TestVector = async () => {
    if (getNameDatasetByID_ClassicClassification(dataSet) === MODEL_UPLOAD) {
      if (CustomDataSet_JSON === undefined) {
        await alertHelper.alertError('Primero debes de cargar un dataSet')
        return
      }
    }
    if (Model === undefined) {
      await alertHelper.alertError('Primero debes de entrenar el modelo')
      return
    }
    let dataset_JSON = null
    let input = [[], [1, StringTEST.split(';').length]]
    try {
      switch (getNameDatasetByID_ClassicClassification(dataSet)) {
        case MODEL_UPLOAD: {
          dataset_JSON = CustomDataSet_JSON
          break
        }
        case MODEL_CAR.KEY: {
          dataset_JSON = cars_json
          //   // vhigh;vhigh;2;2;big;med
          //   // med;high;4;4;small;high
          //   for (const element of StringTEST.split(';')) {
          //     const index = StringTEST.split(';').indexOf(element);
          //     input[0].push(await MODEL_CAR.function_v_input(element, index, cars_json.attributes[index]))
          //   }
          break
        }
        case MODEL_IRIS.KEY: {
          dataset_JSON = iris_json
          //   for (const element of StringTEST.split(';')) {
          //     const index = StringTEST.split(';').indexOf(element);
          //     input[0].push(await MODEL_IRIS.function_v_input(element, index, iris_json.attributes[index]))
          //   }
          break
        }
        case MODEL_HEPATITIS_C.KEY: {
          dataset_JSON = hepatitis_c_json
          //   for (const element of StringTEST.split(';')) {
          //     const index = StringTEST.split(';').indexOf(element);
          //     input[0].push(await MODEL_HEPATITIS_C.function_v_input(element, index, hepatitis_c_json.attributes[index]))
          //   }
          break
        }
        default: {
          console.error("Error, opción no permitida")
          return
        }
      }
      console.debug("Dataset_JSON", { dataset_JSON })
      let i = 0
      for (const element of StringTEST.split(';')) {
        let name = dataset_JSON?.attributes[i].name
        let type = dataset_JSON?.attributes[i].type
        console.debug("By column:", name, {
          element  : element,
          type     : type,
          id_number: DataSetClasses[i].get(parseInt(element)),
          id_float : DataSetClasses[i].get(parseFloat(element)),
          id_select: DataSetClasses[i].get(element),
        })
        switch (type) {
          case "number": {
            input[0].push(DataSetClasses[i].get(parseInt(element)))
            break
          }
          case "float": {
            input[0].push(DataSetClasses[i].get(parseFloat(element)))
            break
          }
          case "select": {
            input[0].push(DataSetClasses[i].get(element))
            break
          }
          default: {
            console.warn("Columna desconocida?")
            break
          }
        }
        i++
      }

      if (input[0].some((tag) => tag === undefined)) {
        await alertHelper.alertInfo("Valor indefinido", "Error, input no válido")
        return;
      }

      console.log("DataSetClasses: ", { DataSetClasses }, ...input[0])
      const tensor = tf.tensor2d(input[0], input[1])
      const predictionWithArgMax = Model.predict(tensor).argMax(-1).dataSync()

      console.info('La solución es: ', { predictionWithArgMax, TargetSetClasses })
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
    setIdLossValue(aux)
  }

  const handleChange_Optimization = async () => {
    let aux = document.getElementById('FormOptimizer').value
    if (aux === undefined) {
      await alertHelper.alertWarning(`Error handleChange_Optimization`)
      return
    }
    setIdOptimizerValue(aux)
  }

  const handleChange_Metrics = async () => {
    let aux = document.getElementById('FormMetrics').value
    if (aux === undefined) {
      await alertHelper.alertWarning(`Error handleChange_Metrics`)
      return
    }
    setIdMetricsValue(aux)
  }

  const handleClick_LoadGeneratedModel = ({ model, idMODEL }) => {
    const newList = generatedModels.map((item) => {
      if (item.idMODEL === idMODEL) {
        return { ...item, isLoad: true }
      }
      return { ...item, isLoad: false };
    })
    setGeneratedModels(newList);
    setModel(model)
  }

  const handleClick_DownloadGeneratedModel = ({ model, idMODEL }) => {
    model.save('downloads://my-model-' + idMODEL)
  }

  const handleClick_DownloadModel = () => {
    Model.save('downloads://my-model')
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
  "missing_values"   : false,
  "missing_value_key": "?",
  "classes"          : [ "Clase 1", "Clase 2", "Clase 3", "Clase 4", "Clase n" ],
  "attributes"       : [
    { "name": "Atributo 1", "index_column": 0, "type": "number" },
    { "name": "Atributo 2", "index_column": 1, "type": "float"  },
    { "name": "Atributo 3", "index_column": 2, "type": "float"  },
    { 
      "name"        : "Atributo m", 
      "index_column": 3,
      "type"        : "select", 
      "options"     : [ 
        { "value": "option_1", "text": "Opción 1" }, 
        { "value": "option_2", "text": "Opción 2" } 
      ]
    }
  ],
  "data"             : [
    ["dato_entero_01", "dato_decimal_02", "dato_decimal_04", "option_1", "resultado_1"],
    ["dato_entero_11", "dato_decimal_12", "dato_decimal_14", "option_1", "resultado_2"],
    ["dato_entero_21", "dato_decimal_22", "dato_decimal_24", "option_1", "resultado_3"],
    ["dato_entero_31", "dato_decimal_32", "dato_decimal_34", "option_2", "resultado_4"],
    ["dato_entero_41", "dato_decimal_42", "dato_decimal_44", "option_2", "resultado_5"],
    ["dato_entero_51", "dato_decimal_52", "dato_decimal_54", "option_2", "resultado_6"]
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
        // TODO
        // COMPROBAR: ¿Es un json con el formato de la plantilla?
        setCustomDataSet_JSON(JSON.parse(e.target.result.toString()))
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
                  <Accordion.Header><h3>Manual del generador de modelos</h3></Accordion.Header>
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
                  <Accordion.Header><h3>Dataset: {dataSet === '0' ? "Subir datos" : LIST_MODEL_OPTIONS[0][dataSet]}</h3></Accordion.Header>
                  <Accordion.Body>
                    {{
                      '0': <>
                        <DragAndDrop name={"json"}
                                     accept={{ 'application/json': ['.json'] }}
                                     text={"Introduce el fichero de datos plantilla.json"}
                                     labelFiles={"Fichero:"}
                                     function_DropAccepted={handleChange_FileUpload}/>
                        <p className="text-muted">
                          Para carga tu propio conjunto de datos, usa está platilla.
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
                            {TYPE_ACTIVATION.map(({ key, label }, index) => {
                              return (<option key={index} value={key}>{label}</option>)
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
                                 defaultValue={idOptimizerValue}
                                 onChange={handleChange_Optimization}>
                      {TYPE_OPTIMIZER.map(({ key, label }, index) => {
                        return (<option key={index} value={key}>{label}</option>)
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
                                 defaultValue={idLossValue}
                                 onChange={handleChange_Loss}>
                      {TYPE_LOSSES.map(({ key, label }, index) => {
                        return (<option key={index} value={key}>{label}</option>)
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
                                 defaultValue={idMetricsValue}
                                 onChange={handleChange_Metrics}>
                      {TYPE_METRICS.map(({ key, label }, index) => {
                        return (<option key={index} value={key}>{label}</option>)
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
                    {(Model !== undefined) &&
                      <Button className={"ms-1"}
                              disabled={DisabledDownloadModel}
                              onClick={handleClick_DownloadModel}
                              size={"sm"}
                              variant="outline-primary">
                        Exportar modelo actual
                      </Button>
                    }
                  </div>
                </Card.Header>
                <Card.Body>
                  <table className={"table table-sm"}>
                    <thead>
                    <tr>
                      <th>ID</th>
                      <th>Cargar</th>
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
                      return (
                        <tr key={"model_list_row_" + index}>
                          <td>{value.idMODEL}</td>
                          <td>
                            <Button variant={value.isLoad ? 'outline-success' : "outline-info"}
                                    size={"sm"}
                                    disabled={value.isLoad}
                                    onClick={() => handleClick_LoadGeneratedModel(value)}>
                              {value.isLoad ? "Cargado" : "Cargar"}
                            </Button>
                          </td>
                          <td>{value.learningRate * 100}%</td>
                          <td>{value.numberOfEpoch}</td>
                          <td>{value.testSize * 100}%</td>
                          <td>
                            {value.layerList.map((value, index) => {
                              return (
                                <span key={index} style={{ fontFamily: "monospace" }}>
                                  <small>{value.units.toString().padStart(2, "0")} - {value.activation}</small><br/>
                                </span>
                              )
                            })}
                          </td>
                          <td>{value.idOptimizer}</td>
                          <td>{value.idLoss}</td>
                          <td>{value.idMetrics}</td>
                          <td>
                            <Button variant={"outline-primary"}
                                    size={"sm"}
                                    onClick={() => handleClick_DownloadGeneratedModel(value)}>
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
