import React, { useEffect, useState } from 'react'
import * as tf from '@tensorflow/tfjs'
import * as tfvis from '@tensorflow/tfjs-vis'
import ReactGA from "react-ga4";
import { Accordion, Button, Card, Col, Container, Form, Row, Table } from 'react-bootstrap'
import {
  getHTML_DATASET_DESCRIPTION, getNameDatasetByID_ClassicClassification,
  LIST_MODEL_OPTIONS,
  MODEL_CAR, MODEL_IRIS, MODEL_LYMPHOGRAPHY, MODEL_UPLOAD
} from "../../../DATA_MODEL";
import {
  createClassicClassificationCustomDataSet,
} from '../../../modelos/ArchitectureHelper'
import {
  TYPE_ACTIVATION,
  TYPE_OPTIMIZER,
  TYPE_LOSSES,
  TYPE_METRICS
} from "../../../modelos/ArchitectureTypesHelper";
import json_cars from "../../../constants/plantilla_car.json";
import json_iris from "../../../constants/plantilla_iris.json";
import json_lymphatcs from '../../../constants/plantilla_lymphatcs.json'
import * as alertHelper from '../../../utils/alertHelper'
import DragAndDrop from "../../../components/dragAndDrop/DragAndDrop";
import GraphicRed from '../../../utils/graphicRed/GraphicRed'
import DynamicFormDataset from "./DynamicFormDataset";
import N4LTablePagination from "../../../components/table/N4LTablePagination";
import './ClassicClassification.css'

import * as dfd from "danfojs"
import { transform_datasetJSON_To_DataFrame } from "../../../modelos/ClassificationHelper";
import { isProduction } from "../../../utils/utils";


const DEFAULT_LEARNING_RATE = 1
const DEFAULT_NUMBER_EPOCHS = 20
const DEFAULT_TEST_SIZE = 10
const DEFAULT_ID_OPTIMIZATION = 'adam'
const DEFAULT_ID_LOSS = 'categoricalCrossentropy'
const DEFAULT_ID_METRICS = 'accuracy'

const DEFAULT_START_LAYER_UNITS = 10
const DEFAULT_START_LAYER_ACTIVATION = 'sigmoid'
const DEFAULT_END_LAYER_UNITS = 3
const DEFAULT_END_LAYER_ACTIVATION = 'softmax'
const DEFAULT_LAYERS = [
  { units: DEFAULT_START_LAYER_UNITS, activation: DEFAULT_START_LAYER_ACTIVATION },
  { units: DEFAULT_END_LAYER_UNITS, activation: DEFAULT_END_LAYER_ACTIVATION }
]

