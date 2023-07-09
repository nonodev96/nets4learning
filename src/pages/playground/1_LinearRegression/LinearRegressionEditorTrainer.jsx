import { Accordion, Button, Card, Form } from 'react-bootstrap'
import { Trans, useTranslation } from 'react-i18next'
import React, { useContext } from 'react'
import alertHelper from '@utils/alertHelper'
import { TYPE_LOSSES, TYPE_METRICS, TYPE_OPTIMIZER } from '@core/nn-utils/ArchitectureTypesHelper'
import LinearRegressionContext from '@context/LinearRegressionContext'

export default function LinearRegressionEditorTrainer () {

  // 1 - Inf(1000)
  const DEFAULT_NUMBER_OF_EPOCHS = 10
  // 0 - 1 --> 0 - 100
  const DEFAULT_LEARNING_RATE = 1
  // 0 - 1 --> 0 - 100
  const DEFAULT_TEST_SIZE = 10
  // TYPE_OPTIMIZER.key
  const DEFAULT_OPTIMIZER = 'rmsprop'
  // TYPE_LOSSES.key
  const DEFAULT_LOSS = 'meanSquaredError'
  // TYPE_METRICS.key
  // const DEFAULT_METRIC = "meanSquaredError"

  const prefix = 'pages.playground.generator.general-parameters.'
  const { t } = useTranslation()
  const { tmpModel, setTmpModel } = useContext(LinearRegressionContext)

  // 1 - 100
  const handlerChange_TestSize = (_test_size) => {
    change_params_training('test_size', _test_size)
  }

  // 1 - 100
  const handlerChange_LearningRate = (_learning_rate) => {
    change_params_training('learning_rate', _learning_rate)
  }

  // 1 - Inf(1000)
  const handlerChange_NumberOfEpochs = (_number_of_epochs) => {
    change_params_training('n_of_epochs', _number_of_epochs)
  }

  const handlerChange_IdOptimizer = (_id_optimizer) => {
    change_params_training('id_optimizer', _id_optimizer)
  }
  const handlerChange_IdLoss = (_id_loss) => {
    change_params_training('id_loss', _id_loss)
  }
  const handlerClick_RemoveMetric = async (index) => {
    const new_list_id_metrics = [...tmpModel.params_training.list_id_metrics]
    if (new_list_id_metrics.length > 1) {
      new_list_id_metrics.splice(index, 1)
      change_params_training('list_id_metrics', new_list_id_metrics)
    } else {
      await alertHelper.alertWarning(t('error.metrics-length'))
    }
  }

  const handleChange_Metric = (_index, _value) => {
    tmpModel.params_training.list_id_metrics[_index] = _value
    change_params_training('list_id_metrics', [...tmpModel.params_training.list_id_metrics])
  }

  const handlerClick_AddMetric_Start = () => {
    const new_metric = 'meanSquaredError'
    change_params_training('list_id_metrics', [...tmpModel.params_training.list_id_metrics, new_metric])
  }

  const change_params_training = (_key, _value) => {
    setTmpModel({
      ...tmpModel,
      params_training: {
        ...tmpModel.params_training,
        [_key]: _value
      }
    })
  }

  console.debug('render LinearRegressionEditorTrainer')
  return <>
    <Card>
      <Card.Header className={'d-flex align-items-center justify-content-between'}>
        <h3><Trans i18nKey={prefix + 'title'} /></h3>
        <div className={'d-flex'}>
          <Button size={'sm'}
                  variant={'outline-primary'}
                  onClick={handlerClick_AddMetric_Start}>
            <Trans i18nKey={prefix + 'add-metric'} />
          </Button>
        </div>
      </Card.Header>
      <Card.Body>

        <Form.Group className="mb-3" controlId="formTrainer-LearningRate">
          <Form.Label>
            <Trans i18nKey={prefix + 'learning-rate'} />
          </Form.Label>
          <Form.Control type="number"
                        min={1} max={100} step={1}
                        placeholder={t(prefix + 'learning-rate-placeholder')}
                        defaultValue={DEFAULT_LEARNING_RATE}
                        onChange={(e) => {
                          const value = parseInt(e.target.value)
                          const isValidNumber = !isNaN(value) && value >= 0 && value <= 100
                          handlerChange_LearningRate(isValidNumber ? value : 1)
                        }} />
          <Form.Text className="text-muted">
            <Trans i18nKey={prefix + 'learning-rate-info'} />
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formTrainer_n_of_epochs">
          <Form.Label>
            <Trans i18nKey={prefix + 'number-of-epochs'} />
          </Form.Label>
          <Form.Control type="number"
                        min={1} max={1000} step={1}
                        placeholder={t(prefix + 'number-of-epochs-placeholder')}
                        defaultValue={DEFAULT_NUMBER_OF_EPOCHS}
                        onChange={(e) => {
                          const value = parseInt(e.target.value)
                          const isValidNumber = !isNaN(value) && value >= 0 && value <= 1000
                          handlerChange_NumberOfEpochs(isValidNumber ? value : 1)
                        }} />
          <Form.Text className="text-muted">
            <Trans i18nKey={prefix + 'number-of-epochs-info'} />
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formTrainer_train_rate">
          <Form.Label>
            <Trans i18nKey={prefix + 'train-rate'} />
          </Form.Label>
          <Form.Control type="number"
                        min={1} max={100} step={1}
                        placeholder={t(prefix + 'train-rate-placeholder')}
                        defaultValue={DEFAULT_TEST_SIZE}
                        onChange={(e) => {
                          const value = parseInt(e.target.value)
                          const isValidNumber = !isNaN(value) && value >= 0 && value <= 100
                          handlerChange_TestSize(isValidNumber ? value : 1)
                        }} />
          <Form.Text className="text-muted">
            <Trans i18nKey={prefix + 'train-rate-info'} />
          </Form.Text>
        </Form.Group>

        <hr />

        <Form.Group className="m3-3" controlId={'formIdOptimizer'}>
          <Form.Label>
            <Trans i18nKey={prefix + 'optimizer-id'} />
          </Form.Label>
          <Form.Select aria-label={t(prefix + 'optimizer-id')}
                       defaultValue={DEFAULT_OPTIMIZER}
                       onChange={(e) => handlerChange_IdOptimizer(e.target.value)}>
            {TYPE_OPTIMIZER.map(({ key, label }, index) => {
              return (<option key={index} value={key}>{label}</option>)
            })}
          </Form.Select>
          <Form.Text className="text-muted">
            <Trans i18nKey={prefix + 'optimizer-id-info'} />
          </Form.Text>
        </Form.Group>

        <hr />

        <Form.Group className="m3-3" controlId={'formIdLoss'}>
          <Form.Label>
            <Trans i18nKey={prefix + 'loss-id'} />
          </Form.Label>
          <Form.Select aria-label={t(prefix + 'optimizer-id-info')}
                       defaultValue={DEFAULT_LOSS}
                       onChange={(e) => handlerChange_IdLoss(e.target.value)}>
            {TYPE_LOSSES.map(({ key, label }, index) => {
              return (<option key={index} value={key}>{label}</option>)
            })}
          </Form.Select>
          <Form.Text className="text-muted">
            <Trans i18nKey={prefix + 'loss-id-info'} />
          </Form.Text>
        </Form.Group>

        <hr />

        <Accordion className={'mt-2'}>
          {tmpModel.params_training.list_id_metrics.map((metric, index) => {
            return <Accordion.Item key={index} eventKey={index.toString()}>
              <Accordion.Header>
                Metrics {index + 1}
              </Accordion.Header>
              <Accordion.Body>
                <div className="d-grid gap-2">
                  <Button onClick={() => handlerClick_RemoveMetric(index)}
                          variant={'outline-danger'}>
                    <Trans i18nKey={prefix + 'delete-layer'} values={{ index: index + 1 }} />
                  </Button>
                </div>

                <Form.Group className="m3-3" controlId={'formMetric_' + index}>
                  <Form.Label>
                    <Trans i18nKey={prefix + 'metric-id-select'} />
                  </Form.Label>
                  <Form.Select aria-label={t(prefix + 'metric-id-info')}
                               value={metric}
                               onChange={(e) => handleChange_Metric(index, e.target.value)}>
                    {TYPE_METRICS.map(({ key, label }, index) => {
                      return (<option key={index} value={key}>{label}</option>)
                    })}
                  </Form.Select>
                  <Form.Text className="text-muted">
                    <Trans i18nKey={prefix + 'metric-id-info'} />
                  </Form.Text>
                </Form.Group>
              </Accordion.Body>
            </Accordion.Item>
          })}

        </Accordion>
      </Card.Body>
    </Card>
  </>
}