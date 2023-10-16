import React from 'react'
import { Form, Button, Card, Row, Col } from 'react-bootstrap'
import { Trans, useTranslation } from 'react-i18next'
import { Bar } from 'react-chartjs-2'
import { UPLOAD } from '@/DATA_MODEL'
import { CHARTJS_CONFIG_DEFAULT } from '@/CONSTANTS_ChartsJs'
import { VERBOSE } from '@/CONSTANTS'
import TabularClassificationPredictionForm from '@pages/playground/0_TabularClassification/TabularClassificationPredictionForm'

export default function TabularClassificationPrediction (props) {
  const {
    dataset,
    /** @type DatasetProcessed_t[] */
    datasets,
    datasetIndex,

    generatedModels,
    generatedModelsIndex,
    setGeneratedModelsIndex,

    Model,
    setModel,

    inputDataToPredict,
    setInputDataToPredict,
    inputVectorToPredict,
    setInputVectorToPredict,

    predictionBar,

    handleSubmit_PredictVector,
  } = props

  const prefix = 'pages.playground.generator.dynamic-form-dataset.'
  const { t } = useTranslation()
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

  const handleChange_ROW = (e) => {
    let row_index = parseInt(e.target.value)
    const dataset_processed = datasets[datasetIndex]
    const { data_processed } = dataset_processed
    const { column_name_target } = data_processed
    const dataframe = dataset_processed.dataframe_original.drop({ columns: [column_name_target] })
    setInputDataToPredict(dataframe.$data[row_index])
  }

  const handleChange_Model = (e) => {
    const index = e.target.value
    setModel(generatedModels[index].model)
    setGeneratedModelsIndex(index)
  }

  const canRender_PredictDynamicForm = () => {
    if (datasets.length === 0) return false
    if (datasetIndex < 0) return false

    if (dataset === UPLOAD) {
      return (datasets[datasetIndex] || datasets[datasetIndex].is_dataset_processed) && Model
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
          {(generatedModels.length !== 0 && datasets[datasetIndex].is_dataset_processed) && <>
            <Form.Group controlId={'DATA'} className={'joyride-step-select-instance'}>
              <Form.Select aria-label={t(prefix + 'selector-entity')}
                           size={'sm'}
                           onChange={(e) => handleChange_ROW(e)}>
                {((() => {
                  const { dataframe_original, data_processed } = datasets[datasetIndex]
                  const { column_name_target } = data_processed
                  return dataframe_original[column_name_target].$data
                })())
                  .map((target, index) => {
                    return <option key={'option_' + index} value={index}>
                      Id: {index.toString().padStart(3, '0')} - Target: {target}
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
          <Form onSubmit={handleSubmit_PredictVector}>
            <Card.Text>
              <Trans i18nKey={prefix + 'text-0'} /><br />
              <b>({datasets[datasetIndex].data_processed.attributes.map(att => att.name).join(', ')}).</b>
            </Card.Text>
            <TabularClassificationPredictionForm datasets={datasets}
                                                 datasetIndex={datasetIndex}
                                                 inputDataToPredict={inputDataToPredict}
                                                 setInputDataToPredict={setInputDataToPredict}
                                                 inputVectorToPredict={inputVectorToPredict}
                                                 setInputVectorToPredict={setInputVectorToPredict}

            />

            {/* SUBMIT BUTTON */}
            <div className="d-grid gap-2">
              <Button type={'submit'}
                      size={'lg'}
                      variant="primary">
                <Trans i18nKey={'predict'} />
              </Button>
            </div>
            <hr />
            <Bar options={bar_options}
                 data={{
                   labels  : predictionBar.labels,
                   datasets: [
                     {
                       data           : predictionBar.data,
                       label          : t('prediction'),
                       backgroundColor: CHARTJS_CONFIG_DEFAULT.BACKGROUND_COLOR,
                       borderColor    : CHARTJS_CONFIG_DEFAULT.BORDER_COLOR,
                       borderWidth    : 1,
                     },
                   ],
                 }} />
          </Form>
        </>}
      </Card.Body>
      <Card.Footer>
        {dataset === UPLOAD && <>
          <Row>
            <Col>
              <ol start="0">
                {predictionBar
                  .labels
                  .map((item, index) => <li key={index}>{item}</li>)
                }
              </ol>
            </Col>
          </Row>
        </>}
      </Card.Footer>
    </Card>
  </>
}