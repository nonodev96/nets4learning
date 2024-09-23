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

export default function LinearRegressionPrediction() {
  const prefix = 'pages.playground.1-linear-regression.predict.'
  const { t } = useTranslation()

  const {
    predictionInstanceRef,

    prediction,
    setPrediction,

    listModels,
    setListModels,
  } = useContext(LinearRegressionContext)

  const [showPrediction, setShowPrediction] = useState(false)
  
  /**
   * @type {ReturnType<typeof useState<string|number>>}
   */
  const [indexInstance, setIndexInstance] = useState('__disabled__')

  // ESTE DEBE CAMBIAR EL DATAFRAME escalando y procesando los datos para predecir
  // TODO
  const handleSubmit_Predict = async (e) => {
    e.preventDefault()

    // @ts-ignore
    const tensor = tfjs.tensor2d([prediction.input_scaling])
    // @ts-ignore
    const result = listModels.data[listModels.index].model.predict(tensor).dataSync()
    
    console.log(result)
    setPrediction((prevState) => ({
      ...prevState,
      result: result
    }))
    
  }

  const handleChange_Model = (e) => {
    setListModels((prevState) => ({
      ...prevState,
      index: parseInt(e.target.value)
    }))
  }

  const handleChange_Row = (e) => {
    e.preventDefault()

    const _indexInstance = e.target.value
    setIndexInstance(_indexInstance)
    const dataset_processed = listModels.data[listModels.index].dataset_processed
    
    const dataframe_original = dataset_processed.dataframe_original.copy()
    const dataframe_processed = dataset_processed.dataframe_processed.copy()
    const dataframe_X = dataset_processed.data_processed.dataframe_X.copy()
    const X = dataset_processed.data_processed.X.copy()

    // Step 1 Los datos en crudo
    const prediction_input_raw = Array.from(dataframe_original.$data[_indexInstance])
    
    // Step 2 Los datos con el encoding, sin scaling y con target
    const _prediction_input_encoding = Array.from(dataframe_processed.$data[_indexInstance])
    
    // Step 3 Los datos con el encoding, sin scaling y sin target
    const prediction_input_encoding = Array.from(dataframe_X.$data[_indexInstance])
    // Step 3 Los datos con el encoding, con scaling y sin target
    const prediction_input_scaling = Array.from(X.$data[_indexInstance])

    // Step 4 Los datos para transformarlos (con el encoding, pero sin el scaling)
    // const size = dataframe_X.shape[1]
    const prediction_input = dataframe_X.$data[_indexInstance]

    // Con los datos escalados
    // const prediction_input_processed = dataset_processed.data_processed.scaler.transform(prediction_input)
    
    // Creamos estructura vacia pero con formato    
    const df_void = new dfd.DataFrame([], { 
      columns: dataframe_X.columns, 
      dtypes : dataframe_X.dtypes
    })
    // Insertamos los datos en el dataframe
    const new_df = df_void.append([prediction_input], [0])
    // Guardamos
    predictionInstanceRef.current.dataframe = new_df.copy()

    setPrediction((prevState)=>({
      ...prevState,
      input_raw     : prediction_input_raw,
      input         : prediction_input,
      input_encoding: prediction_input_encoding,
      input_scaling : prediction_input_scaling
    }))
  }

  useEffect(() => {
    setShowPrediction((listModels.data.length > 0 && listModels.index >= 0))
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
                           onChange={(e) => handleChange_Row(e)}
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
          <div className={'ms-3'}>
            <Form.Group controlId={'model-selector'}>
              <Form.Select aria-label={'model-selector'}
                           size={'sm'}
                           value={listModels.index}
                           disabled={!showPrediction}
                           onChange={(e) => handleChange_Model(e)}
              >
                <option disabled={true} value="__disabled__"><Trans i18nKey={prefix + 'list-models'} /></option>
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
