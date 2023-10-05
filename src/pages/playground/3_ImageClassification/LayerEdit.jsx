import { Col, Form, Row } from 'react-bootstrap'
import { TYPE_ACTIVATION } from '@core/nn-utils/ArchitectureTypesHelper'

export default function LayerEdit ({
  item,
  indexLayer,

  handleChange_Attr,
  handleChange_AttrArray,
}) {

  return (<>
    {item._class === 'Conv2D' && <Row className={'mt-3'}>
      {/* KERNEL SIZE */}
      <Col xl={6}>
        <Form.Group className="mb-3" controlId={'formKernelLayer' + indexLayer}>
          <Form.Label>Tamaño del Kernel</Form.Label>
          <Form.Control type="number"
                        placeholder="Introduce el tamaño del kernel de la capa"
                        value={item.kernelSize}
                        onChange={(e) => handleChange_Attr(e, indexLayer, 'kernelSize')} />
        </Form.Group>
      </Col>

      {/* FILTERS */}
      <Col xl={6}>
        <Form.Group className="mb-3" controlId={'formFiltersLayer' + indexLayer}>
          <Form.Label>Tamaño del filters</Form.Label>
          <Form.Control type="number"
                        placeholder="Introduce el filtro de la capa"
                        value={item.filters}
                        onChange={(e) => handleChange_Attr(e, indexLayer, 'filters')} />
        </Form.Group>
      </Col>

      {/* STRIDES */}
      <Col xl={6}>
        <Form.Group className="mb-3" controlId={'formStridesLayer' + indexLayer}>
          <Form.Label>Strides</Form.Label>
          <Form.Control type="number"
                        placeholder="Introduce el strides de la capa"
                        value={item.strides}
                        onChange={(e) => handleChange_Attr(e, indexLayer, 'strides')} />
        </Form.Group>
      </Col>

      {/* ACTIVATION FUNCTION */}
      <Col xl={6}>
        <Form.Group className="mb-3" controlId={'formActivationLayer' + indexLayer}>
          <Form.Label>Selecciona la función de activación</Form.Label>
          <Form.Select aria-label="Selecciona la función de activación"
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
          <Form.Label>POOL SIZE 0 de la capa</Form.Label>
          <Form.Control type="number"
                        placeholder="Introduce el número de POOLSIZE de la capa"
                        value={item.poolSize[0]}
                        onChange={(e) => handleChange_AttrArray(e, indexLayer, 'poolSize', 0)} />
        </Form.Group>
      </Col>


      {/* POOL SIZE 2 */}
      <Col xl={6}>
        <Form.Group className="mb-3" controlId={'formPoolSize1Layer' + indexLayer}>
          <Form.Label>POOL SIZE 1 de la capa</Form.Label>
          <Form.Control type="number"
                        placeholder="Introduce el número de POOLSIZE2 de la capa"
                        value={item.poolSize[1]}
                        onChange={(e) => handleChange_AttrArray(e, indexLayer, 'poolSize', 1)} />
        </Form.Group>
      </Col>

      {/* strides max 1 */}
      <Col xl={6}>
        <Form.Group className="mb-3" controlId={'formStrides0Layer' + indexLayer}>
          <Form.Label>Strides 0 de la capa</Form.Label>
          <Form.Control type="number"
                        placeholder="Introduce el número de strides de la capa"
                        value={item.strides2[0]}
                        onChange={(e) => handleChange_AttrArray(e, indexLayer, 'strides2', 0)} />
        </Form.Group>
      </Col>
      <Col xl={6}>
        {/* strides max 2 */}
        <Form.Group className="mb-3" controlId={'formStrides1Layer' + indexLayer}>
          <Form.Label>Strides 1 de la capa</Form.Label>
          <Form.Control type="number"
                        placeholder="Introduce el número de strides 2 de la capa"
                        value={item.strides2[1]}
                        onChange={(e) => handleChange_AttrArray(e, indexLayer, "strides2", 1)} />
        </Form.Group>
      </Col>
    </Row>}
  </>)
}
