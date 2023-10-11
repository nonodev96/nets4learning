import React from 'react'
import { Link } from 'react-router-dom'
import { Trans, useTranslation } from 'react-i18next'
import { Card, Form } from 'react-bootstrap'
import { TYPE_LOSSES, TYPE_METRICS, TYPE_OPTIMIZER } from '@core/nn-utils/ArchitectureTypesHelper'
import { DEFAULT_ID_LOSS, DEFAULT_ID_METRICS, DEFAULT_ID_OPTIMIZATION, DEFAULT_LEARNING_RATE, DEFAULT_NUMBER_EPOCHS, DEFAULT_TEST_SIZE } from './CONSTANTS'
import { VERBOSE } from '@/CONSTANTS'

export default function TabularClassificationEditorHyperparameters (props) {

  const {
    setLearningRate,
    setNumberEpochs,
    setTestSize,
    setIdOptimizer,
    setIdLoss,
    setIdMetrics,
  } = props

  const prefix = ''
  const { t } = useTranslation()
  // region HYPERPARAMETERS

  // endregion
  if (VERBOSE) console.debug('render TabularClassificationEditorHyperparameters')
  return <>
    <Card className={'sticky-top'} style={{ zIndex: 10 }}>
      <Card.Header><h3><Trans i18nKey={prefix + 'general-parameters.title'} /></h3></Card.Header>
      <Card.Body>
        {/* LEARNING RATE */}
        <Form.Group className="mb-3" controlId="formLearningRate">
          <Form.Label>
            <Trans i18nKey={prefix + 'general-parameters.learning-rate'} />
          </Form.Label>
          <Form.Control type="number"
                        min={1} max={100}
                        placeholder={t(prefix + 'general-parameters.learning-rate-placeholder')}
                        defaultValue={DEFAULT_LEARNING_RATE}
                        onChange={(e) => setLearningRate(parseInt(e.target.value))} />
          <Form.Text className="text-muted">
            <Trans i18nKey={prefix + 'general-parameters.learning-rate-info'} />
          </Form.Text>
        </Form.Group>

        {/* Número OT ITERATIONS */}
        <Form.Group className="mb-3" controlId="FormNumberOfEpochs">
          <Form.Label>
            <Trans i18nKey={prefix + 'general-parameters.number-of-epochs'} />
          </Form.Label>
          <Form.Control type="number"
                        min={1} max={100}
                        placeholder={t(prefix + 'general-parameters.number-of-epochs')}
                        defaultValue={DEFAULT_NUMBER_EPOCHS}
                        onChange={(e) => setNumberEpochs(parseInt(e.target.value))} />
          <Form.Text className="text-muted">
            <Trans i18nKey={prefix + 'general-parameters.number-of-epochs-info'} />
          </Form.Text>
        </Form.Group>

        {/* TEST SIZE */}
        <Form.Group className="mb-3" controlId="formTrainRate">
          <Form.Label>
            <Trans i18nKey={prefix + 'general-parameters.train-rate'} />
          </Form.Label>
          <Form.Control type="number"
                        min={1} max={100}
                        placeholder={t(prefix + 'general-parameters.train-rate-placeholder')}
                        defaultValue={DEFAULT_TEST_SIZE}
                        onChange={(e) => setTestSize(parseInt(e.target.value))} />
          <Form.Text className="text-muted">
            <Trans i18nKey={prefix + 'general-parameters.train-rate-info'} />
          </Form.Text>
        </Form.Group>

        {/* OPTIMIZATION FUNCTION */}
        <Form.Group className="mb-3" controlId="FormOptimizer">
          <Form.Label>
            <Trans i18nKey={prefix + 'general-parameters.optimizer-id'} />
          </Form.Label>
          <Form.Select aria-label="Default select example"
                       defaultValue={DEFAULT_ID_OPTIMIZATION}
                       onChange={(e) => setIdOptimizer(e.target.value)}>
            {TYPE_OPTIMIZER.map(({ key, label }, index) => {
              return (<option key={index} value={key}>{label}</option>)
            })}
          </Form.Select>
          <Form.Text className="text-muted">
            <Trans i18nKey={prefix + 'general-parameters.optimizer-id-info'} />
          </Form.Text>
        </Form.Group>

        {/* LOSS FUNCTION */}
        <Form.Group className="mb-3" controlId="FormLoss">
          <Form.Label>
            <Trans i18nKey={prefix + 'general-parameters.loss-id'} />
          </Form.Label>
          <Form.Select aria-label="Selecciona la función de pérdida"
                       defaultValue={DEFAULT_ID_LOSS}
                       onChange={(e) => setIdLoss(e.target.value)}>
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
            <Trans i18nKey={prefix + 'general-parameters.loss-id-info'} />
          </Form.Text>
        </Form.Group>

        {/* METRICS FUNCTION */}
        <Form.Group className="mb-3" controlId="FormMetrics">
          <Form.Label>
            <Trans i18nKey={prefix + 'general-parameters.metrics-id'} />
          </Form.Label>
          <Form.Select aria-label="Selecciona la métrica"
                       defaultValue={DEFAULT_ID_METRICS}
                       disabled={true}
                       onChange={(e) => setIdMetrics(e.target.value)}>
            {TYPE_METRICS.map(({ key, label }, index) => {
              return (<option key={index} value={key}>{label}</option>)
            })}
          </Form.Select>
          <Form.Text className="text-muted">
            <Trans i18nKey={prefix + 'general-parameters.metrics-id-info'} />
          </Form.Text>
        </Form.Group>
      </Card.Body>
      <Card.Footer className={'d-flex justify-content-end'}>
        <p className={'text-muted mb-0 pb-0'}>
          <Trans i18nKey={'more-information-in-link'}
                 components={{
                   link1: <Link to={{ pathname: '/manual/', state: { action: 'open-hyperparameters-editor-tabular-classification' } }}
                                className={'text-info'}>link</Link>
                 }} />
        </p>
      </Card.Footer>
    </Card>
  </>
}