import React, { useEffect, useState } from 'react'
import { Card, Col, Form, Row } from 'react-bootstrap'
import { Trans, useTranslation } from 'react-i18next'
import * as dfd from 'danfojs'
import * as DataFrameUtils from '@core/dataframe/DataFrameUtils'
import N4LTablePagination from '@components/table/N4LTablePagination'
import { VERBOSE } from '@/CONSTANTS'
import { Link } from 'react-router-dom'

export default function TabularClassificationDatasetShow (props) {
  const { datasets, datasetIndex } = props
  const prefix = 'pages.playground.generator.dataset.'
  const { t } = useTranslation()

  const [dataframe, setDataframe] = useState(new dfd.DataFrame())
  const [showProcessed, setShowProcessed] = useState(false)
  const [showDataset, setShowDataset] = useState(false)

  const handleChange_Dataset = (e) => {
    const checked = e.target.checked
    setShowProcessed(!!checked)
    if (!!checked) {
      setDataframe(datasets[datasetIndex].dataframe_processed)
    } else {
      setDataframe(datasets[datasetIndex].dataframe_original)
    }
  }

  useEffect(() => {
    const canRenderDataset = () => {
      if (datasets && datasets.length > 0 && datasetIndex >= 0) {
        if (datasets[datasetIndex].is_dataset_processed)
          return true
      }
      return false
    }

    const _showDataset = canRenderDataset()
    setShowDataset(_showDataset)
    if (_showDataset) {
      setDataframe(datasets[datasetIndex].dataframe_original)
    }
  }, [datasets, datasetIndex])

  if (VERBOSE) console.debug('render TabularClassificationDatasetShow')
  return <>
    <Card className={'mt-3'}>
      <Card.Header className={'d-flex align-items-center justify-content-between'}>
        <h3><Trans i18nKey={prefix + 'title'} /></h3>
        <div className={'d-flex'}>
          <div key={'default-switch'}>
            <Form.Check type="switch"
                        id={'default-switch'}
                        reverse={true}
                        size={'sm'}
                        name={'switch-webcam'}
                        label={t('Processed')}
                        value={showProcessed.toString()}
                        onChange={(e) => handleChange_Dataset(e)}
            />
          </div>
        </div>
      </Card.Header>
      <Card.Body>
        {!showDataset && <>
          <p className="placeholder-glow">
            <small className={'text-muted'}><Trans i18nKey={'pages.playground.generator.waiting-for-file'} /></small>
            <span className="placeholder col-12"></span>
          </p>
        </>}
        {showDataset && <>
          <Row>
            <Col className={'overflow-x-auto'}>
              <N4LTablePagination data_head={dataframe.columns}
                                  data_body={DataFrameUtils.DataFrameIterRows(dataframe)}
              />
            </Col>
          </Row>
          <hr />
          <Row>
            <Col lg={10}>
              <details>
                <summary className={'n4l-summary'}><Trans i18nKey={prefix + 'attributes.title'} /></summary>
                <main>
                  <Row xs={3} sm={3} md={3} lg={4}>
                    {datasets[datasetIndex].data_processed.attributes.map((item, i1) => {
                      return <Col key={i1}>
                        <p className={'mb-0'}><b>{item.name}</b></p>
                        {item.type === 'int32' && <p className={'mb-0'}><Trans i18nKey={prefix + 'attributes.int32'} /></p>}
                        {item.type === 'float32' && <p className={'mb-0'}><Trans i18nKey={prefix + 'attributes.float32'} /></p>}
                        {item.type === 'label-encoder' && <>
                          <p className={'mb-0'}>LabelEncoder:</p>
                          <ol className={'n4l-ol-label-encoder'} start="0">
                            {item.options.map((option, i2) => {
                              return <li key={i1 + '_' + i2}>{option.text}</li>
                            })}
                          </ol>
                        </>}
                      </Col>
                    })}
                  </Row>
                </main>
              </details>
            </Col>
            <Col lg={2}>
              <details>
                <summary className={'n4l-summary'}><Trans i18nKey={prefix + 'attributes.classes'} /></summary>
                <main>
                  <Row>
                    <Col>
                      <p className={'mb-0'}><b>{datasets[datasetIndex].data_processed.column_name_target}</b></p>
                      <p className={'mb-0'}>LabelEncoder:</p>
                      <ol className={'n4l-ol-label-encoder'} start="0">
                        {datasets[datasetIndex].data_processed.classes.map((item, index) => {
                          return <li key={index}>{item}</li>
                        })}
                      </ol>
                    </Col>
                  </Row>
                </main>
              </details>
            </Col>
          </Row>
        </>}
      </Card.Body>
      <Card.Footer className={'d-flex justify-content-end'}>
        <p className={'text-muted mb-0 pb-0'}>
          <Trans i18nKey={'more-information-in-link'}
                 components={{
                   link1: <Link className={'text-info'}
                                to={{
                                  pathname: '/manual/',
                                  state   : {
                                    action: 'tabular-classification-dataset-open',
                                  },
                                }}
                   />,
                 }} />
        </p>
      </Card.Footer>

    </Card>
  </>
}