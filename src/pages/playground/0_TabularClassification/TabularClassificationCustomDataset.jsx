import './TabularClassificationCustomDataset.css'
import React, { useEffect, useState } from 'react'
import * as tf from '@tensorflow/tfjs'
import * as tfvis from '@tensorflow/tfjs-vis'
import ReactGA from "react-ga4";
import { Accordion, Button, Card, Col, Container, Form, Row, Table } from 'react-bootstrap'
import {
  getKeyDatasetByID_TabularClassification,
  MODEL_CAR,
  MODEL_IRIS,
  MODEL_LYMPHOGRAPHY,
  MODEL_UPLOAD
} from "../../../DATA_MODEL";
import {
  createTabularClassificationCustomDataSet,
  createTabularClassificationCustomDataSet_upload,
} from '../../../core/nn-utils/ArchitectureHelper'
import {
  transform_datasetJSON_To_DataFrame
} from "../../../core/nn-utils/ClassificationHelper";
import {
  TYPE_ACTIVATION,
  TYPE_OPTIMIZER,
  TYPE_LOSSES,
  TYPE_METRICS
} from "../../../core/nn-utils/ArchitectureTypesHelper";
import json_cars from "../../../core/constants/template_car.json";
import json_iris from "../../../core/constants/template_iris.json";
import json_lymphatics from '../../../core/constants/template_lymphatcs.json'
import * as alertHelper from '../../../utils/alertHelper'
import DragAndDrop from "../../../components/dragAndDrop/DragAndDrop";
import GraphicRed from '../../../utils/graphicRed/GraphicRed'
import DynamicFormDataset from "./DynamicFormDataset";
import N4LTablePagination from "../../../components/table/N4LTablePagination";

import { isProduction } from "../../../utils/utils";
import TabularClassificationCustomDatasetManual from "./TabularClassificationCustomDatasetManual";
import { Trans, useTranslation } from "react-i18next";
import { MODEL_TABULAR_CLASSIFICATION } from "./models/_model";
import * as dfd from "danfojs"
import TabularClassificationCustomDatasetForm from "./TabularClassificationCustomDatasetForm";

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

