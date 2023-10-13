import React, { useEffect, useState } from 'react'
import { Card, Col, Row, Form } from 'react-bootstrap'
import { Trans, useTranslation } from 'react-i18next'
import N4LTablePagination from '@components/table/N4LTablePagination'
import * as DataFrameUtils from '@core/dataframe/DataFrameUtils'
import { VERBOSE } from '@/CONSTANTS'

export default function TabularClassificationDatasetShow (props) {
  const { datasets, datasetIndex } = props
  const prefix = 'pages.playground.generator.dataset.'
  const { t } = useTranslation()

  const [showProcessed, setShowProcessed] = useState(false)
  const [showDataset, setShowDataset] = useState(false)

  const handleChange_Dataset = (e) => {
    const checked = e.target.checked
    setShowProcessed(!!checked)
  }

  useEffect(() => {
    const canRenderDataset = () => {
      if (datasets && datasets.length > 0 && datasetIndex >= 0) {
        if (datasets[datasetIndex].is_dataset_processed)
          return true
      }
      return false
    }
    setShowDataset(canRenderDataset())
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
                        label={t('processed')}
                        defaultValue={'false'}
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

              <N4LTablePagination data_head={datasets[datasetIndex].dataframe_processed.columns}
                                  data_body={
                                    DataFrameUtils.DataFrameIterRows(
                                      showProcessed ?
                                        datasets[datasetIndex].dataframe_processed
                                        :
                                        datasets[datasetIndex].dataframe_original,
                                    )
                                  }
              />
            </Col>
          </Row>
        </>}
      </Card.Body>
      {showDataset &&
        <Card.Footer>
          <Row>
            <Col lg={10}>
              <details>
                <summary className={'n4l-summary'}><Trans i18nKey={prefix + 'attributes.title'} /></summary>
                <main>
                  <Row>
                    {datasets[datasetIndex].attributes.map((item, i1) => {
                      return <Col lg={2} md={2} sm={3} xs={3} key={i1}>
                        <p><b>{item.name}</b></p>
                        {item.type === 'int32' && <p><Trans i18nKey={prefix + 'attributes.int32'} /></p>}
                        {item.type === 'float32' && <p><Trans i18nKey={prefix + 'attributes.float32'} /></p>}
                        {item.type === 'label-encoder' && <>
                          <ol start="0">
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
                  <div className={'n4l-list'}>
                    <ol start="0">
                      {datasets[datasetIndex].classes.map((item, index) => {
                        return <li key={'_' + index}>{item.name}</li>
                      })}
                    </ol>
                  </div>
                </main>
              </details>
            </Col>
          </Row>
        </Card.Footer>
      }

    </Card>
  </>
}