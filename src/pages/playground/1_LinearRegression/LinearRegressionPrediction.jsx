import React, { useContext, useEffect, useState } from 'react'
import { Button, Card, Col, Row, Form } from 'react-bootstrap'
import { Trans, useTranslation } from 'react-i18next'

import * as dfd from  'danfojs'
import * as tfjs from  '@tensorflow/tfjs'

import { VERBOSE } from '@/CONSTANTS'
import N4LSummary from '@components/summary/N4LSummary'
import WaitingPlaceholder from '@components/loading/WaitingPlaceholder'

import LinearRegressionContext from '@context/LinearRegressionContext'
import LinearRegressionPredictionForm from '@pages/playground/1_LinearRegression/LinearRegressionPredictionForm'
import LinearRegressionPredictionInfo from '@pages/playground/1_LinearRegression/LinearRegressionPredictionInfo'

export default function LinearRegressionPrediction({dataFrameToPredict, setDataFrameToPredict}) {
  const prefix = 'pages.playground.1-linear-regression.predict.'
  const { t } = useTranslation()

  const {
    listModels,
    setListModels,
  } = useContext(LinearRegressionContext)

  // const [dynamicObject, setDynamicObject] = useState({})
  const [showPrediction, setShowPrediction] = useState(false)
  
  /**
   * @type {ReturnType<typeof useState<{input: (number|string)[], input_processed: number[], result: number[]}>>}
   */
  const [prediction, setPrediction] = useState({
    input          : [],
    input_processed: [],
    result         : []
  })
  /**
   * @type {ReturnType<typeof useState<string|number>>}
   */
  const [indexInstance, setIndexInstance] = useState('__disabled__')

  // ESTE DEBE CAMBIAR EL DATAFRAME 
  const handleChange_InstanceToPredict = (e, _column_name) => {
    const _new_value = e.target.value

    const { dataset_processed } = listModels.data[listModels.index]
    console.log({ dataset_processed })
    // setDynamicObject((prevState) => {
    //   return {
    //     ...prevState,
    //     [_column_name]: _new_value,
    //   }
    // })
  }

  // ESTE DEBE CAMBIAR EL DATAFRAME escalando y procesando los datos para predecir
  // TODO
  const handleSubmit_Predict = async (e) => {
    e.preventDefault()

    // @ts-ignore
    const tensor = tfjs.tensor2d([prediction.input_processed])
    // @ts-ignore
    console.log(listModels.data[listModels.index].model.predict(tensor).dataSync())
  }

  const handleChange_Model = (e) => {
    setListModels(e.target.value)
  }

  const handleChange_Instance = (e) => {
    const instanceIndex = e.target.value
    setIndexInstance(instanceIndex)
    // const _dynamic_object = listModels.data[listModels.index]
    // .dataframe
    // .columns
    //   .reduce((o, column_name) => {
    //     let new_value = listModels.data[listModels.index].dataframe[column_name].values[instanceIndex]
    //     return Object.assign(o, { [column_name]: new_value })
    //   }, {})
    // setDynamicObject(_dynamic_object)
    
    const prediction_input = listModels.data[listModels.index].dataset_processed.data_processed.dataframe_X.values[instanceIndex]
    const prediction_input_processed = listModels.data[listModels.index].dataset_processed.data_processed.X.values[instanceIndex]
    setPrediction((prevState) => ({
      ...prevState,
      input          : prediction_input,
      input_processed: prediction_input_processed
    }))
  }

  useEffect(() => {
    if (VERBOSE) console.debug('useEffect [listModels, listModels.index]')
    if (listModels.length > 0 && listModels.index >= 0) {
      // listModels.data[listModels.index]
      //   .dataframe
      //   .describe()
      //   .T
      //   .plot(idDataFrameDescribe)
      //   .table({ config: TABLE_PLOT_STYLE_CONFIG })
      // const _dynamic_object = listModels.data[listModels.index]
      //   .dataframe
      //   .columns
      //   .reduce((o, column_name) => {
      //     let new_value = listModels.data[listModels.index].dataframe[column_name].values[0]
      //     return Object.assign(o, { [column_name]: new_value })
      //   }, {})
      // setDynamicObject(_dynamic_object)
    }
  }, [listModels, listModels.data, listModels.index])

  useEffect(() => {
    setShowPrediction((listModels.data.length > 0 && listModels.index >= 0))
  }, [listModels, listModels.data, listModels.index, setShowPrediction])

  useEffect(() => {
    if (VERBOSE) console.debug('useEffect [listModels, t]')
    if (listModels.data.length > 0 && listModels.index >= 0 && listModels.data[listModels.index]) {
      const { params_features } = listModels.data[listModels.index]
      console.log({params_features})
      // TODO
    }
  }, [listModels, t])

  if (VERBOSE) console.debug('render LinearRegressionPrediction')
  return <>
    <Card>
      <Card.Header className={'d-flex align-items-center justify-content-between'}>
        <h2><Trans i18nKey={prefix + 'title'} /></h2>
        <div className="d-flex">
          <div className={'ms-3'}>
            <Form.Group controlId={'model-selector'}>
              <Form.Select aria-label={'model-selector'}
                           size={'sm'}
                           defaultValue={listModels.index}
                           disabled={!showPrediction}
                           onChange={(e) => handleChange_Model(e)}
              >
                <option disabled={true} value="__disabled__"><Trans i18nKey={prefix + 'list-models-generated'} /></option>
                <>
                  {listModels
                    .data
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
            <Form.Group controlId={'instance-selector'}>
              <Form.Select aria-label={'instance-selector'}
                           size={'sm'}
                           defaultValue={indexInstance}
                           disabled={!showPrediction}
                           onChange={(e) => handleChange_Instance(e)}
              >
                <option disabled={true} value="__disabled__"><Trans i18nKey={prefix + 'list-instances'} /></option>
                <>
                  {listModels.data.length > 0 && listModels.index >= 0 && <>
                    {Array(listModels.data[listModels.index].dataset_processed.data_processed.dataframe_X.values.length)
                      .fill(0)
                      .map((value, index) => {
                        return <option key={index} value={index}>
                          <Trans i18nKey={prefix + 'instance.__index__'}
                            values={{ index: index + 1 }} />
                        </option>
                      })}
                  </>}
                </>
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
            <Col>
              <N4LSummary title={t('Features')}>
                <ol>
                {Array
                  .from(listModels.data[listModels.index]?.params_features.X_features ?? [])
                  .map((value, index) => {
                    return <li key={index}>{value}</li>
                  })
                }
                </ol>
              </N4LSummary>
            </Col>
            <Col>
              <N4LSummary title={t('Target')}>
                <ol>
                  <li>{listModels.data[listModels.index]?.params_features.Y_target}</li>
                </ol>
              </N4LSummary>
            </Col>
          </Row>
          <hr />
          <Form onSubmit={handleSubmit_Predict}>
            
            <LinearRegressionPredictionForm generatedModel={listModels.data[listModels.index]}
                                            handleChange_InstanceToPredict={handleChange_InstanceToPredict}
            />

            <LinearRegressionPredictionInfo prediction={prediction} />

            <Row className={'mt-3'}>
              <div className="d-grid gap-2">
                <Button variant={'primary'}
                        size={'lg'}
                        type={'submit'}>
                  <Trans i18nKey={prefix + 'button-submit'} />
                </Button>
              </div>
            </Row>
          </Form>
        </>}
      </Card.Body>
    </Card>
  </>
}
