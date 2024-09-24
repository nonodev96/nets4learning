import styles from '@pages/playground/1_LinearRegression/LinearRegression.module.css'
import { Row, Col, Form } from 'react-bootstrap'
import { Trans } from'react-i18next'
import * as _Types from '@core/types'

/**
 * 
 * @param {{prediction: _Types.StatePrediction_t}} props 
 * @returns 
 */
export default function LinearRegressionPredictionInfo({ prediction }) {
  
  return <>
    <Row xs={2} sm={2} md={2} lg={2} xl={2} xxl={2}>
      <Col>
        <Form.Group controlId={'FormInputRaw'}>
          <Form.Label>
            <Trans i18nKey={'prediction-input'} />
          </Form.Label>
          <Form.Control size={'sm'}
                        disabled={true}
                        className={styles.border_blue}
                        value={prediction.input_1_dataframe_original.values[0].join(',')} />
          <Form.Text className={'text-muted'}>
            <Trans i18nKey={'prediction-input-description'} />
          </Form.Text>
        </Form.Group>
      </Col>
      <Col>
        <Form.Group controlId={'FormInputProcessed'}>
          <Form.Label>
            <Trans i18nKey={'prediction-input-encoding'} />
          </Form.Label>
          <Form.Control size={'sm'}
                        disabled={true}
                        className={styles.border_pink}
                        value={prediction.input_2_dataframe_encoding.values[0].join(',')} />
          <Form.Text className={'text-muted'}>
            <Trans i18nKey={'prediction-input-processed-description'} />
          </Form.Text>
        </Form.Group>
      </Col>
      <Col>
        <Form.Group controlId={'FormInputProcessed'}>
          <Form.Label>
            <Trans i18nKey={'prediction-input-scaling'} />
          </Form.Label>
          <Form.Control size={'sm'}
                        disabled={true}
                        className={styles.border_pink}
                        value={prediction.input_3_dataframe_scaling.values[0].join(',')} />
          <Form.Text className={'text-muted'}>
            <Trans i18nKey={'prediction-input-processed-description'} />
          </Form.Text>
        </Form.Group>
      </Col>
      <Col>
        <Form.Group controlId={'FormPredictionResult'}>
          <Form.Label>
            <Trans i18nKey={'prediction-result'} />
          </Form.Label>
          <Form.Control size={'sm'}
                        disabled={true}
                        className={styles.border_green}
                        value={prediction.result.join(',')} />
          <Form.Text className={'text-muted'}>
            <Trans i18nKey={'prediction-result-description'} />
          </Form.Text>
        </Form.Group>
      </Col>
    </Row>
  </>
}