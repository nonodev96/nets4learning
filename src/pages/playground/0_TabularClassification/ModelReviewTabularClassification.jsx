import React, { useState, useEffect } from 'react'
import ReactGA from 'react-ga4'
import { Button, Card, Col, Container, Form, Row, ProgressBar } from 'react-bootstrap'
import { Trans, useTranslation } from 'react-i18next'
import * as tfjs from '@tensorflow/tfjs'
import * as tfvis from '@tensorflow/tfjs-vis'

import {
  LIST_MODELS_TABULAR_CLASSIFICATION,
} from '@/DATA_MODEL'
import alertHelper from '@utils/alertHelper'
import I_MODEL_TABULAR_CLASSIFICATION from './models/_model'
import { VERBOSE } from '@/CONSTANTS'
import { MAP_TC_CLASSES } from '@pages/playground/0_TabularClassification/models'
import ModelReviewTabularClassificationDatasetTable from '@pages/playground/0_TabularClassification/ModelReviewTabularClassificationDatasetTable'
import ModelReviewTabularClassificationDatasetInfo from '@pages/playground/0_TabularClassification/ModelReviewTabularClassificationDatasetInfo'
import ModelReviewTabularClassificationPredict from '@pages/playground/0_TabularClassification/ModelReviewTabularClassificationPredict'
import ModelReviewTabularClassificationDynamicForm from '@pages/playground/0_TabularClassification/ModelReviewTabularClassificationDynamicForm'
import * as DataFrameUtils from '@core/dataframe/DataFrameUtils'

