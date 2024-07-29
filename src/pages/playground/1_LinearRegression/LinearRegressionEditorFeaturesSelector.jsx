import styles from './LinearRegression.module.css'
import React, { useContext, useEffect, useState } from 'react'
import { Card, Form } from 'react-bootstrap'
import { Trans } from 'react-i18next'

import { VERBOSE } from '@/CONSTANTS'
import LinearRegressionContext from '@context/LinearRegressionContext'
import WaitingPlaceholder from '@components/loading/WaitingPlaceholder'

/**
 * 
 * @deprecated
 */
export default function LinearRegressionEditorFeaturesSelector () {

  const prefix = 'pages.playground.generator.editor-feature-selector.'
  const { params, setParams, datasetLocal } = useContext(LinearRegressionContext)

  const [show, setShow] = useState(false)

  useEffect(() => {
    setShow(datasetLocal.is_dataset_processed)
  }, [setShow, datasetLocal.is_dataset_processed])

  const handleChange_FeatureSelector_Y = (e) => {
    setParams((prevState) => {
      return Object.assign({}, prevState, {
        params_features: {
          ...prevState.params_features,
          y_target: e.target.value
        }
      })
    })
  }

  const handleChange_FeatureSelector_X = (e) => {
    setParams((prevState) => {
      return Object.assign({}, prevState, {
        params_features: {
          ...prevState.params_features,
          X_feature: e.target.value
        }
      })
    })
  }

  useEffect(() => {
    if (VERBOSE) console.debug('useEffect [datasetLocal.dataframe_processed, setParams]')
    setParams((prevState) => {
      const X_features = new Set(datasetLocal.dataframe_processed.columns)
      const X_feature = datasetLocal.dataframe_processed.columns[0]
      const y_target = datasetLocal.dataframe_processed.columns[datasetLocal.dataframe_processed.columns.length - 1]
      return Object.assign({}, prevState, {
        params_features: {
          X_features: X_features,
          X_feature : X_feature,
          y_target  : y_target
        }
      })
    })
  }, [datasetLocal.dataframe_processed, setParams])

  if (VERBOSE) console.debug('render LinearRegressionEditorFeaturesSelector')
  return <>
    <Card>
      <Card.Header className={'d-flex align-items-center justify-content-between'}>
        <h3><Trans i18nKey={prefix + 'title'} /></h3>
        {/*
        <div className={'d-flex'}>
          <Button onClick={() => handlerClick_AddFeature()}
                  size={'sm'}
                  variant="outline-primary">
            <Trans i18nKey={prefix + 'add-feature'} />
          </Button>
        </div>
        */}
      </Card.Header>
      <Card.Body>

        {!show && <>
          <WaitingPlaceholder title={'pages.playground.generator.waiting-for-process'} />
        </>}
        {show && <>
          <Form.Group controlId={'feature-selector-X'}>
            <Form.Label>
              <Trans i18nKey={prefix + 'feature-selector-x'} />
            </Form.Label>
            <Form.Select aria-label={'feature selector x'}
                        className={styles.border_blue}
                        value={params.params_features.X_feature}
                        onChange={(e) => handleChange_FeatureSelector_X(e)}>
              <>
                {datasetLocal.dataframe_processed.columns
                  .map((value, index) => {
                    return (<option key={index} value={value}>{value} - {datasetLocal.dataframe_processed.dtypes[index]}</option>)
                  })}
              </>
            </Form.Select>
          </Form.Group>
          <Form.Group controlId={'feature-selector-y'} className={'mt-3'}>
            <Form.Label>
              <Trans i18nKey={prefix + 'feature-selector-y'} />
            </Form.Label>
            <Form.Select aria-label={'feature selector y'}
                        className={styles.border_green}
                        value={params.params_features.Y_target}
                        onChange={(e) => handleChange_FeatureSelector_Y(e)}>
              <>
                {datasetLocal.dataframe_processed.columns
                  .map((value, index) => {
                    return (<option key={index} value={value}>{value} - {datasetLocal.dataframe_processed.dtypes[index]}</option>)
                  })}
              </>
            </Form.Select>
          </Form.Group>
        </>}

      </Card.Body>
    </Card>
  </>
}