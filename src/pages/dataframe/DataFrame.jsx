import React, { useState } from 'react'
import { Container, Row, Col, Card, Button } from 'react-bootstrap'
import { Trans, useTranslation } from 'react-i18next'
import * as dfd from 'danfojs'

import AlertHelper from '@utils/alertHelper'

import WaitingCircle from '@components/loading/WaitingCircle'
import DragAndDrop from '@components/dragAndDrop/DragAndDrop'

import { DataFramePlotProvider } from '@components/_context/DataFramePlotContext'
import DataFramePlot from '@components/dataframe/DataFramePlot'
import DataFrameCorrelationMatrix from '@components/dataframe/DataFrameCorrelationMatrix'
import DataFrameQuery from '@components/dataframe/DataFrameQuery'
import DataFrameDescribe from '@components/dataframe/DataFrameDescribe'


export default function DataFrame () {
  const prefix = 'pages.dataframe.'
  const { t } = useTranslation()

  const [dataframe, setDataFrame] = useState(/**@type dfd.DataFrame*/ new dfd.DataFrame())
  const [waiting, setWaiting] = useState(true)

  const handleFileUpload_CSV_Accepted = async (files, event) => {
    const file_dataframe = new File([files[0]], files[0].name, { type: files[0].type })
    try {
      setWaiting(true)
      const data = await dfd.readCSV(file_dataframe)
      setDataFrame(data)
      await AlertHelper.alertSuccess(t('success.file-upload'))
    } catch (e) {
      await AlertHelper.alertError(t('error.parsing-csv'))
      console.log(e)
    } finally {
      setWaiting(false)
    }
  }

  const handleFileUpload_CSV_Rejected = async (files, event) => {
    console.error({ files, event })
    await AlertHelper.alertError(t('error.file-not-valid', { title: 'Error' }))
  }


  /**
   *
   * @param _dataframe
   * @param column_name_x
   * @param column_name_y
   * @return {number}
   */

  return <>
    <Container className={'mt-3 mb-3'}>
      <h1><Trans i18nKey={prefix + 'title'} /></h1>
      <Row className={'mt-3'}>
        <Col>
          <Card>
            <Card.Header><h3><Trans i18nKey={prefix + 'upload-csv'} /></h3></Card.Header>
            <Card.Body>
              <DragAndDrop name={'csv'}
                           id={'dataset-upload'}
                           accept={{ 'text/csv': ['.csv'] }}
                           text={t('drag-and-drop.csv')}
                           labelFiles={t('drag-and-drop.label-files-one')}
                           function_DropAccepted={handleFileUpload_CSV_Accepted}
                           function_DropRejected={handleFileUpload_CSV_Rejected}
              />

              {waiting && dataframe.columns.length !== 0 &&
                <Row>
                  <Col>
                    <div className={'d-flex justify-content-center'}>
                      <WaitingCircle />
                    </div>
                  </Col>
                </Row>
              }
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className={'mt-3'}>
        <Col>
          <DataFrameDescribe dataframe={dataframe} />
        </Col>
      </Row>

      <Row className={'mt-3'}>
        <Col>
          <DataFramePlotProvider>
            <DataFramePlot dataframe={dataframe} />
          </DataFramePlotProvider>
        </Col>
      </Row>

      <Row className={'mt-3'}>
        <Col>
          <DataFrameCorrelationMatrix dataframe={dataframe} />
        </Col>
      </Row>

      <Row className={'mt-3'}>
        <Col>
          <DataFrameQuery dataframe={dataframe} />
        </Col>
      </Row>
    </Container>
  </>

}