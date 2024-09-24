import styles from '@pages/playground/1_LinearRegression/LinearRegression.module.css'
import React, { useContext } from 'react'
import { Row, Col, Form } from 'react-bootstrap'
import * as dfd from 'danfojs'

import * as _Types from '@core/types'
import { VERBOSE } from '@/CONSTANTS'
import { DataFrameSetCellValue } from '@/core/dataframe/DataFrameUtils'
import LinearRegressionContext from '@/context/LinearRegressionContext'

/**
 * @typedef {Object} LinearRegressionPredictionFormProps_t
 * @property {_Types.CustomModelGenerated_t} generatedModel
 * @property {Object} [dynamicObject = {}]
 */

/**
 * 
 * @param {LinearRegressionPredictionFormProps_t} props 
 * @returns 
 */
export default function LinearRegressionPredictionForm ({ generatedModel }) {

  const {
    prediction,
    setPrediction
  } = useContext(LinearRegressionContext)

  const getColor = (generatedModel, column_name) => {
    if (generatedModel.params_features.Y_target === column_name) {
      return styles.border_green
    }
    if (generatedModel.params_features.X_features.has(column_name)) {
      return styles.border_blue
    }
    return styles.border_red
  }
  
  const isDisabled = (generatedModel, column_name) => {
    if (generatedModel.params_features.Y_target === column_name) {
      return true
    }
     if (generatedModel.params_features.X_features.has(column_name)) {
      return false
    }
    return true
  }

  const handleChange_EditInstanceEncoding = (column_name, new_value) => {
    const [new_value_encoding] = generatedModel.dataset_processed.data_processed.encoders[column_name].encoder.transform([new_value])
    const newInputDataFrameOriginal = DataFrameSetCellValue(prediction.input_1_dataframe_original, 0, column_name, new_value)
    const newInputDataFrameProcessed = DataFrameSetCellValue(prediction.input_1_dataframe_processed, 0, column_name, new_value)
    const newInputDataFrameEncoding = DataFrameSetCellValue(prediction.input_2_dataframe_encoding, 0, column_name, new_value_encoding)
    const newInputDataFrameScaling = generatedModel.dataset_processed.data_processed.scaler.transform(newInputDataFrameEncoding)
    
    setPrediction((prevState) => {
      // console.log({
      //   prevState, 
      //   newInputDataFrameOriginal,
      //   newInputDataFrameProcessed,
      //   newInputDataFrameEncoding,
      //   newInputDataFrameScaling,
      // })
      return {
        ...prevState,
        input_1_dataframe_original : newInputDataFrameOriginal,
        input_1_dataframe_processed: newInputDataFrameProcessed,
        input_2_dataframe_encoding : newInputDataFrameEncoding,
        input_3_dataframe_scaling  : newInputDataFrameScaling
      }
    })
  }
  
  const handleChange_EditInstance = (column_name, new_value) => {
    setPrediction((prevState) => {
      const newInputDataFrameOriginal = DataFrameSetCellValue(prediction.input_1_dataframe_original, 0, column_name, new_value)
      const newInputDataFrameProcessed = DataFrameSetCellValue(prediction.input_1_dataframe_processed, 0, column_name, new_value)
      const newInputDataFrameEncoding = DataFrameSetCellValue(prediction.input_2_dataframe_encoding, 0, column_name, new_value)
      // const newInputDataFrameScaling = DataFrameSetCellValue(prediction.input_2_dataframe_encoding, 0, column_name, new_value)
      const newInputDataFrameScaling = generatedModel.dataset_processed.data_processed.scaler.transform(newInputDataFrameEncoding)

      return {
        ...prevState,
        input_1_dataframe_original : newInputDataFrameOriginal,
        input_1_dataframe_processed: newInputDataFrameProcessed,
        input_2_dataframe_encoding : newInputDataFrameEncoding,
        input_3_dataframe_scaling  : newInputDataFrameScaling
      }
    })
  }

  if (VERBOSE) console.debug('render LinearRegressionPredictionForm')
  return <Row xs={6} sm={6} md={4} lg={4} xl={4} xxl={6}>
    {generatedModel
      .dataset_processed
      .dataframe_processed
      .columns
      .map((column_name, index) => {
      const column_type = generatedModel.dataset_processed.dataframe_original[column_name].dtype
      const column_value = prediction.input_1_dataframe_original[column_name].values[0]
      
      switch (column_type) {
        case 'int32': {
          return <Col className="mb-3" key={index}>
            <Form.Group controlId={'linear-regression-dynamic-form-' + column_name}>
              <Form.Label><b>{column_name}</b></Form.Label>
              <Form.Control type="number"
                            step={1}
                            size={'sm'}
                            placeholder={'int32'}
                            value={column_value}
                            className={getColor(generatedModel, column_name)}
                            disabled={isDisabled(generatedModel, column_name)}
                            onChange={e => handleChange_EditInstance(column_name, parseInt(e.target.value))} />
              <Form.Text className="text-muted">Dtype: {column_type}</Form.Text>
            </Form.Group>
          </Col>
        }
        case 'float32': {
          return <Col className="mb-3" key={index}>
            <Form.Group controlId={'linear-regression-dynamic-form-' + column_name}>
              <Form.Label><b>{column_name}</b></Form.Label>
              <Form.Control type="number"
                            step={0.1}
                            placeholder={'float32'}
                            size={'sm'}
                            value={column_value}
                            className={getColor(generatedModel, column_name)}
                            disabled={isDisabled(generatedModel, column_name)}
                            onChange={e => handleChange_EditInstance(column_name, parseFloat(e.target.value))} />
              <Form.Text className="text-muted">Dtype: {column_type}</Form.Text>
            </Form.Group>
          </Col>
        }
        case 'string': {
          const labelEncoder = new dfd.LabelEncoder()
          labelEncoder.fit(generatedModel.dataset_processed.dataframe_original[column_name])
          return <Col className={'mb-3'} key={index}>
            <Form.Group controlId={'linear-regression-dynamic-form-' + column_name}>
              <Form.Label><b>{column_name}</b></Form.Label>
              <Form.Select aria-label={'linear-regression-dynamic-form-' + column_name}
                           size={'sm'}
                           value={column_value}
                           className={getColor(generatedModel, column_name)}
                           disabled={isDisabled(generatedModel, column_name)}
                           onChange={e => handleChange_EditInstanceEncoding(column_name, e.target.value)}>
                <>
                  {Object.entries(labelEncoder.$labels)
                    .map(([text, value], index_options) => {
                        return <option key={index_options} value={text}>{text}</option>
                    })
                  }
                </>
              </Form.Select>
              <Form.Text className="text-muted">Dtype: {column_type}</Form.Text>
            </Form.Group>
          </Col>
        }
        default: {
          return <Col className="mb-3" key={index}>
            Error, option not valid
          </Col>
        }
      }
    })}
  </Row>
}
