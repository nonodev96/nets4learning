import React, { useEffect } from 'react'
import { Form, Button, Card, Row, Col } from 'react-bootstrap'
import { Trans, useTranslation } from 'react-i18next'
import { Bar } from 'react-chartjs-2'
import { UPLOAD } from '@/DATA_MODEL'
import { CHARTJS_CONFIG_DEFAULT } from '@/CONSTANTS_ChartsJs'
import { VERBOSE } from '@/CONSTANTS'
import TabularClassificationPredictionDynamicForm from '@pages/playground/0_TabularClassification/TabularClassificationPredictionDynamicForm'

export default function TabularClassificationPrediction ({
  dataset,
  datasets,
  datasetIndex,

  dataProcessed,
  predictionBar,
  generatedModels,

  Model,
  setModel,

  generatedModelsIndex,
  setGeneratedModelsIndex,

  stringToPredict = '',
  setStringToPredict,

  setObjectToPredict,

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
    if (datasets[datasetIndex]?.data?.length > 0) {
      const rowDefault = datasets[datasetIndex].data[0]
      const defaultString = rowDefault.slice(0, -1).join(';')
      setStringToPredict(defaultString)

      datasets[datasetIndex].attributes.forEach((att) => {
        setObjectToPredict(oldState => ({
          ...oldState,
          [att.name]: rowDefault[att.index_column],
        }))
      })
    }
  }, [datasets, datasetIndex, setStringToPredict, setObjectToPredict])

  const handleChange_ROW = (e) => {
    let row_index = parseInt(e.target.value)
    setStringToPredict(datasets[datasetIndex].data[row_index].slice(0, -1).join(';'))

    datasets[datasetIndex].attributes.forEach((att) => {
      setObjectToPredict(oldState => ({
        ...oldState,
        [att.name]: datasets[datasetIndex].data[row_index][att?.index_column],
      }))

      document.getElementById('FormControl_' + att.index_column).value =
        datasets[datasetIndex].data[row_index][att?.index_column]
    })
  }
  const handleChange_Model = (e) => {
    const index = e.target.value
    setModel(generatedModels[index].model)
    setGeneratedModelsIndex(index)
  }

  const canRender_PredictDynamicForm = () => {
    if (dataset === UPLOAD) {
      return (datasets[datasetIndex] || dataProcessed) && Model
    } else {
      return (datasets[datasetIndex]) && Model
    }
  }

  if (VERBOSE) console.debug('render TabularClassificationPrediction')
  return <>
    <Card>
      <Card.Header className={'d-flex align-items-center justify-content-between'}>
        <h3><Trans i18nKey={prefix + 'title'} /> {generatedModelsIndex !== -1 && <>| <Trans i18nKey={'model.__index__'} values={{ index: generatedModelsIndex }} /></>}</h3>
        <div className={'d-flex'}>
          {(generatedModels.length !== 0 && datasets[datasetIndex]?.data?.length > 0) && <>
            <Form.Group controlId={'DATA'} className={'joyride-step-select-instance'}>
              <Form.Select aria-label={t(prefix + 'selector-entity')}
                           size={'sm'}
                           onChange={(e) => handleChange_ROW(e)}>
                {datasets[datasetIndex].data.map((row, index) => {
                  return <option key={'option_' + index} value={index}>
                    Id row: {index.toString().padStart(3, '0')} - Target: {row.slice(-1)}
                  </option>
                })}
              </Form.Select>
            </Form.Group>
          </>}
          {generatedModels.length !== 0 && <>
            <Form.Group controlId={'MODEL'} className={'ms-3'}>
              <Form.Select aria-label={t(prefix + 'selector-model joyride-step-select-model')}
                           size={'sm'}
                           onChange={(e) => handleChange_Model(e)}>
                {generatedModels.map((row, index) => {
                  return <option key={'option_' + index} value={index}>
                    <Trans i18nKey={'model.__index__'} values={{ index: index }} />
                  </option>
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


        {(canRender_PredictDynamicForm()) && <>
          <Form onSubmit={(e) => handleSubmit_PredictVector(e)}>
            <Card.Text>
              <Trans i18nKey={prefix + 'text-0'} /><br />
              <b>({datasets[datasetIndex].attributes.map(att => att.name).join(', ')}).</b>
            </Card.Text>
            <Row>
              <TabularClassificationPredictionDynamicForm datasets={datasets}
                                                          datasetIndex={datasetIndex}
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
            <hr />
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