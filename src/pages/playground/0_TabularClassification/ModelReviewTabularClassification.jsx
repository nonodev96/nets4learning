import React, { useState, useEffect } from 'react'
import ReactGA from 'react-ga4'
import { Button, Card, Col, Container, Form, Row, ProgressBar } from 'react-bootstrap'
import { Trans, useTranslation } from 'react-i18next'
import * as tfjs from '@tensorflow/tfjs'

import DragAndDrop from '@components/dragAndDrop/DragAndDrop'

import {
  UPLOAD, LIST_MODELS_TABULAR_CLASSIFICATION,
} from '@/DATA_MODEL'
import alertHelper from '@utils/alertHelper'
import I_MODEL_TABULAR_CLASSIFICATION from './models/_model'
import { CONSOLE_LOG_h3, VERBOSE } from '@/CONSTANTS'
import { MAP_TC_MODEL } from '@pages/playground/0_TabularClassification/models'
import ModelReviewTabularClassificationDatasetTable from '@pages/playground/0_TabularClassification/ModelReviewTabularClassificationDatasetTable'
import ModelReviewTabularClassificationDatasetInfo from '@pages/playground/0_TabularClassification/ModelReviewTabularClassificationDatasetInfo'
import ModelReviewTabularClassificationPredict from '@pages/playground/0_TabularClassification/ModelReviewTabularClassificationPredict'
import ModelReviewTabularClassificationDynamicForm from '@pages/playground/0_TabularClassification/ModelReviewTabularClassificationDynamicForm'

