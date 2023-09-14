import styles from './LinearRegression.module.css'
import React, { lazy, Suspense, useContext, useEffect, useRef } from 'react'
import { useParams } from 'react-router'
import { Accordion, Button, Card, Col, Container, Form, Row } from 'react-bootstrap'
import { Trans, useTranslation } from 'react-i18next'

import N4LLayerDesign from '@components/neural-network/N4LLayerDesign'
import DebugJSON from '@components/debug/DebugJSON'

import { UPLOAD } from '@/DATA_MODEL'
import { MAP_LR_MODEL } from './models'

import LinearRegressionContext from '@context/LinearRegressionContext'
import LinearRegressionJoyride from './LinearRegressionJoyride'
import LinearRegressionModelController_Simple from '@core/LinearRegressionModelController_Simple'
import { cloneTmpModel } from '@pages/playground/1_LinearRegression/utils'

// Manual and datasets
const LinearRegressionManual = lazy(() => import( './LinearRegressionManual'))
const LinearRegressionDataset = lazy(() => import( './LinearRegressionDataset'))
const LinearRegressionDatasetShow = lazy(() => import( './LinearRegressionDatasetShow'))
const LinearRegressionDatasetPlot = lazy(() => import( './LinearRegressionDatasetPlot'))
// Editors
const LinearRegressionEditorLayers = lazy(() => import( './LinearRegressionEditorLayers'))
const LinearRegressionEditorFeaturesSelector = lazy(() => import( './LinearRegressionEditorFeaturesSelector'))
const LinearRegressionEditorTrainer = lazy(() => import( './LinearRegressionEditorTrainer'))
// const LinearRegressionEditorVisor = lazy(() => import( './LinearRegressionEditorVisor'))
// Models
const LinearRegressionTableModels = lazy(() => import( './LinearRegressionTableModels'))
// const LinearRegressionPredictionExample = lazy(() => import( './LinearRegressionPredictionExample'))
const LinearRegressionPrediction = lazy(() => import(  './LinearRegressionPrediction'))

