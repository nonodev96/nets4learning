import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router'
import { Trans, useTranslation } from 'react-i18next'
import { Card, Col, Container, Row, Form } from 'react-bootstrap'
import Plot from 'react-plotly.js'
import ReactGA from 'react-ga4'
import * as dfd from 'danfojs'
import * as tfjs from '@tensorflow/tfjs'

import { VERBOSE } from '@/CONSTANTS'
import { PLOTLY_CONFIG_DEFAULT } from '@/CONSTANTS_ChartsJs'

import DataFrameDatasetCard from '@components/dataframe/DataFrameDatasetCard'
import LinearRegressionModelController_Simple from '@core/LinearRegressionModelController_Simple'
import DataFrameScatterPlotCard from '@components/dataframe/DataFrameScatterPlotCard'
import { I_MODEL_LINEAR_REGRESSION, MAP_LR_CLASSES } from '@pages/playground/1_LinearRegression/models'

export default function ModelReviewLinearRegression ({ dataset }) {
  const { id } = useParams()

  const prefix = 'pages.playground.1-linear-regression.'
  const { t } = useTranslation()
  const refPlotJS = useRef()

  const [iModelInstance, setIModelInstance] = useState(new I_MODEL_LINEAR_REGRESSION(t, () => {}))

  const [datasets, setDatasets] = useState([])
  const [datasets_Index, setDatasets_Index] = useState(0)
  const [datasets_DataFrame, setDatasets_DataFrame] = useState(new dfd.DataFrame())

  const [listModels, setListModels] = useState(/**@type []*/[])
  const [listModels_Index, setListModels_Index] = useState('select-model')
  const [dataPlot, setDataPlot] = useState({ original: [], predicted: [], column_name_X: '', column_name_Y: '' })

  useEffect(() => {
    ReactGA.send({ hitType: 'pageview', page: '/ModelReviewLinearRegression/' + dataset, title: dataset, })
  }, [dataset])

  useEffect(() => {
    // const dataset_ID = parseInt(dataset)
    // const dataset_key = getKeyDatasetByID_LinearRegression(dataset_ID)

    if (MAP_LR_CLASSES.hasOwnProperty(dataset)) {
      const _iModelClass = MAP_LR_CLASSES[dataset]
      setIModelInstance(new _iModelClass(t, {}))
    } else {
      console.error('Error, option not valid', dataset)
    }
  }, [dataset, t])

  useEffect(() => {
    async function init () {
      if (iModelInstance !== null) {
        const _datasets = (await iModelInstance.DATASETS()).datasets
        setDatasets(_datasets)
      }
    }

    init().then(_r => undefined)
  }, [iModelInstance])

  useEffect(() => {
    async function init () {
      if (iModelInstance !== null && datasets.length > 0) {
        const _listModels = (await iModelInstance.MODELS(datasets[datasets_Index].csv))
        setListModels(_listModels)
      }
    }

    init().then(_r => undefined)
  }, [datasets, datasets_Index, iModelInstance])

  useEffect(() => {
    if (listModels.length === 0) {
      setListModels_Index('select-model')
      setDataPlot({ original: [], predicted: [], column_name_X: '', column_name_Y: '' })
    }
  }, [listModels])

  useEffect(() => {
    console.debug('useEffect[ listModels, listModels_Index ]')

    async function init () {
      if (listModels_Index !== 'select-model' && listModels.length > 0) {
        const { model_path, column_name_X, column_name_Y } = listModels[listModels_Index]
        const model = await tfjs.loadLayersModel(model_path)
        const linear = new LinearRegressionModelController_Simple(t)
        linear.setDataFrame(datasets_DataFrame)
        linear.setFeatures({
          X_feature  : column_name_X,
          y_target   : column_name_Y,
          categorical: new Map()
        })
        linear.setVisor({
          description_model: false,
          scatterplot      : false,
          confusion_matrix : false,
          linechart        : false
        })
        const { original, predicted } = await linear.runModel(model)

        setDataPlot({
          original,
          predicted,
          column_name_X,
          column_name_Y
        })
      }
    }

    init().then(_r => undefined)
  }, [datasets_DataFrame, listModels, listModels_Index, t])

  useEffect(() => {
    console.debug('useEffect[datasets_Index]')
    if (datasets.length > 0) {
      setDatasets_DataFrame(datasets[datasets_Index].dataframe_processed)
    }
  }, [datasets, datasets_Index])

  const handleChange_Datasets_Index = (event) => {
    setDatasets_Index(parseInt(event.target.value))
  }

  const handleChange_ListModels_Index = async (event) => {
    setListModels_Index(event.target.value)
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

        {iModelInstance !== null &&
          <Row>
            <Col xs={12} sm={12} md={12} xl={3} xxl={3}>
              <Card className={'sticky-top border-info mt-3'}>
                <Card.Header>
                  <h3><Trans i18nKey={iModelInstance.i18n_TITLE} /></h3>
                </Card.Header>
                <Card.Body>
                  <Form.Group className="mb-3" controlId="FormSelectDatasetOption">
                    <Form.Label><Trans i18nKey={'form.select-dataset.title'} /></Form.Label>
                    <Form.Select aria-label={'form.select-dataset.title'}
                                 size={'sm'}
                                 value={datasets_Index}
                                 onChange={handleChange_Datasets_Index}>
                      {datasets.map(({ csv }, index) => {
                        return (<option key={index} value={index}>{csv}</option>)
                      })}
                    </Form.Select>
                    <Form.Text className="text-muted">
                      <Trans i18nKey={'form.select-dataset.info'} />
                    </Form.Text>
                  </Form.Group>

                  {iModelInstance.DESCRIPTION()}

                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} sm={12} md={12} xl={9} xxl={9}>

              <DataFrameDatasetCard dataframe={datasets_DataFrame} />

              <DataFrameScatterPlotCard dataframe={datasets_DataFrame} />

              <Card className={'mt-3'}>
                <Card.Header className={'d-flex justify-content-between'}>
                  <h3><Trans i18nKey={prefix + 'model-selector.title'} /></h3>
                  <div className={'d-flex'}>
                    <Form.Group controlId={'FormModelSelector_X'}>
                      <Form.Select aria-label={'plot'}
                                   size={'sm'}
                                   value={listModels_Index}
                                   onChange={handleChange_ListModels_Index}>
                        <option value={'select-model'} disabled={true}><Trans i18nKey={prefix + 'model-selector.option'} /></option>
                        {listModels.map((value, index) => {
                          return <option key={index} value={index}>
                            <Trans i18nKey={'model.__index__'} values={{ index: index }} />
                          </option>
                        })}
                      </Form.Select>
                    </Form.Group>
                  </div>
                </Card.Header>
                <Card.Body>

                  <Plot ref={refPlotJS}
                        data={[...(() => {
                          const traceOriginal = {
                            x      : dataPlot.original.map((v) => v.x),
                            y      : dataPlot.original.map((v) => v.y),
                            name   : t('{{X_feature}} x {{target}}', { X_feature: dataPlot.column_name_X, target: dataPlot.column_name_Y }),
                            mode   : 'markers',
                            type   : 'scatter',
                            opacity: 1,
                            marker : {
                              color: 'blue'
                            }
                          }
                          const tracePredicted = {
                            x      : dataPlot.predicted.map((v) => v.x),
                            y      : dataPlot.predicted.map((v) => v.y),
                            name   : t('Predicted'),
                            mode   : 'lines+markers',
                            type   : 'scatter',
                            opacity: 0.5,
                            marker : {
                              color: 'forestgreen'
                            }
                          }
                          return [traceOriginal, tracePredicted]
                        })()]}
                        useResizeHandler={true}
                        style={PLOTLY_CONFIG_DEFAULT.STYLES}
                        layout={{
                          title: '',
                          ...PLOTLY_CONFIG_DEFAULT.LAYOUT
                        }}
                  />

                </Card.Body>
              </Card>
            </Col>
          </Row>
        }
      </Container>
    </>
  )
}