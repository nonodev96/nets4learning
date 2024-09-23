import { useRef } from 'react'
import { Trans } from 'react-i18next'
import { Button, Col, Form, Row } from 'react-bootstrap'
import * as dfd from 'danfojs'

import { VERBOSE } from '@/CONSTANTS'
import ModelReviewLinearRegressionPredictForm from './ModelReviewLinearRegressionPredictForm'
import LinearRegressionPredictionInfo from './LinearRegressionPredictionInfo'

export default function ModelReviewLinearRegressionPredict ({ dataset, model, dataframe }) {

  const prediction = useRef({
    dataframe      : new dfd.DataFrame(),
    input          : [],
    input_processed: [],
    result         : []
  })

  /**
   * 
   * @param {import('react').FormEvent<HTMLFormElement>} event 
   */
  function handleSubmit_Predict(event) {
    event.preventDefault()

    // TODO
    prediction.current = {
        dataframe      : [],
        input          : [],
        input_processed: [],
        result         : []
    }

  }

  if (VERBOSE) console.debug('ModelReviewLinearRegressionPredict')
  return (
    <Form onSubmit={handleSubmit_Predict}>

      <ModelReviewLinearRegressionPredictForm dataset={dataset}
                                              dataframe={dataframe} />
      
      <LinearRegressionPredictionInfo prediction={prediction.current} />

      <Row className={'mt-3'}>
        <Col>
          <div className={'d-grid gap-2'}>
            <Button variant={'primary'}
                    size={'lg'}
                    type={'submit'}>
              <Trans i18nKey={'Predict'} />
            </Button>
          </div>
        </Col>
      </Row>
      
    </Form>
  )
}