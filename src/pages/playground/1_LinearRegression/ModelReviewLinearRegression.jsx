import React, { useEffect, useRef, useState, useId } from 'react'
import { useParams } from 'react-router'
import { useHistory } from 'react-router-dom'
import { Trans, useTranslation } from 'react-i18next'
import { Card, Col, Container, Form, Row } from 'react-bootstrap'
import ReactGA from 'react-ga4'
import * as dfd from 'danfojs'
import * as tfjs from '@tensorflow/tfjs'

import * as _Types from '@/core/types'
import { VERBOSE, DEFAULT_SELECTOR_DATASET, DEFAULT_SELECTOR_MODEL, DEFAULT_SELECTOR_INSTANCE } from '@/CONSTANTS'
import { UPLOAD } from '@/DATA_MODEL'
import { TABLE_PLOT_STYLE_CONFIG } from '@/CONSTANTS_DanfoJS'
import N4LSummary from '@components/summary/N4LSummary'
import DataFrameDatasetCard from '@components/dataframe/DataFrameDatasetCard'
import DataFrameScatterPlotCard from '@components/dataframe/DataFrameScatterPlotCard'
import { I_MODEL_LINEAR_REGRESSION, MAP_LR_CLASSES } from '@pages/playground/1_LinearRegression/models'
import ModelReviewLinearRegressionPredict from './ModelReviewLinearRegressionPredict'
import { TRANSFORM_DATASET_PROCESSED_TO_STATE_PREDICTION } from './utils'



