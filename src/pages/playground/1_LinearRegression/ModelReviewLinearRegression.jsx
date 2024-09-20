import React, { useEffect, useRef, useState, useId } from 'react'
import { useParams } from 'react-router'
import { useHistory } from 'react-router-dom'
import { Trans, useTranslation } from 'react-i18next'
import { Card, Col, Container, Form, Row } from 'react-bootstrap'
import ReactGA from 'react-ga4'
import * as dfd from 'danfojs'
import * as tfjs from '@tensorflow/tfjs'

import * as _Type from '@/core/types'
import { VERBOSE } from '@/CONSTANTS'
import { TABLE_PLOT_STYLE_CONFIG } from '@/CONSTANTS_DanfoJS'
import N4LSummary from '@components/summary/N4LSummary'
import DataFrameDatasetCard from '@components/dataframe/DataFrameDatasetCard'
import DataFrameScatterPlotCard from '@components/dataframe/DataFrameScatterPlotCard'
import { I_MODEL_LINEAR_REGRESSION, MAP_LR_CLASSES } from '@pages/playground/1_LinearRegression/models'
import { UPLOAD } from '@/DATA_MODEL'

export default function ModelReviewLinearRegression ({ dataset }) {
  const { id } = useParams()
  const history = useHistory()

  const prefix = 'pages.playground.1-linear-regression.'
  const { t } = useTranslation()
  const dataframe_original_plotID = useId()
  const dataframe_processed_plotID = useId()
  const iModelInstance_ref = useRef(new I_MODEL_LINEAR_REGRESSION(t, () => {}))

  /**
   * @type {ReturnType<typeof useState<Array<_Type.DatasetProcessed_t>>>}
   */
  const [datasets, setDatasets] = useState([])
    /**
   * @type {ReturnType<typeof useState<number>>}
   */
  const [datasets_Index, setDatasets_Index] = useState('select-dataset')
  const [datasets_DataFrame, setDatasets_DataFrame] = useState(new dfd.DataFrame())
  const [instance_Index, setInstanceIndex] = useState(new dfd.DataFrame())
  
  const [dataFrame_Instance, setDataFrameInstance] = useState(new dfd.DataFrame())
  
  /**
   * @type {ReturnType<typeof useState<Array<_Type.CustomModel_t>>>}
   */
  const [listModels, setListModels] = useState([])
  /**
   * @type {ReturnType<typeof useState<number|'select-model'>>}
   */
  const [listModels_Index, setListModels_Index] = useState('select-model')

  useEffect(() => {
    ReactGA.send({ hitType: 'pageview', page: '/ModelReviewLinearRegression/' + dataset, title: dataset, })
  }, [dataset])

  useEffect(() => {
    if (VERBOSE) console.debug('useEffect[dataset, t]')
    const init = async () => {
      if (dataset === UPLOAD) {
        console.warn('Error, option not valid', { ID: dataset })
      } else if (dataset in MAP_LR_CLASSES) {
        const _iModelClass = MAP_LR_CLASSES[dataset]
        iModelInstance_ref.current = new _iModelClass(t, {})
        const _datasets = await iModelInstance_ref.current.DATASETS()
        // console.log({_datasets})
        setDatasets(_datasets)
        setDatasets_Index(0)
      } else {
        console.error('Error, option not valid', { ID: dataset })
        history.push('/404')
      }
    }
    init().then(() => undefined)
  }, [dataset, t, history])

  useEffect(() => {
    async function init () {
      if (datasets.length > 0) {
        console.log({ datasets, datasets_Index, d: datasets[datasets_Index].csv})
        const _listModels = (await iModelInstance_ref.current.MODELS(datasets[datasets_Index].csv))
        setListModels(_listModels)
      }
    }

    init().then(() => undefined)
  }, [datasets, datasets_Index])

  useEffect(() => {
    if (listModels.length === 0) {
      setListModels_Index('select-model')
    }
  }, [listModels])

  useEffect(() => {
    if (VERBOSE) console.debug('useEffect[ listModels, listModels_Index ]')

    async function init () {
      if (listModels_Index !== 'select-model' && listModels.length > 0) {
        const { 
          is_dataset_upload,
          is_dataset_processed,
          path,
          info,
          csv,
          container_info,
          dataframe_original,
          dataframe_processed,
          dataset_transforms,
          data_processed
        } = datasets[datasets_Index]
        const { model_path, X, y } = listModels[listModels_Index]
        console.log({X})


        // const model = await tfjs.loadLayersModel(model_path)
        // model.predict(tfjs.tensor2d())

      }
    }

    init().then(() => undefined)
  }, [datasets, datasets_Index, datasets_DataFrame, listModels, listModels_Index, t, dataframe_original_plotID, dataframe_processed_plotID])

  useEffect(() => {
    if (VERBOSE) console.debug('useEffect[datasets_Index]')
    if (datasets.length > 0) {
      const { 
        is_dataset_upload,
        is_dataset_processed,
        path,
        info,
        csv,
        container_info,
        dataframe_original,
        dataframe_processed,
        dataset_transforms,
        data_processed
      } = datasets[datasets_Index]

      setDatasets_DataFrame(dataframe_processed)
      // TODO
      dataframe_processed
        .plot(dataframe_original_plotID)
        .table({ config: TABLE_PLOT_STYLE_CONFIG })
      dataframe_processed
        .describe()
        .T
        .plot(dataframe_processed_plotID)
        .table({ config: TABLE_PLOT_STYLE_CONFIG })
    }
  }, [dataframe_original_plotID, dataframe_processed_plotID, datasets, datasets_Index])

  const handleChange_Datasets_Index = (event) => {
    setDatasets_Index(parseInt(event.target.value))
  }

  const handleChange_ListModels_Index = async (event) => {
    setListModels_Index(event.target.value)
  }

  const handleChange_Instance_Index = async (event) => {
    setInstanceIndex(event.target.value)
  }

  if (VERBOSE) console.debug('render ModelReviewLinearRegression')
  return (
    <>
      <Container id={'ModelReviewLinearRegression'} data-testid="Test-ModelReviewLinearRegression">

        <Row className={'mt-3'}>
          <Col>
            <div className="d-flex justify-content-between">
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
                    <Form.Select 
                      aria-label={t('form.select-dataset.title')}
                      size={'sm'}
                      value={datasets_Index}
                      onChange={handleChange_Datasets_Index}
                    >
                      <option value={'select-dataset'} disabled={true}><Trans i18nKey={prefix + 'selector-dataset.option'} /></option>
                      {datasets.map(({ csv }, index) => {
                        return (<option key={index} value={index}>{csv}</option>)
                      })}
                    </Form.Select>
                    <Form.Text className="text-muted">
                      <Trans i18nKey={'form.select-dataset.info'} />
                    </Form.Text>
                  </Form.Group>

                  {iModelInstance_ref.current.DESCRIPTION()}

                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} sm={12} md={12} xl={9} xxl={9}>

              <DataFrameDatasetCard dataframe={datasets_DataFrame} />

              <Card className={'mt-3'}>
                <Card.Header className={'d-flex justify-content-between'}>
                  <h2><Trans i18nKey={prefix + 'dataframe.title'} /></h2>
                </Card.Header>
                <Card.Body>
                  <N4LSummary
                        title={<Trans i18nKey={prefix + 'details.description-original'} />}
                        info={<div id={dataframe_original_plotID}></div>} />
                  <N4LSummary
                    title={<Trans i18nKey={prefix + 'details.description-processed'} />}
                    info={<div id={dataframe_processed_plotID}></div>} />
                </Card.Body>
              </Card>

              <DataFrameScatterPlotCard dataframe={datasets_DataFrame} />

              <Card className={'mt-3'}>
                <Card.Header className={'d-flex justify-content-between'}>
                  <h2><Trans i18nKey={prefix + 'model-selector.title'} /></h2>
                  <div className={'d-flex'}>
                    <Form.Group controlId={'FormSelector_Models'}>
                      <Form.Select 
                        aria-label={'plot'}
                        size={'sm'}
                        value={listModels_Index}
                        onChange={handleChange_ListModels_Index}
                      >
                        <option value={'select-model'} disabled={true}><Trans i18nKey={prefix + 'selector-model.option'} /></option>
                        {listModels.map((value, index) => {
                          return <option key={index} value={index}>
                            <Trans i18nKey={'model.__index__'} values={{ index: index }} />
                          </option>
                        })}
                      </Form.Select>
                    </Form.Group>
                    <Form.Group controlId={'FormSelector_Instances'}>
                      <Form.Select 
                        aria-label={'plot'}
                        size={'sm'}
                        value={instance_Index}
                        onChange={handleChange_Instance_Index}
                      >
                        <option value={'select-instance'} disabled={true}><Trans i18nKey={prefix + 'selector-instance.option'} /></option>
                        {listModels.map((value, index) => {
                          return <option key={index} value={index}>
                            <Trans i18nKey={'instance.__index__'} values={{ index: index }} />
                          </option>
                        })}
                      </Form.Select>
                    </Form.Group>
                  </div>
                </Card.Header>
                <Card.Body>



                </Card.Body>
              </Card>
            </Col>
          </Row>
        }
      </Container>
    </>
  )
}
