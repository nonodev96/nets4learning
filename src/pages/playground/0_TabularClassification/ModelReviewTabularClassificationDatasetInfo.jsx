import React, { useEffect } from 'react'
import { Trans } from 'react-i18next'
import { Card } from 'react-bootstrap'
import { UPLOAD } from '@/DATA_MODEL'

export default function ModelReviewTabularClassificationDatasetInfo (props) {

  const { dataset, iModelInstance } = props

  useEffect(() => {
    console.log(iModelInstance)
  }, [iModelInstance])

  return <>
    <Card className={'mt-3'}>
      <Card.Header>
        <h3><Trans i18nKey={'pages.playground.0-tabular-classification.general.description-input'} /></h3>
      </Card.Header>
      <Card.Body>
        {dataset === UPLOAD && <>
          <p>
            <Trans i18nKey={'datasets-models.0-tabular-classification.upload.html-example.text'} /><br />
            <b><Trans i18nKey={'datasets-models.0-tabular-classification.upload.html-example.items'} /></b>
          </p>
        </>}
        {dataset !== UPLOAD && <>{iModelInstance.HTML_EXAMPLE()}</>}
      </Card.Body>
    </Card>
  </>
}