export default function ModelReviewTabularClassification (props) {
  const { dataset } = props

  //const prefix = 'pages.playground.0-tabular-classification'
  const { t } = useTranslation()

  const [iModelInstance, setIModelInstance] = useState(new I_MODEL_TABULAR_CLASSIFICATION(t))
  const [model, setModel] = useState(null)

  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)

  const [isButtonToPredictDisabled, setIsButtonToPredictDisabled] = useState(true)

  // Datos a predecir crudos
  const [dataToPredict, setDataToPredict] = useState({})
  // Datos a predecir después de codificar
  const [vectorToPredict, setVectorToPredict] = useState([])

  const [prediction, setPrediction] = useState({ labels: [], data: [] })

  const handleChange_onProgress = (fraction) => {
    setProgress(fraction * 100)
  }
  useEffect(() => {
    console.debug('useEffect []')
    return () => {
      tfvis.visor().close()
    }
  }, [])

  useEffect(() => {
    console.debug('useEffect [dataToPredict]')
    // TODO encoders to dataToPredict
    const init = async () => {
      const datasets = await iModelInstance.DATASETS()
      if (datasets.length === 0) return
      const _vectorValuesEncoders = DataFrameUtils.DataFrameApplyEncoders(datasets[0].encoders, dataToPredict, iModelInstance.DATA_DEFAULT_KEYS)
      setVectorToPredict(_vectorValuesEncoders)
    }
    init().then()
  }, [dataToPredict])

  useEffect(() => {
    ReactGA.send({ hitType: 'pageview', page: `/ModelReviewTabularClassification/${dataset}`, title: dataset })

    async function init () {
      const isValid = LIST_MODELS_TABULAR_CLASSIFICATION.some((e) => e === dataset)
      if (!isValid) {
        await alertHelper.alertError('Error en la selección del modelo')
        return
      }

      if (MAP_TC_CLASSES.hasOwnProperty(dataset)) {
        const _iModelClass = MAP_TC_CLASSES[dataset]

        try {
          const _iModelInstance = new _iModelClass(t)
          setDataToPredict(_iModelInstance.DATA_DEFAULT)

          const _datasets = await _iModelInstance.DATASETS()
          const _applyEncoders = DataFrameUtils.DataFrameApplyEncoders(
            _datasets[0].encoders,
            _iModelInstance.DATA_DEFAULT,
            _iModelInstance.DATA_DEFAULT_KEYS,
          )
          setVectorToPredict(_applyEncoders)

          const _loadedModel = await _iModelInstance.LOAD_LAYERS_MODEL({ onProgress: handleChange_onProgress })
          setIsLoading(false)

          setIModelInstance(_iModelInstance)
          setModel(_loadedModel)
          setIsButtonToPredictDisabled(false)
          await alertHelper.alertSuccess(t('model-loaded-successfully'))
        } catch (e) {
          console.error(`Error, can't load model`, { e })
        }
      } else {
        console.error('Error, model not valid')
      }
    }

    init().then((_r) => {
      console.log('init end')
    })
  }, [dataset, t])

  const handleSubmit_PredictVector = async (e) => {
    e.preventDefault()
    setIsButtonToPredictDisabled(true)
    if (vectorToPredict === undefined || vectorToPredict.length < 1) {
      await alertHelper.alertInfo(t('info.insert-input'))
      setIsButtonToPredictDisabled(false)
      return
    }

    try {
      const input = [vectorToPredict, [1, vectorToPredict.length]]
      const tensor = tfjs.tensor2d(input[0], input[1])
      const model_prediction = model.predict(tensor)
      const model_prediction_data = model_prediction.dataSync()
      const _prediction = {
        labels: iModelInstance.CLASSES,
        data  : Array.from(model_prediction_data).map((item) => item.toFixed(4)),
      }
      setPrediction(_prediction)
    } catch (error) {
      console.error(error)
      await alertHelper.alertError(error)
    }

    setIsButtonToPredictDisabled(false)
  }

  const setExample = (example) => {
    setDataToPredict(example)
  }

  const handleChange_Example = (e) => {
    const example = JSON.parse(e.target.value)
    setExample(example)
  }

  const handleClick_openSummary = async () => {
    if (model === null) {
      console.log('Error, model is null')
      return
    }
    console.log('tfvis')
    if (!tfvis.visor().isOpen()) {
      await tfvis.show.modelSummary({ name: 'Model Summary' }, model)
      tfvis.visor().open()
    } else {
      tfvis.visor().close()
    }
  }

  if (VERBOSE) console.debug('render ModelReviewTabularClassification')
  return (<>
    <Container>
      <Row className={'mt-2'}>
        <Col xl={12}>
          <div className="d-flex justify-content-between">
            <h1><Trans i18nKey={`modality.0`} /></h1>
          </div>
        </Col>
      </Row>
    </Container>

    <Container id={'ModelReviewTabularClassification'} data-testid={'Test-ModelReviewTabularClassification'}>
      <Row>
        <Col>
          {isLoading &&
            <ProgressBar label={progress < 100 ? t('downloading') : t('downloaded')}
                         striped={true}
                         animated={true}
                         now={progress} />}
        </Col>
      </Row>
      <Row>
        <Col xs={12} sm={12} md={12} xl={3} xxl={3}>
          <Card className={'sticky-top mt-3 border-info'} style={{ zIndex: 0 }}>
            <Card.Header className={'d-flex align-items-center justify-content-between'}>
              <h3><Trans i18nKey={'pages.playground.0-tabular-classification.general.model'} /></h3>
              <div className="d-flex">
                <Button size={'sm'}
                        variant={'outline-info'}
                        onClick={handleClick_openSummary}>Summary</Button>
              </div>
            </Card.Header>
            <Card.Body>
              <Card.Title>
                <Trans i18nKey={iModelInstance?.TITLE ?? 'loading'} />
              </Card.Title>
              {iModelInstance.DESCRIPTION()}

            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} sm={12} md={12} xl={9} xxl={9}>

          <ModelReviewTabularClassificationDatasetTable dataset={dataset}
                                                        iModelInstance={iModelInstance} />

          <ModelReviewTabularClassificationDatasetInfo dataset={dataset}
                                                       iModelInstance={iModelInstance} />

          <Card className={'mt-3'}>
            <Card.Header className={'d-flex align-items-center justify-content-between'}>
              <h3>
                <Trans i18nKey={'pages.playground.0-tabular-classification.general.description-features'} />
              </h3>
              <div className="d-flex">
                <Form.Group controlId={'plot'}>
                  <Form.Select aria-label={'example'}
                               size={'sm'}
                               onChange={(e) => handleChange_Example(e)}>
                    {iModelInstance.LIST_EXAMPLES.map((value, index) => {
                      return (<option key={'option_' + index} value={JSON.stringify(value)}>
                        <Trans i18nKey={'example-i'}
                               values={{ i: iModelInstance.LIST_EXAMPLES_RESULTS[index] }} />
                      </option>)
                    })}
                  </Form.Select>
                </Form.Group>
              </div>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit_PredictVector}>
                <ModelReviewTabularClassificationDynamicForm iModelInstance={iModelInstance}
                                                             dataToTest={dataToPredict}
                                                             setDataToTest={setDataToPredict}

                />
                <Row className={'mt-3'}>
                  <Col>
                    <Form.Group controlId={`formDataInput`}>
                      <Form.Label>
                        <Trans i18nKey={'pages.playground.0-tabular-classification.general.description-input'} />
                      </Form.Label>
                      <Form.Control size={'sm'}
                                    disabled={true}
                                    value={Object.values(dataToPredict).join(';')} />
                      <Form.Text className="text-muted">
                        <Trans i18nKey={'pages.playground.form.vector-to-check'} />
                      </Form.Text>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId={`formVectorInput`}>
                      <Form.Label>
                        <Trans i18nKey={'pages.playground.0-tabular-classification.general.description-input'} />
                      </Form.Label>
                      <Form.Control size={'sm'}
                                    disabled={true}
                                    value={vectorToPredict.join(';')} />
                      <Form.Text className="text-muted">
                        <Trans i18nKey={'pages.playground.form.vector-to-check'} />
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>
                {/*<Row><Col><pre>[[{vectorToPredict.join(',')}], [1, {vectorToPredict.length}]]</pre></Col></Row>*/}
                <Row className={'mt-3'}>
                  <Col>
                    <div className="d-grid gap-2">
                      <Button variant={'primary'}
                              size={'lg'}
                              type={'submit'}
                              disabled={isButtonToPredictDisabled}>
                        <Trans i18nKey={'pages.playground.form.button-check-result'} />
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>

          <ModelReviewTabularClassificationPredict iModelInstance={iModelInstance}
                                                   prediction={prediction} />
        </Col>
      </Row>
    </Container>
  </>)
}

