import { Col, Form, Row } from 'react-bootstrap'
import { Trans, useTranslation } from 'react-i18next'
import { TYPE_ACTIVATION } from '@core/nn-utils/ArchitectureTypesHelper'
import { VERBOSE } from '@/CONSTANTS'

export default function ImageClassificationEditorLayersItem ({ item, indexLayer, handleChange_Attr, handleChange_AttrArray }) {
  const prefix = 'pages.playground.generator.editor-layers.'
  const { t } = useTranslation()

  if (VERBOSE) console.debug('render LayerEdit')
  return (<>
    {item._class === 'Conv2D' && <Row className={'mt-3'}>
      {/* KERNEL SIZE */}
      <Col xl={6}>
        <Form.Group className="mb-3" controlId={'formKernelLayer' + indexLayer}>
          <Form.Label><Trans i18nKey={prefix + 'kernel-size'} /></Form.Label>
          <Form.Control type="number"
                        placeholder={t(prefix + 'kernel-size-placeholder')}
                        value={item.kernelSize}
                        onChange={(e) => handleChange_Attr(e, indexLayer, 'kernelSize')} />
        </Form.Group>
      </Col>

      {/* FILTERS */}
      <Col xl={6}>
        <Form.Group className="mb-3" controlId={'formFiltersLayer' + indexLayer}>
          <Form.Label><Trans i18nKey={prefix + 'filters-size'} /></Form.Label>
          <Form.Control type="number"
                        placeholder={t(prefix + 'filters-size-placeholder')}
                        value={item.filters}
                        onChange={(e) => handleChange_Attr(e, indexLayer, 'filters')} />
        </Form.Group>
      </Col>

      {/* STRIDES */}
      <Col xl={6}>
        <Form.Group className="mb-3" controlId={'formStridesLayer' + indexLayer}>
          <Form.Label><Trans i18nKey={prefix + 'strides'} /></Form.Label>
          <Form.Control type="number"
                        placeholder={t(prefix + 'strides-placeholder')}
                        value={item.strides}
                        onChange={(e) => handleChange_Attr(e, indexLayer, 'strides')} />
        </Form.Group>
      </Col>

      {/* ACTIVATION FUNCTION */}
      <Col xl={6}>
        <Form.Group className="mb-3" controlId={'formActivationLayer' + indexLayer}>
          <Form.Label><Trans i18nKey={prefix + 'activation-function-select'} /></Form.Label>
          <Form.Select aria-label={t(prefix + 'activation-function-info')}
                       value={item.activation}
                       onChange={(e) => handleChange_Attr(e, indexLayer, 'activation')}>
            {TYPE_ACTIVATION.map(({ key, label }, indexAct) => {
              return (<option key={indexAct} value={key}>{label}</option>)
            })}
          </Form.Select>
        </Form.Group>
      </Col>
    </Row>}

    {item._class === 'MaxPooling2D' && <Row className={'mt-3'}>
      {/* POOL_SIZE */}
      <Col xl={6}>
        <Form.Group className="mb-3"
                    controlId={'formPoolSize0Layer' + indexLayer}>
          <Form.Label><Trans i18nKey={prefix + 'pool-size'} /> 0</Form.Label>
          <Form.Control type="number"
                        placeholder={t(prefix + 'pool-size-placeholder')}
                        value={item.poolSize[0]}
                        onChange={(e) => handleChange_AttrArray(e, indexLayer, 'poolSize', 0)} />
        </Form.Group>
      </Col>


      {/* POOL SIZE 2 */}
      <Col xl={6}>
        <Form.Group className="mb-3" controlId={'formPoolSize1Layer' + indexLayer}>
          <Form.Label><Trans i18nKey={prefix + 'pool-size'} /> 1</Form.Label>
          <Form.Control type="number"
                        placeholder={t(prefix + 'pool-size-placeholder')}
                        value={item.poolSize[1]}
                        onChange={(e) => handleChange_AttrArray(e, indexLayer, 'poolSize', 1)} />
        </Form.Group>
      </Col>

      {/* strides max 1 */}
      <Col xl={6}>
        <Form.Group className="mb-3" controlId={'formStrides0Layer' + indexLayer}>
          <Form.Label><Trans i18nKey={prefix + 'strides'} /> 0</Form.Label>
          <Form.Control type="number"
                        placeholder={t(prefix + 'strides-placeholder')}
                        value={item.strides2[0]}
                        onChange={(e) => handleChange_AttrArray(e, indexLayer, 'strides2', 0)} />
        </Form.Group>
      </Col>
      <Col xl={6}>
        {/* strides max 2 */}
        <Form.Group className="mb-3" controlId={'formStrides1Layer' + indexLayer}>
          <Form.Label><Trans i18nKey={prefix + 'strides'} /> 1</Form.Label>
          <Form.Control type="number"
                        placeholder={t(prefix + 'strides-placeholder')}
                        value={item.strides2[1]}
                        onChange={(e) => handleChange_AttrArray(e, indexLayer, 'strides2', 1)} />
        </Form.Group>
      </Col>
    </Row>}
  </>)
}
