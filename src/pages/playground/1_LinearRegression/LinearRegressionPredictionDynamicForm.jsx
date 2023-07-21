import styles from '@pages/playground/1_LinearRegression/LinearRegression.module.css'
import { Col, Form } from 'react-bootstrap'
import * as dfd from 'danfojs'

import { VERBOSE } from '@/CONSTANTS'

export default function LinearRegressionPredictionDynamicForm ({ generatedModel, dynamicObject, handleChange_DynamicObject }) {

  const getColor = (column_name) => {
    if (generatedModel.params_features.X_feature === column_name) {
      return styles.border_blue
    }
    if (generatedModel.params_features.y_target === column_name) {
      return styles.border_green
    }
    return styles.border_red
  }

  const isDisabled = (column_name) => {
    if (generatedModel.params_features.X_feature === column_name) {
      return false
    }
    if (generatedModel.params_features.y_target === column_name) {
      return true
    }
    return true
  }

  if (VERBOSE) console.debug('render LinearRegressionPredictionDynamicForm')
  return generatedModel.dataframe.columns.map((column_name, index) => {
    const column_type = generatedModel.dataframe[column_name].dtype
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
        const labelEncoder = new dfd.LabelEncoder()
        labelEncoder.fit(generatedModel.dataframe[column_name])
        return <Col className="mb-3" key={index} xs={6} sm={6} md={4} lg={4} xl={4} xxl={3}>
          <Form.Group controlId={'linear-regression-dynamic-form-' + column_name}>
            <Form.Label><b>{column_name}</b></Form.Label>
            <Form.Select aria-label={'linear-regression-dynamic-form-' + column_name}
                         value={dynamicObject[column_name]}
                         className={getColor(column_name)}
                         disabled={isDisabled(column_name)}
                         onChange={(e) => handleChange_DynamicObject(e.target.value, column_name)}>
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
