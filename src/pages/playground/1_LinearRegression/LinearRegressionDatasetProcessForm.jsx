import { useContext, useState, useId, useEffect } from 'react'
import { Button, Form, Row, Col } from 'react-bootstrap'
import { Trans, useTranslation } from 'react-i18next'

import { VERBOSE } from '@/CONSTANTS'
import { TABLE_PLOT_STYLE_CONFIG } from '@/CONSTANTS_DanfoJS'
import LinearRegressionContext from '@/context/LinearRegressionContext'

export default function LinearRegressionDatasetProcessForm() {

  const prefix = 'form-dataframe.'

  const plot_original_ID = useId()
  const plot_processed_ID = useId()

  const {
    datasetLocal,
    setDatasetLocal
  } = useContext(LinearRegressionContext)

  const { t } = useTranslation()

  const [showDetails, setShowDetails] = useState({
    show_dataframe_original : false,
    show_dataframe_form     : true,
    show_dataframe_processed: false,
  })

  const handleSubmit_ProcessDataset = async (event) => {
    event.preventDefault()
    
    datasetLocal
      .dataframe_processed
      .plot(plot_processed_ID)
      .table({
        config: TABLE_PLOT_STYLE_CONFIG,
        layout: {
          title: t('dataframe-processed'),
        },
      })

      setDatasetLocal((prevState)=>({
        ...prevState,
        is_dataset_processed: true
      }))
  }

  useEffect(() => {
    datasetLocal
      .dataframe_original
      .plot(plot_original_ID)
      .table({
        config: TABLE_PLOT_STYLE_CONFIG,
        layout: {
          title: t('dataframe-original'),
        },
      })
  }, [datasetLocal, t, plot_original_ID, plot_processed_ID])

  if (VERBOSE) console.debug('render LinearRegressionDatasetProcessForm')
  return <>
    <Row>
      <Col>
        <details className='border p-2 rounded-2' open={showDetails.show_dataframe_original}>
          <summary className="n4l-summary"><Trans i18nKey="dataframe-original" /></summary>
          <main>
            <Row>
              <Col>
                <div id={plot_original_ID} />
              </Col>
            </Row>
          </main>
        </details>
      </Col>
    </Row>
    <hr />
    <Row>
      <Col>
        <Form onSubmit={handleSubmit_ProcessDataset}>
          <details className='border p-2 rounded-2' open={showDetails.show_dataframe_form}>
            <summary className="n4l-summary"><Trans i18nKey="dataframe-form" /></summary>
            <hr />
            <Row>
              <Col><h4><Trans i18nKey="preprocessing.transformations-columns" /></h4></Col>
            </Row>
            <Row>
              <Col>
              
              </Col>
            </Row>

            <hr />
            <Row>
              <Col><h4><Trans i18nKey="preprocessing.transformations-set-X" /></h4></Col>
            </Row>
            <Row>
              <Col>
              
              </Col>
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
          <summary className="n4l-summary"><Trans i18nKey="dataframe-processed" /></summary>
          <main>
            <Row>
              <Col>
                <div id={plot_processed_ID} />
              </Col>
            </Row>
          </main>
        </details>
      </Col>
    </Row>
  </>
}