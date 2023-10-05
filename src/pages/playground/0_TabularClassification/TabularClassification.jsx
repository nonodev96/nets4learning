import './TabularClassification.css'
import React, { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Trans, useTranslation } from 'react-i18next'
import { Accordion, Button, Card, Col, Container, Form, Row } from 'react-bootstrap'
import ReactGA from 'react-ga4'
import * as dfd from 'danfojs'
import * as tf from '@tensorflow/tfjs'
import * as tfvis from '@tensorflow/tfjs-vis'

import { UPLOAD, MODEL_CAR, MODEL_IRIS, MODEL_LYMPHOGRAPHY, } from '@/DATA_MODEL'
import { createTabularClassificationCustomDataSet, createTabularClassificationCustomDataSet_upload, } from '@core/nn-utils/ArchitectureHelper'
import { TYPE_ACTIVATION, TYPE_LOSSES, TYPE_METRICS, TYPE_OPTIMIZER, } from '@core/nn-utils/ArchitectureTypesHelper'

import json_cars from '@core/constants/template_car.json'
import json_iris from '@core/constants/template_iris.json'
import json_lymphatics from '@core/constants/template_lymphatics.json'
import alertHelper from '@utils/alertHelper'

import TabularClassificationForm from '@pages/playground/0_TabularClassification/TabularClassificationForm'
import TabularClassificationManual from '@pages/playground/0_TabularClassification/TabularClassificationManual'
import TabularClassificationPrediction from '@pages/playground/0_TabularClassification/TabularClassificationPrediction'
import TabularClassificationTableModels from '@pages/playground/0_TabularClassification/TabularClassificationTableModels'

import { isProduction } from '@utils/utils'
import { I_MODEL_TABULAR_CLASSIFICATION } from './models/_model'
import * as errorUtils from '@core/error-utils'
import DragAndDrop from '@components/dragAndDrop/DragAndDrop'
import N4LLayerDesign from '@components/neural-network/N4LLayerDesign'
import N4LTablePagination from '@components/table/N4LTablePagination'
import N4LJoyride from '@components/joyride/N4LJoyride'
import { VERBOSE } from '@/CONSTANTS'

const DEFAULT_LEARNING_RATE = 1
const DEFAULT_NUMBER_EPOCHS = 20
const DEFAULT_TEST_SIZE = 10
const DEFAULT_ID_OPTIMIZATION = 'adam'
const DEFAULT_ID_LOSS = 'metrics-categoricalCrossentropy'
const DEFAULT_ID_METRICS = 'accuracy'

const DEFAULT_START_LAYER_UNITS = 10
const DEFAULT_START_LAYER_ACTIVATION = 'sigmoid'
const DEFAULT_END_LAYER_UNITS = 3
const DEFAULT_END_LAYER_ACTIVATION = 'softmax'
const DEFAULT_LAYERS = [
  { units: DEFAULT_START_LAYER_UNITS, activation: DEFAULT_START_LAYER_ACTIVATION },
  { units: DEFAULT_END_LAYER_UNITS, activation: DEFAULT_END_LAYER_ACTIVATION },
]
// Por defecto dejamos la configuración óptima para el modelo del titanic
const DEFAULT_LAYERS_UPLOAD = [
  { units: 124, activation: 'relu' },
  { units: 64, activation: 'relu' },
  { units: 32, activation: 'relu' },
  { units: 2, activation: 'softmax' },
]

/**
 * Se ha dividido en modelos entrenados y modelos creados,
 * Las siguientes funciones corresponder a subir un modelo, pre procesar los datos, entrenar y predecir
 *
 *                                                            Upload
 * 1. Subir conjunto de datos:                                |
 * handleChange_FileUpload_CSV()                <-------------|
 * handleChange_FileUpload_CSV_reject()         <-------------|
 * $ <TabularClassificationCustomDatasetForm />               |
 *                                                            |
 * > handleChange_cType()                       <-------------|
 *                                                            |
 * -- Pre procesamiento                                       |
 * > handleSubmit_ProcessDataFrame()            <-------------|
 * > > Parser.transform()                       <-------------|
 *                                                            |
 * 2. Entrenar modelo:                                        |
 * handleSubmit_CreateModel_upload()            <-------------|
 *                                                            |
 * 3. Predecir con el modelo:                                 |
 * $ <TabularClassificationDynamicFormPrediction />           |
 *                                                            |
 * Case 1. -- Cambiar datos de todas las columnas             |
 * > handleChange_ROW()                                       |
 * Case 2. -- Cambiar dato de una columna                     |
 * > handleChange_Float()                                     |
 * > handleChange_Number()                                    |
 * > handleChange_Select()                                    |
 *                                                            |
 * -- Predecir                                                |
 * > handleClick_TestVector_upload()            <-------------|
 *
 */
