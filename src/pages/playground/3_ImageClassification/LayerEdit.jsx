import { Col, Form, Row } from 'react-bootstrap'
import { TYPE_ACTIVATION } from '@core/nn-utils/ArchitectureTypesHelper'

export default function LayerEdit ({
  index, item,
  handleChange_Kernel,
  handleChange_Activation,
  handleChange_Filters,
  handleChange_Strides,
  handleChange_PoolSize,
  handleChange_StridesMax,
}) {

  return (<>
    {item._class === 'Conv2D' && <Row className={'mt-3'}>
      {/* KERNEL SIZE */}
      <Col xl={6}>
        <Form.Group className="mb-3" controlId={'formKernelLayer' + index}>
          <Form.Label>Tamaño del Kernel</Form.Label>
          <Form.Control type="number"
                        placeholder="Introduce el tamaño del kernel de la capa"
                        defaultValue={item.kernelSize}
                        onChange={(e) => handleChange_Kernel(index, e)} />
        </Form.Group>
      </Col>

      {/* FILTERS */}
      <Col xl={6}>
        <Form.Group className="mb-3" controlId={'formFiltersLayer' + index}>
          <Form.Label>Tamaño del filters</Form.Label>
          <Form.Control type="number"
                        placeholder="Introduce el filtro de la capa"
                        defaultValue={item.filters}
                        onChange={(e) => handleChange_Filters(index, e)} />
        </Form.Group>
      </Col>

      {/* STRIDES */}
      <Col xl={6}>
        <Form.Group className="mb-3" controlId={'formStridesLayer' + index}>
          <Form.Label>Strides</Form.Label>
          <Form.Control type="number"
                        placeholder="Introduce el strides de la capa"
                        defaultValue={item.strides}
                        onChange={(e) => handleChange_Strides(index, e)} />
        </Form.Group>
      </Col>

      {/* ACTIVATION FUNCTION */}
      <Col xl={6}>
        <Form.Group className="mb-3" controlId={'formActivationLayer' + index}>
          <Form.Label>Selecciona la función de activación</Form.Label>
          <Form.Select aria-label="Selecciona la función de activación"
                       value={item.activation}
                       onChange={(e) => handleChange_Activation(index, e)}>
            {TYPE_ACTIVATION.map(({ key, label }, indexAct) => {
              return (<option key={indexAct} value={key}>{label}</option>)
            })}
          </Form.Select>
          <Form.Text className="text-muted">
            Será la función de activación
          </Form.Text>
        </Form.Group>
      </Col>
    </Row>}

    {item._class === 'MaxPooling2D' && <Row className={'mt-3'}>
      {/* POOL_SIZE */}
      <Col xl={6}>
        <Form.Group className="mb-3"
                    controlId={'formPoolSize0Layer' + index}>
          <Form.Label>POOL SIZE 0 de la capa</Form.Label>
          <Form.Control type="number"
                        placeholder="Introduce el número de POOLSIZE de la capa"
                        defaultValue={item.poolSize[0]}
                        onChange={(e) => handleChange_PoolSize(index, 0, e)} />
        </Form.Group>
      </Col>


      {/* POOL SIZE 2 */}
      <Col xl={6}>
        <Form.Group className="mb-3" controlId={'formPoolSize1Layer' + index}>
          <Form.Label>POOL SIZE 1 de la capa</Form.Label>
          <Form.Control type="number"
                        placeholder="Introduce el número de POOLSIZE2 de la capa"
                        defaultValue={item.poolSize[1]}
                        onChange={(e) => handleChange_PoolSize(index, 1, e)} />
        </Form.Group>
      </Col>

      {/* strides max 1 */}
      <Col xl={6}>
        <Form.Group className="mb-3" controlId={'formStrides0Layer' + index}>
          <Form.Label>Strides 0 de la capa</Form.Label>
          <Form.Control type="number"
                        placeholder="Introduce el número de strides de la capa"
                        defaultValue={item.strides2[0]}
                        onChange={(e) => handleChange_StridesMax(index, 0, e)} />
        </Form.Group>
      </Col>
      <Col xl={6}>
        {/* strides max 2 */}
        <Form.Group className="mb-3" controlId={'formStrides1Layer' + index}>
          <Form.Label>Strides 1 de la capa</Form.Label>
          <Form.Control type="number"
                        placeholder="Introduce el número de strides 2 de la capa"
                        defaultValue={item.strides2[1]}
                        onChange={(e) => handleChange_StridesMax(index, 1, e)} />
        </Form.Group>
      </Col>
    </Row>}
  </>)
}
