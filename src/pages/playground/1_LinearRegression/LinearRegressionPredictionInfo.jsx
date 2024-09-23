import { Row, Col, Form } from 'react-bootstrap'
import { Trans } from'react-i18next'

/**
 * 
 * @param {{input: any[], input_processed: any[], result: any[]}} param0 
 * @returns 
 */
export default function LinearRegressionPredictionInfo({ prediction }) {
  
  return <>
    <Row xs={3} sm={3} md={3} lg={3} xl={3} xxl={3}>
      <Col>
        <Form.Group controlId={'FormInputRaw'}>
          <Form.Label>
            <Trans i18nKey={'prediction-input'} />
          </Form.Label>
          <Form.Control size={'sm'}
                        disabled={true}
                        value={prediction.input.join(',')} />
          <Form.Text className={'text-muted'}>
            <Trans i18nKey={'prediction-input-description'} />
          </Form.Text>
        </Form.Group>
      </Col>
      <Col>
        <Form.Group controlId={'FormInputProcessed'}>
          <Form.Label>
            <Trans i18nKey={'prediction-input-processed'} />
          </Form.Label>
          <Form.Control size={'sm'}
                        disabled={true}
                        value={prediction.input_processed.join(',')} />
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
                        value={prediction.result.join(',')} />
          <Form.Text className={'text-muted'}>
            <Trans i18nKey={'prediction-result-description'} />
          </Form.Text>
        </Form.Group>
      </Col>
    </Row>
  </>
}