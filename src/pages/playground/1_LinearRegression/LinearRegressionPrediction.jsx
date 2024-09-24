import React, { useContext, useEffect, useState } from 'react'
import { Button, Card, Col, Row, Form } from 'react-bootstrap'
import { Trans, useTranslation } from 'react-i18next'

import * as dfd from  'danfojs'
import * as tfjs from  '@tensorflow/tfjs'

import { DEFAULT_SELECTOR_INSTANCE, DEFAULT_SELECTOR_MODEL, VERBOSE } from '@/CONSTANTS'
import N4LSummary from '@components/summary/N4LSummary'
import WaitingPlaceholder from '@components/loading/WaitingPlaceholder'

import LinearRegressionContext from '@context/LinearRegressionContext'
import LinearRegressionPredictionForm from '@pages/playground/1_LinearRegression/LinearRegressionPredictionForm'
import LinearRegressionPredictionInfo from '@pages/playground/1_LinearRegression/LinearRegressionPredictionInfo'
import { TRANSFORM_DATASET_PROCESSED_TO_STATE_PREDICTION } from './utils'

export default function LinearRegressionPrediction() {
  const prefix = 'pages.playground.1-linear-regression.predict.'
  const { t } = useTranslation()

  const {
    prediction,
    setPrediction,

    listModels,
    setListModels,
  } = useContext(LinearRegressionContext)

  const [showPrediction, setShowPrediction] = useState(false)
  
  /**
   * @type {ReturnType<typeof useState<string|number>>}
   */
  const [indexInstance, setIndexInstance] = useState(DEFAULT_SELECTOR_INSTANCE)

  // ESTE DEBE CAMBIAR EL DATAFRAME escalando y procesando los datos para predecir
  // TODO
  const handleSubmit_Predict = async (e) => {
    e.preventDefault()

    const vector = prediction.input_3_dataframe_scaling.values[0]
    // @ts-ignore
    const tensor = tfjs.tensor2d([vector])
    const result = listModels.data[listModels.index].model.predict(tensor).dataSync()
    
    setPrediction((prevState) => ({
      ...prevState,
      result: result
    }))
    
  }

  const handleChange_Model_Index = (e) => {
    setListModels((prevState) => ({
      ...prevState,
      index: parseInt(e.target.value)
    }))
  }

  const handleChange_Instance_Index = (e) => {
    e.preventDefault()
    const _indexInstance = parseInt(e.target.value)
    setIndexInstance(_indexInstance)

    const dataset_processed = listModels.data[listModels.index].dataset_processed
    const newPredictionState = TRANSFORM_DATASET_PROCESSED_TO_STATE_PREDICTION(dataset_processed, _indexInstance)
    
    setPrediction((prevState) => ({
      ...prevState,
      input_0_raw                : newPredictionState.input_0_raw,
      input_1_dataframe_original : newPredictionState.input_1_dataframe_original,
      input_1_dataframe_processed: newPredictionState.input_1_dataframe_processed,
      input_2_dataframe_encoding : newPredictionState.input_2_dataframe_encoding,
      input_3_dataframe_scaling  : newPredictionState.input_3_dataframe_scaling,
    }))
  }

  useEffect(() => {
    setShowPrediction((listModels.data.length > 0 && listModels.index !== DEFAULT_SELECTOR_MODEL && listModels.index >= 0))
  }, [listModels, listModels.data, listModels.index, setShowPrediction])

  useEffect(() => {
    console.log(prediction)
  }, [prediction])

  if (VERBOSE) console.debug('render LinearRegressionPrediction')
  return <>
    <Card>
      <Card.Header className={'d-flex align-items-center justify-content-between'}>
        <h2><Trans i18nKey={prefix + 'title'} /></h2>
        <div className="d-flex">
          <div>
            <Form.Group controlId={'instance-selector'}>
              <Form.Select aria-label={'instance-selector'}
                           size={'sm'}
                           defaultValue={indexInstance}
                           disabled={!showPrediction}
                           onChange={(e) => handleChange_Instance_Index(e)}>
                <option disabled={true} value={DEFAULT_SELECTOR_INSTANCE}><Trans i18nKey={prefix + 'list-instances'} /></option>
                <>
                  {showPrediction && <>
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
          <div className={'ms-3'}>
            <Form.Group controlId={'model-selector'}>
              <Form.Select aria-label={'model-selector'}
                           size={'sm'}
                           data-value={listModels.index}
                           value={listModels.index}
                           disabled={!showPrediction}
                           onChange={(e) => handleChange_Model_Index(e)}
              >
                <option disabled={true} value={DEFAULT_SELECTOR_MODEL}><Trans i18nKey={prefix + 'list-models'} /></option>
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
            
            <LinearRegressionPredictionForm generatedModel={listModels.data[listModels.index]} />

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
