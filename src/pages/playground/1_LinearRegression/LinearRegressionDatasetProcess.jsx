import React, { useContext } from 'react'
import { Card } from 'react-bootstrap'
import { Trans } from 'react-i18next'
import { Link } from 'react-router-dom'

import LinearRegressionContext from '@context/LinearRegressionContext'
import WaitingPlaceholder from '@components/loading/WaitingPlaceholder'
import { VERBOSE } from '@/CONSTANTS'
import { GLOSSARY_ACTIONS } from '@/CONSTANTS_ACTIONS'
import LinearRegressionDatasetProcessForm from './LinearRegressionDatasetProcessForm'

export default function LinearRegressionDatasetProcess() {

  const {
    datasets,
    indexDatasetSelected 
  } = useContext(LinearRegressionContext)

  const showDatasetProcess = () => {
    return datasets[indexDatasetSelected].is_dataset_upload
  }

  if (VERBOSE) console.debug('render LinearRegressionDatasetProcess')
  return <>
    <Card className="mt-3">
      <Card.Header><h3><Trans i18nKey={'Data set processing'} /></h3></Card.Header>
      <Card.Body>
        {!showDatasetProcess() && <>
          <WaitingPlaceholder title={'pages.playground.generator.waiting-for-file'} />
        </>}

        {showDatasetProcess() && <>
          <LinearRegressionDatasetProcessForm  />
        </>}
      </Card.Body>
      <Card.Footer className="text-end">
        <p className="text-muted mb-0 pb-0">
          <Trans i18nKey="more-information-in-link"
            components={{
              link1: <Link className="text-info"
                to={{
                  pathname: '/glossary/',
                  state   : {
                    action: GLOSSARY_ACTIONS.TABULAR_CLASSIFICATION.STEP_1_UPLOAD_AND_PROCESS
                  }
                }} />
            }}
          />
        </p>
      </Card.Footer>
    </Card>
  </>
}