export default function ModelReviewLinearRegression ({ dataset }) {
  /**
   * @type {ReturnType<typeof useParams<{id: string}>>}
   */
  const { id } = useParams()
  const history = useHistory()

  const prefix = 'pages.playground.1-linear-regression.'
  const { t } = useTranslation()
  const dataframe_processed_dataset_plotID = useId()
  const dataframe_processed_describe_plotID = useId()
  const iModelInstance_ref = useRef(new I_MODEL_LINEAR_REGRESSION(t, () => {}))

  const [dataframe_X, setDataFrame_X] = useState(new dfd.DataFrame())

  /**
   * @type {ReturnType<typeof useState<_Types.StateDatasetProcessed_t>>}
   */
  const [datasets, setDatasets] = useState({data: [], index: DEFAULT_SELECTOR_DATASET})

  /**
   * @type {ReturnType<typeof useState<_Types.StateModel_t>>}
   */
  const [models, setModels] = useState({data: [], index: DEFAULT_SELECTOR_MODEL})

  /**
   * @type {ReturnType<typeof useState<_Types.StateInstance_t>>}
   */
  const [instances, setInstances] = useState({data: [], index: DEFAULT_SELECTOR_INSTANCE})


  /**
   * @type {ReturnType<typeof useState<_Types.StatePrediction_t>>}
   */
  const [prediction, setPrediction] = useState({
    input_0_raw                : [],
    // 
    input_1_dataframe_original : new dfd.DataFrame(),
    input_1_dataframe_processed: new dfd.DataFrame(),
    input_2_dataframe_encoding : new dfd.DataFrame(),
    input_3_dataframe_scaling  : new dfd.DataFrame(),
    // 
    result                     : [],    
  })


  useEffect(() => {
    ReactGA.send({ hitType: 'pageview', page: '/ModelReviewLinearRegression/' + dataset, title: dataset, })
  }, [dataset])

  useEffect(() => {
    console.debug('useEffect[dataset, t]')
    const init = async () => {
      if (dataset === UPLOAD) {
        console.warn('Error, option not valid', { ID: dataset })
      } else if (dataset in MAP_LR_CLASSES) {
        const _iModelClass = MAP_LR_CLASSES[dataset]
        iModelInstance_ref.current = new _iModelClass(t, {})
        const _datasets = await iModelInstance_ref.current.DATASETS()
        setDatasets({
          data : _datasets,
          index: 0
        })
        
      } else {
        console.error('Error, option not valid', { ID: dataset })
        history.push('/404')
      }
    }
    init().then(() => undefined)
  }, [dataset, t, history])

  useEffect(() => {
    async function init () {
      if (datasets.index !== DEFAULT_SELECTOR_DATASET && datasets.data.length > 0 && iModelInstance_ref.current) {
        const _models = (await iModelInstance_ref.current.MODELS(datasets.data[datasets.index].csv))
        setModels({
          data : _models,
          index: 0
        })
      }
    }

    init().then(() => undefined)
  }, [datasets])

  useEffect(() => {
    console.debug('useEffect[ datasets, datasets.data, datasets.index, models, models.data, models.index ]')

    async function init () {
      if (models.index !== DEFAULT_SELECTOR_MODEL && models.data.length > 0) {
        const dataset_processed = (/**@type {_Types.DatasetProcessed_t}*/ (datasets.data[datasets.index]))
        const { dataframe_original, /* data_processed */ } = dataset_processed

        setDataFrame_X(dataframe_original)
        setInstances((_prevState) => ({
          data : dataframe_original.values,
          index: DEFAULT_SELECTOR_INSTANCE
        }))


        const state = TRANSFORM_DATASET_PROCESSED_TO_STATE_PREDICTION(dataset_processed)
        setPrediction((prevState) => {
          return {
            ...prevState,
            input_0_raw                : state.input_0_raw,
            input_1_dataframe_original : state.input_1_dataframe_original,
            input_1_dataframe_processed: state.input_1_dataframe_processed,
            input_2_dataframe_encoding : state.input_2_dataframe_encoding,
            input_3_dataframe_scaling  : state.input_3_dataframe_scaling,
            result                     : state.result,
          }
        })

        // const model = await tfjs.loadLayersModel(model_path)
        // model.predict(tfjs.tensor2d(dataframe_X.values[16]))

      }
    }

    init().then(() => undefined)
  }, [datasets, datasets.data, datasets.index, models, models.data, models.index])

  useEffect(() => {
    console.debug('useEffect[ datasets, datasets.data, datasets.index, dataframe_processed_dataset_plotID, dataframe_processed_describe_plotID ]')
    if (datasets.index !== DEFAULT_SELECTOR_DATASET && datasets.data.length > 0) {
      const { dataframe_processed } = datasets.data[datasets.index]
      // TODO
      dataframe_processed
        .plot(dataframe_processed_dataset_plotID)
        .table({ config: TABLE_PLOT_STYLE_CONFIG })
      dataframe_processed
        .describe()
        .T
        .plot(dataframe_processed_describe_plotID)
        .table({ config: TABLE_PLOT_STYLE_CONFIG })
    }
  }, [datasets, datasets.data, datasets.index, dataframe_processed_dataset_plotID, dataframe_processed_describe_plotID])

  const handleChange_Datasets_Index = (event) => {
    setDatasets((prevState) => ({
      ...prevState,
      index: parseInt(event.target.value)
    }))
  }

  const handleChange_Models_Index = async (event) => {
    setModels((prevState) => ({
      ...prevState,
      index: parseInt(event.target.value)
    }))
  }
  
  const handleChange_Instance_Index = async (event) => {
    const newInstanceIndex = parseInt(event.target.value)
    
    const dataset_processed = (/**@type {_Types.DatasetProcessed_t}*/ (datasets.data[datasets.index]))
    const state = TRANSFORM_DATASET_PROCESSED_TO_STATE_PREDICTION(dataset_processed, newInstanceIndex)
    setPrediction((prevState) => {
      return {
        ...prevState,
        input_0_raw                : state.input_0_raw,
        input_1_dataframe_original : state.input_1_dataframe_original,
        input_1_dataframe_processed: state.input_1_dataframe_processed,
        input_2_dataframe_encoding : state.input_2_dataframe_encoding,
        input_3_dataframe_scaling  : state.input_3_dataframe_scaling,
        result                     : state.result,
      }
    })
    setInstances((prevState) => ({
      ...prevState,
      index: newInstanceIndex
    }))
  }

  if (VERBOSE) console.debug('render ModelReviewLinearRegression')
  return (
    <>
      <Container id={'ModelReviewLinearRegression'} data-testid="Test-ModelReviewLinearRegression">

        <Row className={'mt-3'}>
          <Col>
            <div className={'d-flex justify-content-between'}>
              <h1><Trans i18nKey={'modality.' + id} /></h1>
            </div>
          </Col>
        </Row>

        {iModelInstance_ref !== null &&
          <Row>
            <Col xs={12} sm={12} md={12} xl={3} xxl={3}>
              <Card className={'sticky-top border-info mt-3'}>
                <Card.Header>
                  <h2><Trans i18nKey={iModelInstance_ref.current.i18n_TITLE} /></h2>
                </Card.Header>
                <Card.Body>
                  <Form.Group controlId="FormSelector_Dataset">
                    <Form.Label><Trans i18nKey={'form.select-dataset.title'} /></Form.Label>
                    <Form.Select aria-label={t('form.select-dataset.title')}
                                 size={'sm'}
                                 value={datasets.index}
                                 onChange={handleChange_Datasets_Index}
                    >
                      <option value={DEFAULT_SELECTOR_DATASET} disabled={true}><Trans i18nKey={'selector-dataset'} /></option>
                      {datasets.data.map(({ csv }, index) => {
                        return (<option key={index} value={index}>{csv}</option>)
                      })}
                    </Form.Select>
                    <Form.Text className={'text-muted'}>
                      <Trans i18nKey={'form.select-dataset.info'} />
                    </Form.Text>
                  </Form.Group>

                  {iModelInstance_ref.current.DESCRIPTION()}

                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} sm={12} md={12} xl={9} xxl={9}>

              <DataFrameDatasetCard dataframe={dataframe_X} />

              {/* DataFrame INFO */}
              <Card className={'mt-3'}>
                <Card.Header className={'d-flex justify-content-between'}>
                  <h2><Trans i18nKey={prefix + 'dataframe.title'} /></h2>
                </Card.Header>
                <Card.Body>
                  <N4LSummary title={<Trans i18nKey={prefix + 'details.description-processed.dataset'} />}
                              info={<div id={dataframe_processed_dataset_plotID}></div>} />
                  <N4LSummary title={<Trans i18nKey={prefix + 'details.description-processed.describe'} />}
                              info={<div id={dataframe_processed_describe_plotID}></div>} />
                </Card.Body>
              </Card>

              {/* DataFrame PLOT */}
              <DataFrameScatterPlotCard dataframe={dataframe_X} />

              {/* Model PREDICT */}
              <Card className={'mt-3'}>
                <Card.Header className={'d-flex justify-content-between'}>
                  <h2><Trans i18nKey={prefix + 'model-selector.title'} /></h2>
                  <div className={'d-flex gap-2'}>
                    <Form.Group controlId={'FormSelector_Models'}>
                      <Form.Select aria-label={'plot'}
                                   size={'sm'}
                                   value={models.index}
                                   onChange={handleChange_Models_Index}
                      >
                        <option value={DEFAULT_SELECTOR_MODEL} disabled={true}><Trans i18nKey={'selector-model'} /></option>
                        {models.data.map((_value, index) => {
                          return <option key={index} value={index}>
                            <Trans i18nKey={'model.__index__'} values={{ index: index }} />
                          </option>
                        })}
                      </Form.Select>
                    </Form.Group>
                    <Form.Group controlId={'FormSelector_Instances'}>
                      <Form.Select aria-label={'plot'}
                                   size={'sm'}
                                   value={instances.index}
                                   onChange={handleChange_Instance_Index}
                      >
                        <option value={DEFAULT_SELECTOR_INSTANCE} disabled={true}><Trans i18nKey={'selector-instance'} /></option>
                        {instances.data.map((_value, index) => {
                          return <option key={index} value={index}>
                            <Trans i18nKey={'instance.__index__'} values={{ index: index }} />
                          </option>
                        })}
                      </Form.Select>
                    </Form.Group>
                  </div>
                </Card.Header>
                <Card.Body>
                  
                  <ModelReviewLinearRegressionPredict model={models.data[models.index]}
                                                      dataset={datasets.data[datasets.index]}
                                                      prediction={prediction}
                                                      setPrediction={setPrediction} />

                </Card.Body>
              </Card>
            </Col>
          </Row>
        }
      </Container>
    </>
  )
}