export default function TabularClassification (props) {
  const { dataset } = props

  const { t } = useTranslation()
  const prefix = 'pages.playground.generator.'
  const prefixManual = 'pages.playground.0-tabular-classification.generator.'

  const isDebug = process.env.REACT_APP_ENVIRONMENT !== 'production'

  // Steps:
  //
  // Upload dataset
  // Select transformations from the xTrain and yTrain set.
  // 1.X. Preprocessing
  //
  // Definition of the model architecture
  // 2.1. Selecting the layers of the architecture
  // 2.2. Selecting the hyperparameters
  // 2.X. Training the model
  //
  // Selecting the trained model
  //
  // Predictions
  // 4.1. Selecting the data to be predicted
  // 4.X. Prediction

  // Dataset
  // dataframe original
  const [dataframeOriginal, setDataframeOriginal] = useState(null)
  /**
   * @typedef {Object | null} DataProcessedState_t
   * @property {dfd.DataFrame} dataframeProcessed
   * @property {string} column_name_target
   * @property {dfd.DataFrame} X
   * @property {dfd.DataFrame} y
   * @property {dfd.MinMaxScaler|dfd.StandardScaler} scaler
   * @property {Object.<string, dfd.LabelEncoder>} obj_encoder
   * @property {Array<TYPE_ATTRIBUTES_OPTIONS|TYPE_ATTRIBUTES_NUMBER>} attributes
   * @property {Array<TYPE_CLASSES>} classes
   */
  const [dataProcessed, setDataProcessed] = useState(/** @type DataProcessedState_t*/null)
  const [isDatasetProcessed, setIsDatasetProcessed] = useState(false)

  // Layers
  const [layers, setLayers] = useState(dataset === UPLOAD ? DEFAULT_LAYERS_UPLOAD : DEFAULT_LAYERS)

  // Params
  const [learningRate, setLearningRate] = useState(DEFAULT_LEARNING_RATE)
  const [numberEpochs, setNumberEpochs] = useState(DEFAULT_NUMBER_EPOCHS)
  const [testSize, setTestSize] = useState(DEFAULT_TEST_SIZE)
  const [idOptimizer, setIdOptimizer] = useState(DEFAULT_ID_OPTIMIZATION) // OPTIMIZER_TYPE
  const [idLoss, setIdLoss] = useState(DEFAULT_ID_LOSS) // LOSS_TYPE
  const [idMetrics, setIdMetrics] = useState(DEFAULT_ID_METRICS) // METRICS_TYPE

  // Models upload && review
  const [isTraining, setIsTraining] = useState(false)
  /**
   * @typedef {Object} GeneratedModel_t
   * @property {number} idMODEL
   * @property {any} model
   * @property {any} TARGET_SET_CLASSES
   * @property {any} DATA_SET_CLASSES
   * @property {number} learningRate
   * @property {number} testSize
   * @property {number} numberOfEpoch
   * @property {Array<{units: number, activation: string}>} layerList
   * @property {string} idOptimizer
   * @property {string} idLoss
   * @property {string} idMetrics
   */
  const [generatedModels, setGeneratedModels] = useState(/** @type Array<GeneratedModel_t> */[])
  const [generatedModelsIndex, setGeneratedModelsIndex] = useState(-1)
  const [isDisabledDownloadModel, setIsDisabledDownloadModel] = useState(true)
  // Model review
  const [Model, setModel] = useState(null)
  const [DataSetClasses, setDataSetClasses] = useState([])
  const [TargetSetClasses, setTargetSetClasses] = useState([])
  // Utils

  /**
   * @typedef {Object | null} CustomDataset_t
   * @property {boolean} missing_values
   * @property {string} missing_value_key
   * @property {Array<any>} attributes
   * @property {Array<any>} classes
   * @property {Array<Array<any>>} data
   */
  const [customDataSet_JSON, setCustomDataSet_JSON] = useState(/** @type CustomDataset_t */   null)

  // Class && Controllers
  const [iModelInfo, set_IModelInfo] = useState(new I_MODEL_TABULAR_CLASSIFICATION(t))

  // Prediction
  const [predictionBar, setPredictionBar] = useState({
    list_encoded_classes: [],
    labels              : [],
    data                : [],
  })
  const [objectToPredict, setObjectToPredict] = useState({})
  const [stringToPredict, setStringToPredict] = useState('')

  const refJoyrideButton = useRef({})

  const debug = async () => {
    console.log({ customDataSet_JSON, stringToPredict })
  }

  useEffect(() => {
    ReactGA.send({ hitType: 'pageview', page: '/TabularClassificationCustomDataset/' + dataset, title: dataset })

    switch (dataset) {
      case UPLOAD: {
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
        // }
        setLayers(DEFAULT_LAYERS_UPLOAD)
        setIsDatasetProcessed(false)
        break
      }
      case MODEL_CAR.KEY: {
        const _model = new MODEL_CAR(t)
        set_IModelInfo(_model)
        console.log('json_cars', { json_cars })
        setCustomDataSet_JSON(json_cars)
        setIsDatasetProcessed(true)
        setLayers([
          { units: 10, activation: 'sigmoid' },
          { units: 4, activation: 'softmax' },
        ])
        break
      }
      case MODEL_IRIS.KEY: {
        const _model = new MODEL_IRIS(t)
        set_IModelInfo(_model)
        setCustomDataSet_JSON(json_iris)
        setIsDatasetProcessed(true)
        setLayers([
          { units: 10, activation: 'sigmoid' },
          { units: 3, activation: 'softmax' },
        ])
        break
      }
      case MODEL_LYMPHOGRAPHY.KEY: {
        const _model = new MODEL_LYMPHOGRAPHY(t)
        set_IModelInfo(_model)
        setCustomDataSet_JSON(json_lymphatics)
        setIsDatasetProcessed(true)
        setLayers([
          { units: 18, activation: 'sigmoid' },
          { units: 10, activation: 'relu' },
          { units: 4, activation: 'softmax' },
        ])
        break
      }
      default: {
        console.error('Error, opción not valid')
      }
    }
    return () => {
      tfvis.visor().close()
    }
  }, [dataset, t])

  // region Dataset
  const handleChange_FileUpload_CSV = async (files, _event) => {
    if (files.length !== 1) {
      console.error(t('error.load-json-csv'))
      return
    }
    try {
      const file_csv = new File([files[0]], files[0].name, { type: files[0].type })
      dfd.readCSV(file_csv).then((_dataframe) => {
        setDataframeOriginal(_dataframe)
        setObjectToPredict({})
      })
      await alertHelper.alertSuccess(t('success.file-upload'))
    } catch (error) {
      console.error(error)
    }
  }

  const handleChange_FileUpload_CSV_reject = async (_files, _event) => {
    await alertHelper.alertError(t('error.file-not-valid'))
  }
  // endregion

  // region Layers
  const handlerClick_AddLayer_Start = async () => {
    if (layers.length < 10) {
      setLayers(oldLayers => [{
        units     : 10,
        activation: 'sigmoid',
      }, ...oldLayers])
    } else {
      await alertHelper.alertWarning(t('warning.not-more-layers'))
    }
  }

  const handlerClick_AddLayer_End = async () => {
    if (layers.length < 10) {
      let units = customDataSet_JSON?.classes?.length ?? 10
      if (units === 0) units = 1
      setLayers(oldLayers => [...oldLayers, {
        units     : units,
        activation: 'softmax',
      }])
    } else {
      await alertHelper.alertWarning(t('warning.not-more-layers'))
    }
  }

  const handlerClick_RemoveLayer = async (_idLayer) => {
    if (layers.length === 1) {
      await alertHelper.alertWarning(t('warning.error-layers'))
      return
    }
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
  const handleSubmit_CreateModel = async (event) => {
    event.preventDefault()
    console.debug('ID Conjunto de datos: ', { dataset })
    if (customDataSet_JSON === null) {
      await alertHelper.alertError(t('error.need-dataset'))
      return
    }

    const last_layer_units = layers[layers.length - 1].units ?? 0
    const classes_length = customDataSet_JSON?.classes?.length ?? 0

    if (last_layer_units !== classes_length) {
      await alertHelper.alertWarning(t('error.tensor-shape'),
        {
          footer: '',
          text  : '',
          html  : <Trans i18nKey={'error.tensor-shape-change'}
                         values={{
                           last_layer_units: last_layer_units,
                           classes_length  : classes_length,
                         }} />,
        },
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
        idMetrics    : _idMetrics,
      }, t)
      setGeneratedModels(oldArray => [
        ...oldArray.map((oldModel) => {
          return { ...oldModel, isLoad: false }
        }), {
          idMODEL           : oldArray.length,
          model             : model,
          TARGET_SET_CLASSES: TARGET_SET_CLASSES,
          DATA_SET_CLASSES  : DATA_SET_CLASSES,
          learningRate      : _learningRate,
          testSize          : _testSize,
          numberOfEpoch     : _numberOfEpoch,
          layerList         : JSON.parse(JSON.stringify(_layerList)),
          idOptimizer       : _idOptimizer,
          idLoss            : _idLoss,
          idMetrics         : _idMetrics,
        }],
      )
      setIsTraining(false)
      setIsDisabledDownloadModel(false)
      setDataSetClasses(DATA_SET_CLASSES)
      setTargetSetClasses(TARGET_SET_CLASSES)

      setModel(model)
      await alertHelper.alertSuccess(t('alert.model-train-success'))
    } catch (error) {
      console.error(error)
    } finally {
      setIsTraining(false)
    }
  }

  // TODO
  // Create model Upload
  const handleSubmit_CreateModel_upload = async (event) => {
    event.preventDefault()
    try {
      setIsTraining(true)

      let _learningRate = learningRate / 100
      let _testSize = testSize / 100
      let _numberOfEpoch = numberEpochs
      let _layers = layers
      let _idOptimizer = idOptimizer
      let _idLoss = idLoss
      let _idMetrics = idMetrics
      const model = await createTabularClassificationCustomDataSet_upload({
        learningRate : _learningRate,
        testSize     : _testSize,
        numberOfEpoch: _numberOfEpoch,
        layerList    : JSON.parse(JSON.stringify(_layers)),
        idOptimizer  : _idOptimizer,
        idLoss       : _idLoss,
        idMetrics    : _idMetrics,
        dataProcessed: dataProcessed,
      }, t)

      setModel(model)
      setGeneratedModels(oldArray => {
          return [
            // Old elements
            ...oldArray.map((oldModel) => {
              return { ...oldModel, isLoad: false }
            }),
            // New element
            {
              idMODEL      : generatedModels.length,
              model        : model,
              learningRate : _learningRate,
              testSize     : _testSize,
              numberOfEpoch: _numberOfEpoch,
              layerList    : JSON.parse(JSON.stringify(_layers)),
              idOptimizer  : _idOptimizer,
              idLoss       : _idLoss,
              idMetrics    : _idMetrics,
              dataProcessed: dataProcessed,
            },
          ]
        },
      )
      setGeneratedModelsIndex(generatedModels.length)

    } catch (error) {
      console.error(error)
      if (errorUtils.isErrorTargetExpected(error.message)) {
        const match = errorUtils.matchErrorTargetExpected(error.message)
        const error_params = {
          tensor_shape_0       : match.tensor_shape_0,
          tensor_shape_1       : match.tensor_shape_1,
          target_tensor_shape_0: match.target_tensor_shape_0,
          target_tensor_shape_1: match.target_tensor_shape_1,
        }
        const error_message = t('error.tensor-shape-description', error_params)
        await alertHelper.alertError(error_message, { title: 'Error' })
      } else {
        await alertHelper.alertError(error.message, { title: 'Error' })
      }
    } finally {
      setIsTraining(false)
    }
  }

  const handleClick_DownloadGeneratedModel = ({ model, idMODEL }) => {
    model.save('downloads://my-model-' + idMODEL)
  }
  // endregion

  // region Prediction
  // TODO Prediction Upload
  const handleSubmit_PredictVector_upload = async (e) => {
    e.preventDefault()
    const currentDataProcessed = generatedModels[generatedModelsIndex].dataProcessed
    const currentObjEncoder = currentDataProcessed.obj_encoder
    const columnNameTarget = currentDataProcessed.column_name_target
    // Seleccionamos el escalador MinMaxScaler o StandardScaler
    const currentScaler = currentDataProcessed.scaler
    // Seleccionamos el modelo cargado
    const currentModel = generatedModels[generatedModelsIndex].model

    const objectToPredict_dataframe_format = {}
    for (const [name, value] of Object.entries(objectToPredict)) {
      objectToPredict_dataframe_format[name] = [value]
    }
    const tempDataFrame = new dfd.DataFrame(objectToPredict_dataframe_format)

    // Escalamos los datos a predecir en función del escalador del preprocesamiento
    const scaledData = currentScaler.transform(tempDataFrame.values[0])
    // Realizamos la predicción
    const tensor_input = tf.tensor2d([scaledData])
    const prediction = currentModel.predict(tensor_input)
    // const predictionWithArgMax = prediction.argMax(-1).dataSync();
    const predictionArraySync = prediction.arraySync()[0]
    const labels = currentDataProcessed.classes.map(({ name }) => {
      return name
    })
    const list_encoded_classes = currentDataProcessed.classes.map(({ name }, index) => {
      const class_target_id = currentObjEncoder[columnNameTarget].$labels[name].toString()
      return <Trans key={index}
                    i18nKey="pages.playground.generator.prediction.class_id_name"
                    values={{ name, class_target_id }} />
    })

    setPredictionBar((_prevState) => {
      return {
        list_encoded_classes: [...list_encoded_classes],
        labels              : [...labels],
        data                : [...predictionArraySync],
      }
    })

    if (!isProduction()) console.debug('Predicción', { prediction, predictionArraySync, wtf: prediction.arraySync() })
    const text = predictionArraySync.map(item => {
      const float = parseFloat(item * 100)
      return float.toFixed(2)
    }).join(', ')
    await alertHelper.alertSuccess(t('prediction'), { text })
  }

  const handleSubmit_PredictVector = async (e) => {
    e.preventDefault()
    if (dataset === UPLOAD) {
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
      switch (dataset) {
        case UPLOAD: {
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
          console.error('Error, opción no permitida')
          return
        }
      }
      if (!isProduction()) console.debug('Dataset_JSON', { dataset_JSON })
      if (!isProduction()) console.debug('stringToPredict', { stringToPredict: stringToPredict.split(';') })

      let i = 0
      for (const element of stringToPredict.split(';')) {
        if (!isProduction()) console.debug('Attribute: ', dataset_JSON.attributes[i])
        let name = dataset_JSON?.attributes[i].name
        let type = dataset_JSON?.attributes[i].type

        let input_number = undefined
        let input_float = undefined
        let input_select = undefined
        switch (type) {
          case 'int32': {
            input_number = DataSetClasses[i].get(parseInt(element))
            break
          }
          case 'float32': {
            input_float = parseFloat(element)
            //DataSetClasses[i].get(parseFloat(element))
            break
          }
          case 'string':
          case 'label-encoder': {
            input_select = DataSetClasses[i].get(element)
            input_select = input_select ?? DataSetClasses[i].get(parseInt(element))
            break
          }
          default: {
            console.warn('Tipo de dato desconocido')
            break
          }
        }
        // Bug: 0||undefined||undefined
        let new_input = (input_number || input_float || input_select) ?? 0
        input[0].push(new_input)
        if (!isProduction()) console.debug('By column:', name, { element: element, type: type }, [input_number, input_float, input_select], new_input)
        i++
      }

      if (input[0].some((tag) => tag === undefined)) {
        await alertHelper.alertInfo('Valor indefinido', { text: 'Error, input no válido' })
        return
      }

      const tensor = tf.tensor2d(input[0], input[1])
      const prediction = Model.predict(tensor)
      const predictionDataSync = prediction.dataSync()
      const predictionWithArgMax = prediction.argMax(-1).dataSync()
      console.log('predictionWithArgMax', { predictionWithArgMax, predictionDataSync })

      const prediction_class_name = customDataSet_JSON.classes.find((item) => {
        if (isFinite(TargetSetClasses[predictionWithArgMax]))
          return parseInt(item.key) === TargetSetClasses[predictionWithArgMax]
        else
          return item.key === TargetSetClasses[predictionWithArgMax]
      })
      const list_encoded_classes = customDataSet_JSON.classes.map(({ name }) => name)
      if (!isProduction()) console.info('DataSetClasses: ', { DataSetClasses }, ...input[0])
      if (!isProduction()) console.info('La solución es: ', { prediction, predictionWithArgMax, TargetSetClasses, prediction_class_name })
      if (prediction_class_name !== undefined) {
        await alertHelper.alertInfo(
          '' + prediction_class_name.key,
          '' + prediction_class_name.name,
        )
        setPredictionBar({
          list_encoded_classes: list_encoded_classes,
          labels              : list_encoded_classes,
          data                : Array.from(predictionDataSync)
        })
      } else {
        await alertHelper.alertInfo(
          'Tipo: ' + TargetSetClasses[predictionWithArgMax],
          `` + TargetSetClasses[predictionWithArgMax],
        )
      }

    } catch (error) {
      console.error(error)
    }
  }
  // endregion

  // Comprueba si se han ejecutado los pasos previos

  if (VERBOSE) console.debug('render TabularClassificationCustomDataset')
  return (
    <>
      <N4LJoyride refJoyrideButton={refJoyrideButton}
                  JOYRIDE_state={iModelInfo.JOYRIDE()}
                  KEY={'tabular'} />

      <Container className={'mb-3'}>
        <Row className={'mt-3 mb-3'}>
          <Col xl={12}>
            <div className="d-flex justify-content-between">
              <h1><Trans i18nKey={'modality.0'} /></h1>
              <Button size={'sm'}
                      variant={'outline-primary'}
                      onClick={refJoyrideButton.current.handleClick_StartJoyride}>
                <Trans i18nKey={'datasets-models.0-tabular-classification.joyride.title'} />
              </Button>
            </div>
          </Col>
        </Row>

        {/* INFORMACIÓN */}
        <div className={`mt-3 mb-4 n4l-hr-row`}>
          <span className={'n4l-hr-title'}>
            <Trans i18nKey={'hr.information'} />
          </span>
        </div>
        <Row className={'mt-3'}>
          <Col xl={12}>
            <Accordion defaultActiveKey={dataset === UPLOAD ? 'description_dataset' : ''}>
              <Accordion.Item className={'joyride-step-manual'} key={UPLOAD} eventKey={'description_architecture_editor'}>
                <Accordion.Header>
                  <h3><Trans i18nKey={prefixManual + 'manual.title'} /></h3>
                </Accordion.Header>
                <Accordion.Body><TabularClassificationManual /></Accordion.Body>
              </Accordion.Item>
              <Accordion.Item className={'joyride-step-dataset-info'} key={'1'} eventKey={'description_dataset'}>
                <Accordion.Header>
                  <h3>
                    <Trans i18nKey={dataset !== UPLOAD ? iModelInfo.TITLE : prefix + 'dataset.upload-dataset'} />
                  </h3>
                </Accordion.Header>
                <Accordion.Body>
                  {{
                    [UPLOAD]: <>
                      <DragAndDrop name={'csv'}
                                   accept={{ 'text/csv': ['.csv'] }}
                                   text={t('drag-and-drop.csv')}
                                   labelFiles={t('drag-and-drop.label-files-one')}
                                   function_DropAccepted={handleChange_FileUpload_CSV}
                                   function_DropRejected={handleChange_FileUpload_CSV_reject} />

                      {dataframeOriginal && <>
                        <TabularClassificationForm dataframeOriginal={dataframeOriginal}
                                                   dataProcessed={dataProcessed}
                                                   setDataProcessed={setDataProcessed}
                                                   setIsDatasetProcessed={setIsDatasetProcessed}
                                                   setCustomDataSet_JSON={setCustomDataSet_JSON}
                                                   setLayers={setLayers} />
                      </>}
                      {!dataframeOriginal && <>
                        <p className="placeholder-glow">
                          <small className={'text-muted'}>{t('pages.playground.generator.waiting-for-file')}</small>
                          <span className="placeholder col-12"></span>
                        </p>
                      </>}
                    </>,
                  }[dataset]}
                  {dataset !== UPLOAD ? (
                    iModelInfo.DESCRIPTION()
                  ) : ('')}
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Col>
        </Row>

        {/* CONJUNTO DE DATOS */}
        <div className={`mt-3 mb-4 n4l-hr-row`}>
            <span className={'n4l-hr-title'}>
              <Trans i18nKey={'hr.dataset'} />
            </span>
        </div>
        <Row className={'mt-3 joyride-step-dataset'}>
          <Col xl={12}>
            <Card>
              <Card.Header>
                <h3 className={'d-flex align-items-baseline'}>
                  <Trans i18nKey={prefix + 'dataset.title'} />
                  {!customDataSet_JSON && <>
                    <div className="ms-4 spinner-border"
                         role="status"
                         style={{
                           fontSize                      : '0.5em',
                           height                        : '1rem',
                           width                         : '1rem',
                           '--bs-spinner-animation-speed': '1.5s',
                         }}>
                      <span className="sr-only"></span>
                    </div>
                  </>}
                </h3>
              </Card.Header>
              <Card.Body className={'overflow-x-scroll'}>

                {customDataSet_JSON &&
                  <>
                    <N4LTablePagination data_head={[...customDataSet_JSON.attributes.map((i) => i.name), 'Target']}
                                        data_body={customDataSet_JSON.data} />

                    <hr />

                    <details>
                      <summary className={'n4l-summary'}><Trans i18nKey={prefix + 'dataset.attributes.title'} /></summary>
                      <main>
                        <Row>
                          {customDataSet_JSON.attributes.map((item, i1) => {
                            return <Col lg={2} md={2} sm={3} xs={3} key={i1}>
                              <p><b>{item.name}</b></p>
                              {item.type === 'int32' && <p><Trans i18nKey={prefix + 'dataset.attributes.int32'} /></p>}
                              {item.type === 'float32' && <p><Trans i18nKey={prefix + 'dataset.attributes.float32'} /></p>}
                              {item.type === 'label-encoder' && <ol start="0">{item.options.map((option, i2) => <li key={i1 + '_' + i2}>{option.text}</li>)}</ol>}
                            </Col>
                          })}
                        </Row>
                      </main>
                    </details>
                    <details>
                      <summary className={'n4l-summary'}><Trans i18nKey={prefix + 'dataset.attributes.classes'} /></summary>
                      <main>
                        <div className={'n4l-list'}>
                          <ol start="0">{customDataSet_JSON.classes.map((item, index) => (<li key={'_' + index}>{item.name}</li>))}</ol>
                        </div>
                      </main>
                    </details>
                  </>
                }
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <div className={`mt-3 mb-4 n4l-hr-row`}>
            <span className={'n4l-hr-title'}>
              <Trans i18nKey={'hr.model'} />
            </span>
        </div>
        <Form id={'TabularClassificationCustomDataset'} onSubmit={dataset === UPLOAD ? handleSubmit_CreateModel_upload : handleSubmit_CreateModel}>
          {/* BLOCK 1 */}
          <Row className={'mt-3'}>
            <Col xl={12} className={'joyride-step-layer'}>
              <N4LLayerDesign layers={layers} />
            </Col>

            {/* LAYER EDITOR */}
            <Col className={'mt-3 joyride-step-editor-layers'} xl={6}>
              <Card>
                <Card.Header className={'d-flex align-items-center justify-content-between'}>
                  <h3><Trans i18nKey={prefix + 'editor-layers.title'} /></h3>
                  <div className={'d-flex'}>
                    <Button variant={'outline-primary'}
                            size={'sm'}
                            onClick={() => handlerClick_AddLayer_Start()}>
                      <Trans i18nKey={prefix + 'editor-layers.add-layer-start'} />
                    </Button>
                    <Button variant={'outline-primary'}
                            size={'sm'}
                            className={'ms-3'}
                            onClick={() => handlerClick_AddLayer_End()}>
                      <Trans i18nKey={prefix + 'editor-layers.add-layer-end'} />
                    </Button>
                  </div>
                </Card.Header>
                <Card.Body>
                  <Accordion>
                    {layers.map((item, index) => {
                      return (
                        <Accordion.Item key={index} eventKey={index.toString()}>
                          <Accordion.Header>
                            <Trans i18nKey={prefix + 'editor-layers.layer-id'}
                                   values={{ index: index + 1 }} />
                          </Accordion.Header>

                          <Accordion.Body>
                            <div className="d-grid gap-2">
                              <Button variant={'outline-danger'}
                                      onClick={() => handlerClick_RemoveLayer(index)}>
                                <Trans i18nKey={prefix + 'editor-layers.delete-layer'}
                                       values={{ index: index + 1 }} />
                              </Button>
                            </div>
                            {/* UNITS */}
                            <Form.Group className="mt-3"
                                        controlId={'formUnitsLayer' + index}>
                              <Form.Label>
                                <Trans i18nKey={prefix + 'editor-layers.units'} />
                              </Form.Label>
                              <Form.Control type="number"
                                            min={1} max={200}
                                            placeholder={t(prefix + 'editor-layers.units-placeholder')}
                                            value={item.units}
                                            onChange={(e) => handleChange_Layer(index, {
                                              units     : parseInt(e.target.value),
                                              activation: item.activation,
                                            })} />
                            </Form.Group>
                            {/* ACTIVATION FUNCTION */}
                            <Form.Group className="m3-3"
                                        controlId={'formActivationLayer' + index}>
                              <Form.Label>
                                <Trans i18nKey={prefix + 'editor-layers.activation-function-select'} />
                              </Form.Label>
                              <Form.Select aria-label={'Default select example: ' + item.activation}
                                           value={item.activation}
                                           onChange={(e) => handleChange_Layer(index, {
                                             units     : item.units,
                                             activation: e.target.value,
                                           })}>
                                {TYPE_ACTIVATION.map(({ key, label }, index) => {
                                  return (<option key={index} value={key}>{label}</option>)
                                })}
                              </Form.Select>
                              <Form.Text className="text-muted">
                                <Trans i18nKey={prefix + 'editor-layers.activation-function-info'} />
                              </Form.Text>
                            </Form.Group>
                          </Accordion.Body>
                        </Accordion.Item>
                      )
                    })}
                  </Accordion>
                </Card.Body>
                <Card.Footer className={'d-flex justify-content-end'}>
                  <p className={'text-muted mb-0 pb-0'}>
                    <Trans i18nKey={'more-information-in-link'}
                           components={{
                             link1: <Link to={{ pathname: '/manual/', state: { action: 'open-layer-editor-tabular-classification' } }}
                                          className={'text-info'} />
                           }} />
                  </p>
                </Card.Footer>
              </Card>
            </Col>

            {/* HYPERPARAMETERS EDITOR */}
            <Col className={'mt-3 joyride-step-editor-trainer'} xl={6}>
              <Card className={'sticky-top'} style={{ zIndex: 10 }}>
                <Card.Header><h3><Trans i18nKey={prefix + 'general-parameters.title'} /></h3></Card.Header>
                <Card.Body>
                  {/* LEARNING RATE */}
                  <Form.Group className="mb-3" controlId="formLearningRate">
                    <Form.Label>
                      <Trans i18nKey={prefix + 'general-parameters.learning-rate'} />
                    </Form.Label>
                    <Form.Control type="number"
                                  min={1} max={100}
                                  placeholder={t(prefix + 'general-parameters.learning-rate-placeholder')}
                                  defaultValue={DEFAULT_LEARNING_RATE}
                                  onChange={(e) => setLearningRate(parseInt(e.target.value))} />
                    <Form.Text className="text-muted">
                      <Trans i18nKey={prefix + 'general-parameters.learning-rate-info'} />
                    </Form.Text>
                  </Form.Group>

                  {/* Número OT ITERATIONS */}
                  <Form.Group className="mb-3" controlId="FormNumberOfEpochs">
                    <Form.Label>
                      <Trans i18nKey={prefix + 'general-parameters.number-of-epochs'} />
                    </Form.Label>
                    <Form.Control type="number"
                                  min={1} max={100}
                                  placeholder={t(prefix + 'general-parameters.number-of-epochs')}
                                  defaultValue={DEFAULT_NUMBER_EPOCHS}
                                  onChange={(e) => setNumberEpochs(parseInt(e.target.value))} />
                    <Form.Text className="text-muted">
                      <Trans i18nKey={prefix + 'general-parameters.number-of-epochs-info'} />
                    </Form.Text>
                  </Form.Group>

                  {/* TEST SIZE */}
                  <Form.Group className="mb-3" controlId="formTrainRate">
                    <Form.Label>
                      <Trans i18nKey={prefix + 'general-parameters.train-rate'} />
                    </Form.Label>
                    <Form.Control type="number"
                                  min={1} max={100}
                                  placeholder={t(prefix + 'general-parameters.train-rate-placeholder')}
                                  defaultValue={DEFAULT_TEST_SIZE}
                                  onChange={(e) => setTestSize(parseInt(e.target.value))} />
                    <Form.Text className="text-muted">
                      <Trans i18nKey={prefix + 'general-parameters.train-rate-info'} />
                    </Form.Text>
                  </Form.Group>

                  {/* OPTIMIZATION FUNCTION */}
                  <Form.Group className="mb-3" controlId="FormOptimizer">
                    <Form.Label>
                      <Trans i18nKey={prefix + 'general-parameters.optimizer-id'} />
                    </Form.Label>
                    <Form.Select aria-label="Default select example"
                                 defaultValue={DEFAULT_ID_OPTIMIZATION}
                                 onChange={(e) => setIdOptimizer(e.target.value)}>
                      {TYPE_OPTIMIZER.map(({ key, label }, index) => {
                        return (<option key={index} value={key}>{label}</option>)
                      })}
                    </Form.Select>
                    <Form.Text className="text-muted">
                      <Trans i18nKey={prefix + 'general-parameters.optimizer-id-info'} />
                    </Form.Text>
                  </Form.Group>

                  {/* LOSS FUNCTION */}
                  <Form.Group className="mb-3" controlId="FormLoss">
                    <Form.Label>
                      <Trans i18nKey={prefix + 'general-parameters.loss-id'} />
                    </Form.Label>
                    <Form.Select aria-label="Selecciona la función de pérdida"
                                 defaultValue={DEFAULT_ID_LOSS}
                                 onChange={(e) => setIdLoss(e.target.value)}>
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
                      <Trans i18nKey={prefix + 'general-parameters.loss-id-info'} />
                    </Form.Text>
                  </Form.Group>

                  {/* METRICS FUNCTION */}
                  <Form.Group className="mb-3" controlId="FormMetrics">
                    <Form.Label>
                      <Trans i18nKey={prefix + 'general-parameters.metrics-id'} />
                    </Form.Label>
                    <Form.Select aria-label="Selecciona la métrica"
                                 defaultValue={DEFAULT_ID_METRICS}
                                 disabled={true}
                                 onChange={(e) => setIdMetrics(e.target.value)}>
                      {TYPE_METRICS.map(({ key, label }, index) => {
                        return (<option key={index} value={key}>{label}</option>)
                      })}
                    </Form.Select>
                    <Form.Text className="text-muted">
                      <Trans i18nKey={prefix + 'general-parameters.metrics-id-info'} />
                    </Form.Text>
                  </Form.Group>
                </Card.Body>
                <Card.Footer className={'d-flex justify-content-end'}>
                  <p className={'text-muted mb-0 pb-0'}>
                    <Trans i18nKey={'more-information-in-link'}
                           components={{
                             link1: <Link to={{ pathname: '/manual/', state: { action: 'open-hyperparameters-editor-tabular-classification' } }}
                                          className={'text-info'}>link</Link>
                           }} />
                  </p>
                </Card.Footer>
              </Card>
            </Col>
          </Row>

          {/* BLOCK BUTTON SUBMIT */}
          <Row className={'mt-3'}>
            <Col xl={12}>
              <div className="d-grid gap-2">
                <Button variant={'primary'}
                        size={'lg'}
                        type={'submit'}
                        disabled={isTraining || !isDatasetProcessed}>
                  <Trans i18nKey={prefix + 'models.button-submit'} />
                </Button>
              </div>
            </Col>
          </Row>
        </Form>

        {/* SALIDA */}
        <div className={`mt-3 mb-4 n4l-hr-row`}>
          <span className={'n4l-hr-title'}>
            <Trans i18nKey={'hr.generated-models'} />
          </span>
        </div>
        <Row className={'mt-3 joyride-step-list-of-models'}>
          <Col xl={12}>
            <TabularClassificationTableModels listModels={generatedModels}
                                              isTraining={isTraining} />

          </Col>
        </Row>

        {/* Prediction */}
        <div className={`mt-3 mb-4 n4l-hr-row`}>
          <span className={'n4l-hr-title'}>
            <Trans i18nKey={'hr.predict'} />
          </span>
        </div>
        <Row className={'mt-3 joyride-step-classify-visualization'}>
          <Col xl={12}>
            <TabularClassificationPrediction dataset={dataset}
                                             dataset_JSON={customDataSet_JSON}
                                             dataProcessed={dataProcessed}
                                             predictionBar={predictionBar}
                                             generatedModels={generatedModels}

                                             Model={Model}
                                             setModel={setModel}

                                             generatedModelsIndex={generatedModelsIndex}
                                             setGeneratedModelsIndex={setGeneratedModelsIndex}

                                             stringToPredict={stringToPredict}
                                             setStringToPredict={setStringToPredict}

                                             objectToPredict={objectToPredict}
                                             setObjectToPredict={setObjectToPredict}

                                             handleSubmit_PredictVector={dataset === UPLOAD ? handleSubmit_PredictVector_upload : handleSubmit_PredictVector} />
          </Col>
        </Row>
      </Container>

      {isDebug &&
        <Container>
          <Row>
            <Col>
              <Card className={'mt-3'}>
                <Card.Header className={'d-flex align-items-center justify-content-between'}>
                  <h3>Debug</h3>
                  <div className="d-flex">
                    <Button variant={'outline-primary'}
                            size={'sm'}
                            className={'ms-3'}
                            onClick={() => debug()}>
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
