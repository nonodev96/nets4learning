import React from 'react'
import { Card } from 'react-bootstrap'
import { Trans } from 'react-i18next'

import { VERBOSE } from '@/CONSTANTS'
import { Link } from 'react-router-dom'
import TabularClassificationDatasetProcessForm
  from '@pages/playground/0_TabularClassification/TabularClassificationDatasetProcessForm'
import WaitingPlaceholder from '@components/loading/WaitingPlaceholder'

export default function TabularClassificationDatasetProcess (props) {
  const {
    datasets,
    setDatasets,
    datasetIndex,
    setDatasetIndex
  } = props

  const isFileUploaded = () => {
    if (datasets.length > 0 && datasetIndex >= 0) {
      return datasets[datasetIndex].is_dataset_upload
    }
  }

  if (VERBOSE) console.debug('render TabularClassificationDatasetProcess')
  return <>
    <Card className="mt-3">
      <Card.Header><h3><Trans i18nKey="Process dataset" /></h3></Card.Header>
      <Card.Body>
        {(!isFileUploaded()) && <>
          <WaitingPlaceholder title={'pages.playground.generator.waiting-for-file'} />
        </>}
        {(isFileUploaded()) && <>
          <TabularClassificationDatasetProcessForm datasets={datasets}
                                                   setDatasets={setDatasets}
                                                   datasetIndex={datasetIndex}
                                                   setDatasetIndex={setDatasetIndex}
          />
        </>}
      </Card.Body>
      <Card.Footer className="d-flex justify-content-end">
        <p className="text-muted mb-0 pb-0">
          <Trans i18nKey="more-information-in-link"
                 components={{
                   link1: <Link className="text-info"
                                to={{
                                  pathname: '/manual/',
                                  state   : {
                                    action: 'open-pre-process-dataframe-tabular-classification'
                                  }
                                }} />
                 }}
          />
        </p>
      </Card.Footer>
    </Card>
  </>
}
