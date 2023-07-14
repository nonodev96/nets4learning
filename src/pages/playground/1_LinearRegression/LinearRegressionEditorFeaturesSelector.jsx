import React, { useContext, useEffect } from 'react'
import { Form, Card } from 'react-bootstrap'
import { Trans } from 'react-i18next'

import LinearRegressionContext from '@context/LinearRegressionContext'

export default function LinearRegressionEditorFeaturesSelector () {

  const prefix = 'pages.playground.generator.editor-feature-selector.'
  const { datasetLocal, tmpModel, setTmpModel } = useContext(LinearRegressionContext)

  useEffect(() => {
    setTmpModel((prevState) => {
      return {
        ...prevState,
        feature_selector: {
          x_name: datasetLocal.dataframe_processed.columns[0],
          y_name: datasetLocal.dataframe_processed.columns[1]
        }
      }
    })
  }, [datasetLocal.dataframe_processed, setTmpModel])

  const handleChange_FeatureSelector = (e, _key) => {
    setTmpModel((prevState) => {
    console.log({ prevState })
      return {
        ...prevState,
        feature_selector: {
          ...prevState.feature_selector,
          [_key]: e.target.value
        }
      }
    })
  }

  return <>
    <Card>
      <Card.Header>
        <h3><Trans i18nKey={prefix + 'title'} /></h3>
      </Card.Header>
      <Card.Body>

        <Form.Group controlId={'feature-selector-x'}>
          <Form.Label>
            <Trans i18nKey={prefix + 'feature-selector-x'} />
          </Form.Label>
          <Form.Select aria-label={'feature selector x'}
                       value={tmpModel.feature_selector.x_name}
                       onChange={(e) => handleChange_FeatureSelector(e, 'x_name')}>
            {datasetLocal
              .dataframe_processed
              .columns
              .map((value, index) => {
                return (<option key={index} value={value}>{value}</option>)
              })}
          </Form.Select>
        </Form.Group>

        <Form.Group controlId={'feature-selector-y'}>
          <Form.Label>
            <Trans i18nKey={prefix + 'feature-selector-y'} />
          </Form.Label>
          <Form.Select aria-label={'feature selector y'}
                       value={tmpModel.feature_selector.y_name}
                       onChange={(e) => handleChange_FeatureSelector(e, 'y_name')}>
            {datasetLocal
              .dataframe_processed
              .columns
              .map((value, index) => {
                return (<option key={index} value={value}>{value}</option>)
              })}
          </Form.Select>
        </Form.Group>


      </Card.Body>
    </Card>
  </>
}