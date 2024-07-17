import React, { useEffect, useState } from 'react'
import { Card } from 'react-bootstrap'
import { Trans } from 'react-i18next'

import WaitingPlaceholder from '@components/loading/WaitingPlaceholder'
import DataFrameShow from './DataFrameShow'

export default function DataFrameShowCard({ dataframe }) {

  const [showDataFrame, setShowDataFrame] = useState(false)

  useEffect(()=>{
    setShowDataFrame(dataframe.columns.length !== 0)
  }, [dataframe])

  return <>
    <Card className={'mt-3'}>
      <Card.Header className={'d-flex align-items-center justify-content-between'}>
        <h3><Trans i18nKey={'dataframe.dataset.title'} /></h3>
      </Card.Header>
      <Card.Body>
        {!showDataFrame &&
          <WaitingPlaceholder title={'Waiting'} />
        }
        {showDataFrame && <>
          <DataFrameShow dataframe={dataframe} />
        </>}
      </Card.Body>
    </Card>
  </>
}