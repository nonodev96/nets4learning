import React, { useEffect } from 'react'
import { Col, Form } from 'react-bootstrap'
import { VERBOSE } from '@/CONSTANTS'

export default function TabularClassificationPredictionDynamicForm ({
  dataset_JSON,
  stringToPredict = '',
  setStringToPredict,
  setObjectToPredict,
}) {

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

  const handleChange_Float = (e, column_name, index_column) => {
    const text_split = stringToPredict.split(';')
    text_split[index_column] = parseFloat(e.target.value)
    setStringToPredict(text_split.join(';'))
    setObjectToPredict(oldState => ({
      ...oldState,
      [column_name]: parseFloat(e.target.value),
    }))

    console.log(text_split.join(';'), parseFloat(e.target.value))
  }

  const handleChange_Number = (e, column_name, index_column) => {
    const text_split = stringToPredict.split(';')
    text_split[index_column] = parseInt(e.target.value)
    setStringToPredict(text_split.join(';'))
    setObjectToPredict(oldState => ({
      ...oldState,
      [column_name]: parseInt(e.target.value),
    }))

    console.log(text_split.join(';'), parseInt(e.target.value))
  }

  const handleChange_Select = (e, column_name, index_column) => {
    const text_split = stringToPredict.split(';')
    text_split[index_column] = (e.target.value)
    setStringToPredict(text_split.join(';'))
    setObjectToPredict(oldState => ({
      ...oldState,
      [column_name]: parseInt(e.target.value),
    }))

    console.log(text_split.join(';'), e.target.value)
  }

  if (VERBOSE) console.debug('Render TabularClassificationDynamicFormPrediction')
  return <>
    {dataset_JSON.attributes.map((attribute, index) => {
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
          return <Col key={'form' + index} className={'mb-3'}
                      xs={6} sm={6} md={4} lg={4} xl={4} xxl={3}>
            <Form.Group controlId={'FormControl_' + column_index}>
              <Form.Label><b>{column_name}</b></Form.Label>
              <Form.Control type="number"
                            size={'sm'}
                            placeholder={'int32'}
                            min={0}
                            step={1}
                            defaultValue={parseInt(dataset_JSON.data[0][column_index])}
                            onChange={(e) => handleChange_Number(e, column_name, column_index)} />
              <Form.Text className="text-muted">{column_name} | {column_type}</Form.Text>
            </Form.Group>
          </Col>
        }
        case 'float32': {
          return <Col key={'form' + index} className={'mb-3'}
                      xs={6} sm={6} md={4} lg={4} xl={4} xxl={3}>
            <Form.Group controlId={'FormControl_' + column_index}>
              <Form.Label><b>{column_name}</b></Form.Label>
              <Form.Control type="number"
                            size={'sm'}
                            placeholder={'float32'}
                            min={0}
                            step={0.1}
                            defaultValue={parseFloat(dataset_JSON.data[0][column_index])}
                            onChange={(e) => handleChange_Float(e, column_name, column_index)} />
              <Form.Text className="text-muted">{column_name} | {column_type}</Form.Text>
            </Form.Group>
          </Col>
        }
        case 'string': {
          return <Col key={'form' + index} className={'mb-3'}
                      xs={6} sm={6} md={4} lg={4} xl={4} xxl={3}>
            <p className={'text-center'}>Texto</p>
          </Col>
        }
        case 'label-encoder': {
          return <Col key={'form' + index} className={'mb-3'}
                      xs={6} sm={6} md={4} lg={4} xl={4} xxl={3}>
            <Form.Group controlId={'FormControl_' + column_index}>
              <Form.Label><b>{column_name}</b></Form.Label>
              <Form.Select aria-label="select"
                           size={'sm'}
                           defaultValue={dataset_JSON.data[0][column_index]}
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
          return <Col key={'form' + index} className={'mb-3'}
                      xs={6} sm={6} md={4} lg={4} xl={4} xxl={3}>
            <p className={'text-center'}>OneHotEncoder</p>
          </Col>
        }
        default:
          console.error('Error, option not valid')
          return <>Error, option not valid</>
      }
    })}
  </>
}