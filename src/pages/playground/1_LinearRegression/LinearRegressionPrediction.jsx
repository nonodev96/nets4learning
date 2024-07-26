import React, { useContext, useEffect, useRef, useState } from 'react'
import { Button, Card, Col, Row, Form } from 'react-bootstrap'
import { Trans, useTranslation } from 'react-i18next'
import Plot from 'react-plotly.js'

import { VERBOSE } from '@/CONSTANTS'
import { PLOTLY_CONFIG_DEFAULT } from '@/CONSTANTS_ChartsJs'
import N4LSummary from '@components/summary/N4LSummary'
import WaitingPlaceholder from '@components/loading/WaitingPlaceholder'

import LinearRegressionContext from '@context/LinearRegressionContext'
import LinearRegressionPredictionDynamicForm from '@pages/playground/1_LinearRegression/LinearRegressionPredictionDynamicForm'

export default function LinearRegressionPrediction() {
  const prefix = 'pages.playground.1-linear-regression.predict.'
  const { t } = useTranslation()

  const { listModels } = useContext(LinearRegressionContext)

  const [indexModel, setIndexModel] = useState(-1)
  const [dataPrediction, setDataPrediction] = useState([])
  const [dynamicObject, setDynamicObject] = useState({})
  const [showPrediction, setShowPrediction] = useState(false)
  /**
   * @type {ReturnType<typeof useState<string|number>>}
   */
  const [indexInstance, setIndexInstance] = useState('__disabled__')
  const refPlotJS = useRef()

  const handleChange_DynamicObject = (e) => {
    const _new_value = e.target.value
    const _column_name = e.target.getAttribute('data-column_name')
    setDynamicObject((prevState) => {
      return {
        ...prevState,
        [_column_name]: _new_value,
      }
    })
  }

  // TODO
  const handleSubmit_Predict = async (e) => {
    e.preventDefault()
    // const tensor = tfjs.tensor1d([165]).reshape([100, 1])
    // console.log(listModels[indexModel].model.predict(tensor).dataSync())
  }

  const handleChange_Model = (e) => {
    setIndexModel(e.target.value)
  }

  const handleChange_Instance = (e) => {
    const index = e.target.value
    setIndexInstance(index)
    const _dynamic_object = listModels[indexModel]
    .dataframe
    .columns
      .reduce((o, column_name) => {
        let new_value = listModels[indexModel].dataframe[column_name].values[index]
        return Object.assign(o, { [column_name]: new_value })
      }, {})
    setDynamicObject(_dynamic_object)
  }

  useEffect(() => {
    if (VERBOSE) console.debug('useEffect [listModels.length]')
    setIndexModel(listModels.length - 1)
  }, [listModels.length])

  useEffect(() => {
    if (VERBOSE) console.debug('useEffect [listModels, indexModel]')
    if (listModels.length > 0 && indexModel >= 0) {
      // listModels[indexModel]
      //   .dataframe
      //   .describe()
      //   .T
      //   .plot(idDataFrameDescribe)
      //   .table({ config: TABLE_PLOT_STYLE_CONFIG })

      const _dynamic_object = listModels[indexModel]
        .dataframe
        .columns
        .reduce((o, column_name) => {
          let new_value = listModels[indexModel].dataframe[column_name].values[0]
          return Object.assign(o, { [column_name]: new_value })
        }, {})
      setDynamicObject(_dynamic_object)
    }
  }, [listModels, indexModel])

  useEffect(() => {
    setShowPrediction((listModels.length > 0 && indexModel >= 0))
  }, [listModels, indexModel, setShowPrediction])

  useEffect(() => {
    if (VERBOSE) console.debug('useEffect [listModels, indexModel, setDataPrediction]')
    if (listModels.length > 0 && indexModel >= 0 && listModels[indexModel]) {
      const {
        original,
        predicted,
        params_features,
        /* predictedLinear */
      } = listModels[indexModel]
      const { X_feature, Y_target: y_target } = params_features
      const trace = {
        x      : original.map((v) => v.x),
        y      : original.map((v) => v.y),
        name   : t('{{X_feature}} x {{target}}', { X_feature, target: y_target }),
        mode   : 'markers',
        type   : 'scatter',
        opacity: 1,
        marker : {
          color: 'blue',
        },
      }
      const rTrace = {
        x      : predicted.map((v) => v.x),
        y      : predicted.map((v) => v.y),
        name   : t('Predicted'),
        mode   : 'lines+markers',
        type   : 'scatter',
        opacity: 0.5,
        marker : {
          color: 'forestgreen',
        },
      }
      // const lrTrace = {
      //   x      : predictedLinear.map((v) => v.x),
      //   y      : predictedLinear.map((v) => v.y),
      //   name   : t('Predicted linear'),
      //   mode   : 'lines+markers',
      //   type   : 'scatter',
      //   opacity: 0.5,
      //   marker : {
      //     color: 'orange'
      //   }
      // }
      setDataPrediction([trace, rTrace])
    }
  }, [listModels, indexModel, setDataPrediction, t])

  if (VERBOSE) console.debug('render LinearRegressionPrediction')
  return <>
    <Card>
      <Card.Header className={'d-flex align-items-center justify-content-between'}>
        <h2><Trans i18nKey={prefix + 'title'} /></h2>
        <div className="d-flex">
          <div className={'ms-3'}>
            <Form.Group controlId={'model-selector'}>
              <Form.Select
                aria-label={'model-selector'}
                size={'sm'}
                value={indexModel}
                disabled={!showPrediction}
                onChange={(e) => handleChange_Model(e)}>
                <option disabled={true} value="__disabled__"><Trans i18nKey={prefix + 'list-models-generated'} /></option>
                <>
                  {listModels
                    .map((_, index) => {
                      return <option key={index} value={index}>
                        <Trans i18nKey={'model.__index__'}
                          values={{ index: index + 1 }} />
                      </option>
                    })}
                </>
              </Form.Select>
            </Form.Group>
          </div>
          <div className={'ms-3'}>
            <Form.Group controlId={'dataframe-selector-value'}>
              <Form.Select 
                aria-label={'dataframe-selector-value'}
                size={'sm'}
                disabled={!showPrediction}
                value={indexInstance}
                onChange={(e) => handleChange_Instance(e)}>
                <option disabled={true} value="__disabled__"><Trans i18nKey={prefix + 'list-instances'} /></option>
                {listModels.length > 0 && indexModel >= 0 && <>
                  {Array(listModels[indexModel].dataframe.values.length)
                    .fill(0)
                    .map((value, index) => {
                      return <option key={index} value={index}>
                        <Trans i18nKey={prefix + 'instance.__index__'}
                          values={{ index: index + 1 }} />
                      </option>
                    })}
                </>}
              </Form.Select>
            </Form.Group>
          </div>
        </div>
      </Card.Header>
      <Card.Body>
        {!showPrediction && <>
          <WaitingPlaceholder title={'pages.playground.generator.waiting-for-models'} />
        </>}
        {showPrediction && <>
          <Row>
            <N4LSummary title={t('Features')}>
              <Card.Text><strong>X</strong> {listModels[indexModel]?.params_features.X_features ?? []}</Card.Text>
              <Card.Text><strong>X</strong> {listModels[indexModel]?.params_features.X_feature ?? ''}</Card.Text>
              <Card.Text><strong>Y</strong> {listModels[indexModel]?.params_features.Y_target ?? ''}</Card.Text>
            </N4LSummary>
          </Row>
          <hr />
          <Form onSubmit={handleSubmit_Predict}>
            <Row xs={6} sm={6} md={4} lg={4} xl={4} xxl={6}>
              <LinearRegressionPredictionDynamicForm 
                generatedModel={listModels[indexModel]}
                dynamicObject={dynamicObject}
                handleChange_DynamicObject={handleChange_DynamicObject}
              />
            </Row>
            <Row>
              <div className="d-grid gap-2">
                <Button 
                  variant={'primary'}
                  size={'lg'}
                  type={'submit'}>
                  <Trans i18nKey={prefix + 'button-submit'} />
                </Button>
              </div>
            </Row>
            <Row>
              <Col>
                <Plot 
                  ref={refPlotJS}
                  data={dataPrediction}
                  useResizeHandler={true}
                  style={PLOTLY_CONFIG_DEFAULT.STYLES}
                  layout={{
                    title: '',
                    ...PLOTLY_CONFIG_DEFAULT.LAYOUT,
                  }}
                />
              </Col>
            </Row>
          </Form>
        </>}
      </Card.Body>
    </Card>
  </>
}
