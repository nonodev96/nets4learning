import styles from '@pages/playground/1_LinearRegression/LinearRegression.module.css'
import { useEffect, useRef, useState } from 'react'
import { Row, Col, Form } from 'react-bootstrap'
import { useTranslation, Trans } from 'react-i18next'
import * as dfd from 'danfojs'

import * as _Types from '@core/types'
import { VERBOSE } from '@/CONSTANTS'
import { DataFrameSetCellValue } from '@/core/dataframe/DataFrameUtils'
import WaitingPlaceholder from '@components/loading/WaitingPlaceholder'

/**
 * @typedef ModelReviewLinearRegressionPredictFormProps_t
 * @property {_Types.DatasetProcessed_t} dataset
 * @property {_Types.StatePrediction_t} prediction
 * @property {React.Dispatch<React.SetStateAction<_Types.StatePrediction_t>>} setPrediction 
 */

/**
 * 
 * @param {ModelReviewLinearRegressionPredictFormProps_t} props 
 * @returns 
 */
export default function ModelReviewLinearRegressionPredictForm({ dataset, prediction, setPrediction }) {
  
  const  { t } = useTranslation()

  const [ready, setReady] = useState(false)

  useEffect(() => {
    setReady(!!(dataset && dataset.dataframe_processed && prediction && prediction.input_1_dataframe_original.values.length > 0))
  }, [dataset, prediction, setReady])

  /**
   * 
   * @param {_Types.DatasetProcessed_t} dataset
   * @param {string} column_name 
   * @returns 
   */
  const isDisabled = (dataset, column_name) => {
    if (dataset.data_processed.column_name_target === column_name) {
      return true
    }
    if (dataset.dataset.some(v => v.column_name === column_name )) {
      return false
    }
    return true
  }

  /**
   * 
   * @param {_Types.DatasetProcessed_t} dataset
   * @param {string} column_name 
   * @returns 
   */
  const getColor = (dataset, column_name) => {
    if (dataset.data_processed.column_name_target === column_name) {
      return styles.border_green
    }
    if (dataset.dataset.some(v => v.column_name === column_name )) {
      return styles.border_blue
    }
    return styles.border_red
  }

  const handleChange_Parameter_int32_float32 = (column_name, new_value) => {
    setPrediction((prevState) => {
      const newInputDataFrameOriginal = DataFrameSetCellValue(prediction.input_1_dataframe_original, 0, column_name, new_value)
      const newInputDataFrameProcessed = DataFrameSetCellValue(prediction.input_1_dataframe_processed, 0, column_name, new_value)
      const newInputDataFrameEncoding = DataFrameSetCellValue(prediction.input_2_dataframe_encoding, 0, column_name, new_value)
      // const newInputDataFrameScaling = DataFrameSetCellValue(prediction.input_2_dataframe_encoding, 0, column_name, new_value)
      const newInputDataFrameScaling = dataset.data_processed.scaler.transform(newInputDataFrameEncoding)

      return {
        ...prevState,
        input_1_dataframe_original : newInputDataFrameOriginal,
        input_1_dataframe_processed: newInputDataFrameProcessed,
        input_2_dataframe_encoding : newInputDataFrameEncoding,
        input_3_dataframe_scaling  : newInputDataFrameScaling
      }
    })
  }

  const handleChange_Parameter_string = (column_name, value) => {
  }



  if (VERBOSE) console.debug('render ModelReviewLinearRegressionPredictForm')
  console.log({dataset})
  return <>
    <Row>
      {!ready && <>
        <WaitingPlaceholder title={t('Waiting')} />
      </>}
    </Row>
    <Row xs={6} sm={6} md={4} lg={4} xl={4} xxl={6}>
      {ready && <>
        {dataset
          .dataframe_processed
          .columns
          .map((column_name, index) => {
            console.log({prediction})
            const column_type = (/** @type {_Types.ColumnType_t} */(dataset.dataframe_original[column_name].dtype))
            const column_value = prediction.input_1_dataframe_original[column_name].values[0]


          
            switch (column_type) {
              case 'int32': {
                return <Col key={'form' + index} className={'mb-3'}>
                  <Form.Group>
                    <Form.Label>{t('pages.playground.form.select-parameter')}: <b>{column_name}</b></Form.Label>
                    <Form.Control type="number"
                                  size={'sm'}
                                  placeholder={t('pages.playground.form.parameter-integer')}
                                  min={0}
                                  step={1}
                                  value={column_value}
                                  className={getColor(dataset, column_name)}
                                  disabled={isDisabled(dataset, column_name)}
                                  onChange={($event) => handleChange_Parameter_int32_float32(column_name, $event.target.value)} />
                    <Form.Text className="text-muted">
                      <Trans i18nKey={'pages.playground.form.parameter-integer'} />: {column_name}
                    </Form.Text>
                  </Form.Group>
                </Col>
              }
              case 'float32': {
                return <Col key={'form' + index} className={'mb-3'}>
                  <Form.Group>
                    <Form.Label>{t('pages.playground.form.select-parameter')}:  <b>{column_name}</b></Form.Label>
                    <Form.Control type="number"
                                  size={'sm'}
                                  placeholder={t('pages.playground.form.parameter-decimal')}
                                  min={0}
                                  step={0.1}
                                  value={column_value}
                                  className={getColor(dataset, column_name)}
                                  disabled={isDisabled(dataset, column_name)}
                                  onChange={($event) => handleChange_Parameter_int32_float32(column_name, $event.target.value)} />
                    <Form.Text className="text-muted">
                      <Trans i18nKey={'pages.playground.form.parameter-decimal'} />: {column_name}
                    </Form.Text>
                  </Form.Group>
                </Col>
              }
              case 'string': {
                return <Col key={'form' + index} className={'mb-3'}>
                  <Form.Group controlId={column_name}>
                    <Form.Label>{t('pages.playground.form.select-parameter')}: <b>{column_name}</b></Form.Label>
                    <Form.Select aria-label={t('pages.playground.form.select-parameter')}
                                  size={'sm'}
                                  value={column_value}
                                  className={getColor(dataset, column_name)}
                                  disabled={isDisabled(dataset, column_name)}
                                  onChange={($event) => handleChange_Parameter_string(column_name, $event.target.value)}>
    
                    </Form.Select>
                    <Form.Text className="text-muted">
                      <Trans i18nKey={'pages.playground.form.parameter-decimal'} />: {column_name}
                    </Form.Text>
                  </Form.Group>
                </Col>
              }
              default:
                return <>default</>
            }
              
          }
          
        )}
      </>}
    </Row>
  </>

}