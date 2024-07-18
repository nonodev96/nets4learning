import React, { useState, useId, useEffect } from 'react'
import { Button, Form, Row, Col } from 'react-bootstrap'
import { Trans , useTranslation } from 'react-i18next'

import { DataFrameTransform, DataFrameDeepCopy } from '@core/dataframe/DataFrameUtils'
import AlertHelper from '@/utils/alertHelper'
import { DataFrame } from 'danfojs'
import { TABLE_PLOT_STYLE_CONFIG__STYLE_N4L_2 } from '@/CONSTANTS_DanfoJS'


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
  const prefix = ''

  const { t } = useTranslation()

  const plotDataFrameOriginalID = useId()
  const plotDataFrameProcessedID = useId()

  const [showDetails, setShowDetails] = useState({
    show_dataframe_original : false,
    show_dataframe_form     : true,
    show_dataframe_processed: false,
  })



  useEffect(()=>{
    dataFrameOriginal
      .plot(plotDataFrameOriginalID)
      .table({ config: TABLE_PLOT_STYLE_CONFIG__STYLE_N4L_2 })
  }, [dataFrameOriginal, plotDataFrameOriginalID])

  const handleSubmit_ProcessDataFrame = async (event) => {
    event.preventDefault()

    console.log(dataFrameOriginal)
    let dataframe_processed = DataFrameDeepCopy(dataFrameOriginal)
    // TODO


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