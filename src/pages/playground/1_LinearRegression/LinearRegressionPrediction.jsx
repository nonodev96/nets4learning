import React, { useContext, useEffect, useRef, useState } from 'react'
import styles from './LinearRegression.module.css'
import { Button, Card, Col, Row, Form } from 'react-bootstrap'
import { Trans, useTranslation } from 'react-i18next'
import Plot from 'react-plotly.js'

import { PLOTLY_CONFIG_DEFAULT } from '@/CONSTANTS_ChartsJs'
import LinearRegressionContext from '@context/LinearRegressionContext'

// import * as LinearRegressionModelExample from '@core/LinearRegressionModelExample'
import DebugJSON from '@components/debug/DebugJSON'

export default function LinearRegressionPrediction () {
  const prefix = 'pages.playground.1-linear-regression.predict.'
  const { t, i18n } = useTranslation()

  const {
    listModels,

    datasetLocal
  } = useContext(LinearRegressionContext)

  const [listFeaturesX, setListFeaturesX] = useState('')
  const [dynamicObject, setDynamicObject] = useState({})
  const [indexModel, setIndexModel] = useState(0)
// [
//   {
//     name  : 'Original',
//     x     : dataPrediction.dataOriginal_x,
//     y     : dataPrediction.dataOriginal_y,
//     type  : 'scatter',
//     mode  : 'markers',
//     marker: { color: 'blue' },
//   }, {
//     name  : 'Predicted',
//     x     : dataPrediction.dataPredicted_x,
//     y     : dataPrediction.dataPredicted_y,
//     type  : 'scatter',
//     mode  : 'lines+markers',
//     marker: { color: 'red' },
//   },
// ]
  const [dataPrediction, setDataPrediction] = useState([])
  const refPlotJS = useRef()

  useEffect(() => {
    const formatter = new Intl.ListFormat(i18n.language, { style: 'long', type: 'conjunction' })
    let list = []
    if (listModels[indexModel]?.feature_selector?.X_features) {
      list = [...listModels[indexModel]?.feature_selector?.X_features]
    }
    setListFeaturesX(formatter.format(list))
    console.log()
  }, [i18n.language, listModels, indexModel, setListFeaturesX])

  useEffect(() => {
    if (listModels[indexModel]) {
      const { original, predicted } = listModels[indexModel]
      console.log('enter', { original: listModels[indexModel].original, predicted })

      const trace = {
        x      : [...Array(original.length).keys()],
        y      : original,
        name   : 'Original',
        mode   : 'lines+markers',
        type   : 'scatter',
        opacity: 0.5,
        marker : {
          color: 'dodgerblue'
        }
      }
      const lmTrace = {
        x      : [...Array(original.length).keys()],
        y      : predicted,
        name   : 'Predicted',
        mode   : 'lines+markers',
        type   : 'scatter',
        opacity: 0.5,
        marker : {
          color: 'forestgreen'
        }
      }
      setDataPrediction([trace, lmTrace])
    }
  }, [listModels, indexModel, setDataPrediction])

  const handleClick_Test = async () => {
    // const filename = process.env.REACT_APP_PATH + '/datasets/linear-regression/auto-mpg/auto-mpg.csv'
    // const columns = { x_name: 'horsepower', y_name: 'mpg' }
    // const filename = process.env.REACT_APP_PATH + '/datasets/linear-regression/salary/salary.csv'
    // const columns = { x_name: 'YearsExperience', y_name: 'Salary' }
    // const { original, predicted } = await LinearRegressionModelExample.run(filename, columns)
    // console.log({ original, predicted })
    //
    // const original_x = original.map((v) => v.x)
    // const original_y = original.map((v) => v.y)
    // const predicted_x = predicted.map((v) => v.x)
    // const predicted_y = predicted.map((v) => v.y)
    //
    // setDataPrediction({
    //   dataOriginal_label : columns.x_name,
    //   dataOriginal_x     : original_x,
    //   dataOriginal_y     : original_y,
    //   dataPredicted_label: columns.y_name,
    //   dataPredicted_x    : predicted_x,
    //   dataPredicted_y    : predicted_y
    // })
  }

  const handleChange_DynamicObject = (_newValue, _column_name) => {
    // setIndexModel(p => p + 1)
    setDynamicObject((prevState) => {
      return {
        ...prevState,
        [_column_name]: _newValue
      }
    })
  }

  const getColor = (column_name) => {
    if (Array.from(listModels[indexModel].feature_selector.X_features).includes(column_name))
      return styles.border_blue
    if (listModels[indexModel].feature_selector.y_target === column_name)
      return styles.border_green
    return styles.border_red
  }

  const isDisabled = (column_name) => {
    if (Array.from(listModels[indexModel].feature_selector.X_features).includes(column_name))
      return false
    if (listModels[indexModel].feature_selector.y_target === column_name)
      return true
    return true
  }

  const LinearRegressionDataFrameProcessedDynamicForm = () => {
    const _dataframe = datasetLocal.dataframe_processed
    return _dataframe.columns.map((column_name, index) => {
      const column_type = _dataframe[column_name].dtype
      switch (column_type) {
        case 'int32': {
          return <Col className="mb-3" key={index} xs={6} sm={6} md={4} lg={4} xl={4} xxl={3}>
            <Form.Group controlId={'linear-regression-dynamic-form-' + column_name}>
              <Form.Label><b>{column_name}</b></Form.Label>
              <Form.Control type="number"
                            size={'sm'}
                            className={getColor(column_name)}
                            disabled={isDisabled(column_name)}
                            placeholder={'int32'}
                            step={1}
                            value={dynamicObject[column_name]}
                            onChange={(e) => handleChange_DynamicObject(e.target.value, column_name)} />
              <Form.Text className="text-muted">{column_name} | {column_type}</Form.Text>
            </Form.Group>
          </Col>

        }
        case 'float32': {
          return <Col className="mb-3" key={index} xs={6} sm={6} md={4} lg={4} xl={4} xxl={3}>
            <Form.Group controlId={'linear-regression-dynamic-form-' + column_name}>
              <Form.Label><b>{column_name}</b></Form.Label>
              <Form.Control type="number"
                            size={'sm'}
                            className={getColor(column_name)}
                            disabled={isDisabled(column_name)}
                            placeholder={'float32'}
                            value={dynamicObject[column_name]}
                            step={0.1}
                            onChange={(e) => handleChange_DynamicObject(e.target.value, column_name)} />
              <Form.Text className="text-muted">{column_name} | {column_type}</Form.Text>
            </Form.Group>
          </Col>
        }
        case 'string': {
          /**
           * TODO
           * Se debe hacer un label encoder de los posibles strings de un modelo
           **/
          return <Col className="mb-3" key={index} xs={6} sm={6} md={4} lg={4} xl={4} xxl={3}>
            <Form.Group controlId={'linear-regression-dynamic-form-' + column_name}>
              <Form.Label><b>{column_name}</b></Form.Label>
              <Form.Select aria-label={t(prefix + 'metric-id-info')}
                           value={dynamicObject[column_name]}
                           disabled={true}
                           onChange={(e) => handleChange_DynamicObject(e.target.value, column_name)}>
                <option value={'TODO'}>TODO</option>
              </Form.Select>
              <Form.Text className="text-muted">{column_name} | {column_type}</Form.Text>

            </Form.Group>
          </Col>
        }
        default: {
          return <Col className="mb-3" key={index} xs={6} sm={6} md={4} lg={4} xl={4} xxl={3}>
            Error, option not valid
          </Col>
        }
      }
    })
  }

  useEffect(() => {
    const _dynamic_object = datasetLocal
      .dataframe_processed
      .columns
      .reduce((o, column_name) => {
        let new_value = datasetLocal.dataframe_processed[column_name].values[0]
        return Object.assign(o, { [column_name]: new_value })
      }, {})
    setDynamicObject(_dynamic_object)
  }, [datasetLocal.dataframe_processed])

  // TODO
  const handleSubmit_Predict = async (e) => {
    e.preventDefault()

    listModels[indexModel].model.predict()
  }

  const handleChange_Model = (e) => {
    setIndexModel(e.target.value)
  }
  const handleChange_Entity = (e) => {
    const index = e.target.value
    const _dynamic_object = datasetLocal
      .dataframe_processed
      .columns
      .reduce((o, column_name) => {
        let new_value = datasetLocal.dataframe_processed[column_name].values[index]
        return Object.assign(o, { [column_name]: new_value })
      }, {})
    setDynamicObject(_dynamic_object)
  }

  console.debug('render LinearRegressionPrediction')
  return <>
    <Card>
      <Card.Header className={'d-flex align-items-center'}>
        <h3><Trans i18nKey={prefix + 'title'} /></h3>
        <div className={'ms-3'}>
          <Form.Group controlId={'model-selector'}>
            <Form.Select aria-label={'model-selector'}
                         size={'sm'}
                         onChange={(e) => handleChange_Model(e)}>
              <option disabled={true} value="__disabled__"><Trans i18nKey={prefix + 'list-models-generated'} /></option>
              <>
                {listModels
                  .map((_, index) => {
                    return <option key={index} value={index}>
                      <Trans i18nKey={prefix + 'model.__index__'}
                             values={{ index: index + 1 }} />
                    </option>
                  })}
              </>
            </Form.Select>
          </Form.Group>
        </div>
        <div className={'ms-3'}>
          <Form.Group controlId={'dataframe-selector-value'}>
            <Form.Select aria-label={'dataframe-selector-value'}
                         size={'sm'}
                         onChange={(e) => handleChange_Entity(e)}>
              <>
                {Array(datasetLocal.dataframe_processed.values.length)
                  .fill(0)
                  .map((value, index) => {
                    return <option key={index} value={index}>
                      <Trans i18nKey={prefix + 'entity.__index__'}
                             values={{ index: index + 1 }} />
                    </option>
                  })}
              </>
            </Form.Select>
          </Form.Group>
        </div>
      </Card.Header>
      <Card.Body>
        {listModels.length > 0 && <>
          <Row>
            <Col>
              <Card.Text><strong>X</strong> {listFeaturesX ?? ''}</Card.Text>
              <Card.Text><strong>Y</strong> {listModels[indexModel]?.feature_selector.y_target ?? ''}</Card.Text>
            </Col>
          </Row>

          <hr />

          <Form onSubmit={handleSubmit_Predict}>
            <Row>
              <LinearRegressionDataFrameProcessedDynamicForm />
            </Row>
            <Row>
              <div className="d-grid gap-2">
                <Button type={'submit'}
                        size={'lg'}
                        variant={'outline-primary'}>
                  <Trans i18nKey={prefix + 'button-submit'} />
                </Button>
              </div>
            </Row>
            <Row>
              <Col>
                <Plot ref={refPlotJS}
                      data={dataPrediction}
                      useResizeHandler={true}
                      style={PLOTLY_CONFIG_DEFAULT.STYLES}
                      layout={{ title: '', ...PLOTLY_CONFIG_DEFAULT.LAYOUT }}
                />
              </Col>
            </Row>
          </Form>
        </>
        }
      </Card.Body>

      <Card.Footer>
        <DebugJSON obj={dynamicObject} />
        <DebugJSON obj={Object.entries(listModels[indexModel]?.feature_selector ?? {})} />
      </Card.Footer>
    </Card>
  </>
}
