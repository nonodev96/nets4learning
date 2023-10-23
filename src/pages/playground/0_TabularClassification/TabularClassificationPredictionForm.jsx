import React, { useEffect } from 'react'
import { Row, Col, Form } from 'react-bootstrap'
import { Trans, useTranslation } from 'react-i18next'
import { VERBOSE } from '@/CONSTANTS'
import * as DataFrameUtils from '@core/dataframe/DataFrameUtils'

export default function TabularClassificationPredictionForm (props) {
  const {
    /** @type DatasetProcessed_t[] */
    datasets,
    datasetIndex,

    /** @type any[] */
    inputDataToPredict = [],
    /** @type React.Dispatch<Array<Object>>*/
    setInputDataToPredict,

    /** @type any[] */
    inputVectorToPredict,
    /** @type React.Dispatch<Array<Object>>*/
    setInputVectorToPredict
  } = props

  const prefix = 'pages.playground.generator.dynamic-form-dataset.'
  const { t } = useTranslation()

  useEffect(() => {
    console.debug("useEffect [datasets, datasetIndex, setInputDataToPredict]")
    const dataset_processed = datasets[datasetIndex]
    const { dataframe_original, data_processed } = dataset_processed
    const { column_name_target } = data_processed
    const dataframe = dataframe_original.drop({ columns: [column_name_target] })
    const dataframe_row_default_data = dataframe.$data[0]
    setInputDataToPredict(dataframe_row_default_data)
  }, [datasets, datasetIndex, setInputDataToPredict])

  useEffect(() => {
    console.debug("useEffect [datasets, datasetIndex, inputDataToPredict, setInputVectorToPredict]")
    if (inputDataToPredict.length === 0) return
    const { data_processed } = datasets[datasetIndex]
    const { encoders, X } = data_processed
    const _inputVectorToPredict = DataFrameUtils.DataFrameApplyEncodersVector(encoders, inputDataToPredict, X.columns)
    setInputVectorToPredict(_inputVectorToPredict)
  }, [datasets, datasetIndex, inputDataToPredict, setInputVectorToPredict])

  const handleChange_Float = (e, column_name, index_column) => {
    setInputDataToPredict((prevState) => {
      return prevState.map((inputDataItem, index) => {
        if (index === index_column) {
          return parseFloat(e.target.value)
        }
        return inputDataItem
      })
    })
  }

  const handleChange_Number = (e, column_name, index_column) => {
    setInputDataToPredict((prevState) => {
      return prevState.map((inputDataItem, index) => {
        if (index === index_column) {
          return parseInt(e.target.value)
        }
        return inputDataItem
      })
    })
  }

  const handleChange_Select = (e, column_name, index_column) => {
    setInputDataToPredict((prevState) => {
      return prevState.map((inputDataItem, index) => {
        if (index === index_column) {
          return (e.target.value)
        }
        return inputDataItem
      })
    })
  }

  if (VERBOSE) console.debug('Render TabularClassificationPredictionForm')
  return <>
    <Row xs={2} sm={2} md={4} lg={6} xl={6} xxl={6}>
      {datasets[datasetIndex].data_processed.attributes.map((attribute, index) => {
        // VALUES:
        // { name: "type1", type: "int32" },
        // { name: "type2", type: "float32"  },
        // { name: "type3", type: "string", options: [{value: "", text: ""] },

        const column_index = attribute.index_column
        const column_type = attribute.type
        const column_name = attribute.name
        const column_options = attribute.options

        switch (column_type) {
          case 'int32': {
            return <Col key={'form' + index} className={'mb-3'}>
              <Form.Group controlId={'FormControl_' + column_index}>
                <Form.Label><b>{column_name}</b></Form.Label>
                <Form.Control type="number"
                              size={'sm'}
                              placeholder={'int32'}
                              min={0}
                              step={1}
                              value={inputDataToPredict[column_index]}
                              onChange={(e) => handleChange_Number(e, column_name, column_index)} />
                <Form.Text className="text-muted">{column_name} | {column_type}</Form.Text>
              </Form.Group>
            </Col>
          }
          case 'float32': {
            return <Col key={'form' + index} className={'mb-3'}>
              <Form.Group controlId={'FormControl_' + column_index}>
                <Form.Label><b>{column_name}</b></Form.Label>
                <Form.Control type="number"
                              size={'sm'}
                              placeholder={'float32'}
                              min={0}
                              step={0.1}
                              value={inputDataToPredict[column_index]}
                              onChange={(e) => handleChange_Float(e, column_name, column_index)} />
                <Form.Text className="text-muted">{column_name} | {column_type}</Form.Text>
              </Form.Group>
            </Col>
          }
          case 'string': {
            return <Col key={'form' + index} className={'mb-3'}>
              <p className={'text-center'}>Texto</p>
            </Col>
          }
          case 'label-encoder': {
            return <Col key={'form' + index} className={'mb-3'}>
              <Form.Group controlId={'FormControl_' + column_index}>
                <Form.Label><b>{column_name}</b></Form.Label>
                <Form.Select aria-label="select"
                             size={'sm'}
                             value={inputDataToPredict[column_index]}
                             onChange={(e) => handleChange_Select(e, column_name, column_index)}>
                  {column_options.map((option_value, option_index) => {
                    return <option key={column_name + '_option_' + option_index}
                                   value={option_value.value}>
                      {option_value.text}
                    </option>
                  })}
                </Form.Select>
                <Form.Text className="text-muted">{column_name} | {column_type}</Form.Text>
              </Form.Group>
            </Col>
          }
          case 'one-hot-encoder': {
            return <Col key={'form' + index} className={'mb-3'}>
              <p className={'text-center'}>OneHotEncoder</p>
            </Col>
          }
          default:
            console.error('Error, option not valid')
            return <>Error, option not valid</>
        }
      })}
    </Row>
    <hr />
    <Row>
      <Col>
        <Form.Group className="mb-3" controlId={'formTestInput'}>
          <Form.Label><Trans i18nKey={prefix + 'test-input-data'} /></Form.Label>
          <Form.Control placeholder={t(prefix + 'input-data')}
                        disabled={true}
                        value={inputDataToPredict.join(';')} />
        </Form.Group>
      </Col>
      <Col>
        <Form.Group className="mb-3" controlId={'formTestVector'}>
          <Form.Label><Trans i18nKey={prefix + 'test-input-vector'} /></Form.Label>
          <Form.Control placeholder={t(prefix + 'input-vector')}
                        disabled={true}
                        value={inputVectorToPredict.join(';')} />
        </Form.Group>
      </Col>
    </Row>
  </>
}