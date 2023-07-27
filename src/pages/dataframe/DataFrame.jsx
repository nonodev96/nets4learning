import React, { useEffect, useId, useState } from 'react'
import { Container, Row, Col, Card, Button } from 'react-bootstrap'
import { Trans, useTranslation } from 'react-i18next'
import * as dfd from 'danfojs'

import DragAndDrop from '@components/dragAndDrop/DragAndDrop'
import { DataFramePlotProvider } from '@components/_context/DataFramePlotContext'
import DataFramePlot from '@components/dataframe/DataFramePlot'
import DataFrameCorrelationMatrix from '@components/dataframe/DataFrameCorrelationMatrix'

import AlertHelper from '@utils/alertHelper'
import { TABLE_PLOT_STYLE_CONFIG } from '@/CONSTANTS_DanfoJS'
import WaitingPlaceholder from '@components/loading/WaitingPlaceholder'
import WaitingCircle from '@components/loading/WaitingCircle'

export default function DataFrame () {
  const prefix = 'pages.dataframe.'
  const { t } = useTranslation()

  const dataframeID = useId()
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

  const handleClick_OpenModal_Describe = () => {

  }

  /**
   *
   * @param _dataframe
   * @param column_name_x
   * @param column_name_y
   * @return {number}
   */

  useEffect(() => {
    if (dataframe.columns.length > 0) {
      dataframe.describe().T.plot(dataframeID).table({ config: TABLE_PLOT_STYLE_CONFIG })
    }
  }, [dataframe, dataframeID])

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
          <Card>
            <Card.Header className={'d-flex align-items-center justify-content-between'}>
              <h3><Trans i18nKey={'DataFrame Describe'} /></h3>
              <div className="d-flex">
                <Button onClick={handleClick_OpenModal_Describe}
                        size={'sm'}
                        variant={'outline-primary'}>
                  Descripción {/*<Trans i18nKey={''} />*/}
                </Button>
              </div>
            </Card.Header>
            <Card.Body>
              {dataframe.columns.length === 0 &&
                <WaitingPlaceholder title={t('Waiting')} />
              }
              <div id={dataframeID}></div>
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

      <Row className={'mt-3'}>
        <Col>

          <DataFrameCorrelationMatrix dataframe={dataframe} />

        </Col>
      </Row>
    </Container>
  </>

}