import './TabularClassification.css'
import React, { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Trans, useTranslation } from 'react-i18next'
import { Accordion, Button, Card, Col, Container, Form, Row } from 'react-bootstrap'
import ReactGA from 'react-ga4'
import * as dfd from 'danfojs'
import * as tf from '@tensorflow/tfjs'
import * as tfvis from '@tensorflow/tfjs-vis'

import { UPLOAD } from '@/DATA_MODEL'
import { MAP_TC_CLASSES } from '@pages/playground/0_TabularClassification/models'
import { createTabularClassificationCustomDataSet, createTabularClassificationCustomDataSet_upload, } from '@core/nn-utils/ArchitectureHelper'

import alertHelper from '@utils/alertHelper'

import TabularClassificationManual from '@pages/playground/0_TabularClassification/TabularClassificationManual'
import TabularClassificationDatasetShow from '@pages/playground/0_TabularClassification/TabularClassificationDatasetShow'
import TabularClassificationTableModels from '@pages/playground/0_TabularClassification/TabularClassificationTableModels'
import TabularClassificationPrediction from '@pages/playground/0_TabularClassification/TabularClassificationPrediction'

import { isProduction } from '@utils/utils'
import I_MODEL_TABULAR_CLASSIFICATION from './models/_model'
import * as errorUtils from '@core/error-utils'
import N4LLayerDesign from '@components/neural-network/N4LLayerDesign'
import N4LJoyride from '@components/joyride/N4LJoyride'
import { VERBOSE } from '@/CONSTANTS'
import TabularClassificationDataset from '@pages/playground/0_TabularClassification/TabularClassificationDataset'
import TabularClassificationEditorLayers from '@pages/playground/0_TabularClassification/TabularClassificationEditorLayers'
import TabularClassificationEditorHyperparameters from '@pages/playground/0_TabularClassification/TabularClassificationEditorHyperparameters'

