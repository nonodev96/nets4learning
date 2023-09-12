import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { Trans, useTranslation } from 'react-i18next'
import { Card, Col, Container, Row, Form } from 'react-bootstrap'
import ReactGA from 'react-ga4'
import * as dfd from 'danfojs'
import * as tfjs from '@tensorflow/tfjs'

import {
  MODEL_1_SALARY,
  MODEL_2_AUTO_MPG,
  MODEL_3_BOSTON_HOUSING,
  MODEL_4_BREAST_CANCER,
  MODEL_5_STUDENT_PERFORMANCE,
  MODEL_6_WINE,
} from '@/DATA_MODEL'
import { VERBOSE } from '@/CONSTANTS'

import DataFrameDatasetCard from '@components/dataframe/DataFrameDatasetCard'
import DataFrameDescribeCard from '@components/dataframe/DataFrameDescribeCard'
import LinearRegressionModelController_Simple from '@core/LinearRegressionModelController_Simple'

export default function ModelReviewLinearRegression ({ dataset }) {
  const { id } = useParams()

  const prefix = ''
  const { t } = useTranslation()

  const [iModel, setIModel] = useState(null)

  const [datasets, setDatasets] = useState([])
  const [datasets_Index, setDatasets_Index] = useState(0)
  const [datasets_DataFrame, setDatasets_DataFrame] = useState(new dfd.DataFrame())

  const [listModels, setListModels] = useState([])
  const [listModels_Index, setListModels_Index] = useState('select-model')
  const [listModels_Model, setListModels_Model] = useState(null)

  useEffect(() => {
    ReactGA.send({ hitType: 'pageview', page: '/ModelReviewLinearRegression/' + dataset, title: dataset, })
  }, [dataset])

  useEffect(() => {
    // const dataset_ID = parseInt(dataset)
    // const dataset_key = getKeyDatasetByID_LinearRegression(dataset_ID)
    const modelClasses = {
      [MODEL_1_SALARY.KEY]             : MODEL_1_SALARY,
      [MODEL_2_AUTO_MPG.KEY]           : MODEL_2_AUTO_MPG,
      [MODEL_3_BOSTON_HOUSING.KEY]     : MODEL_3_BOSTON_HOUSING,
      [MODEL_4_BREAST_CANCER.KEY]      : MODEL_4_BREAST_CANCER,
      [MODEL_5_STUDENT_PERFORMANCE.KEY]: MODEL_5_STUDENT_PERFORMANCE,
      [MODEL_6_WINE.KEY]               : MODEL_6_WINE,
    }
    const selectedModelClass = modelClasses[dataset]
    if (selectedModelClass) {
      setIModel(new selectedModelClass(t, {}))
    } else {
      console.error('Error, incorrect model', dataset)
    }
  }, [dataset, t])

  useEffect(() => {
    async function init () {
      if (iModel !== null) {
        const _datasets = (await iModel.DATASETS()).datasets
        setDatasets(_datasets)

        const _listModels = (await iModel.MODELS())
        setListModels(_listModels)
      }
    }

    init().then(_r => undefined)
  }, [iModel])

  useEffect(() => {
    console.debug('useEffect[ listModels, listModels_Index ]')

    async function init () {
      if (listModels_Index !== 'select-model') {
        const { model_path, column_name_X, column_name_Y } = listModels[listModels_Index]
        const model = await tfjs.loadLayersModel(model_path)
        console.log('model', model)

        const _tensors = tfjs.tensor([0, 2, 4, 8, 16, 32, 64, 128, 256, 512])
        console.log('_tensors', _tensors)
        _tensors.print()

        const _predict = model.predict(_tensors)
        console.log('_predict', _predict)
        _predict.print()



        const linear = new LinearRegressionModelController_Simple(t)
        linear.setDataFrame(datasets_DataFrame)
        linear.setFeatures({ X_feature: column_name_X, y_target: column_name_Y, categorical: new Map() })

        const data = await linear.GetData()
        const normalizationTensorData = LinearRegressionModelController_Simple.ConvertToTensor(data, linear.config.features.X_feature, linear.config.features.y_target)
        console.log("normalizationTensorData", normalizationTensorData)



        const xs = tfjs.linspace(0, 1, 100)
        const preds = model.predict(xs.reshape([100, 1]))
        console.log('_preds', preds)
        preds.print()

        setListModels_Model(model)
      }
    }

    init().then(_r => undefined)
  }, [listModels, listModels_Index])

  useEffect(() => {
    console.debug('useEffect[datasets_Index]')
    if (datasets.length > 0) {
      setDatasets_DataFrame(datasets[datasets_Index].dataframe_processed)
    }
  }, [datasets, datasets_Index])

  const handleChange_Datasets_Index = (event) => {
    setDatasets_Index(parseInt(event.target.value))
  }

  const handleChange_ListModels_Index = async (event) => {
    setListModels_Index(parseInt(event.target.value))
  }

  if (VERBOSE) console.debug('render ModelReviewLinearRegression')
  return (
    <>
      <Container id={'ModelReviewLinearRegression'} data-testid="Test-ModelReviewLinearRegression">

        <Row className={'mt-3'}>
          <Col>
            <div className="d-flex justify-content-between">
              <h1><Trans i18nKey={'modality.' + id} /></h1>
            </div>
          </Col>
        </Row>

        {iModel !== null &&
          <Row>
            <Col xs={12} sm={12} md={12} xl={3} xxl={3}>
              <Card className={'sticky-top border-info mt-3'}>
                <Card.Header>
                  <h3><Trans i18nKey={iModel.i18n_TITLE} /></h3>
                </Card.Header>
                <Card.Body>
                  <Form.Group className="mb-3" controlId="FormSelectDatasetOption">
                    <Form.Label><Trans i18nKey={prefix + 'form.select-dataset.title'} /></Form.Label>
                    <Form.Select aria-label="form.select-dataset.title"
                                 value={datasets_Index}
                                 onChange={handleChange_Datasets_Index}>
                      {datasets.map(({ csv }, index) => {
                        return (<option key={index} value={index}>{csv}</option>)
                      })}
                    </Form.Select>
                    <Form.Text className="text-muted">
                      <Trans i18nKey={prefix + 'form.select-dataset.info'} />
                    </Form.Text>
                  </Form.Group>

                  {iModel.DESCRIPTION()}

                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} sm={12} md={12} xl={9} xxl={9}>

              <DataFrameDatasetCard dataframe={datasets_DataFrame} />

              <DataFrameDescribeCard dataframe={datasets_DataFrame} />

              <Card className={'mt-3'}>
                <Card.Header className={'d-flex justify-content-between'}>
                  <h3><Trans i18nKey={prefix + 'model-selector.title'} /></h3>
                  <div className="d-flex">
                    <Form.Group controlId={'FormModelSelector_X'}>
                      <Form.Select onChange={handleChange_ListModels_Index}
                                   aria-label={'plot'}
                                   size={'sm'}
                                   value={listModels_Index}>
                        <option value={'select-model'} disabled={true}><Trans i18nKey={'Select model'} /></option>
                        {listModels.map((value, index) => {
                          return <option key={index} value={index}>
                            <Trans i18nKey={'model.' + index} values={{ index: index }} />
                          </option>
                        })}
                      </Form.Select>
                    </Form.Group>
                  </div>
                </Card.Header>
                <Card.Body>

                  {JSON.stringify(listModels)}

                </Card.Body>
              </Card>
            </Col>
          </Row>
        }
      </Container>
    </>
  )
}