export default function CustomDatasetTabularClassification(props) {
  const { dataset } = props

  const isDebug = process.env.REACT_APP_ENVIRONMENT !== "production"

  const [generatedModels, setGeneratedModels] = useState([])

  const [layers, setLayers] = useState(DEFAULT_LAYERS)
  const [learningRate, setLearningRate] = useState(DEFAULT_LEARNING_RATE)
  const [numberEpochs, setNumberEpochs] = useState(DEFAULT_NUMBER_EPOCHS)
  const [testSize, setTestSize] = useState(DEFAULT_TEST_SIZE)
  const [idOptimizer, setIdOptimizer] = useState(DEFAULT_ID_OPTIMIZATION) // OPTIMIZER_TYPE
  const [idLoss, setIdLoss] = useState(DEFAULT_ID_LOSS) // LOSS_TYPE
  const [idMetrics, setIdMetrics] = useState(DEFAULT_ID_METRICS) // METRICS_TYPE

  const [customDataSet_JSON, setCustomDataSet_JSON] = useState(null)
  const [Model, setModel] = useState(null)
  const [stringToPredict, setStringToPredict] = useState("")

  const [DataSetClasses, setDataSetClasses] = useState([])
  const [TargetSetClasses, setTargetSetClasses] = useState([])

  const [isTraining, setIsTraining] = useState(false)
  const [isDisabledDownloadModel, setIsDisabledDownloadModel] = useState(true)

  const debug = async (dataset_JSON) => {
    if (!dataset_JSON) {
      await alertHelper.alertError("Error, dataset no cargado", "Error")
      return
    }

    // console.log({ dataset_JSON })
    const df = transform_datasetJSON_To_DataFrame(dataset_JSON)
    df.plot("plot_div").table()
    // console.log({ df })

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
    const dataset_key = getNameDatasetByID_ClassicClassification(dataset)
    ReactGA.send({ hitType: "pageview", page: "/CustomDataSetClassicClassification/" + dataset_key, title: dataset_key });
    switch (dataset_key) {
      case MODEL_UPLOAD: {
        const uploadedArchitecture = localStorage.getItem('custom-architecture')
        if (uploadedArchitecture !== "{}") {
          if (!isProduction()) console.log(uploadedArchitecture)
          const uploadedJSON = JSON.parse(uploadedArchitecture)
          const auxLayer = uploadedJSON?.modelTopology?.config?.layers ?? []
          let _layerArray = []
          for (let i = 0; i < auxLayer.length; i++) {
            _layerArray.push({
              units     : auxLayer[i].config.units,
              activation: auxLayer[i].config.activation,
            })
          }
          setLayers(_layerArray)
        } else {
          setLayers(DEFAULT_LAYERS)
        }
        break
      }
      case MODEL_CAR.KEY: {
        setCustomDataSet_JSON(json_cars)
        setLayers([
          { units: 10, activation: 'sigmoid' },
          { units: 4, activation: 'softmax' },
        ])
        break
      }
      case MODEL_IRIS.KEY: {
        setCustomDataSet_JSON(json_iris)
        setLayers([
          { units: 10, activation: 'sigmoid' },
          { units: 3, activation: 'softmax' },
        ])
        break
      }
      case MODEL_LYMPHOGRAPHY.KEY: {
        setCustomDataSet_JSON(json_lymphatcs)
        setLayers([
          { units: 18, activation: 'sigmoid' },
          { units: 10, activation: 'relu' },
          { units: 4, activation: 'softmax' }
        ])
        break
      }
      default: {
        console.error("Error, opción no permitida")
      }
    }
    return () => {
      tfvis.visor().close()
    };
  }, [])

  const handleSubmit_Play = async (event) => {
    event.preventDefault()
    console.debug('ID Conjunto de datos: ', { dataset })
    if (customDataSet_JSON === null) {
      await alertHelper.alertError('Primero debes de cargar los datos')
      return
    }

    const last_layer_units = layers[layers.length - 1].units ?? 0
    const classes_length = customDataSet_JSON?.classes?.length ?? 0
    console.log({ last_layer_units, classes_length })

    if (last_layer_units !== classes_length) {
      await alertHelper.alertWarning(
        "Forma del tensor incorrecta",
        {
          html: `
La capa de salida tiene la forma (* ,${last_layer_units}).
<br> Debe tener la forma (*, ${classes_length})
`
        }
      )
      return
    }

    try {
      setIsTraining(true)
      let _learningRate = learningRate / 100
      let _numberOfEpoch = parseInt(numberEpochs)
      let _testSize = testSize / 100
      let _layerList = layers

      let _customDataset_JSON = customDataSet_JSON
      let _idOptimizer = idOptimizer
      let _idLoss = idLoss
      let _idMetrics = idMetrics

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
      setIsDisabledDownloadModel(false)
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
    if (getNameDatasetByID_ClassicClassification(dataset) === MODEL_UPLOAD) {
      if (customDataSet_JSON === null) {
        await alertHelper.alertError('Primero debes de cargar un dataset')
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
      switch (getNameDatasetByID_ClassicClassification(dataset)) {
        case MODEL_UPLOAD: {
          dataset_JSON = customDataSet_JSON
          break
        }
        case MODEL_CAR.KEY: {
          dataset_JSON = json_cars
          break
        }
        case MODEL_IRIS.KEY: {
          dataset_JSON = json_iris
          break
        }
        case MODEL_LYMPHOGRAPHY.KEY: {
          dataset_JSON = json_lymphatcs
          break
        }
        default: {
          console.error("Error, opción no permitida")
          return
        }
      }
      if (!isProduction()) console.debug("Dataset_JSON", { dataset_JSON })
      if (!isProduction()) console.debug("stringToPredict", { stringToPredict: stringToPredict.split(';') })

      let i = 0
      for (const element of stringToPredict.split(';')) {
        if (!isProduction()) console.debug("Attribute: ", dataset_JSON.attributes[i])
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
        if (!isProduction()) console.debug("By column:", name, { element: element, type: type }, [input_number, input_float, input_select], new_input)
        i++
      }

      if (input[0].some((tag) => tag === undefined)) {
        await alertHelper.alertInfo("Valor indefinido", "Error, input no válido")
        return;
      }

      const tensor = tf.tensor2d(input[0], input[1])
      const prediction = Model.predict(tensor)
      const predictionWithArgMax = prediction.argMax(-1).dataSync()

      const prediction_class_name = customDataSet_JSON.classes.find((item) => {
        if (isFinite(TargetSetClasses[predictionWithArgMax]))
          return parseInt(item.key) === TargetSetClasses[predictionWithArgMax]
        else
          return item.key === TargetSetClasses[predictionWithArgMax]
      })
      if (!isProduction()) console.info("DataSetClasses: ", { DataSetClasses }, ...input[0])
      if (!isProduction()) console.info('La solución es: ', { prediction, predictionWithArgMax, TargetSetClasses, prediction_class_name })
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
    if (layers === undefined) {
      await alertHelper.alertWarning("Error handlerClick_AddLayer_Start")
      return
    }
    if (layers.length < 10) {
      setLayers(oldLayers => [{
        units     : 10,
        activation: 'sigmoid'
      }, ...oldLayers])
    } else {
      await alertHelper.alertWarning("No se pueden añadir más capas")
    }
  }

  const handlerClick_AddLayer_End = async () => {
    if (layers === undefined) {
      await alertHelper.alertWarning("Error handlerClick_AddLayer_End")
      return
    }
    if (layers.length < 10) {
      setLayers(oldLayers => [...oldLayers, {
        units     : customDataSet_JSON?.classes?.length ?? 10,
        activation: 'softmax'
      }])
    } else {
      await alertHelper.alertWarning("No se pueden añadir más capas")
    }
  }

  const handlerClick_RemoveLayer = async (_idLayer) => {
    if (layers === undefined) {
      await alertHelper.alertWarning(`Error handlerRemoveLayer`)
      return
    }
    const newArray = layers.filter((item, index) => (index !== _idLayer))
    setLayers(newArray)
  }

  const handleChange_Layer = async (_idLayer, _updateLayer) => {
    if (layers === undefined) {
      await alertHelper.alertWarning(`Error handleChangeUnits`)
      return
    }
    const newLayers = layers.map((item, index) => {
      if (_idLayer === index) return { units: _updateLayer.units, activation: _updateLayer.activation }
      return { units: item.units, activation: item.activation }
    })
    setLayers(newLayers)
  }

  const handleChange_TestInput = async () => {
    let aux = document.getElementById(`formTestInput`).value
    if (aux === undefined) {
      await alertHelper.alertWarning(`Error handleChangeTestInput`)
      return
    }
    setStringToPredict(aux)
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
            onSubmit={handleSubmit_Play}>
        <Container className={"mb-3"}>
          <Row>
            <Col xl={12} className={"mt-3"}>
              <Accordion>
                <Accordion.Item key={"0"} eventKey={"description_architecture_editor"}>
                  <Accordion.Header><h3>Manual del generador de modelos</h3></Accordion.Header>
                  <Accordion.Body>

                    <details>
                      <summary style={{ fontSize: "1.5em" }}>Editor de las capas</summary>
                      <p>
                        Se pueden editar las capas de la red neuronal, puedes agregar tantas como desees pulsando el botón "Añadir capa" al inicio o al final.
                      </p>
                      <ul>
                        <li>
                          <b>Unidades de la capa</b>:<br/>
                          Cada unidad en una capa está conectada a todas las unidades de la capa anterior y de la capa siguiente. <br/>
                          Cada unidad en una capa tiene un conjunto de pesos asociados que determinan la fuerza y dirección de la señal que se transmite entre las unidades. <br/>
                          Podemos editar el número de entradas y salidas de la capa.
                        </li>
                        <li>
                          <b>Función de activación</b>:<br/>
                          La función de activación en una capa de una red neuronal se refiere a la función matemática que se aplica a la salida de cada unidad en la capa, antes de pasar la señal a la capa siguiente, podemos editar cada una
                          de las funciones de activación de todas las capas.
                        </li>
                      </ul>
                    </details>

                    <details>
                      <summary style={{ fontSize: "1.5em" }}>Editor de hiperparámetros</summary>
                      <p>
                        Se pueden editar los parámetros generales necesarios para la creación del modelo. <br/>
                        Estos parámetros son:
                      </p>
                      <ul>
                        <li>
                          <b>Tasa de aprendizaje</b>:<br/>
                          Valor entre 0 y 100 el cual indica a la red qué cantidad de datos debe usar para el
                          entrenamiento.
                        </li>
                        <li>
                          <b>Número de iteraciones</b>:<br/>
                          Cantidad de ciclos que va a realizar la red (a mayor número, más tiempo tarda en entrenar).
                        </li>
                        <li>
                          <b>Tamaño del banco de pruebas</b>:<br/>
                          Porcentaje del conjunto de datos que se va a usar para el entrenamiento y la evaluación.
                        </li>
                        <li>
                          <b>Optimizador</b>:<br/>
                          Es una función que como su propio nombre indica se usa para optimizar los modelos. <br/>
                          Esto es frecuentemente usado para evitar estancarse en un máximo local.
                        </li>
                        <li>
                          <b>Función de pérdida</b>:<br/>
                          Es un método para evaluar qué tan bien un algoritmo específico modela los datos otorgados.
                        </li>
                        <li>
                          <b>Función de métrica</b>:<br/>
                          Es la evaluación para valorar el rendimiento de un modelo de aprendizaje automático.
                        </li>
                      </ul>
                    </details>

                    <details>
                      <summary style={{ fontSize: "1.5em" }}>Información de hiperparámetros</summary>
                      <ul>
                        <li>
                          <b>Tasa de aprendizaje</b>:<br/>
                          La tasa de aprendizaje es un parámetro que determina cuánto se deben actualizar los pesos de la red neuronal en función del error calculado durante el entrenamiento.
                        </li>
                        <li>
                          <b>Número de iteraciones</b>:<br/>
                          El número de iteraciones se refiere al número de veces que se presentan los datos de entrenamiento a la red neuronal durante el proceso de entrenamiento. Cada iteración implica una actualización de los pesos de la
                          red en función del error calculado.
                        </li>
                        <li>
                          <b>Tamaño del banco de pruebas</b>:<br/>
                          El tamaño del banco de pruebas se refiere a la cantidad de datos utilizados para evaluar el rendimiento de la red neuronal después del entrenamiento. Este conjunto de datos no se utiliza en el entrenamiento de la
                          red neuronal y se utiliza para medir la capacidad de la red de generalizar a datos nuevos.
                        </li>
                        <li>
                          <b>Optimizador</b>:<br/>
                          El optimizador es un algoritmo utilizado para actualizar los pesos de la red neuronal en función del error calculado durante el entrenamiento. Algunos ejemplos de optimizadores son el Descenso del Gradiente
                          Estocástico (SGD), el Adam y el Adagrad.
                        </li>
                        <li>
                          <b>Función de pérdida</b>:<br/>
                          La función de pérdida es una medida del error entre las predicciones de la red neuronal y las salidas reales. Se utiliza para optimizar la red neuronal durante el entrenamiento y existen diferentes funciones de
                          pérdida, como la Entropía Cruzada y el Error Cuadrático Medio.
                        </li>
                      </ul>
                    </details>

                    <details>
                      <summary style={{ fontSize: "1.5em" }}>Crear y entrenar modelo</summary>
                      <p>
                        Una vez se han rellenado todos los campos anteriores podemos crear el modelo pulsando el botón "Crear y entrenar modelo".
                      </p>
                      <p>
                        Si hemos entrenado el modelo con la función de métrica <i>Accuracy</i> nos aparecerá dos graficas en el visor.
                        La más relevante para nosotros seá la de abajo, ya que en TensorFlow.js, <i>acc</i> y <i>val_acc</i> son métricas de evaluación comúnmente utilizadas en el entrenamiento de modelos de redes neuronales. <br/>
                        <i>acc</i> representa la precisión (accuracy) del modelo en el conjunto de datos de entrenamiento. La precisión se define como el número de predicciones correctas dividido por el número total de predicciones. <br/>
                        <i>val_acc</i> representa la precisión del modelo en el conjunto de datos de validación. La validación se utiliza para evaluar la capacidad del modelo para generalizar a nuevos datos que no han sido vistos durante el
                        entrenamiento. <br/>
                      </p>
                      <p>
                        La precisión de validación es importante para detectar el sobreajuste (<i>overfitting</i>) del modelo, que se produce cuando el modelo se ajusta demasiado a los datos de entrenamiento y no generaliza bien a nuevos
                        datos.
                      </p>
                      <p>
                        En resumen, <b>acc</b> se refiere a la precisión en el conjunto de datos de entrenamiento y <b>val_acc</b> se refiere a la precisión en el conjunto de datos de validación. Ambas métricas son importantes para evaluar
                        la capacidad del modelo para generalizar a nuevos datos.
                      </p>
                      <p>
                        Si todo ha sido correcto se añadirá una nueva entrada a la lista de modelos generados con el conjunto de datos seleccionado, se nos permitirá cargar en memoria modelos entrenados anteriormente.
                      </p>
                    </details>

                    <details>
                      <summary style={{ fontSize: "1.5em" }}>Exportar modelo</summary>
                      <p>
                        Si hemos creado el modelo correctamente se añadirá una entrada en la tabla de modelos generados, se nos permite exportar los modelos generados y guardarlos localmente.
                      </p>
                    </details>


                    <details>
                      <summary style={{ fontSize: "1.5em" }}>Predicción</summary>
                      <p>
                        El formulario final nos permite seleccionar las características principales que se usan para determinar la clase.
                      </p>
                      <p>
                        El valor de salida será un índice de la lista de clases, para realizar la predicción de la clase en función de las características debemos pulsar el botón "Ver resultado".
                      </p>
                    </details>

                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item key={"1"} eventKey={"description_dataset"}>
                  <Accordion.Header><h3>1. {dataset === '0' ? "Subir conjunto de datos" : LIST_MODEL_OPTIONS[0][dataset]}</h3></Accordion.Header>
                  <Accordion.Body>
                    {{
                      '0': <>
                        <DragAndDrop name={"json"}
                                     accept={{ 'application/json': ['.json'] }}
                                     text={"Introduce el fichero de datos plantilla.json"}
                                     labelFiles={"Fichero:"}
                                     function_DropAccepted={handleChange_FileUpload_TemplateDataset}/>
                      </>
                    }[dataset]}
                    {dataset !== '0' ? (
                      // DEFAULT
                      getHTML_DATASET_DESCRIPTION(0, dataset)
                    ) : ("")}
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Col>

            <Col xl={12} className={"mt-3"}>
              <Card>
                <Card.Header>
                  <h3 className={"d-flex align-items-baseline"}>
                    Conjunto de datos
                    {!customDataSet_JSON && <>
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
                <Card.Body className={"overflow-x-scroll"}>

                  {customDataSet_JSON &&
                    <>
                      <N4LTablePagination data_head={[...customDataSet_JSON.attributes.map((i) => i.name), "Resultados"]}
                                          data_body={customDataSet_JSON.data}/>

                      <hr/>

                      <details>
                        <summary style={{ fontSize: "1.5em" }}>Atributos</summary>
                        <main>
                          <Row>
                            {customDataSet_JSON.attributes.map((item, i1) => {
                              return <Col lg={2} md={2} sm={3} xs={3} key={i1}>
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
                        <summary style={{ fontSize: "1.5em" }}>Clases</summary>
                        <main>
                          <ol>{customDataSet_JSON.classes.map((item, index) => (<li key={"_" + index}>{item.name}</li>))}</ol>
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
              <Card>
                <Card.Header className={"d-flex align-items-center justify-content-between"}>
                  <h3>Editor de capas</h3>
                  <div className={"d-flex"}>
                    <Button onClick={handlerClick_AddLayer_Start}
                            size={"sm"}
                            variant="outline-primary">
                      Añadir capa al principio
                    </Button>
                    <Button onClick={handlerClick_AddLayer_End}
                            size={"sm"}
                            variant="outline-primary"
                            className={"ms-3"}>
                      Añadir capa al final
                    </Button>
                  </div>
                </Card.Header>
                <Card.Body>
                  <Accordion>
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
                                            value={item.units}
                                            onChange={(e) => handleChange_Layer(index, {
                                              units     : parseInt(e.target.value),
                                              activation: item.activation
                                            })}/>
                            </Form.Group>
                            {/* ACTIVATION FUNCTION */}
                            <Form.Group className="m3-3"
                                        controlId={'formActivationLayer' + index}>
                              <Form.Label>Selecciona la función de activación</Form.Label>
                              <Form.Select aria-label={"Default select example: " + item.activation}
                                           value={item.activation}
                                           onChange={(e) => handleChange_Layer(index, {
                                             units     : item.units,
                                             activation: e.target.value
                                           })}>
                                {TYPE_ACTIVATION.map(({ key, label }, index) => {
                                  return (<option key={index} value={key}>{label}</option>)
                                })}
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
                </Card.Body>
              </Card>
            </Col>

            {/* GENERAL PARAMETERS */}
            <Col className={"mt-3"} xl={6}>
              <Card className={"sticky-top"} style={{ zIndex: 10 }}>
                <Card.Header><h3>Editor de hiperparámetros</h3></Card.Header>
                <Card.Body>
                  {/* LEARNING RATE */}
                  <Form.Group className="mb-3" controlId="formTrainRate">
                    <Form.Label>Tasa de aprendizaje</Form.Label>
                    <Form.Control type="number"
                                  min={1}
                                  max={100}
                                  placeholder="Introduce la tasa de aprendizaje"
                                  defaultValue={DEFAULT_LEARNING_RATE}
                                  onChange={(e) => setLearningRate(parseInt(e.target.value))}/>
                    <Form.Text className="text-muted">
                      Recuerda que debe ser un valor entre 0 y 100 (es un porcentaje)
                    </Form.Text>
                  </Form.Group>

                  {/* Número OT ITERATIONS */}
                  <Form.Group className="mb-3" controlId="FormNumberOfEpochs">
                    <Form.Label>Número de iteraciones</Form.Label>
                    <Form.Control type="number"
                                  min={1}
                                  max={100}
                                  placeholder="Introduce el número de iteraciones"
                                  defaultValue={DEFAULT_NUMBER_EPOCHS}
                                  onChange={(e) => setNumberEpochs(parseInt(e.target.value))}/>
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
                                  defaultValue={DEFAULT_TEST_SIZE}
                                  onChange={(e) => setTestSize(parseInt(e.target.value))}/>
                    <Form.Text className="text-muted">
                      Recuerda que debe ser un valor entre 0 y 100 (es un porcentaje)
                    </Form.Text>
                  </Form.Group>

                  {/* OPTIMIZATION FUNCTION */}
                  <Form.Group className="mb-3" controlId="FormOptimizer">
                    <Form.Label>Selecciona el optimizador</Form.Label>
                    <Form.Select aria-label="Default select example"
                                 defaultValue={DEFAULT_ID_OPTIMIZATION}
                                 onChange={(e) => setIdOptimizer(e.target.value)}>
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
                                 defaultValue={DEFAULT_ID_LOSS}
                                 onChange={(e) => setIdLoss(e.target.value)}>
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
                                 defaultValue={DEFAULT_ID_METRICS}
                                 onChange={(e) => setIdMetrics(e.target.value)}>
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
                        disabled={isTraining || !customDataSet_JSON}
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
                <Card.Header className={"d-flex align-items-center"}>
                  <h3>Modelos</h3>
                  <div className={"d-flex"}>
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
                              disabled={isDisabledDownloadModel}
                              onClick={handleClick_DownloadModel}
                              size={"sm"}
                              variant="outline-primary">
                        Exportar modelo actual
                      </Button>
                    }
                  </div>
                </Card.Header>
                <Card.Body className={"overflow-x-scroll"}>
                  <Table size={"sm"}>
                    <thead>
                    <tr>
                      <th>ID</th>
                      <th>Cargar</th>
                      <th>Aprendizaje</th>
                      <th>Número de iteraciones</th>
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
                  </Table>

                  {isTraining ? <p className="placeholder-glow"><span className="placeholder col-12"></span></p> : <></>}

                  <div id="salida"></div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </Form>


      {/* BLOCK 2 */}
      {(customDataSet_JSON && Model) &&
        (<DynamicFormDataset dataset_JSON={customDataSet_JSON}
                             dataset={dataset}
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
                <Card.Header className={"d-flex align-items-center justify-content-between"}>
                  <h3>Debug</h3>
                  <div className="d-flex">
                    <Button onClick={() => debug(customDataSet_JSON)}
                            className={"ms-3"}
                            size={"sm"}
                            variant={"outline-primary"}>
                      Debug
                    </Button>
                  </div>
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