import {
  DEFAULT_LEARNING_RATE,
  DEFAULT_NUMBER_EPOCHS,
  DEFAULT_TEST_SIZE,
  DEFAULT_ID_OPTIMIZATION,
  DEFAULT_ID_LOSS,
  DEFAULT_ID_METRICS,
  DEFAULT_LAYERS,
  DEFAULT_LAYERS_UPLOAD
} from './CONSTANTS'

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
 * -- Preprocesamiento                                        |
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

  const prefix = 'pages.playground.generator.'
  const prefixManual = 'pages.playground.0-tabular-classification.generator.'
  const { t } = useTranslation()

  const isDebug = process.env.REACT_APP_ENVIRONMENT !== 'production'
  // const [dataframeOriginal, setDataframeOriginal] = useState(null)
  // const [dataProcessed, setDataProcessed] = useState(null)
  // const [isDatasetProcessed, setIsDatasetProcessed] = useState(false)

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
  const [generatedModels, setGeneratedModels] = useState(/** @type Array<GeneratedModel_t> */[])
  const [generatedModelsIndex, setGeneratedModelsIndex] = useState(-1)
  // Model review
  const [Model, setModel] = useState(null)
  const [datasets, setDatasets] = useState([])
  const [datasetIndex, setDatasetIndex] = useState(-1)

  const [DataSetClasses, setDataSetClasses] = useState([])
  const [TargetSetClasses, setTargetSetClasses] = useState([])
  // Utils

  // Class && Controllers
  const [iModelInstance, set_IModelInstance] = useState(new I_MODEL_TABULAR_CLASSIFICATION(t))

  // Prediction
  const [predictionBar, setPredictionBar] = useState({
    list_encoded_classes: [],
    labels              : [],
    data                : [],
  })
  const [objectToPredict, setObjectToPredict] = useState({})
  const [stringToPredict, setStringToPredict] = useState('')
  const refJoyrideButton = useRef({})


  useEffect(() => {
    ReactGA.send({ hitType: 'pageview', page: '/TabularClassificationCustomDataset/' + dataset, title: dataset })

    const init = async () => {
      if (dataset === UPLOAD) {
        // TODO
      } else if (MAP_TC_CLASSES.hasOwnProperty(dataset)) {
        const _iModelClass = MAP_TC_CLASSES[dataset]
        const _iModelInstance = new _iModelClass(t)
        set_IModelInstance(_iModelInstance)
        setLayers(_iModelInstance.DEFAULT_LAYERS())
        const datasets = await _iModelInstance.DATASETS()
        setDatasets(datasets)
        setDatasetIndex(0)
      } else {
        console.error('Error, opción not valid')
      }
    }
    init().then(() => {
      console.debug('end init')
    })

    return () => { tfvis.visor().close() }
  }, [dataset, t])

  // region MODEL
  const handleSubmit_CreateModel = async (event) => {
    event.preventDefault()
    console.debug('ID Conjunto de datos: ', { dataset })
    if (datasets.length === 0) {
      await alertHelper.alertError(t('error.need-dataset'))
      return
    }

    const last_layer_units = layers[layers.length - 1].units ?? 0
    const classes_length = datasets[datasetIndex]?.classes?.length ?? 0

    if (last_layer_units !== classes_length) {
      await alertHelper.alertWarning(t('error.tensor-shape'), {
        footer: '',
        text  : '',
        html  : <Trans i18nKey={'error.tensor-shape-change'} values={{ last_layer_units: last_layer_units, classes_length: classes_length, }} />,
      })
      return
    }

    try {
      setIsTraining(true)
      let _learningRate = learningRate / 100
      let _numberOfEpoch = numberEpochs
      let _testSize = testSize / 100
      let _layerList = layers

      let _idOptimizer = idOptimizer
      let _idLoss = idLoss
      let _idMetrics = idMetrics

      const [model, TARGET_SET_CLASSES, DATA_SET_CLASSES] = await createTabularClassificationCustomDataSet({
        learningRate : _learningRate,
        numberOfEpoch: _numberOfEpoch,
        testSize     : _testSize,
        layerList    : _layerList,
        // TODO
        // dataset_JSON : _customDataset_JSON,
        dataset    : datasets[datasetIndex],
        idOptimizer: _idOptimizer,
        idLoss     : _idLoss,
        idMetrics  : _idMetrics,
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
      // setDataSetClasses(DATA_SET_CLASSES)
      // setTargetSetClasses(TARGET_SET_CLASSES)

      setModel(model)
      await alertHelper.alertSuccess(t('alert.model-train-success'))
    } catch (error) {
      console.error(error)
    } finally {
      setIsTraining(false)
    }
  }
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
        dataProcessed: datasets[datasetIndex],
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
              idMODEL            : generatedModels.length,
              model              : model,
              learningRate       : _learningRate,
              testSize           : _testSize,
              numberOfEpoch      : _numberOfEpoch,
              layerList          : JSON.parse(JSON.stringify(_layers)),
              idOptimizer        : _idOptimizer,
              idLoss             : _idLoss,
              idMetrics          : _idMetrics,
              dataframe_processed: datasets[datasetIndex].dataframe_processed,
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
      if (datasets.length === 0) {
        await alertHelper.alertError('Primero debes de cargar un dataset')
        return
      }
    }
    if (Model === undefined) {
      await alertHelper.alertError('Primero debes de entrenar el modelo')
      return
    }
    let input = [[], [1, stringToPredict.split(';').length]]
    try {

      let i = 0
      for (const element of stringToPredict.split(';')) {
        if (!isProduction()) console.debug('Attribute: ', datasets[datasetIndex].attributes[i])
        let name = datasets[datasetIndex]?.attributes[i].name
        let type = datasets[datasetIndex]?.attributes[i].type

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

      const prediction_class_name = datasets[datasetIndex].classes.find((item) => {
        if (isFinite(TargetSetClasses[predictionWithArgMax]))
          return parseInt(item.key) === TargetSetClasses[predictionWithArgMax]
        else
          return item.key === TargetSetClasses[predictionWithArgMax]
      })
      const list_encoded_classes = datasets[datasetIndex].classes.map(({ name }) => name)
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

  if (VERBOSE) console.debug('render TabularClassificationCustomDataset')
  return (
    <>
      <N4LJoyride refJoyrideButton={refJoyrideButton}
                  JOYRIDE_state={iModelInstance.JOYRIDE()}
                  TASK={'tabular-classification'}
                  KEY={'TabularClassification'}
      />

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
          <p><span className={'n4l-hr-title'}><Trans i18nKey={'hr.information'} /></span></p>
        </div>
        <Row className={'mt-3'}>
          <Col>
            <Accordion defaultActiveKey={dataset === UPLOAD ? ['dataset_info'] : []}>
              <Accordion.Item className={'joyride-step-manual'} key={UPLOAD} eventKey={'manual'}>
                <Accordion.Header>
                  <h3><Trans i18nKey={prefixManual + 'manual.title'} /></h3>
                </Accordion.Header>
                <Accordion.Body><TabularClassificationManual /></Accordion.Body>
              </Accordion.Item>
              <Accordion.Item className={'joyride-step-dataset-info'} key={'1'} eventKey={'dataset_info'}>
                <Accordion.Header>
                  <h3><Trans i18nKey={dataset !== UPLOAD ? iModelInstance.TITLE : prefix + 'dataset.upload-dataset'} /></h3>
                </Accordion.Header>
                <Accordion.Body>
                  <TabularClassificationDataset dataset={dataset}
                                                datasets={datasets}
                                                setDatasets={setDatasets}
                                                datasetIndex={datasetIndex}
                                                setDatasetIndex={setDatasetIndex}
                                                iModelInstance={iModelInstance}
                  />
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Col>
        </Row>

        {/* CONJUNTO DE DATOS */}
        <div className={`mt-3 mb-4 n4l-hr-row`}>
          <p><span className={'n4l-hr-title'}><Trans i18nKey={'hr.dataset'} /></span></p>
        </div>
        <Row className={'mt-3 joyride-step-dataset'}>
          <Col>
            <TabularClassificationDatasetShow datasets={datasets}
                                              datasetIndex={datasetIndex} />
          </Col>
        </Row>

        {/* GENERADOR */}
        <div className={`mt-3 mb-4 n4l-hr-row`}>
          <p><span className={'n4l-hr-title'}><Trans i18nKey={'hr.model'} /></span></p>
        </div>
        <Form id={'TabularClassificationCustomDataset'} onSubmit={dataset === UPLOAD ? handleSubmit_CreateModel_upload : handleSubmit_CreateModel}>
          {/* BLOCK 1 */}
          <Row className={'mt-3'}>
            <Col xl={12} className={'joyride-step-layer'}>
              <N4LLayerDesign layers={layers} />
            </Col>

            {/* LAYER EDITOR */}
            <Col className={'mt-3 joyride-step-editor-layers'} xl={6}>
              <TabularClassificationEditorLayers layers={layers}
                                                 setLayers={setLayers}
                                                 datasets={datasets}
                                                 datasetIndex={datasetIndex}
              />
            </Col>

            {/* HYPERPARAMETERS EDITOR */}
            <Col className={'mt-3 joyride-step-editor-trainer'} xl={6}>
              <TabularClassificationEditorHyperparameters setLearningRate={setLearningRate}
                                                          setNumberEpochs={setNumberEpochs}
                                                          setTestSize={setTestSize}
                                                          setIdOptimizer={setIdOptimizer}
                                                          setIdLoss={setIdLoss}
                                                          setIdMetrics={setIdMetrics}
              />
            </Col>
          </Row>

          {/* BLOCK BUTTON SUBMIT */}
          <Row className={'mt-3'}>
            <Col xl={12}>
              <div className="d-grid gap-2">
                <Button variant={'primary'}
                        size={'lg'}
                        type={'submit'}
                        disabled={isTraining || (datasets[datasetIndex]?.is_dataset_processed ?? true)}>
                  <Trans i18nKey={prefix + 'models.button-submit'} />
                </Button>
              </div>
            </Col>
          </Row>
        </Form>

        {/* SALIDA */}
        <div className={`mt-3 mb-4 n4l-hr-row`}>
          <p><span className={'n4l-hr-title'}><Trans i18nKey={'hr.generated-models'} /></span></p>
        </div>
        <Row className={'mt-3 joyride-step-list-of-models'}>
          <Col>
            <TabularClassificationTableModels listModels={generatedModels}
                                              isTraining={isTraining} />

          </Col>
        </Row>

        {/* Prediction */}
        <div className={`mt-3 mb-4 n4l-hr-row`}>
          <p><span className={'n4l-hr-title'}><Trans i18nKey={'hr.predict'} /></span></p>
        </div>
        <Row className={'mt-3 joyride-step-classify-visualization'}>
          <Col xl={12}>
            <TabularClassificationPrediction dataset={dataset}  // conjunto de datos
                                             datasets={datasets} // listado de conjuntos de datos procesados
                                             datasetIndex={datasetIndex} // el conjunto de datos procesado que se quiere usar

                                             Model={Model} // modelo de tensorflowjs
                                             setModel={setModel} // actualizar el modelo de tensorflowjs

                                             generatedModels={generatedModels}
                                             setGeneratedModels={setGeneratedModels}

                                             generatedModelsIndex={generatedModelsIndex}
                                             setGeneratedModelsIndex={setGeneratedModelsIndex}

                                             stringToPredict={stringToPredict}
                                             setStringToPredict={setStringToPredict}

                                             objectToPredict={objectToPredict}
                                             setObjectToPredict={setObjectToPredict}

                                             predictionBar={predictionBar}

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
                </Card.Header>
                <Card.Body>
                  {datasetIndex}
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
