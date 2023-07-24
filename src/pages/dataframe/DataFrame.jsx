import React, { useState } from 'react'
import { Container, Row, Col, Card } from 'react-bootstrap'
import { Trans, useTranslation } from 'react-i18next'
import * as dfd from 'danfojs'

import DragAndDrop from '@components/dragAndDrop/DragAndDrop'
import DataFramePlot from '@components/dataframe/DataFramePlot'
import { DataFramePlotProvider } from '@components/_context/DataFramePlotContext'
import alertHelper from '@utils/alertHelper'

export default function DataFrame () {
  const prefix = 'pages.dataframe.'
  const { t } = useTranslation()

  const [dataframe, setDataFrame] = useState(/**@type dfd.DataFrame*/ new dfd.DataFrame())
  const handleFileUpload_CSV_Accepted = async (files, event) => {
    const file_dataframe = new File([files[0]], files[0].name, { type: files[0].type })
    setDataFrame(await dfd.readCSV(file_dataframe))
  }

  const handleFileUpload_CSV_Rejected = async (files, event) => {
    console.error({ files, event })
    await alertHelper.alertError(t('error.file-not-valid', { title: 'Error' }))
  }

  return <>
    <Container className={'mb-3'}>
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
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className={'mt-3'}>
        <Col>
          <DataFramePlotProvider>
            <DataFramePlot dataframe={dataframe} />
          </DataFramePlotProvider>
        </Col>
      </Row>
    </Container>
  </>
}