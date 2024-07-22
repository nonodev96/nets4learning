import React, { useState, useId, useEffect } from 'react'
import { Button, Form, Row, Col } from 'react-bootstrap'
import { Trans, useTranslation } from 'react-i18next'

import * as _Types from '@/core/types'
import { DataFrameTransform, DataFrameDeepCopy } from '@core/dataframe/DataFrameUtils'
import AlertHelper from '@/utils/alertHelper'
import { DataFrame } from 'danfojs'
import { TABLE_PLOT_STYLE_CONFIG__STYLE_N4L_1, F_TABLE_PLOT_STYLE_CONFIG__STYLE_N4L_2 } from '@/CONSTANTS_DanfoJS'
import { VERBOSE } from '@/CONSTANTS'

// @formatter:off
const DEFAULT_OPTIONS = [
  { value: 'int32', i18n: 'int32' },
  { value: 'float32', i18n: 'float32' },
  { value: 'string', i18n: 'string' },
  { value: 'label-encoder', i18n: 'label-encoder' },
  { value: 'drop', i18n: 'drop' },
]
// @formatter:on
/**
 * @typedef PreProcessDataFrameProps_t
 * @property {DataFrame} dataFrameOriginal
 * @property {React.Dispatch<React.SetStateAction<DataFrame>>} setDataFrameOriginal
 * @property {DataFrame} dataFrameProcessed
 * @property {React.Dispatch<React.SetStateAction<DataFrame>>} setDataFrameProcessed
 * @property {boolean} isDataFrameProcessed
 * @property {React.Dispatch<React.SetStateAction<boolean>>} setIsDataFrameProcessed
 */
/**
 * 
 * @param {PreProcessDataFrameProps_t} props 
 * @returns 
 */
