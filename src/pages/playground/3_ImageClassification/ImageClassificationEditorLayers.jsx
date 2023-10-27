import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Accordion, Button, Card, Form } from 'react-bootstrap'

import { TYPE_CLASS } from '@core/nn-utils/ArchitectureTypesHelper'
import ImageClassificationEditorLayersItem from '@pages/playground/3_ImageClassification/ImageClassificationEditorLayersItem'
import { VERBOSE } from '@/CONSTANTS'
import alertHelper from '@utils/alertHelper'
import { Link } from 'react-router-dom'
import { MANUAL_ACTIONS } from '@/CONSTANTS_ACTIONS'

const DEFAULT_LAYER_END = {
  _class  : 'maxPooling2d',
  poolSize: 2,
  strides : 2
}

const MAP_CLASS_LAYERS = {
  'conv2d'      : {
    _class    : 'conv2d',
    kernelSize: 3,
    filters   : 16,
    activation: 'relu',
  },
  'maxPooling2d': {
    _class  : 'maxPooling2d',
    poolSize: 2,
    strides : 2,
  },
  'flatten'     : {
    _class: 'flatten',
  },
  'dense'       : {
    _class    : 'dense',
    units     : 32,
    activation: 'relu'
  }
}

export default function ImageClassificationEditorLayers (props) {
  const { Layers, setLayers } = props

  const prefix = 'pages.playground.generator.editor-layers.'
  const { t } = useTranslation()

  // region CONTROL DE LAS CAPAS
  // const handleClick_AddLayer_Start = async () => {
  //   if (Layers.length < 10) {
  //     setLayers(oldLayers => [DEFAULT_LAYER_START, ...oldLayers])
  //   } else {
  //     await alertHelper.alertWarning(t('warning.not-more-layers'))
  //   }
  // }
  const handleClick_AddLayer_End = async () => {
    if (Layers.length < 10) {
      setLayers(oldLayers => [...oldLayers, DEFAULT_LAYER_END])
    } else {
      await alertHelper.alertWarning(t('warning.not-more-layers'))
    }
  }

  const handleClick_RemoveLayer = async (indexLayer) => {
    if (Layers[indexLayer]._protected) {
      await alertHelper.alertWarning('Error, first layer cant be removed')
      return
    }
    if (Layers.length === 1) {
      await alertHelper.alertWarning(t('warning.error-layers'))
    } else {
      const updatedLayers = Layers.filter((_, index) => index !== indexLayer)
      setLayers(updatedLayers)
    }
  }

  const handleChange_Class = async (e, indexLayer) => {
    if (Layers[indexLayer]._protected) {
      await alertHelper.alertWarning('Error, first layer cant be changed')
      return
    }
    const option = e.target.value
    setLayers((prevState) => {
      const updatedLayers = [...prevState]
      updatedLayers[indexLayer] = MAP_CLASS_LAYERS[option]
      console.log(updatedLayers[indexLayer])
      return updatedLayers
    })
  }
  // endregion

  // region PARÁMETROS DE LAS CAPAS
  const handleChange_Attr = (e, indexLayer, _param_name_) => {
    const updatedLayers = [...Layers]
    updatedLayers[indexLayer] = {
      ...updatedLayers[indexLayer],
      [_param_name_]: parseInt(e.target.value)
    }
    setLayers(updatedLayers)
  }

  const handleChange_AttrArray = (e, indexLayer, _param_name_, id) => {
    const updatedLayers = [...Layers]
    updatedLayers[indexLayer] = {
      ...updatedLayers[indexLayer],
      [_param_name_]: [...updatedLayers[indexLayer][_param_name_]]
    }
    updatedLayers[indexLayer][_param_name_][id] = parseInt(e.target.value)
    setLayers(updatedLayers)
  }
  // endregion

  if (VERBOSE) console.debug('render ImageClassificationLayerEditor')
  return <>
    <Card className={'joyride-step-6-editor-layers'}>
      <Card.Header className={'d-flex align-items-center justify-content-between'}>
        <h3><Trans i18nKey={prefix + 'title'} /></h3>
        <div className={'d-flex'}>
         {/*
         <Button variant={'outline-primary'}
                  size={'sm'}
                  onClick={() => handleClick_AddLayer_Start()}>
            <Trans i18nKey={prefix + 'add-layer-start'} />
          </Button>
          */}
          <Button variant={'outline-primary'}
                  size={'sm'}
                  className={'ms-3'}
                  onClick={() => handleClick_AddLayer_End()}>
            <Trans i18nKey={prefix + 'add-layer-end'} />
          </Button>
        </div>
      </Card.Header>
      <Card.Body>
        <Accordion>
          {Layers.map((item, index) => {
            return <Accordion.Item key={index} eventKey={index.toString()}>
              <Accordion.Header>
                <Trans i18nKey={prefix + 'layer-id'}
                       values={{ index: index }} />
              </Accordion.Header>
              <Accordion.Body>
                <div className="d-grid gap-2">
                  <Button variant={'outline-danger'}
                          onClick={() => handleClick_RemoveLayer(index)}>
                    <Trans i18nKey={prefix + 'delete-layer'}
                           values={{ index: index }} />
                  </Button>
                </div>

                {/* CLASS */}
                <Form.Group className="mt-3"
                            controlId={'formClass' + index}>
                  <Form.Label>Clase de la capa</Form.Label>
                  <Form.Select aria-label={'Selecciona la clase de la capa'}
                               value={Layers[index]._class}
                               onChange={(e) => handleChange_Class(e, index)}>
                    {TYPE_CLASS.map(({ key, label }, index) => {
                      return (<option key={index} value={key}>{label}</option>)
                    })}
                  </Form.Select>
                </Form.Group>

                <hr />

                <ImageClassificationEditorLayersItem item={Layers[index]}
                                                     indexLayer={index}
                                                     handleChange_Attr={handleChange_Attr}
                                                     handleChange_AttrArray={handleChange_AttrArray}
                />
              </Accordion.Body>
            </Accordion.Item>
          })}
        </Accordion>
      </Card.Body>
      <Card.Footer className={'text-end'}>
        <p className={'text-muted mb-0 pb-0'}>
          <Trans i18nKey={'more-information-in-link'}
                 components={{
                   link1: <Link className={'text-info'}
                                to={{
                                  pathname: '/manual/',
                                  state   : {
                                    action: MANUAL_ACTIONS.IMAGE_CLASSIFICATION.STEP_3_LAYERS
                                  }
                                }}
                   />
                 }} />
        </p>
      </Card.Footer>
    </Card>
  </>
}