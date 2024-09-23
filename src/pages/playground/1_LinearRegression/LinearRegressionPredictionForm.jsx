import React from 'react'
import styles from '@pages/playground/1_LinearRegression/LinearRegression.module.css'
import { Row, Col, Form } from 'react-bootstrap'
import * as dfd from 'danfojs'
import * as _Types from '@core/types'

import { VERBOSE } from '@/CONSTANTS'
/**
 * @typedef {Object} LinearRegressionPredictionForm_Props
 * @property {_Types.CustomModelGenerated_t} [generatedModel]
 * @property {Object} [dynamicObject = {}]
 * @property {Function} [handleChange_InstanceToPredict]
 */
/**
 * 
 * @param {LinearRegressionPredictionForm_Props} param0 
 * @returns 
 */
export default function LinearRegressionPredictionForm ({ generatedModel, dynamicObject={}, handleChange_InstanceToPredict }) {

  function getColor(column_name) {
    if (generatedModel.params_features.X_features.has(column_name)) {
      return styles.border_blue
    }
    if (generatedModel.params_features.Y_target === column_name) {
      return styles.border_green
    }
    return styles.border_red
  }

  function isDisabled(column_name) {
    if (generatedModel.params_features.X_features.has(column_name)) {
      return false
    }
    if (generatedModel.params_features.Y_target === column_name) {
      return true
    }
    return true
  }

  if (VERBOSE) console.debug('render LinearRegressionPredictionForm')
  return <Row xs={6} sm={6} md={4} lg={4} xl={4} xxl={6}>
    {generatedModel
      .dataset_processed
      .data_processed
      .dataframe_X
      .columns
      .map((column_name, index) => {
      const column_type = generatedModel.dataset_processed.data_processed.dataframe_X[column_name].dtype
      switch (column_type) {
        case 'int32': {
          return <Col className="mb-3" key={index}>
            <Form.Group controlId={'linear-regression-dynamic-form-' + column_name}>
              <Form.Label><b>{column_name}</b></Form.Label>
              <Form.Control type="number"
                            step={1}
                            size={'sm'}
                            placeholder={'int32'}
                            value={dynamicObject[column_name] ?? 0}
                            className={getColor(column_name)}
                            disabled={isDisabled(column_name)}
                            onChange={e => handleChange_InstanceToPredict(e, column_name)}
              />
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
                            value={dynamicObject[column_name] ?? 0.0}
                            className={getColor(column_name)}
                            disabled={isDisabled(column_name)}
                            onChange={e => handleChange_InstanceToPredict(e, column_name)}
              />
              <Form.Text className="text-muted">Dtype: {column_type}</Form.Text>
            </Form.Group>
          </Col>
        }
        case 'string': {
          const labelEncoder = new dfd.LabelEncoder()
          labelEncoder.fit(generatedModel.dataframe[column_name])
          return <Col className="mb-3" key={index}>
            <Form.Group controlId={'linear-regression-dynamic-form-' + column_name}>
              <Form.Label><b>{column_name}</b></Form.Label>
              <Form.Select aria-label={'linear-regression-dynamic-form-' + column_name}
                           size={'sm'}
                           value={dynamicObject[column_name] ?? ''}
                           className={getColor(column_name)}
                           disabled={isDisabled(column_name)}
                           onChange={e => handleChange_InstanceToPredict(e, column_name)}
              >
                <>
                  {Object.entries(labelEncoder.$labels)
                    .map(([key, value], index_options) => {
                        return <option key={index_options}
                                       value={JSON.stringify({ key, value })}>
                          {key}
                        </option>
                      }
                    )}
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