export default function PreProcessDataFrame(props) {

  const {
    dataFrameOriginal,
    setDataFrameOriginal,
    dataFrameProcessed,
    setDataFrameProcessed,
    isDataFrameProcessed,
    setIsDataFrameProcessed
  } = props

  const prefix = 'form-dataframe.'
  const { t } = useTranslation()

  const plotDataFrameOriginalID = useId()
  const plotDataFrameProcessedID = useId()

  /**
   * @type {ReturnType<typeof useState<Array<_Types.DataFrameColumnTypeEnable_t>>>}
   */
  const [listColumnNameType, setListColumnNameTypes] = useState([])
    /**
   * @type {ReturnType<typeof useState<_Types.DataFrameColumnTransformEnable_t[]>>}
   */
  const [listColumnNameTransformations, setListColumnNameTransformations] = useState([])
  const [columnNameTarget, setColumnNameTarget] = useState('')


  const [typeScaler, setTypeScaler] = useState('min-max-scaler')
  
  useEffect(() => {
    /** @type _Types.DataFrameColumnType_t[] */
    const _listColumnNameType = dataFrameOriginal.columns.map((_, index) => {
      return {
        column_name     : dataFrameOriginal.columns[index],
        column_type     : dataFrameOriginal.dtypes[index],
        column_enable   : true,
        column_transform: dataFrameOriginal.dtypes[index],
      }
    })
    const _listTransformations = _listColumnNameType.map(({ column_name, column_type }) => {
      const _column_transform = (column_type === 'string') ? 'label-encoder' : column_type
      return { 
        column_name     : column_name, 
        column_type     : column_type,
        column_enable   : true,
        column_transform: _column_transform,
      }
    })
    setColumnNameTarget(dataFrameOriginal.columns[dataFrameOriginal.columns.length - 1])
    setListColumnNameTypes(_listColumnNameType)
    setListColumnNameTransformations(_listTransformations)
  }, [dataFrameOriginal])

  const [showDetails, setShowDetails] = useState({
    show_dataframe_original : false,
    show_dataframe_form     : true,
    show_dataframe_processed: false,
  })

  useEffect(() => {
    dataFrameOriginal
      .plot(plotDataFrameOriginalID)
      .table({
        config: TABLE_PLOT_STYLE_CONFIG__STYLE_N4L_1,
        layout: {
          title: t('dataframe-original'),
        },
       })
  }, [dataFrameOriginal, plotDataFrameOriginalID, t])
  
  useEffect(() => {
    dataFrameProcessed
      .plot(plotDataFrameProcessedID)
      .table({ 
        config: F_TABLE_PLOT_STYLE_CONFIG__STYLE_N4L_2(dataFrameProcessed.columns, columnNameTarget),
        layout: {
          title: t('dataframe-processed'),
        },
      })
  }, [dataFrameProcessed, plotDataFrameProcessedID, t])

  const handleChange_ColumnTransformEnable = (e, column_name) => {
    setListColumnNameTransformations((prevState) =>{
      return prevState.map((oldColumn) => {
        if (oldColumn.column_name === column_name){
          return { ...oldColumn, column_enable: e.target.checked, column_transform: 'drop' }
        }
        return { ...oldColumn }
      })
    })
  }

  const handleChange_ColumnTransform = (e, column_name) => {
    setListColumnNameTransformations((prevState) =>
      prevState.map((oldColumn) =>
        (oldColumn.column_name === column_name) ? { ...oldColumn, column_transform: e.target.value } : oldColumn,
      )
    )
  }

  const handleChange_ColumnNameTarget = (e) => {
    setColumnNameTarget(e.target.value)
    setListColumnNameTransformations((prevState) =>
      prevState.map((oldColumn) =>
        (oldColumn.column_name === e.target.value) ? { ...oldColumn, column_transform: 'label-encoder' } : oldColumn,
      )
    )
  }


  const handleSubmit_ProcessDataFrame = async (event) => {
    event.preventDefault()

    console.log(dataFrameOriginal)
    let dataframe_processed = DataFrameDeepCopy(dataFrameOriginal)
    // TODO
    dataframe_processed = DataFrameTransform(dataframe_processed, listColumnNameTransformations)


    setDataFrameProcessed(dataframe_processed)
    setIsDataFrameProcessed(true)
    setShowDetails(() => {
      return {
        show_dataframe_original : false,
        show_dataframe_form     : false,
        show_dataframe_processed: true,
      }
    })

    await AlertHelper.alertSuccess(t('preprocessing.title'), { text: t('alert.success') })
  }

  if (VERBOSE) console.log('render PreProcessDataFrame')
  return <>
    <Row>
      <Col>
        <details className='border p-2 rounded-2' open={showDetails.show_dataframe_original}>
          <summary className="n4l-summary-1-25"><Trans i18nKey="dataframe-original" /></summary>
          <main>
            <Row>
              <Col>
                <div id={plotDataFrameOriginalID} />
              </Col>
            </Row>
          </main>
        </details>
      </Col>
    </Row>
    <hr />
    <Row>
      <Col>
        <Form onSubmit={handleSubmit_ProcessDataFrame}>
          <details className='border p-2 rounded-2' open={showDetails.show_dataframe_form}>
            <summary className="n4l-summary-1-25"><Trans i18nKey="dataframe-form" /></summary>

            <hr />
            <Row>
              <Col><h4><Trans i18nKey="preprocessing.transformations-set-X" /></h4></Col>
            </Row>
            <Row>
              <Col>
                <Form.Group controlId="FormControl_Scaler">
                  <Form.Label><b><Trans i18nKey={'Scaler'} /></b> {typeScaler}</Form.Label>
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
                  <Form.Label><b><Trans i18nKey={'Column target'} /></b> {columnNameTarget}</Form.Label>
                  <Form.Select aria-label={'Selecciona un '}
                               size="sm"
                               value={columnNameTarget}
                               onChange={handleChange_ColumnNameTarget}>
                    <>
                      {listColumnNameType.map(({ column_name }, index) => {
                        return <option value={column_name} key={index}>{column_name}</option>
                      })}
                    </>
                  </Form.Select>
                  <Form.Text className="text-muted">{columnNameTarget}</Form.Text>
                </Form.Group>
              </Col>
            </Row>

            <hr />
            <Row>
              <Col><h4><Trans i18nKey="preprocessing.transformations-columns" /></h4></Col>
            </Row>
            <Row xs={1} sm={2} md={3} lg={3} xl={4} xxl={4} className='g-2'>
              {listColumnNameTransformations.map(({ column_enable, column_name, column_type, column_transform,  }, index) => {
                return <Col key={'listColumnNameTransformations_' + index} >
                  <div className={'border border-1 rounded p-2 ' + (column_name === columnNameTarget ? 'border-info':'')} >
                    <Form.Check
                      type="switch"
                      id={'column-switch-' + column_name}
                      reverse={false}
                      size={'sm'}
                      name={'column-switch-' + column_name}
                      label={column_enable ? 'Enable' : 'Disabled'}
                      checked={column_enable}
                      onChange={(e) => handleChange_ColumnTransformEnable(e, column_name)}
                    />
                    <Form.Group controlId={'FormControl_' + column_name} className="mt-2">
                      <Form.Label><b>{column_name}</b></Form.Label>
                      <Form.Select
                        aria-label="select"
                        size="sm"
                        disabled={column_enable === false}
                        value={column_transform}
                        onChange={(e) => handleChange_ColumnTransform(e, column_name)}>
                        <>
                          {DEFAULT_OPTIONS.map((optionValue, optionIndex) => {
                            return <option key={column_name + '_option_' + optionIndex}
                              value={optionValue.value}>
                              <Trans i18nKey={prefix + optionValue.i18n} />
                            </option>
                          })}
                        </>
                      </Form.Select>
                      <Form.Text className="text-muted">Dtype: [{column_type}] -&gt; {column_transform}</Form.Text>
                    </Form.Group>
                  </div>
                </Col>
              })}
            </Row>

            <hr />
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
        </Form>
      </Col>
    </Row>
    <hr />
    <Row>
      <Col>
        <details className='border p-2 rounded-2' open={showDetails.show_dataframe_processed}>
          <summary className="n4l-summary-1-25"><Trans i18nKey="dataframe-processed" /></summary>
          <main>
            <Row>
              <Col>
                <div id={plotDataFrameProcessedID} />
              </Col>
            </Row>
          </main>
        </details>
      </Col>
    </Row>
  </>
}