import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Form, Row } from 'react-bootstrap'
import { Trans, useTranslation } from 'react-i18next'
import * as dfd from 'danfojs'

import alertHelper from '@utils/alertHelper'
import { VERBOSE } from '@/CONSTANTS'
import { TABLE_PLOT_STYLE_CONFIG } from '@/CONSTANTS_DanfoJS'
import { Link } from 'react-router-dom'

// @formatter:off
const DEFAULT_OPTIONS = [
  { value: 'int32', i18n: 'int32' },
  { value: 'float32', i18n: 'float32' },
  { value: 'string', i18n: 'string' },
  { value: 'label-encoder', i18n: 'label-encoder' },
  { value: 'drop', i18n: 'drop' },
  { value: 'ignored', i18n: 'ignored' }
]
// @formatter:on

export default function TabularClassificationDatasetProcessForm (props) {
  const {
    datasets,
    setDatasets,
    datasetIndex,
    setDatasetIndex
  } = props

  /**
   * @typedef {Object} ColumnType_t
   * @property {string} column_name
   * @property {string} column_type
   */
  const [columns, setColumns] = useState(/**@type ColumnType_t[]*/[])
  /**
   * @typedef {Object} Transoformation_t
   * @property {string} column_name
   * @property {string} column_transform
   */
  const [listTransformations, setListTransformations] = useState(/**@type DataFrameColumnTransform_t[]*/[])
  const [typeScaler, setTypeScaler] = useState('min-max-scaler')
  const [columnNameTarget, setColumnNameTarget] = useState('')

  const { t } = useTranslation()
  const prefix = 'form-dataframe.'

  useEffect(() => {
    const _columns = datasets[datasetIndex].dataframe_original.columns
    const _dtypes = datasets[datasetIndex].dataframe_original.dtypes

    const _c_name_type = _columns.map((_, index) => {
      return { column_name: _columns[index], column_type: _dtypes[index] }
    })

    const _listTransformations = _c_name_type.map(({ column_name, column_type }, index) => {
      const _column_transform = (column_type === 'string') ? 'label-encoder' : column_type
      return { column_name: column_name, column_transform: _column_transform }
    })
    setColumns(_c_name_type)
    setColumnNameTarget(_columns[0])
    setListTransformations(_listTransformations)
    console.log({ d: datasets[datasetIndex].dataframe_original, _c_name_type, _listTransformations })
  }, [datasets, datasetIndex])

  useEffect(() => {
    datasets[datasetIndex].dataframe_original.plot('plot_original').table({
      config: TABLE_PLOT_STYLE_CONFIG,
      layout: {
        title: t('dataframe-original')
      }
    })
  }, [datasets, datasetIndex, t])

  useEffect(() => {
    if (!datasets[datasetIndex].is_dataset_processed) {
      console.log('!datasets[datasetIndex].is_dataset_processed')
      return
    }
    if (datasets[datasetIndex].dataframe_processed === null) {
      console.log('!datasets[datasetIndex].dataframe_processed')
      return
    }

    datasets[datasetIndex].dataframe_processed.plot('plot_processed').table({
      config: TABLE_PLOT_STYLE_CONFIG, layout: {
        title: t('dataframe-processed')
      }
    })
  }, [datasets, datasetIndex, t])

  const handleChange_cType = (e, columnName, setArray) => {
    setListTransformations((prevState) =>
      prevState.map((oldColumn) =>
        (oldColumn.column_name === columnName) ? { ...oldColumn, column_transform: e.target.value } : oldColumn
      )
    )
  }

  const handleSubmit_ProcessDataset = async (event) => {
    event.preventDefault()
    const map_encoders = {}
    let scaler
    if (typeScaler === 'min-max-scaler') {
      scaler = new dfd.MinMaxScaler()
    } else if (typeScaler === 'standard-scaler') {
      scaler = new dfd.StandardScaler()
    }
    const classes = []
    const attributes = []
    const column_name_target = 'class'
    const dataProcessed = {
      missing_values    : false,
      missing_value_key : '',
      column_name_target: column_name_target,
      classes           : classes,
      encoders          : map_encoders,
      scaler            : scaler,
      attributes        : attributes
    }
    await alertHelper.alertSuccess(t('preprocessing.title'), { text: t('alert.success') })
  }

  if (VERBOSE) console.debug('render TabularClassificationDatasetForm')
  return <>
    <Form onSubmit={handleSubmit_ProcessDataset}>
      <Row>
        <Col>
          <details open>
            <summary className="n4l-summary"><Trans i18nKey="dataframe-form" /></summary>
            <hr />
            <Row>
              <Col><h4><Trans i18nKey="preprocessing.transformations-columns" /></h4></Col>
            </Row>

            <Row className="mt-3" md={2} lg={3} xl={4} xxl={6}>
              {listTransformations
                .map(({ column_name, column_transform }, index) => {
                  return <Col key={index}>
                    <Form.Group controlId={'FormControl_' + column_name} className="mt-2">
                      <Form.Label><b>{column_name}</b></Form.Label>
                      <Form.Select aria-label="select"
                                   size="sm"
                                   value={column_transform}
                                   onChange={(e) => handleChange_cType(e, column_name)}>
                        <>
                          {DEFAULT_OPTIONS.map((optionValue, optionIndex) => {
                            return <option key={column_name + '_option_' + optionIndex}
                                           value={optionValue.value}>
                              <Trans i18nKey={prefix + optionValue.i18n} />
                            </option>
                          })}
                        </>
                      </Form.Select>
                      <Form.Text className="text-muted">{column_transform}</Form.Text>
                    </Form.Group>
                  </Col>
                })}
            </Row>

            <hr />

            <Row>
              <Col><h4><Trans i18nKey="preprocessing.transformations-set-X" /></h4></Col>
            </Row>
            <Row>
              <Col>
                <Form.Group controlId="FormControl_Scaler">
                  <Form.Label><b>Scaler</b> {typeScaler}</Form.Label>
                  <Form.Select aria-label="Selecciona un escalador"
                               size="sm"
                               defaultValue="min-max-scaler"
                               onChange={(e) => setTypeScaler(e.target.value)}>
                    <option value="min-max-scaler">MinMaxScaler</option>
                    <option value="standard-scaler">StandardScaler</option>
                  </Form.Select>
                  <Form.Text className="text-muted">Scaler</Form.Text>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="FormControl_ColumnNameTarget">
                  <Form.Label><b>ColumnNameTarget</b> {columnNameTarget}</Form.Label>
                  <Form.Select aria-label={'Selecciona un '}
                               size="sm"
                               value={columnNameTarget}
                               onChange={(e) => setColumnNameTarget(e.target.value)}>
                    <>
                      {columns.map(({column_name}, index) => {
                        return <option value={column_name} key={index}>{column_name}</option>
                      })}
                    </>
                  </Form.Select>
                  <Form.Text className="text-muted">ColumnNameTarget</Form.Text>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <div className="d-grid gap-2">
                  <Button type="submit" className="mt-3">
                    <Trans i18nKey={prefix + 'submit'} />
                  </Button>
                </div>
              </Col>
            </Row>
          </details>
        </Col>
      </Row>
      <hr />
      <Row>
        <Col xs={12} sm={12} md={12} lg={12} xxl={12}>
          <details>
            <summary className="n4l-summary"><Trans i18nKey="dataframe-original" /></summary>
            <main>
              <Row>
                <Col>
                  <div id="plot_original" />
                </Col>
              </Row>
            </main>
          </details>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} xxl={12}>
          <details>
            <summary className="n4l-summary"><Trans i18nKey="dataframe-processed" /></summary>
            <main>
              <Row>
                <Col>
                  <div id="plot_processed" />
                </Col>
              </Row>
            </main>
          </details>
        </Col>
      </Row>
    </Form>
  </>
}
