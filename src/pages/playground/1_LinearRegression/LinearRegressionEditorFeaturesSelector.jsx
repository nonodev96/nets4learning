import React, { useContext, useEffect } from 'react'
import { Accordion, Button, Card, Form } from 'react-bootstrap'
import { Trans, useTranslation } from 'react-i18next'

import LinearRegressionContext from '@context/LinearRegressionContext'
import alertHelper from '@utils/alertHelper'

export default function LinearRegressionEditorFeaturesSelector () {

  const prefix = 'pages.playground.generator.editor-feature-selector.'
  const { t } = useTranslation()
  const { datasetLocal, tmpModel, setTmpModel } = useContext(LinearRegressionContext)

  useEffect(() => {
    setTmpModel((prevState) => {
      const X_features = [datasetLocal.dataframe_processed.columns[0]]
      const y_target = datasetLocal.dataframe_processed.columns[datasetLocal.dataframe_processed.columns.length - 1]
      return Object.assign({}, prevState, {
        feature_selector: {
          X_features: new Set(X_features),
          y_target  : y_target
        }
      })
    })
  }, [datasetLocal.dataframe_processed, setTmpModel])

  const handleChange_FeatureSelector_Y = (e) => {
    setTmpModel((prevState) => {
      return Object.assign({}, prevState, {
        feature_selector: {
          ...prevState.feature_selector,
          y_target: e.target.value
        }
      })
    })
  }

  const handlerClick_AddFeature = () => {
    setTmpModel((prevState) => {
      for (let newFeature of datasetLocal.dataframe_processed.columns) {
        if (!prevState.feature_selector.X_features.has(newFeature)) {
          prevState.feature_selector.X_features.add(newFeature)
          break
        }
      }
      return Object.assign({}, prevState, {
        feature_selector: {
          ...prevState.feature_selector,
          X_features: new Set(Array.from(prevState.feature_selector.X_features))
        }
      })
    })
  }

  const handleChange_FeatureSelector_X = async (e, oldValue) => {
    if (tmpModel.feature_selector.X_features.has(e.target.value)) {
      await alertHelper.alertWarning(t('error.new-element-need-to-be-unique'))
    }
    setTmpModel((prevState) => {
      prevState.feature_selector.X_features.delete(oldValue)
      prevState.feature_selector.X_features.add(e.target.value)
      return Object.assign({}, prevState, {
        feature_selector: {
          ...prevState.feature_selector,
          X_features: new Set(Array.from(prevState.feature_selector.X_features))
        }
      })
    })
  }

  const handlerClick_RemoveFeature = async (valueToDelete) => {
    if (tmpModel.feature_selector.X_features.size === 1)
      await alertHelper.alertWarning(t('error.need-one-feature'))
    else
      setTmpModel((prevState) => {
        prevState.feature_selector.X_features.delete(valueToDelete)
        return Object.assign({}, prevState, {
          feature_selector: {
            ...prevState.feature_selector,
            X_features: new Set(Array.from(prevState.feature_selector.X_features))
          }
        })
      })
  }

  return <>
    <Card>
      <Card.Header className={'d-flex align-items-center justify-content-between'}>
        <h3><Trans i18nKey={prefix + 'title'} /></h3>
        <div className={'d-flex'}>
          <Button onClick={() => handlerClick_AddFeature()}
                  size={'sm'}
                  variant="outline-primary">
            <Trans i18nKey={prefix + 'add-feature'} />
          </Button>
        </div>
      </Card.Header>
      <Card.Body>

        <Form.Group controlId={'feature-selector-y'}>
          <Form.Label>
            <Trans i18nKey={prefix + 'feature-selector-y'} />
          </Form.Label>
          <Form.Select aria-label={'feature selector y'}
                       value={tmpModel.feature_selector.y_target}
                       onChange={(e) => handleChange_FeatureSelector_Y(e)}>
            <>
              {datasetLocal.dataframe_processed.columns
                .map((value, index) => {
                  return (<option key={index} value={value}>{value}</option>)
                })}
            </>
          </Form.Select>
        </Form.Group>

        <Accordion defaultActiveKey={[]} className={'mt-3'}>
          <>
            {Array.from(tmpModel.feature_selector.X_features)
              .map((feature, index) => {
                return <Accordion.Item eventKey={`feature-x-${index}`} key={index}>
                  <Accordion.Header>
                    <Trans i18nKey={prefix + 'X-set.__index__'}
                           values={{ index: index + 1 }} />
                  </Accordion.Header>
                  <Accordion.Body>
                    <div className="d-grid gap-2">
                      <Button onClick={() => handlerClick_RemoveFeature(feature)}
                              variant={'outline-danger'}>
                        <Trans i18nKey={prefix + 'delete-feature'}
                               values={{ index: index + 1 }} />
                      </Button>
                    </div>
                    <Form.Group controlId={`form-group-feature-selector-x-${index}`} className={'mt-3'}>
                      <Form.Label>
                        <Trans i18nKey={prefix + 'feature-selector-x'}
                               values={{ index: index + 1 }} />
                      </Form.Label>
                      <Form.Select aria-label={t(prefix + 'feature-selector-x')}
                                   value={feature}
                                   onChange={(e) => handleChange_FeatureSelector_X(e, feature)}>
                        <>
                          {datasetLocal.dataframe_processed.columns
                            .map((value, index) => {
                              return (<option key={index} value={value}>{value}</option>)
                            })}
                        </>
                      </Form.Select>
                    </Form.Group>
                  </Accordion.Body>
                </Accordion.Item>
              })}
          </>
        </Accordion>


      </Card.Body>
    </Card>
  </>
}