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
import cars_json from "../../../constants/plantilla_car.json";
import iris_json from "../../../constants/plantilla_iris.json";
import hepatitis_c_json from '../../../constants/plantilla_hepatitisC.json'
import * as alertHelper from '../../../utils/alertHelper'
import DragAndDrop from "../../../components/dragAndDrop/DragAndDrop";
import GraphicRed from '../../../utils/graphicRed/GraphicRed'
import DynamicFormDataset from "./DynamicFormDataset";
import N4LTablePagination from "../../../components/table/N4LTablePagination";
import './ClassicClassification.css'

import * as dfd from "danfojs"
import { transform_datasetJSON_To_DataFrame } from "../../../modelos/ClassificationHelper";
import {
  FILE_TEMPLATE,
  FILE_TEMPLATE_IRIS,
  FILE_TEMPLATE_LYMPHATCS,

  FILE_TOPOLOGY,
} from "../../../constants/files_examples";
import { isNumber } from "chart.js/helpers";


const LearningRate_default = 1
const NumberEpochs_default = 20
const TestSize_default = 10
const DEFAULT_LAYERS = [{ units: 10, activation: 'sigmoid' }]

export default function CustomDataSetClassicClassification(props) {
  const { dataSet } = props

  const isDebug = process.env.REACT_APP_ENVIRONMENT !== "production"

  const [generatedModels, setGeneratedModels] = useState([])

  const [layers, setLayers] = useState(DEFAULT_LAYERS)

  // OPTIMIZER
  const [idOptimizerValue, setIdOptimizerValue] = useState('adam')
  // LOSS_TYPE
  const [idLossValue, setIdLossValue] = useState('categoricalCrossentropy')
  // METRICS_TYPE
  const [idMetricsValue, setIdMetricsValue] = useState('accuracy')

  const [Model, setModel] = useState(null)
  const [stringToPredict, setStringToPredict] = useState("")

  const [LearningRate, setLearningRate] = useState(LearningRate_default)
  const [NumberEpochs, setNumberEpochs] = useState(NumberEpochs_default)
  const [TestSize, setTestSize] = useState(TestSize_default)

  const [CustomDataSet_JSON, setCustomDataSet_JSON] = useState(null)
  const [DataSetClasses, setDataSetClasses] = useState([])

  const [TargetSetClasses, setTargetSetClasses] = useState([])

  const [isTraining, setIsTraining] = useState(false)
  const [DisabledDownloadModel, setDisabledDownloadModel] = useState(true)

  const debug = async (dataset_JSON) => {
    if (!dataset_JSON) {
      await alertHelper.alertError("Error, dataset no cargado", "Error")
      return
    }

    console.log({ dataset_JSON })
    const df = transform_datasetJSON_To_DataFrame(dataset_JSON)
    df.plot("plot_div").table()
    console.log({ df })

    let xTrain, yTrain;
    xTrain = df.iloc({ columns: [`1:`] }) // Data
    yTrain = df['4']                                    // Target

    let scaler = new dfd.MinMaxScaler()
    scaler.fit(xTrain)
    xTrain = scaler.transform(xTrain) // Entrenamos con esto

    console.log("Escalado", { xTrain })
    console.log("Data", { x: xTrain, y: yTrain })

    const new_tf = dfd.tensorflow
    const model = new_tf.sequential()
    model.add(new_tf.layers.dense({ inputShape: [xTrain.shape[1]], units: 10, activation: 'sigmoid' }));
    model.add(new_tf.layers.dense({ units: 3, activation: "softmax" }))
    model.compile({
      optimizer: 'adam',
      loss     : 'categoricalCrossentropy',
      metrics  : ['accuracy']
    })

    const fit_callbacks_metrics_labels = ['loss', 'val_loss', 'acc', 'val_acc']
    const fit_callbacks_container = {
      name  : 'Historial del entrenamiento',
      tab   : 'Entrenamiento',
      styles: {
        height: '1000px'
      }
    }
    const fitCallbacks = tfvis.show.fitCallbacks(fit_callbacks_container, fit_callbacks_metrics_labels, {
      callbacks: ['onEpochEnd'],
    })
    await model.fit(xTrain.tensor, yTrain.tensor, {
      verbose        : 1,
      epochs         : 50,
      validationSplit: 0.9,
      shuffle        : true,

      callbacks: fitCallbacks
    })

    let input = [[], [1, xTrain.shape[1]]]


    // Predecimos con esto
    input[0] = scaler.transform([7.7, 3.0, 6.1, 2.3])
    console.log({ input })
    const tensor = tf.tensor2d(input[0], input[1])

    const predictionWithArgMax = model.predict(tensor).argMax(-1).dataSync()
    console.log("Predicción", { predictionWithArgMax })

  }

  useEffect(() => {
    switch (getNameDatasetByID_ClassicClassification(dataSet)) {
      case MODEL_UPLOAD: {
        setLayers(DEFAULT_LAYERS)
        // setStringToPredict("")
        break
      }
      case MODEL_CAR.KEY: {
        setCustomDataSet_JSON(cars_json)
        setLayers([
          { units: 10, activation: 'sigmoid' },
          { units: 4, activation: 'softmax' },
        ])
        // setStringToPredict('med;med;2;4;big;high')
        break
      }
      case MODEL_IRIS.KEY: {
        setCustomDataSet_JSON(iris_json)
        setLayers([
          { units: 10, activation: 'sigmoid' },
          { units: 3, activation: 'softmax' },
        ])
        // setStringToPredict("5.9;3;5.1;1.8 ")
        break
      }
      case MODEL_HEPATITIS_C.KEY: {
        setCustomDataSet_JSON(hepatitis_c_json)
        setLayers([
          { units: 12, activation: 'sigmoid' },
          { units: 10, activation: 'relu' },
          { units: 10, activation: 'relu' },
          { units: 10, activation: 'relu' },
          { units: 5, activation: 'softmax' }
        ])
        // setStringToPredict('32;m;38.5;52.5;18;24.7;3.9;11.17;4.8;74;15.6;76.5')
        break
      }
      default: {
        console.error("Error, opción no permitida")
      }
    }
  }, [dataSet])

  const handleClickPlay = async (event) => {
    event.preventDefault()
    console.debug('ID Conjunto de datos: ', { dataSet })
    if (CustomDataSet_JSON === null) {
      await alertHelper.alertError('Primero debes de cargar los datos')
      return
    }

    if (dataSet === '0') {
      const last_layer_units = layers[layers.length - 1].units ?? 0
      const classes_length = CustomDataSet_JSON?.classes?.length ?? 0
      if (last_layer_units !== classes_length) {
        await alertHelper.alertWarning(
          "Forma del tensor incorrecta",
          { html: `La capa de salida tiene la forma (* ,${last_layer_units}).<br> Debe tener la siguiente forma (*, ${classes_length})` }
        )
        return
      }
    }

    try {
      setIsTraining(true)
      let _learningRate = LearningRate / 100
      let _numberOfEpoch = parseInt(NumberEpochs)
      let _testSize = TestSize / 100
      let _layerList = layers

      let _customDataset_JSON = CustomDataSet_JSON
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
      if (CustomDataSet_JSON === null) {
        await alertHelper.alertError('Primero debes de cargar un dataSet')
        return
      }
    }
    if (Model === undefined) {
      await alertHelper.alertError('Primero debes de entrenar el modelo')
      return
    }
    let dataset_JSON = null
    let input = [[], [1, stringToPredict.split(';').length]]
    try {
      switch (getNameDatasetByID_ClassicClassification(dataSet)) {
        case MODEL_UPLOAD: {
          dataset_JSON = CustomDataSet_JSON
          break
        }
        case MODEL_CAR.KEY: {
          dataset_JSON = cars_json
          break
        }
        case MODEL_IRIS.KEY: {
          dataset_JSON = iris_json
          break
        }
        case MODEL_HEPATITIS_C.KEY: {
          dataset_JSON = hepatitis_c_json
          break
        }
        default: {
          console.error("Error, opción no permitida")
          return
        }
      }
      console.debug("Dataset_JSON", { dataset_JSON })
      console.debug("stringToPredict", { stringToPredict: stringToPredict.split(';') })

      let i = 0
      for (const element of stringToPredict.split(';')) {
        console.debug("Attribute: ", dataset_JSON.attributes[i])
        let name = dataset_JSON?.attributes[i].name
        let type = dataset_JSON?.attributes[i].type

        let input_number = undefined
        let input_float = undefined
        let input_select = undefined
        switch (type) {
          case "number": {
            input_number = DataSetClasses[i].get(parseInt(element))
            break
          }
          case "float": {
            input_float = DataSetClasses[i].get(parseFloat(element))
            break
          }
          case "select": {
            input_select = DataSetClasses[i].get(element)
            input_select = input_select ?? DataSetClasses[i].get(parseInt(element))
            break
          }
          default: {
            console.warn("Tipo de dato desconocido")
            break
          }
        }
        // Esto por si ocurre el bug de 0||undefined||undefined
        let new_input = (input_number || input_float || input_select) ?? 0
        input[0].push(new_input)
        console.debug("By column:", name, { element: element, type: type },
          [input_number, input_float, input_select], new_input
        )
        i++
      }

      if (input[0].some((tag) => tag === undefined)) {
        await alertHelper.alertInfo("Valor indefinido", "Error, input no válido")
        return;
      }

      const tensor = tf.tensor2d(input[0], input[1])
      const predictionWithArgMax = Model.predict(tensor).argMax(-1).dataSync()

      const prediction_class_name = CustomDataSet_JSON.classes.find((item) => {
        if (isNumber(TargetSetClasses[predictionWithArgMax]))
          return parseInt(item.key) === TargetSetClasses[predictionWithArgMax]
        else
          return item.key === TargetSetClasses[predictionWithArgMax]
      })
      console.info("DataSetClasses: ", { DataSetClasses }, ...input[0])
      console.info('La solución es: ', { predictionWithArgMax, TargetSetClasses, prediction_class_name })
      if (prediction_class_name !== undefined) {
        await alertHelper.alertInfo(
          'Tipo: ' + prediction_class_name.key,
          `` + prediction_class_name.name
        )
      } else {
        await alertHelper.alertInfo(
          'Tipo: ' + TargetSetClasses[predictionWithArgMax],
          `` + TargetSetClasses[predictionWithArgMax]
        )
      }

    } catch (error) {
      console.error(error)
    }
  }

  const handlerClick_AddLayer_Start = async () => {
    let aux_layers = layers
    if (aux_layers === undefined) {
      await alertHelper.alertWarning("Error handlerAddLayer")
      return
    }
    if (aux_layers.length < 10) {
      setLayers(oldLayers => [{
        units     : 10,
        activation: 'sigmoid'
      }, ...oldLayers])
    } else {
      await alertHelper.alertWarning("No se pueden añadir más capas")
    }
  }

  const handlerClick_AddLayer_End = async () => {
    let aux_layers = layers
    if (aux_layers === undefined) {
      await alertHelper.alertWarning("Error handlerAddLayer")
      return
    }
    if (aux_layers.length < 10) {
      setLayers(oldLayers => [...oldLayers, {
        units     : CustomDataSet_JSON?.classes?.length ?? 10,
        activation: 'softmax'
      }])
    } else {
      await alertHelper.alertWarning("No se pueden añadir más capas")
    }
  }

  const handlerClick_RemoveLayer = async (idLayer) => {
    let aux = layers
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
    setLayers(new_layer)
  }

  const handleChange_Units = async (index) => {
    let aux_layer = layers
    if (aux_layer === undefined) {
      await alertHelper.alertWarning(`Error handleChangeUnits`)
      return
    }
    aux_layer[index].units = parseInt(document.getElementById(`formUnitsLayer${index}`).value)
    setLayers(aux_layer)
  }

  const handleChange_TestInput = async () => {
    let aux = document.getElementById(`formTestInput`).value
    if (aux === undefined) {
      await alertHelper.alertWarning(`Error handleChangeTestInput`)
      return
    }
    setStringToPredict(aux)
  }

  const handleChange_Activation = async (index) => {
    let aux_layer = layers
    if (aux_layer === undefined) {
      await alertHelper.alertWarning(`Error handleChangeActivation`)
      return
    }
    aux_layer[index].activation = document.getElementById(`formActivationLayer${index}`).value
    setLayers(aux_layer)
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

  const _download = (filename, textInput) => {
    const link = document.createElement('a')
    link.setAttribute('href', 'data:text/plain;charset=utf-8, ' + encodeURIComponent(textInput))
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    link.parentNode.removeChild(link);
  }

  const handleClick_DownloadFile_TemplateDataset = (FILE) => {
    _download(FILE.title, FILE.content)
  }

  const handleClick_DownloadFile_CustomTopology = () => {
    _download(FILE_TOPOLOGY.title, FILE_TOPOLOGY.content)
  }

  const handleChange_FileUploadCustomTopology = (files) => {
    if (files.length !== 1) {
      console.error("Error, no se ha podido cargar el fichero")
      return;
    }
    try {
      const file_json = new File([files[0]], files[0].name, { type: files[0].type });
      let reader = new FileReader()
      reader.readAsText(file_json)
      reader.onload = (e) => {
        // TODO
        // COMPROBAR: ¿Es un json con el formato de la topología?
        const uploadedJSON = JSON.parse(e.target.result.toString())
        const auxLayers = uploadedJSON?.modelTopology?.config?.layers ?? []
        const _layerArray = auxLayers.map((layer) => ({
          units     : layer.config.units,
          activation: layer.config.activation,
        }))
        setLayers(_layerArray)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleChange_FileUpload_TemplateDataset = (files) => {
    if (files.length !== 1) {
      console.error("Error, no se ha podido cargar el fichero")
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

  console.debug("render CustomDataSetClassicClassification")
  return (
    <>
      <Form id={"CustomDataSetClassicClassification"}
            onSubmit={handleClickPlay}>
        <Container className={"mb-3"}>
          <Row>

            <Col xl={12} className={"mt-3"}>
              <Card className={"border-info"}>
                <Card.Body>
                  <h4>Pasos para el entrenamiento</h4>
                  <ol>
                    <li>Subimos el conjunto de datos que queremos analizar. (<code onClick={() => handleClick_DownloadFile_TemplateDataset(FILE_TEMPLATE)}>dataset.json</code>)</li>
                    <li>Subimos una topología ya definida o la creamos nosotros. (<code onClick={handleClick_DownloadFile_CustomTopology}>my-model.json</code>)</li>
                    <li>Definimos los hiperparámetros de la red neuronal.</li>
                    <li>Entrenamos la red neuronal.</li>
                    <li>Predecir en función de los tipos de datos seleccionados (categóricos, reales, numéricos, etc...).</li>
                  </ol>

                  <Card.Text>Debes tener en cuenta la forma de los datos, puedes jugar con las capas de la red y descubrir diferentes comportamientos de la red.</Card.Text>
                  <Card.Text>Se recomienda para tareas de clasificación usar en las capas iniciales funciones de activación sigmoid, y en las capas finales funciones de activación softmax.</Card.Text>
                  <Card.Text>Debes tener el número de unidades de la última capa que coincida con el número de categorías que tu red puede predecir.</Card.Text>

                  <p className="text-muted">
                    Descarga ficheros con conjuntos de datos preparados:

                    <Button variant={"outline-info"}
                            size={"sm"}
                            onClick={() => handleClick_DownloadFile_TemplateDataset(FILE_TEMPLATE)}>Descargar plantilla</Button>
                    <Button variant={"outline-info ms-3"}
                            size={"sm"}
                            onClick={() => handleClick_DownloadFile_TemplateDataset(FILE_TEMPLATE_IRIS)}>Descargar conjunto de datos | iris</Button>
                    <Button variant={"outline-info ms-3"}
                            size={"sm"}
                            onClick={() => handleClick_DownloadFile_TemplateDataset(FILE_TEMPLATE_LYMPHATCS)}>Descargar conjunto de datos | lymphatcs</Button>

                  </p>

                  <p className="text-muted">
                    Descarga ficheros con arquitecturas de modelos preparados:
                    <Button variant={"outline-info"}
                            size={"sm"}
                            onClick={handleClick_DownloadFile_CustomTopology}>Descargar plantilla topología</Button>
                  </p>

                </Card.Body>
              </Card>
            </Col>

            <Col xl={12} className={"mt-3"}>
              <Accordion defaultActiveKey={"description_architecture_editor"}>
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
                          <b>Tasa de aprendizaje:</b><br/>
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
                  <Accordion.Header><h3>1. {dataSet === '0' ? "Subir conjunto de datos" : LIST_MODEL_OPTIONS[0][dataSet]}</h3></Accordion.Header>
                  <Accordion.Body>
                    {{
                      '0': <>
                        <DragAndDrop name={"json"}
                                     accept={{ 'application/json': ['.json'] }}
                                     text={"Introduce el fichero de datos plantilla.json"}
                                     labelFiles={"Fichero:"}
                                     function_DropAccepted={handleChange_FileUpload_TemplateDataset}/>
                      </>
                    }[dataSet]}
                    {dataSet !== '0' ? (
                      // DEFAULT
                      getHTML_DATASET_DESCRIPTION(0, dataSet)
                    ) : ("")}
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item key={"2"} eventKey={"description_topology"}>
                  <Accordion.Header><h3>2. Subir arquitectura de la red</h3></Accordion.Header>
                  <Accordion.Body>
                    <DragAndDrop name={"json"}
                                 accept={{ 'application/json': ['.json'] }}
                                 text={"Introduce la arquitectura modelo.json"}
                                 labelFiles={"Fichero:"}
                                 function_DropAccepted={handleChange_FileUploadCustomTopology}/>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Col>

            <Col xl={12} className={"mt-3"}>
              <Card>
                <Card.Header>
                  <h3 className={"d-flex align-items-baseline"}>
                    Conjunto de datos
                    {!CustomDataSet_JSON && <>
                      <div className="ms-4 spinner-border"
                           role="status"
                           style={{
                             fontSize                      : "0.5em",
                             height                        : "1rem",
                             width                         : "1rem",
                             "--bs-spinner-animation-speed": "1.5s"
                           }}>
                        <span className="sr-only"></span>
                      </div>
                    </>}
                  </h3>
                </Card.Header>
                <Card.Body>

                  {CustomDataSet_JSON &&
                    <>
                      <N4LTablePagination data_head={[...CustomDataSet_JSON.attributes.map((i) => i.name), "Resultados"]}
                                          data_body={CustomDataSet_JSON.data}/>

                      <hr/>

                      <details>
                        <summary>Atributos</summary>
                        <main>
                          <Row>
                            {CustomDataSet_JSON.attributes.map((item, i1) => {
                              return <Col lg={2} key={i1}>
                                <p><b>{item.name}</b></p>
                                {item.type === "number" && <p>Numérico</p>}
                                {item.type === "float" && <p>Real</p>}
                                {item.type === "select" && <ol>{item.options.map((option, i2) => <li key={i1 + "_" + i2}>{option.text}</li>)}</ol>}
                              </Col>
                            })}
                          </Row>
                        </main>
                      </details>
                      <details>
                        <summary>Clases</summary>
                        <main>
                          <ol>{CustomDataSet_JSON.classes.map((item, index) => (<li key={"_" + index}>{item.name}</li>))}</ol>
                        </main>
                      </details>
                    </>
                  }
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
                  <GraphicRed layer={layers}
                              tipo={0}/>
                  <Card.Text className={"text-muted text-center"}>Puedes visitar la web <a href="https://netron.app/">netron.app</a> para visualizar la topología al completo</Card.Text>
                </Card.Body>
              </Card>
            </Col>

            {/* SPECIFIC PARAMETERS */}
            <Col className={"mt-3"} xl={6}>
              {/* ADD LAYER */}
              <div className="d-grid gap-2">
                <Button onClick={handlerClick_AddLayer_Start}
                        size={"lg"}
                        variant="primary">
                  Añadir capa al principio
                </Button>
                <Button onClick={handlerClick_AddLayer_End}
                        size={"lg"}
                        variant="primary">
                  Añadir capa al final
                </Button>
              </div>

              <Accordion className={"mt-3"}
                         defaultActiveKey={["0"]}
                         alwaysOpen>
                {layers.map((item, index) => {
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
                                        min={0} max={100}
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
                    <Form.Label>Tasa de aprendizaje</Form.Label>
                    <Form.Control type="number"
                                  min={1}
                                  max={100}
                                  placeholder="Introduce la tasa de aprendizaje"
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
                        disabled={isTraining || !CustomDataSet_JSON}
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
                            className={"ms-3"}
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
                      <th>Aprendizaje</th>
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


      {/* BLOCK 2 */}
      {(CustomDataSet_JSON && Model) &&
        (<DynamicFormDataset dataset_JSON={CustomDataSet_JSON}
                             dataSet={dataSet}
                             stringToPredict={stringToPredict}
                             setStringToPredict={setStringToPredict}
                             handleChange_TestInput={handleChange_TestInput}
                             handleClick_TestVector={handleClick_TestVector}/>)
      }

      {isDebug &&
        <Container>
          <Row>
            <Col>
              <Card className={"mt-3"}>
                <Card.Header className={"d-flex align-items-center"}>
                  <h3>Debug</h3>
                  <Button onClick={() => debug(CustomDataSet_JSON)}
                          className={"ms-3"}
                          size={"sm"}
                          variant={"outline-primary"}>
                    Debug
                  </Button>
                </Card.Header>
                <Card.Body>
                  <div id="plot_div"></div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      }
    </>
  )
}
