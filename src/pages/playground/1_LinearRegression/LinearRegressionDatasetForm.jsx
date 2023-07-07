import React, { useContext } from 'react'
import { Trans } from 'react-i18next'
import { Card } from 'react-bootstrap'
import LinearRegressionContext from '@context/LinearRegressionContext'

export default function LinearRegressionDatasetForm () {
  const prefix = 'pages.playground.generator.'
  const {
    i_model
  } = useContext(LinearRegressionContext)

  return <>
    <Card>
      <Card.Header>
        <h3><Trans i18nKey={prefix + 'dataset-form'} /></h3>
      </Card.Header>
      <Card.Body>
        <Card.Text>{i_model._KEY}</Card.Text>
      </Card.Body>
    </Card>
  </>
}