// TODO
export default function LinearRegression ({ dataset_id }) {
  const { id: param_id } = useParams()

  // i18n
  const prefix = 'pages.playground.generator.'
  const { t } = useTranslation()

  const {
    setDatasets,

    tmpModel,
    setTmpModel,

    params,

    isTraining,
    setIsTraining,

    datasetLocal,

    setListModels,

    accordionActive,
    setAccordionActive,

    iModel,
    setIModel,
  } = useContext(LinearRegressionContext)

  const refJoyrideButton = useRef({})

  const handleSubmit_TrainModel = async (event) => {
    event.preventDefault()
    setIsTraining(true)
    console.log('handleSubmit_TrainModel')

    const modelController = new LinearRegressionModelController_Simple(t)
    modelController.setDataFrame(datasetLocal.dataframe_processed)
    modelController.setLayers({
      input : { units: 1 },
      layers: [...params.params_layers.map(value => ({ activation: value.activation, units: value.units }))],
      output: { units: 1 },
    })
    modelController.setCompile({
      id_optimizer: params.params_training.id_optimizer,
      id_loss     : params.params_training.id_loss,
      id_metrics  : params.params_training.list_id_metrics,
      params      : {
        learningRate: params.params_training.learning_rate,
      },
    })
    modelController.setFeatures({
      X_features : params.params_features.X_features,
      X_feature  : params.params_features.X_feature,
      y_target   : params.params_features.y_target,
      categorical: new Map()
    })
    modelController.setFit({
      testSize : params.params_training.test_size,
      epochs   : params.params_training.n_of_epochs,
      shuffle  : true,
      batchSize: 32,
      metrics  : [...params.params_training.list_id_metrics],
    })

    const { model, original, predicted, predictedLinear } = await modelController.run()

    console.log('modelController.run()', { original })

    const updatedTmpModel = {
      model          : model,
      original       : Array.from(original),
      predicted      : Array.from(predicted),
      predictedLinear: Array.from(predictedLinear)
    }

    setTmpModel(updatedTmpModel)
    setListModels((prevState) => [...prevState, {
      ...cloneTmpModel(updatedTmpModel),
      params_layers  : [...params.params_layers],
      params_training: { ...params.params_training },
      params_features: { ...params.params_features },
      dataframe      : datasetLocal.dataframe_processed
    }])
    setIsTraining(false)
  }

  const handleSubmit_TrainModel_Upload = async (event) => {
    event.preventDefault()
    setIsTraining(true)
    console.log('handleSubmit_TrainModel_Upload')
    setIsTraining(false)
  }

  useEffect(() => {
    console.debug('LinearRegression useEffect[init]')
    const init = async () => {
      if (dataset_id === UPLOAD) {
        // TODO
        console.log('TODO')
      } else {
        let info_dataset
        if (MAP_LR_MODEL.hasOwnProperty(dataset_id)) {
          info_dataset = new MAP_LR_MODEL[dataset_id](t, setAccordionActive)
        } else {
          console.error('Error, option not valid')
        }
        const { datasets } = await info_dataset.DATASETS()
        setIModel(info_dataset)
        setDatasets(datasets)
      }
    }
    init().then(() => undefined)
  }, [dataset_id, t, setIModel, setTmpModel, setAccordionActive, setDatasets])

  const accordionToggle = (value) => {
    const copy = JSON.parse(JSON.stringify(accordionActive))
    let index = copy.indexOf(value)
    if (index === -1) {
      copy.push(value)
    } else {
      copy.splice(index, 1)
    }
    setAccordionActive(copy)
  }

  console.debug('render LinearRegression')
  return (
    <>
      <LinearRegressionJoyride refJoyrideButton={refJoyrideButton} />


      <Container>
        <Row className={'mt-2 mb-3'}>
          <Col xl={12}>
            <div className="d-flex justify-content-between">
              <h1><Trans i18nKey={'modality.' + param_id} /></h1>
              <Button size={'sm'}
                      variant={'outline-primary'}
                      onClick={refJoyrideButton.current.handleClick_StartJoyride}>
                <Trans i18nKey={'datasets-models.1-linear-regression.joyride.title'} />
              </Button>
            </div>
          </Col>
        </Row>

        <div className={`mt-2 mb-4 ${styles.n4l_hr_row}`}>
          <span className={styles.n4l_hr_title}>
            <Trans i18nKey={'hr.information'} />
          </span>
        </div>


        <Row>
          <Col>
            <Accordion defaultActiveKey={[]} activeKey={accordionActive}>
              <Accordion.Item className={'joyride-step-1-manual'} eventKey={'manual'}>
                <Accordion.Header onClick={() => accordionToggle('manual')}>
                  <h3><Trans i18nKey={'pages.playground.1-linear-regression.generator.manual.title'} /></h3>
                </Accordion.Header>
                <Accordion.Body>
                  <Suspense fallback={<></>}><LinearRegressionManual /></Suspense>
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item className={'joyride-step-2-dataset-info'} eventKey={'dataset_info'}>
                <Accordion.Header onClick={() => accordionToggle('dataset_info')}>
                  <h3><Trans i18nKey={dataset_id !== UPLOAD ? iModel.i18n_TITLE : prefix + 'dataset.upload-dataset'} /></h3>
                </Accordion.Header>
                <Accordion.Body id={'info_model'}>
                  <Suspense fallback={<></>}><LinearRegressionDataset dataset_id={dataset_id} /></Suspense>
                </Accordion.Body>
              </Accordion.Item>

            </Accordion>

          </Col>
        </Row>

        <div className={`mt-2 mb-4 ${styles.n4l_hr_row}`}>
          <span className={styles.n4l_hr_title}>
            <Trans i18nKey={'hr.dataset'} />
          </span>
        </div>
        <Row className={'joyride-step-3-dataset'}>
          <Col>
            <Suspense fallback={<></>}><LinearRegressionDatasetShow /></Suspense>
          </Col>
        </Row>

        <hr />

        <Row className={'joyride-step-4-dataset-plot'}>
          <Col>
            <Suspense fallback={<></>}><LinearRegressionDatasetPlot /></Suspense>
          </Col>
        </Row>

        <div className={`mt-2 mb-4 ${styles.n4l_hr_row}`}>
          <span className={styles.n4l_hr_title}>
            <Trans i18nKey={'hr.model'} />
          </span>
        </div>

        <Row>
          <Col className={'joyride-step-5-layer'}>
            <N4LLayerDesign layers={params.params_layers} />
          </Col>
        </Row>

        <Form onSubmit={dataset_id === UPLOAD ? handleSubmit_TrainModel_Upload : handleSubmit_TrainModel}>

          <Row className={'mt-3'}>
            <Col className={'mb-3'}>
              <div className={'joyride-step-6-editor-layers'}>
                <Suspense fallback={<></>}><LinearRegressionEditorLayers /></Suspense>
              </div>

              <hr />

              {/*
              <div className={'joyride-step-6-editor-visor'}>
                <Suspense fallback={<></>}><LinearRegressionEditorVisor /></Suspense>
              </div>
              */}
              <div className={'joyride-step-6-editor-selector-features'}>
                <Suspense fallback={<></>}><LinearRegressionEditorFeaturesSelector /></Suspense>
              </div>
            </Col>
            <Col className={'joyride-step-7-editor-trainer'}>
              <Suspense fallback={<></>}><LinearRegressionEditorTrainer /></Suspense>
            </Col>
          </Row>

          <Row className={'mt-3'}>
            <Col xl={12}>
              <div className="d-grid gap-2">
                <Button type={'submit'}
                        disabled={isTraining || !datasetLocal.is_dataset_processed}
                        size={'lg'}
                        variant="primary">
                  <Trans i18nKey={prefix + 'models.button-submit'} />
                </Button>
              </div>
            </Col>
          </Row>

        </Form>

        <hr />

        <Row className={'mt-3'}>
          <Col className={'joyride-step-8-list-of-models'}>
            <Suspense fallback={<></>}><LinearRegressionTableModels /></Suspense>
          </Col>
        </Row>

        <div className={`mt-2 mb-4 ${styles.n4l_hr_row}`}>
          <span className={styles.n4l_hr_title}>
            <Trans i18nKey={'hr.predict'} />
          </span>
        </div>


        {/*<Row className={'mt-3'}>*/}
        {/*  <Col className={'joyride-step-8-list-of-models'}>*/}
        {/*    <Suspense fallback={<></>}><LinearRegressionPredictionExample /></Suspense>*/}
        {/*  </Col>*/}
        {/*</Row>*/}

        {/*<hr />*/}

        <Row className={'mt-3'}>
          <Col className={'joyride-step-9-predict-visualization'}>
            <Suspense fallback={<></>}><LinearRegressionPrediction /></Suspense>
          </Col>
        </Row>

        {process.env.REACT_APP_ENVIRONMENT === 'development' &&
          <Row className={'mt-3'}>
            <Col>
              <Card>
                <Card.Header>
                  <h3>Debug</h3>
                </Card.Header>
                <Card.Body>
                  <Row lg={3}>
                    <Col><DebugJSON obj={tmpModel.params_training} /></Col>
                    <Col><DebugJSON obj={tmpModel.params_visor} /></Col>
                    <Col><DebugJSON obj={Object.keys(datasetLocal)} /></Col>
                    <Col><DebugJSON obj={{ accordionActive }} /></Col>
                    <Col><DebugJSON obj={{ 'dataframe_processed_columns': datasetLocal.dataframe_processed.columns }} /></Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        }

      </Container>
    </>
  )
}