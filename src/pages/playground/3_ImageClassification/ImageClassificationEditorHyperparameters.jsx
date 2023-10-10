import React from 'react'
import { Card, Form } from 'react-bootstrap'
import { Trans, useTranslation } from 'react-i18next'
import { TYPE_LOSSES, TYPE_METRICS, TYPE_OPTIMIZER } from '@core/nn-utils/ArchitectureTypesHelper'
import { VERBOSE } from '@/CONSTANTS'
import {
  DEFAULT_NUMBER_EPOCHS,
  DEFAULT_LEARNING_RATE,
  DEFAULT_ID_OPTIMIZATION,
  DEFAULT_ID_LOSS,
  DEFAULT_ID_METRICS, DEFAULT_TEST_SIZE,
} from './CONSTANTS'
import { Link } from 'react-router-dom'

export default function ImageClassificationEditorHyperparameters (props) {
  const {
    setIdOptimizer,
    setIdLoss,
    setIdMetrics,
    setNumberEpochs,
    setLearningRate,
    setTestSize,
  } = props

  const prefix = 'pages.playground.generator.general-parameters.'
  const { t } = useTranslation()

  // region PARÁMETROS GENERALES
  const handleChange_LearningRate = (e) => {
    setLearningRate(parseInt(e.target.value))
  }
  const handleChange_NumberEpochs = (e) => {
    setNumberEpochs(parseInt(e.target.value))
  }
  const handleChange_TestSize = (e) => {
    setTestSize(parseInt(e.target.value))
  }
  const handleChange_Loss = (e) => {
    setIdLoss(e.target.value)
  }
  const handleChange_Optimization = (e) => {
    setIdOptimizer(e.target.value)
  }
  const handleChange_Metrics = (e) => {
    setIdMetrics(e.target.value)
  }
  // endregion

  if (VERBOSE) console.debug('render ImageClassificationEditorHyperparameters')
  return <>
    <Card className={'sticky-top joyride-step-7-editor-trainer'} style={{ zIndex: 10 }}>
      <Card.Header><h3><Trans i18nKey={prefix + 'title'} /></h3></Card.Header>
      <Card.Body>
        {/* LEARNING RATE */}
        <Form.Group className="mb-3" controlId="formTrainRate">
          <Form.Label><Trans i18nKey={prefix + 'learning-rate'} /></Form.Label>
          <Form.Control type="number"
                        placeholder={t('learning-rate-placeholder')}
                        defaultValue={DEFAULT_LEARNING_RATE}
                        onChange={(e) => handleChange_LearningRate(e)} />
          <Form.Text className="text-muted">
            <Trans i18nKey={prefix + 'learning-rate-info'} />
          </Form.Text>
        </Form.Group>

        {/* NUMBER OF EPOCHS */}
        <Form.Group className="mb-3" controlId="FormNumberOfEpochs">
          <Form.Label><Trans i18nKey={prefix + 'number-of-epochs'} /></Form.Label>
          <Form.Control type="number"
                        placeholder={t('number-of-epochs-placeholder')}
                        defaultValue={DEFAULT_NUMBER_EPOCHS}
                        onChange={(e) => handleChange_NumberEpochs(e)}
          />
          <Form.Text className="text-muted">
            <Trans i18nKey={prefix + 'number-of-epochs-info'} />
          </Form.Text>
        </Form.Group>

        {/* TEST SIZE */}
        <Form.Group className="mb-3" controlId="FormTestSize">
          <Form.Label><Trans i18nKey={prefix + 'test-size'} /></Form.Label>
          <Form.Control type="number"
                        placeholder={t('test-size-placeholder')}
                        defaultValue={DEFAULT_TEST_SIZE}
                        onChange={(e) => handleChange_TestSize(e)}
          />
          <Form.Text className="text-muted">
            <Trans i18nKey={prefix + 'test-size-info'} />
          </Form.Text>
        </Form.Group>

        {/* OPTIMIZATION FUNCTION */}
        <Form.Group className="mb-3" controlId="FormOptimizer">
          <Form.Label><Trans i18nKey={prefix + 'optimizer-id'} /></Form.Label>
          <Form.Select aria-label={t(prefix + 'optimizer-id-info')}
                       defaultValue={DEFAULT_ID_OPTIMIZATION}
                       onChange={handleChange_Optimization}>
            {TYPE_OPTIMIZER.map(({ key, label }, _index) => {
              return (<option key={_index} value={key}>{label}</option>)
            })}
          </Form.Select>
          <Form.Text className="text-muted">
            <Trans i18nKey={prefix + 'optimizer-id-info'} />
          </Form.Text>
        </Form.Group>
        {/* LOSS FUNCTION */}
        <Form.Group className="mb-3" controlId="FormLoss">
          <Form.Label><Trans i18nKey={prefix + 'loss-id'} /></Form.Label>
          <Form.Select aria-label={t(prefix + 'loss-id-info')}
                       defaultValue={DEFAULT_ID_LOSS}
                       onChange={handleChange_Loss}>
            <optgroup label={'Losses'}>
              {TYPE_LOSSES.map(({ key, label }, index) => {
                return (<option key={index} value={'losses-' + key}>{label}</option>)
              })}
            </optgroup>
            <optgroup label={'Metrics'}>
              {TYPE_METRICS.map(({ key, label }, index) => {
                return (<option key={index} value={'metrics-' + key}>{label}</option>)
              })}
            </optgroup>
          </Form.Select>
          <Form.Text className="text-muted">
            <Trans i18nKey={prefix + 'loss-id-info'} />
          </Form.Text>
        </Form.Group>

        {/* METRICS FUNCTION */}
        <Form.Group className="mb-3" controlId="FormMetrics">
          <Form.Label><Trans i18nKey={prefix + 'metrics-id'} /></Form.Label>
          <Form.Select aria-label={t(prefix + 'metrics-id-info')}
                       defaultValue={DEFAULT_ID_METRICS}
                       onChange={(e) => handleChange_Metrics(e)}>
            {TYPE_METRICS.map(({ key, label }, _index) => {
              return (<option key={_index} value={key}>{label}</option>)
            })}
          </Form.Select>
          <Form.Text className="text-muted">
            <Trans i18nKey={prefix + 'metrics-id-info'} />
          </Form.Text>
        </Form.Group>
      </Card.Body>
      <Card.Footer className={'d-flex justify-content-end'}>
        <p className={'text-muted mb-0 pb-0'}>
          <Trans i18nKey={'more-information-in-link'}
                 components={{
                   link1: <Link to={{ pathname: '/manual/', state: { action: 'open-hyperparameters-editor-image-classification' } }}
                                className={'text-info'} />
                 }} />
        </p>
      </Card.Footer>
    </Card>
  </>
}