export default function ModelReviewTabularClassification (props) {
  const { dataset } = props

  const prefix = 'pages.playground.0-tabular-classification'
  const { t } = useTranslation()

  const [iModelInstance, setIModelInstance] = useState(new I_MODEL_TABULAR_CLASSIFICATION(t))
  const [model, setModel] = useState(null)

  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)

  const [textToTest, setTextToTest] = useState('')
  const [isButtonDisabled, setIsButtonDisabled] = useState(true)
  const [dataToTest, setDataToTest] = useState({})
  const [filesUpload, setFilesUpload] = useState(true)
  const [prediction, setPrediction] = useState({ labels: [], data: [] })

  const [files, setFiles] = useState({
    binary: null, json: null, csv: null,
  })

  const [tableHead, setTableHead] = useState([])
  const [tableBody, setTableBody] = useState([])

  useEffect(() => {
    console.log('useEffect [progress]')
    const interval = setInterval(() => {
      if (progress < 90) {
        setProgress(progress + 1)
      } else {
        clearInterval(interval)
      }
    }, 50)
    return () => clearInterval(interval)
  }, [progress])

  async function init () {
    const isValid = LIST_MODELS_TABULAR_CLASSIFICATION.some((e) => e === dataset)
    if (!isValid) {
      await alertHelper.alertError('Error en la selección del modelo')
      return
    }
    if (dataset === UPLOAD) {
      await alertHelper.alertError(t('alert.error.dataset-not-valid'))
      return
    }
    const _iModelClass = MAP_TC_MODEL[dataset]

    if (_iModelClass) {
      const _iModelInstance = new _iModelClass(t)

      const _tableHead = _iModelInstance.TABLE_HEADER
      const _tableBody = _iModelInstance.DATA
      setTableHead(_tableHead)
      setTableBody(_tableBody)

      try {
        setDataToTest(_iModelInstance.DATA_DEFAULT)
        setTextToTest(Object.values(_iModelInstance.DATA_DEFAULT).join(';'))
        const _loadedModel = await _iModelInstance.loadModel()

        setIsLoading(false)
        setIModelInstance(_iModelInstance)
        setModel(_loadedModel)
        setIsButtonDisabled(false)
        console.log(`%cLoad model ${_iModelClass.KEY}`, CONSOLE_LOG_h3)
        await alertHelper.alertSuccess(t('model-loaded-successfully'))
      } catch (e) {
        console.error('Error, can\'t load model', { e })
      }
    } else {
      console.error('Error, model not valid')
    }
  }

  useEffect(() => {
    ReactGA.send({ hitType: 'pageview', page: `/ModelReviewTabularClassification/${dataset}`, title: dataset })
    init().then(r => {
      console.log('init end')
    })
  }, [])

  const handleChange_TestInput = () => {
    setTextToTest(document.getElementById(`formTestInput`).value)
  }

  const handleClick_LoadModel = async () => {
    // TODO
    // necesita ser mejorado
    if (files.json === null || files.binary === null) {
      await alertHelper.alertError(`Debes subir los ficheros JSON y binario`)
      return
    }
    try {
      const loadedModel = await tfjs.loadLayersModel(tfjs.io.browserFiles([files.json, files.binary]))
      setModel(loadedModel)
      setIsLoading(false)
      setIsButtonDisabled(false)
      await alertHelper.alertSuccess(t('model-loaded-successfully'))
    } catch (error) {
      console.error(error)
    }
  }

  const handleSubmit_PredictVector = async (e) => {
    e.preventDefault()
    setIsButtonDisabled(true)
    if (textToTest === undefined || textToTest.length < 1) {
      await alertHelper.alertInfo(t('info.insert-input'))
      setIsButtonDisabled(false)
      return
    }
    if (dataset === UPLOAD) {
      await alertHelper.alertError(t('alert.error.dataset-not-valid'))
      return
    }

    try {
      const array = textToTest.split(';')
      const input = [[], [1, array.length]]
      for (let index = 0; index < array.length; index++) {
        input[0].push(await iModelInstance.function_v_input(array[index], index, iModelInstance.DATA_OBJECT_KEYS[index]))
      }
      const tensor = tfjs.tensor2d(input[0], input[1])
      const model_prediction = model.predict(tensor)
      const model_prediction_data = model_prediction.dataSync()
      const prediction = {
        labels: iModelInstance.CLASSES, data: Array.from(model_prediction_data).map((item) => item.toFixed(4)),
      }
      setPrediction(prediction)
    } catch (error) {
      console.error(error)
      await alertHelper.alertError(error)
    }

    setIsButtonDisabled(false)
  }

  const handleFileUpload_JSON = (uploadedFiles) => {
    setFiles((prevState) => {
      return {
        ...prevState, json: new File([uploadedFiles[0]], uploadedFiles[0].name, { type: uploadedFiles[0].type })
      }
    })
    setFilesUpload(files.json === null || files.binary === null)
  }

  const handleFileUpload_Binary = (uploadedFiles) => {
    setFiles((prevState) => {
      return {
        ...prevState, binary: new File([uploadedFiles[0]], uploadedFiles[0].name, { type: uploadedFiles[0].type })
      }
    })
    setFilesUpload(files.json === null || files.binary === null)
  }

  const handleFileUpload_CSV = (uploadedFiles) => {
    setFiles((prevState) => {
      return {
        ...prevState, csv: new File([uploadedFiles[0]], uploadedFiles[0].name, { type: uploadedFiles[0].type })
      }
    })
    const reader = new FileReader()
    reader.readAsText(files.csv)

    reader.onload = function ($event) {
      const csv = $event.target.result
      const lines = csv.split('\n')
      const _head = lines[0].split(',')
      const _body = []
      for (let row_i = 1; row_i < lines.length; row_i++) {
        const new_row = []
        const row = lines[row_i].split(',')
        for (let col_i = 0; col_i < row.length; col_i++) {
          new_row.push(row[col_i])
        }
        _body.push(new_row)
      }

      setTableHead(_head)
      setTableBody(_body)
    }
  }

  const setExample = (example) => {
    console.log(example)
    setDataToTest(example)
    setTextToTest(Object.values(example).join(';'))
  }

  const handleChange_Example = (e) => {
    const example = JSON.parse(e.target.value)
    setExample(example)
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
            <Card.Header>
              <h3><Trans i18nKey={'pages.playground.0-tabular-classification.general.model'} /></h3>
            </Card.Header>
            <Card.Body>
              <Card.Title>
                <Trans i18nKey={iModelInstance?.TITLE ?? 'pages.playground.0-tabular-classification.0_upload.upload'} />
              </Card.Title>

              {dataset === UPLOAD ? <>
                <Card.Subtitle className="mb-3 text-muted">
                  <Trans i18nKey={'pages.playground.0-tabular-classification.0_upload.upload-your-model'} />
                </Card.Subtitle>
                <Card.Text>
                  <Trans i18nKey={'pages.playground.0-tabular-classification.0_upload.upload-your-model-description'} />
                </Card.Text>
                <Row>
                  <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                    <DragAndDrop name={'json'}
                                 id={'json-upload'}
                                 accept={{ 'application/json': ['.json'] }}
                                 text={t('drag-and-drop.json')}
                                 labelFiles={t('drag-and-drop.label-files-one')}
                                 function_DropAccepted={handleFileUpload_JSON}
                    />
                  </Col>
                  <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                    <DragAndDrop name={'bin'}
                                 id={'weights-upload'}
                                 accept={{ 'application/octet-stream': ['.bin'] }}
                                 text={t('drag-and-drop.binary')}
                                 labelFiles={t('drag-and-drop.label-files-one')}
                                 function_DropAccepted={handleFileUpload_Binary}
                    />
                  </Col>
                  <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                    <div className="d-grid gap-2">
                      <Button variant={'primary'} size={'lg'} type={'button'} disabled={filesUpload} onClick={handleClick_LoadModel}>
                        <Trans i18nKey={''} />
                      </Button>
                    </div>
                  </Col>
                  <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12} className={'mt-3'}>
                    <DragAndDrop name={'csv'}
                                 id={'dataset-upload'}
                                 accept={{ 'text/csv': ['.csv'] }}
                                 text={t('drag-and-drop.csv')}
                                 labelFiles={t('drag-and-drop.label-files-one')}
                                 function_DropAccepted={handleFileUpload_CSV}
                    />
                  </Col>
                </Row>
              </> : <>{iModelInstance.DESCRIPTION()}</>}
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} sm={12} md={12} xl={9} xxl={9}>

          <ModelReviewTabularClassificationDatasetTable tableHead={tableHead}
                                                        tableBody={tableBody} />

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
                                                             dataToTest={dataToTest}
                                                             setDataToTest={setDataToTest}
                                                             textToTest={textToTest}
                                                             setTextToTest={setTextToTest}
                />
                <Row className={'mt-3'}>
                  <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                    <Form.Group controlId={`formTestInput`}>
                      <Form.Label>
                        <Trans i18nKey={'pages.playground.0-tabular-classification.general.description-input'} />
                      </Form.Label>
                      <Form.Control size={'sm'}
                                    disabled={true}
                                    defaultValue={textToTest}
                                    onChange={handleChange_TestInput} />
                      <Form.Text className="text-muted">
                        <Trans i18nKey={'pages.playground.form.vector-to-check'} />
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>
                <Row className={'mt-3'}>
                  <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                    <div className="d-grid gap-2">
                      <Button variant={'primary'}
                              size={'lg'}
                              type={'submit'}
                              disabled={isButtonDisabled}>
                        <Trans i18nKey={'pages.playground.form.button-check-result'} />
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>

          <ModelReviewTabularClassificationPredict prediction={prediction} />
        </Col>
      </Row>
    </Container>
  </>)
}