export default function TabularClassificationCustomDataset(props) {
  const { dataset } = props
  const dataset_key = getKeyDatasetByID_TabularClassification(dataset)

  const { t } = useTranslation()
  const prefix = "pages.playground.0-tabular-classification.generator."

  const isDebug = process.env.REACT_APP_ENVIRONMENT !== "production"

  const [generatedModels, setGeneratedModels] = useState([])

  const [layers, setLayers] = useState(DEFAULT_LAYERS)
  const [learningRate, setLearningRate] = useState(DEFAULT_LEARNING_RATE)
  const [numberEpochs, setNumberEpochs] = useState(DEFAULT_NUMBER_EPOCHS)
  const [testSize, setTestSize] = useState(DEFAULT_TEST_SIZE)
  const [idOptimizer, setIdOptimizer] = useState(DEFAULT_ID_OPTIMIZATION) // OPTIMIZER_TYPE
  const [idLoss, setIdLoss] = useState(DEFAULT_ID_LOSS) // LOSS_TYPE
  const [idMetrics, setIdMetrics] = useState(DEFAULT_ID_METRICS) // METRICS_TYPE

  // dataframe original
  const [dataframeOriginal, setDataframeOriginal] = useState(null)
  // {dataframeProcessed, xTrain, yTrain}
  const [dataProcessed, setDataProcessed] = useState(null)

  const [customDataSet_JSON, setCustomDataSet_JSON] = useState(null)
  const [modelInfo, set_ModelInfo] = useState(new MODEL_TABULAR_CLASSIFICATION(t))
  const [Model, setModel] = useState(null)
  const [stringToPredict, setStringToPredict] = useState("")

  const [DataSetClasses, setDataSetClasses] = useState([])
  const [TargetSetClasses, setTargetSetClasses] = useState([])

  const [isTraining, setIsTraining] = useState(false)
  const [isDisabledDownloadModel, setIsDisabledDownloadModel] = useState(true)

  const debug = async (dataset_JSON) => {
    if (!dataset_JSON) {
      await alertHelper.alertError("Error, dataset no cargado", { title: "Error" })
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
      validationSplit: 0.2,
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
    ReactGA.send({ hitType: "pageview", page: "/TabularClassificationCustomDataset/" + dataset_key, title: dataset_key });

    switch (dataset_key) {
      case MODEL_UPLOAD: {
        // TODO
        // const uploadedArchitecture = localStorage.getItem('custom-architecture')
        // if (uploadedArchitecture !== "{}") {
        //   if (!isProduction()) console.log(uploadedArchitecture)
        //   const uploadedJSON = JSON.parse(uploadedArchitecture)
        //   const auxLayer = uploadedJSON?.modelTopology?.config?.layers ?? []
        //   let _layerArray = []
        //   for (let i = 0; i < auxLayer.length; i++) {
        //     _layerArray.push({
        //       units     : auxLayer[i].config.units,
        //       activation: auxLayer[i].config.activation,
        //     })
        //   }
        //   setLayers(_layerArray)
        // } else {
        setLayers(DEFAULT_LAYERS)
        // }
        break
      }
      case MODEL_CAR.KEY: {
        const _model = new MODEL_CAR(t)
        set_ModelInfo(_model)
        setCustomDataSet_JSON(json_cars)
        setLayers([
          { units: 10, activation: 'sigmoid' },
          { units: 4, activation: 'softmax' },
        ])
        break
      }
      case MODEL_IRIS.KEY: {
        const _model = new MODEL_IRIS(t)
        set_ModelInfo(_model)
        setCustomDataSet_JSON(json_iris)
        setLayers([
          { units: 10, activation: 'sigmoid' },
          { units: 3, activation: 'softmax' },
        ])
        break
      }
      case MODEL_LYMPHOGRAPHY.KEY: {
        const _model = new MODEL_LYMPHOGRAPHY(t)
        set_ModelInfo(_model)
        setCustomDataSet_JSON(json_lymphatics)
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
  }, [dataset, t])

  // region Dataset
  const handleChange_FileUpload_CSV = async (files, event) => {
    if (files.length !== 1) {
      console.error(t("error.load-json-csv"))
      return;
    }
    try {
      const file_csv = new File([files[0]], files[0].name, { type: files[0].type });
      dfd.readCSV(file_csv).then((_dataframe) => {
        console.log(_dataframe)
        setDataframeOriginal(_dataframe)
      })
      await alertHelper.alertSuccess(t("alert.file-upload-success"))
    } catch (error) {
      console.error(error)
    }
  }

  const handleChange_FileUpload_CSV_reject = async (files, event) => {
    await alertHelper.alertError(t("alert.file-upload-error-incorrect-format"))
  }
  // endregion

  // region Layers
  const handlerClick_AddLayer_Start = async () => {
    if (layers.length < 10) {
      setLayers(oldLayers => [{
        units     : 10,
        activation: 'sigmoid'
      }, ...oldLayers])
    } else {
      await alertHelper.alertWarning(t("alert.warning.not-more-layers"))
    }
  }

  const handlerClick_AddLayer_End = async () => {
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
    const newArray = layers.filter((item, index) => (index !== _idLayer))
    setLayers(newArray)
  }

  const handleChange_Layer = async (_idLayer, _updateLayer) => {
    const newLayers = layers.map((item, index) => {
      if (_idLayer === index) return { units: _updateLayer.units, activation: _updateLayer.activation }
      return { units: item.units, activation: item.activation }
    })
    setLayers(newLayers)
  }
  // endregion

  // region Parameters

  // endregion

  // region Model
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

  // TODO
  // Create model Upload
  const handleSubmit_CreateModel_upload = async (event) => {
    event.preventDefault()
    try {
      setIsTraining(true)

      console.log({ dataProcessed })
      const _xTrain_tensor = dataProcessed.xTrain.tensor
      const _yTrain_tensor = dataProcessed.yTrain.tensor

      let _learningRate = learningRate / 100
      let _testSize = testSize / 100
      let _numberOfEpoch = numberEpochs
      let _layerList = layers
      let _idOptimizer = idOptimizer
      let _idLoss = idLoss
      let _idMetrics = idMetrics
      const model = createTabularClassificationCustomDataSet_upload({
        learningRate : _learningRate,
        testSize     : _testSize,
        numberOfEpoch: _numberOfEpoch,
        layerList    : JSON.parse(JSON.stringify(_layerList)),
        idOptimizer  : _idOptimizer,
        idLoss       : _idLoss,
        idMetrics    : _idMetrics,
        xTrain       : _xTrain_tensor,
        yTrain       : _yTrain_tensor
      })


      setGeneratedModels(oldArray => [
        ...oldArray.map((oldModel) => {
          return { ...oldModel, isLoad: false }
        }), {
          idMODEL      : oldArray.length + 1,
          isLoad       : true,
          model        : model,
          learningRate : _learningRate,
          testSize     : _testSize,
          numberOfEpoch: _numberOfEpoch,
          layerList    : JSON.parse(JSON.stringify(_layerList)),
          idOptimizer  : _idOptimizer,
          idLoss       : _idLoss,
          idMetrics    : _idMetrics
        }]
      )

    } catch (error) {

      // console.error(error)
    } finally {
      setIsTraining(false)
    }
  }

  const handleSubmit_CreateModel = async (event) => {
    event.preventDefault()
    console.debug('ID Conjunto de datos: ', { dataset })
    if (customDataSet_JSON === null) {
      await alertHelper.alertError(t("error.need-dataset"))
      return
    }

    const last_layer_units = layers[layers.length - 1].units ?? 0
    const classes_length = customDataSet_JSON?.classes?.length ?? 0
    console.log({ last_layer_units, classes_length })

    if (last_layer_units !== classes_length) {
      await alertHelper.alertWarning(t("error.tensor-shape"),
        {
          footer: "",
          text  : "",
          html  : <Trans i18nKey={"error.tensor-shape-change"}
                         values={{
                           last_layer_units: last_layer_units,
                           classes_length  : classes_length
                         }} />
        }
      )
      return
    }

    try {
      setIsTraining(true)
      let _learningRate = learningRate / 100
      let _numberOfEpoch = numberEpochs
      let _testSize = testSize / 100
      let _layerList = layers

      let _customDataset_JSON = customDataSet_JSON
      let _idOptimizer = idOptimizer
      let _idLoss = idLoss
      let _idMetrics = idMetrics

      const [model, TARGET_SET_CLASSES, DATA_SET_CLASSES] = await createTabularClassificationCustomDataSet({
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
      await alertHelper.alertSuccess(t("alert.model-train-success"))
    } catch (error) {
      console.error(error)
    } finally {
      setIsTraining(false)
    }
  }
  // endregion

  // region Prediction
  // TODO Prediction Upload
  const handleClick_TestVector_upload = async () => {


  }

  const handleClick_TestInput = async () => {
    if (dataset_key === MODEL_UPLOAD) {
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
      switch (dataset_key) {
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
          dataset_JSON = json_lymphatics
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
          case "int32": {
            input_number = DataSetClasses[i].get(parseInt(element))
            break
          }
          case "float32": {
            input_float = parseFloat(element);//DataSetClasses[i].get(parseFloat(element))
            break
          }
          case "string": {
            input_select = DataSetClasses[i].get(element)
            input_select = input_select ?? DataSetClasses[i].get(parseInt(element))
            break
          }
          default: {
            console.warn("Tipo de dato desconocido")
            break
          }
        }
        // Bug: 0||undefined||undefined
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


  const handleChange_TestInput = async () => {
    let aux = document.getElementById(`formTestInput`).value
    if (aux === undefined) {
      await alertHelper.alertWarning(`Error handleChangeTestInput`)
      return
    }
    setStringToPredict(aux)
  }
  // endregion


  console.debug("render TabularClassificationCustomDataset")
  return (
    <>
      <Container className={"mb-3"}>
        <Row>
          <Col xl={12} className={"mt-3"}>
            <Accordion>
              <Accordion.Item key={"0"} eventKey={"description_architecture_editor"}>
                <Accordion.Header>
                  <h3><Trans i18nKey={prefix + "manual.title"} /></h3>
                </Accordion.Header>
                <Accordion.Body>
                  {/* TabularClassificationCustomDatasetManual */}
                  <TabularClassificationCustomDatasetManual />

                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item key={"1"} eventKey={"description_dataset"}>
                <Accordion.Header>
                  <h3>
                    <Trans i18nKey={dataset !== '0' ? modelInfo.TITLE : prefix + "dataset.upload-dataset"} />
                  </h3>
                </Accordion.Header>
                <Accordion.Body>
                  {{
                    '0': <>
                      <DragAndDrop name={"csv"}
                                   accept={{ 'text/csv': ['.csv'] }}
                                   text={t("drag-and-drop.csv")}
                                   labelFiles={t("drag-and-drop.label-files-one")}
                                   function_DropAccepted={handleChange_FileUpload_CSV}
                                   function_DropRejected={handleChange_FileUpload_CSV_reject} />

                      {dataframeOriginal && <>
                        <TabularClassificationCustomDatasetForm dataframeOriginal={dataframeOriginal}
                                                                dataProcessed={dataProcessed}
                                                                setDataProcessed={setDataProcessed}
                                                                setCustomDataSet_JSON={setCustomDataSet_JSON} />
                      </>}

                    </>
                  }[dataset]}
                  {dataset !== '0' ? (
                    modelInfo.DESCRIPTION()
                  ) : ("")}
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Col>

          <Col xl={12} className={"mt-3"}>
            <Card>
              <Card.Header>
                <h3 className={"d-flex align-items-baseline"}>
                  <Trans i18nKey={prefix + "dataset.title"} />
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
                    <N4LTablePagination data_head={[...customDataSet_JSON.attributes.map((i) => i.name)]}
                                        data_body={customDataSet_JSON.data} />

                    <hr />

                    <details>
                      <summary className={"n4l-summary"}><Trans i18nKey={prefix + "dataset.attributes.title"} /></summary>
                      <main>
                        <Row>
                          {customDataSet_JSON.attributes.map((item, i1) => {
                            return <Col lg={2} md={2} sm={3} xs={3} key={i1}>
                              <p><b>{item.name}</b></p>
                              {item.type === "int32" && <p><Trans i18nKey={prefix + "dataset.attributes.int32"} /></p>}
                              {item.type === "float32" && <p><Trans i18nKey={prefix + "dataset.attributes.float32"} /></p>}
                              {item.type === "string" && <ol start="0">{item.options.map((option, i2) => <li key={i1 + "_" + i2}>{option.text}</li>)}</ol>}
                            </Col>
                          })}
                        </Row>
                      </main>
                    </details>
                    <details>
                      <summary className={"n4l-summary"}><Trans i18nKey={prefix + "dataset.attributes.classes"} /></summary>
                      <main>
                        <ol start="0">{customDataSet_JSON.classes.map((item, index) => (<li key={"_" + index}>{item.name}</li>))}</ol>
                      </main>
                    </details>
                  </>
                }
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <Form id={"TabularClassificationCustomDataset"} onSubmit={dataset_key === MODEL_UPLOAD ? handleSubmit_CreateModel_upload : handleSubmit_CreateModel}>
        <Container>
          {/* BLOCK 1 */}
          <Row className={"mt-3"}>
            <Col xl={12}>
              <Card>
                <Card.Header>
                  <h3><Trans i18nKey={prefix + "layers.title"} /></h3>
                </Card.Header>
                <Card.Body>
                  <GraphicRed layer={layers}
                              tipo={0} />
                  <Card.Text className={"text-muted text-center"}>
                    <Trans i18nKey={prefix + "layers.page-info"}
                           components={{
                             link1: <a href="https://netron.app/">Text</a>
                           }} />
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

            {/* SPECIFIC PARAMETERS */}
            <Col className={"mt-3"} xl={6}>
              {/* ADD LAYER */}
              <Card>
                <Card.Header className={"d-flex align-items-center justify-content-between"}>
                  <h3><Trans i18nKey={prefix + "editor-layers.title"} /></h3>
                  <div className={"d-flex"}>
                    <Button onClick={handlerClick_AddLayer_Start}
                            size={"sm"}
                            variant="outline-primary">
                      <Trans i18nKey={prefix + "editor-layers.add-layer-start"} />
                    </Button>
                    <Button onClick={handlerClick_AddLayer_End}
                            size={"sm"}
                            variant="outline-primary"
                            className={"ms-3"}>
                      <Trans i18nKey={prefix + "editor-layers.add-layer-end"} />
                    </Button>
                  </div>
                </Card.Header>
                <Card.Body>
                  <Accordion>
                    {layers.map((item, index) => {
                      return (
                        <Accordion.Item key={index} eventKey={index.toString()}>
                          <Accordion.Header>
                            <Trans i18nKey={prefix + "editor-layers.layer-id"} values={{ value: index + 1 }} />
                          </Accordion.Header>

                          <Accordion.Body>
                            <div className="d-grid gap-2">
                              <Button onClick={() => handlerClick_RemoveLayer(index)}
                                      variant={"outline-danger"}>
                                <Trans i18nKey={prefix + "editor-layers.delete-layer"} values={{ value: index + 1 }} />
                              </Button>
                            </div>
                            {/* UNITS */}
                            <Form.Group className="mt-3"
                                        controlId={'formUnitsLayer' + index}>
                              <Form.Label>
                                <Trans i18nKey={prefix + "editor-layers.units"} />
                              </Form.Label>
                              <Form.Control type="number"
                                            min={1} max={100}
                                            placeholder={t(prefix + "editor-layers.units-placeholder")}
                                            value={item.units}
                                            onChange={(e) => handleChange_Layer(index, {
                                              units     : parseInt(e.target.value),
                                              activation: item.activation
                                            })} />
                            </Form.Group>
                            {/* ACTIVATION FUNCTION */}
                            <Form.Group className="m3-3"
                                        controlId={'formActivationLayer' + index}>
                              <Form.Label>
                                <Trans i18nKey={prefix + "editor-layers.activation-function-select"} />
                              </Form.Label>
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
                                <Trans i18nKey={prefix + "editor-layers.activation-function-info"} />
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
                <Card.Header><h3><Trans i18nKey={prefix + "general-parameters.title"} /></h3></Card.Header>
                <Card.Body>
                  {/* LEARNING RATE */}
                  <Form.Group className="mb-3" controlId="formTrainRate">
                    <Form.Label>
                      <Trans i18nKey={prefix + "general-parameters.learning-rate"} />
                    </Form.Label>
                    <Form.Control type="number"
                                  min={1}
                                  max={100}
                                  placeholder={t(prefix + "general-parameters.learning-rate-placeholder")}
                                  defaultValue={DEFAULT_LEARNING_RATE}
                                  onChange={(e) => setLearningRate(parseInt(e.target.value))} />
                    <Form.Text className="text-muted">
                      <Trans i18nKey={prefix + "general-parameters.learning-rate-info"} />
                    </Form.Text>
                  </Form.Group>

                  {/* Número OT ITERATIONS */}
                  <Form.Group className="mb-3" controlId="FormNumberOfEpochs">
                    <Form.Label>
                      <Trans i18nKey={prefix + "general-parameters.number-of-epochs"} />
                    </Form.Label>
                    <Form.Control type="number"
                                  min={1}
                                  max={100}
                                  placeholder={t(prefix + "general-parameters.number-of-epochs")}
                                  defaultValue={DEFAULT_NUMBER_EPOCHS}
                                  onChange={(e) => setNumberEpochs(parseInt(e.target.value))} />
                    <Form.Text className="text-muted">
                      <Trans i18nKey={prefix + "general-parameters.number-of-epochs-info"} />
                    </Form.Text>
                  </Form.Group>

                  {/* TEST SIZE */}
                  <Form.Group className="mb-3" controlId="formTrainRate">
                    <Form.Label>
                      <Trans i18nKey={prefix + "general-parameters.train-rate"} />
                    </Form.Label>
                    <Form.Control type="number"
                                  min={1}
                                  max={100}
                                  placeholder={t(prefix + "general-parameters.train-rate-placeholder")}
                                  defaultValue={DEFAULT_TEST_SIZE}
                                  onChange={(e) => setTestSize(parseInt(e.target.value))} />
                    <Form.Text className="text-muted">
                      <Trans i18nKey={prefix + "general-parameters.train-rate-info"} />
                    </Form.Text>
                  </Form.Group>

                  {/* OPTIMIZATION FUNCTION */}
                  <Form.Group className="mb-3" controlId="FormOptimizer">
                    <Form.Label>
                      <Trans i18nKey={prefix + "general-parameters.optimizer-id"} />
                    </Form.Label>
                    <Form.Select aria-label="Default select example"
                                 defaultValue={DEFAULT_ID_OPTIMIZATION}
                                 onChange={(e) => setIdOptimizer(e.target.value)}>
                      {TYPE_OPTIMIZER.map(({ key, label }, index) => {
                        return (<option key={index} value={key}>{label}</option>)
                      })}
                    </Form.Select>
                    <Form.Text className="text-muted">
                      <Trans i18nKey={prefix + "general-parameters.optimizer-id-info"} />
                    </Form.Text>
                  </Form.Group>

                  {/* LOSS FUNCTION */}
                  <Form.Group className="mb-3" controlId="FormLoss">
                    <Form.Label>
                      <Trans i18nKey={prefix + "general-parameters.loss-id"} />
                    </Form.Label>
                    <Form.Select aria-label="Selecciona la función de pérdida"
                                 defaultValue={DEFAULT_ID_LOSS}
                                 onChange={(e) => setIdLoss(e.target.value)}>
                      {TYPE_LOSSES.map(({ key, label }, index) => {
                        return (<option key={index} value={key}>{label}</option>)
                      })}
                    </Form.Select>
                    <Form.Text className="text-muted">
                      <Trans i18nKey={prefix + "general-parameters.loss-id-info"} />
                    </Form.Text>
                  </Form.Group>

                  {/* METRICS FUNCTION */}
                  <Form.Group className="mb-3" controlId="FormMetrics">
                    <Form.Label>
                      <Trans i18nKey={prefix + "general-parameters.metrics-id"} />
                    </Form.Label>
                    <Form.Select aria-label="Selecciona la métrica"
                                 defaultValue={DEFAULT_ID_METRICS}
                                 onChange={(e) => setIdMetrics(e.target.value)}>
                      {TYPE_METRICS.map(({ key, label }, index) => {
                        return (<option key={index} value={key}>{label}</option>)
                      })}
                    </Form.Select>
                    <Form.Text className="text-muted">
                      <Trans i18nKey={prefix + "general-parameters.metrics-id-info"} />
                    </Form.Text>
                  </Form.Group>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* BLOCK  BUTTON SUBMIT */}
          <Row className={"mt-3"}>
            <Col xl={12}>
              <div className="d-grid gap-2">
                <Button type="submit"
                        disabled={isTraining}
                        size={"lg"}
                        variant="primary">
                  <Trans i18nKey={prefix + "models.button-submit"} />
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </Form>

      {/* SALIDA */}
      <Container>
        <Row className={"mt-3"}>
          <Col xl={12}>
            <Card>
              <Card.Header className={"d-flex align-items-center"}>
                <h3><Trans i18nKey={prefix + "models.title"} /></h3>
                <div className={"d-flex"}>
                  <Button variant={"outline-primary"}
                          className={"ms-3"}
                          size={"sm"}
                          onClick={() => {
                            tfvis.visor().open()
                          }}>
                    <Trans i18nKey={prefix + "models.open-visor"} />
                  </Button>
                  <Button variant={"outline-primary"}
                          className={"ms-1"}
                          size={"sm"}
                          onClick={() => {
                            tfvis.visor().close()
                          }}>
                    <Trans i18nKey={prefix + "models.close-visor"} />
                  </Button>
                  {(Model !== undefined) &&
                    <Button className={"ms-1"}
                            disabled={isDisabledDownloadModel}
                            onClick={handleClick_DownloadModel}
                            size={"sm"}
                            variant="outline-primary">
                      <Trans i18nKey={prefix + "models.export-current-model"} />
                    </Button>
                  }
                </div>
              </Card.Header>
              <Card.Body className={"overflow-x-scroll"}>
                <Table size={"sm"}>
                  <thead>
                  <tr>
                    <th><Trans i18nKey={prefix + "table.id"} /></th>
                    <th><Trans i18nKey={prefix + "table.load"} /></th>
                    <th><Trans i18nKey={prefix + "table.learning-rate"} /></th>
                    <th><Trans i18nKey={prefix + "table.number-of-epochs"} /></th>
                    <th><Trans i18nKey={prefix + "table.train-rate"} /></th>
                    <th><Trans i18nKey={prefix + "table.layers"} /></th>
                    <th><Trans i18nKey={prefix + "table.optimizer-id"} /></th>
                    <th><Trans i18nKey={prefix + "table.loss-id"} /></th>
                    <th><Trans i18nKey={prefix + "table.metric-id"} /></th>
                    <th><Trans i18nKey={prefix + "table.download"} /></th>
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
                                  <small>{value.units.toString().padStart(2, "0")} - {value.activation}</small><br />
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
                            <Trans i18nKey={prefix + "table.download"} />
                          </Button>
                        </td>
                      </tr>
                    )
                  })}
                  </tbody>
                </Table>

                {isTraining ?
                  <p className="placeholder-glow">
                    <span className="placeholder col-12"></span>
                  </p>
                  :
                  <></>
                }

                <div id="salida"></div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Prediction */}
      {/* UPLOAD */}
      {(dataset_key === MODEL_UPLOAD && (customDataSet_JSON || dataProcessed) && Model) &&
        (<DynamicFormDataset dataset_JSON={customDataSet_JSON}
                             dataset={dataset}
                             stringToPredict={stringToPredict}
                             setStringToPredict={setStringToPredict}
                             handleChange_TestInput={handleChange_TestInput}
                             handleClick_TestVector={handleClick_TestVector_upload} />)
      }
      {/* OTHERS */}
      {(dataset_key !== MODEL_UPLOAD && (customDataSet_JSON) && Model) &&
        (<DynamicFormDataset dataset_JSON={customDataSet_JSON}
                             dataset={dataset}
                             stringToPredict={stringToPredict}
                             setStringToPredict={setStringToPredict}
                             handleChange_TestInput={handleChange_TestInput}
                             handleClick_TestVector={handleClick_TestInput} />)
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
