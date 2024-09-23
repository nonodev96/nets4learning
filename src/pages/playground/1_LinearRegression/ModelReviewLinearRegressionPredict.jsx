import { Button, Col, Form, Row } from 'react-bootstrap'
import ModelReviewLinearRegressionPredictForm from './ModelReviewLinearRegressionPredictForm'
import LinearRegressionPredictionInfo from './LinearRegressionPredictionInfo'
import { Trans } from 'react-i18next'
import { useState } from 'react'

export default function ModelReviewLinearRegressionPredict ({ model, dataframe }) {

  const [prediction, setPrediction] = useState({
    input          : [],
    input_processed: [],
    result         : []
  })

  /**
   * 
   * @param {import('react').FormEvent<HTMLFormElement>} event 
   */
  function handleSubmit_PredictVector(event) {
    event.preventDefault()

    // TODO
    setPrediction((_prevState) => {
      return {
        input          : [],
        input_processed: [],
        result         : []
      }
    })

  }

  return (
    <Form onSubmit={handleSubmit_PredictVector}>

      <ModelReviewLinearRegressionPredictForm dataframe={dataframe} />
      
      <LinearRegressionPredictionInfo prediction={prediction} />

      <Row className={'mt-3'}>
        <Col>
          <div className={'d-grid gap-2'}>
            <Button variant={'primary'}
                    size={'lg'}
                    type={'submit'}>
              <Trans i18nKey={'button-check-result'} />
            </Button>
          </div>
        </Col>
      </Row>
      
    </Form>
  )
}