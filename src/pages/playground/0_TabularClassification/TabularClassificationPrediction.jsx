import React, { useEffect } from 'react'
import { Form, Button, Card, Row, Col } from 'react-bootstrap'
import { Trans, useTranslation } from 'react-i18next'
import { Bar } from 'react-chartjs-2'
import { UPLOAD } from '@/DATA_MODEL'
import { CHARTJS_CONFIG_DEFAULT } from '@/CONSTANTS_ChartsJs'
import { VERBOSE } from '@/CONSTANTS'
import TabularClassificationPredictionDynamicForm from '@pages/playground/0_TabularClassification/TabularClassificationPredictionDynamicForm'

export default function TabularClassificationPrediction ({
  dataset_JSON,
  dataset,
  stringToPredict = '',
  setStringToPredict,
  setObjectToPredict,
  predictionBar,
  generatedModels,
  handleSubmit_PredictVector,
}) {

  const { t } = useTranslation()
  const prefix = 'pages.playground.generator.dynamic-form-dataset.'
  const bar_options = {
    responsive: true,
    plugins   : {
      legend: {
        position: 'top',
        display : false,
      },
      title : {
        display: true,
        text   : t('prediction'),
      },
    },
  }

  useEffect(() => {
    const rowDefault = dataset_JSON.data[0]
    const defaultString = rowDefault.slice(0, -1).join(';')
    setStringToPredict(defaultString)

    dataset_JSON.attributes.forEach((att) => {
      setObjectToPredict(oldState => ({
        ...oldState,
        [att.name]: rowDefault[att.index_column],
      }))
    })
  }, [dataset_JSON, setStringToPredict, setObjectToPredict])

  const handleChange_ROW = (e) => {
    let row_index = parseInt(e.target.value)
    setStringToPredict(dataset_JSON.data[row_index].slice(0, -1).join(';'))

    dataset_JSON.attributes.forEach((att) => {
      setObjectToPredict(oldState => ({
        ...oldState,
        [att.name]: dataset_JSON.data[row_index][att?.index_column],
      }))

      document.getElementById('FormControl_' + att.index_column).value =
        dataset_JSON.data[row_index][att?.index_column]
    })
  }

  if (VERBOSE) console.debug('Render TabularClassificationPrediction')
  return <>
    <Card>
      <Card.Header className={'d-flex align-items-center'}>
        <h3><Trans i18nKey={prefix + 'title'} /></h3>
        <div className={'ms-3'}>
          {generatedModels.length !== 0 && <>
          <Form.Group controlId={'DATA'}>
            {/*<Form.Label>Carga una fila del dataset</Form.Label>*/}
            <Form.Select aria-label={t(prefix + 'title')}
                         size={'sm'}
                         onChange={(e) => handleChange_ROW(e)}>
              {dataset_JSON.data.map((row, index) => {
                return <option key={'option_' + index} value={index}>Id row: {index.toString().padStart(3, '0')} - Target: {row.slice(-1)}</option>
              })}
            </Form.Select>
          </Form.Group>
        </>}
        </div>
      </Card.Header>
      <Card.Body>

        {generatedModels.length === 0 && <>
          <p className="placeholder-glow">
            <small className={'text-muted'}>{t('pages.playground.generator.waiting-for-models')}</small>
            <span className="placeholder col-12"></span>
          </p>
        </>}


        {(generatedModels.length > 0 && generatedModels >= 0) && <>
          <Form onSubmit={(e) => handleSubmit_PredictVector(e)}>
            <Card.Text>
              <Trans i18nKey={prefix + 'text-0'} /><br />
              <b>({dataset_JSON.attributes.map(att => att.name).join(', ')}).</b>
            </Card.Text>
            <Row>
              <TabularClassificationPredictionDynamicForm dataset_JSON={dataset_JSON}
                                                          stringToPredict={stringToPredict}
                                                          setStringToPredict={setStringToPredict}
                                                          setObjectToPredict={setObjectToPredict} />
            </Row>
            <Form.Group className="mb-3" controlId={'formTestInput'}>
              <Form.Label><Trans i18nKey={prefix + 'test-vector'} /></Form.Label>
              <Form.Control placeholder={t(prefix + 'input-vector')}
                            disabled={true}
                            value={stringToPredict}
                            onChange={(e) => setStringToPredict(e.target.value)} />
            </Form.Group>

            {/* SUBMIT BUTTON */}
            <div className="d-grid gap-2">
              <Button type={'submit'}
                      size={'lg'}
                      variant="primary">
                <Trans i18nKey={'predict'} />
              </Button>
            </div>
            {dataset === UPLOAD && <>
              <hr />
              <Row>
                <Col>
                  <ul start="0">
                    {predictionBar
                        .list_encoded_classes
                        .map((item, index) => <li key={index}>{item}</li>)
                    }
                  </ul>
                </Col>
              </Row>
            </>}
            <Bar options={bar_options}
                 data={{
                   labels  : [...predictionBar.labels],
                   datasets: [
                     {
                       label          : t('prediction'),
                       data           : [...predictionBar.data],
                       backgroundColor: CHARTJS_CONFIG_DEFAULT.BACKGROUND_COLOR,
                       borderColor    : CHARTJS_CONFIG_DEFAULT.BORDER_COLOR,
                       borderWidth    : 1,
                     },
                   ],
                 }} />
          </Form>
        </>}
      </Card.Body>
    </Card>

  </>
}