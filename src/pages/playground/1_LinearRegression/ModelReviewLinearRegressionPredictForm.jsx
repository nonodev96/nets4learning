import styles from '@pages/playground/1_LinearRegression/LinearRegression.module.css'
import { useRef, useState } from 'react'
import { Row, Col, Form } from 'react-bootstrap'
import { useTranslation, Trans } from 'react-i18next'
import * as dfd from 'danfojs'

import * as _Types from '@core/types'
import { VERBOSE } from '@/CONSTANTS'


/**
 * 
 * @param {{dataframe: dfd.DataFrame, datasets: _Types.DatasetProcessed_t}} props 
 * @returns 
 */
export default function ModelReviewLinearRegressionPredictForm({ dataset, dataframe }) {
  const  { t } = useTranslation()

  const dataframe_to_predict = useRef(dataframe.copy())


  const handleChange_Parameter_int32 = (column_name, value) => {
    dataframe_to_predict.current[column_name][0] = parseInt(value)
  }


  const handleChange_Parameter_float32 = (column_name, value) => {
    dataframe_to_predict.current[column_name][0] = parseFloat(value)

  }

  const handleChange_Parameter = (column_name, value) => {
    dataframe_to_predict.current[column_name][0] = value
  }

  const _getColor = (column_name) => {
    if (!dataset) return 'none'
    if (dataset.filter(v => v.column_name === column_name).some(v => v.column_role === 'Target')) {
      return styles.border_green
    }
    if (dataset.filter(v => v.column_name === column_name).some(v => v.column_role === 'Feature')) {
      return styles.border_blue
    }
    return styles.border_red
  }

  const _isDisabled = (column_name) => {
    if (!dataset) return true
    if (dataset.filter(v => v.column_name === column_name).some(v => v.column_role === 'Feature')) {
      return false
    }
    if (dataset.filter(v => v.column_name === column_name).some(v => v.column_role === 'Target')) {
      return true
    }
    return true
  }

  if (VERBOSE) console.debug('render ModelReviewLinearRegressionPredictForm')
  return (
    <Row xs={2} sm={2} md={4} lg={4} xl={4} xxl={3}>
      {dataframe.columns.map((column_name, index)=>{
        switch (dataframe.dtypes[index]) {
          case 'int32': {
            return <Col key={'form' + index} className={'mb-3'}>
              <Form.Group>
                <Form.Label>{t('pages.playground.form.select-parameter')}: <b>{column_name}</b></Form.Label>
                <Form.Control type="number"
                              size={'sm'}
                              placeholder={t('pages.playground.form.parameter-integer')}
                              min={0}
                              step={1}
                              value={0}
                              onChange={($event) => handleChange_Parameter_int32(column_name, $event.target.value)} />
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
                              value={0.0}
                              onChange={($event) => handleChange_Parameter_float32(column_name, $event.target.value)} />
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
                             value={0}
                             onChange={($event) => handleChange_Parameter(column_name, $event.target.value)}>

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

        
      })}
    </Row>
  )
}