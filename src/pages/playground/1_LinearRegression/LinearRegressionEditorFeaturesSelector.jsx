import styles from './LinearRegression.module.css'
import React, { useContext, useEffect, useState } from 'react'
import { Card, Form, Accordion } from 'react-bootstrap'
import { Trans } from 'react-i18next'

import { VERBOSE } from '@/CONSTANTS'
import LinearRegressionContext from '@context/LinearRegressionContext'
import WaitingPlaceholder from '@components/loading/WaitingPlaceholder'

/**
 * 
 * @deprecated
 */
export default function LinearRegressionEditorFeaturesSelector() {

  const prefix = 'pages.playground.generator.editor-feature-selector.'
  const {
    datasets,
    params,
    setParams,
  } = useContext(LinearRegressionContext)

  const [show, setShow] = useState(false)

  useEffect(() => {
    setShow(datasets && datasets.data.length > 0 && datasets.index >= 0 && datasets.data[datasets.index].is_dataset_processed)
  }, [setShow, datasets])

  const handleChange_FeatureSelector_Y = (e) => {
    setParams((prevState) => {
      return Object.assign({}, prevState, {
        params_features: {
          ...prevState.params_features,
          Y_target: e.target.value
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
    if (datasets && datasets.data.length > 0 && datasets.index >= 0 && datasets.data[datasets.index].is_dataset_processed) {
      setParams((prevState) => {
        // Target
        const Y_target = datasets.data[datasets.index].dataframe_processed.columns[datasets.data[datasets.index].dataframe_processed.columns.length - 1]
        // Simple
        const X_feature = datasets.data[datasets.index].dataframe_processed.columns[0]
        // Multiple
        const X_features = new Set(datasets.data[datasets.index].dataframe_processed.columns)
        X_features.delete(Y_target)


        return Object.assign({}, prevState, {
          params_features: {
            X_features: X_features,
            X_feature : X_feature,
            Y_target  : Y_target
          }
        })
      })
    }
  }, [datasets, setParams])

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

          <Accordion defaultActiveKey="Target">
          <Accordion.Item eventKey="Target">
              <Accordion.Header><Trans i18nKey={prefix + 'feature-selector-y'} /></Accordion.Header>
              <Accordion.Body>
                <Form.Group controlId={'feature-selector-y'}>
                  <Form.Label>
                    <Trans i18nKey={prefix + 'feature-selector-y'} />
                  </Form.Label>
                  <Form.Select
                    aria-label={'feature selector y'}
                    className={styles.border_green}
                    value={params.params_features.Y_target}
                    onChange={(e) => handleChange_FeatureSelector_Y(e)}>
                    <>
                      {datasets
                        .data[datasets.index]
                        .dataframe_processed
                        .columns
                        .map((value, index) => {
                          return (<option key={index} value={value}>{value} - {datasets.data[datasets.index].dataframe_processed.dtypes[index]}</option>)
                        })}
                    </>
                  </Form.Select>
                </Form.Group>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="Features">
              <Accordion.Header><Trans i18nKey={prefix + 'feature-selector-x'} /></Accordion.Header>
              <Accordion.Body>

                {/* SIMPLE */}
                {/* 
                <Form.Group controlId={'feature-selector-X'} className='mb-3'>
                  <Form.Label>
                    <Trans i18nKey={prefix + 'feature-selector-x'} />
                  </Form.Label>
                  <Form.Select
                    aria-label={'feature selector x'}
                    className={styles.border_blue}
                    value={params.params_features.X_feature}
                    onChange={(e) => handleChange_FeatureSelector_X(e)}>
                    <>
                      {datasets
                        .data[datasets.index]
                        .dataframe_processed
                        .columns
                        .map((value, index) => {
                          return (<option key={index} value={value}>{value} - {datasets.data[datasets.index].dataframe_processed.dtypes[index]}</option>)
                        })}
                    </>
                  </Form.Select>
                </Form.Group> 
                */}

                {datasets
                  .data[datasets.index]
                  .dataframe_processed
                  .columns 
                  .map((column_name) => (
                    <div key={`column-${column_name}`}>
                      <Form.Check 
                        type={'switch'}
                        checked={column_name !== params.params_features.Y_target}
                        disabled={column_name === params.params_features.Y_target}
                        id={`column-${column_name}`}
                        label={`${column_name}`}
                        onChange={() => {

                        }}
                      />

                    </div>
                ))}

              </Accordion.Body>
            </Accordion.Item>
            
          </Accordion>
        </>}

      </Card.Body>
    </Card>
  </>
}