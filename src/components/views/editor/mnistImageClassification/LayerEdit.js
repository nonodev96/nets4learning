import { React } from 'react'
import { Form, Row } from 'react-bootstrap'
import { CloseButton } from 'react-bootstrap'

export default function LayerEdit(props) {
  const {
    index,
    item,
    handlerRemoveLayer,
    handleChangeKernel,
    handleChangeActivation,
    handleChangeFilters,
    handleChangeStrides,
    handleChangePoolSize,
    handleChangeStridesMax,
    ACTIVATION_TYPE,
    CLASS_TYPE,
  } = props

  return (
    <>
      {item.class === 'Conv2D' ? (
        <>
          {/* KERNEL SIZE */}
          <Form.Group className="mb-3" controlId={'formKernelLayer' + index}>
            <Form.Label>Tamaño del Kernel</Form.Label>
            <Form.Control
              type="number"
              placeholder="Introduce el tamaño del kernel de la capa"
              defaultValue={item.kernelSize}
              onChange={() => handleChangeKernel(index)}
            />
          </Form.Group>

          {/* FILTERS */}
          <Form.Group className="mb-3" controlId={'formFiltersLayer' + index}>
            <Form.Label>Tamaño del filters</Form.Label>
            <Form.Control
              type="number"
              placeholder="Introduce el filters de la capa"
              defaultValue={item.filters}
              onChange={() => handleChangeFilters(index)}
            />
          </Form.Group>

          {/* STRIDES */}
          <Form.Group className="mb-3" controlId={'formStridesLayer' + index}>
            <Form.Label>Strides</Form.Label>
            <Form.Control
              type="number"
              placeholder="Introduce el strides de la capa"
              defaultValue={item.strides}
              onChange={() => handleChangeStrides(index)}
            />
          </Form.Group>

          {/* ACTIVATION FUNCTION */}
          <Form.Group
            className="mb-3"
            controlId={'formActivationLayer' + index}
          >
            <Form.Label>Selecciona la función de activación</Form.Label>
            <Form.Select
              aria-label="Default select example"
              defaultValue={item.activation}
              onChange={() => handleChangeActivation(index)}
            >
              <option>Selecciona la función de activación</option>
              {ACTIVATION_TYPE.map((itemAct, indexAct) => {
                return (
                  <option key={indexAct} value={itemAct}>
                    {itemAct}
                  </option>
                )
              })}
            </Form.Select>
            <Form.Text className="text-muted">
              Será el optimizador que se usará para activar la funcion
            </Form.Text>
          </Form.Group>
        </>
      ) : (
        <>
        {console.log(item)}
          <Row>
            {/* POOLSIZE */}
            <Form.Group
              className="mb-3"
              controlId={'formPoolSize0Layer' + index}
            >
              <Form.Label>POOLSIZE de la capa</Form.Label>
              <Form.Control
                type="number"
                placeholder="Introduce el número de POOLSIZE de la capa"
                defaultValue={item.poolSize[0]}
                onChange={() => handleChangePoolSize(index, 0)}
              />
            </Form.Group>

            {/* POOLSIZE2 */}
            <Form.Group className="mb-3" controlId={'formPoolSize1Layer' + index}>
              <Form.Label>POOLSIZE de la capa</Form.Label>
              <Form.Control
                type="number"
                placeholder="Introduce el número de POOLSIZE2 de la capa"
                defaultValue={item.poolSize[1]}
                onChange={() => handleChangePoolSize(index,1)}
              />
            </Form.Group>
            </Row>

            <Row>
            {/* strides max */}
            <Form.Group className="mb-3" controlId={'formStrides0Layer' + index}>
              <Form.Label>strides de la capa</Form.Label>
              <Form.Control
                type="number"
                placeholder="Introduce el número de strides de la capa"
                defaultValue={item.strides2[0]}
                onChange={() => handleChangeStridesMax(index,0)}
              />
            </Form.Group>

            {/* strides max 2 */}
            <Form.Group className="mb-3" controlId={'formStrides1Layer' + index}>
              <Form.Label>strides de la capa</Form.Label>
              <Form.Control
                type="number"
                placeholder="Introduce el número de strides 2 de la capa"
                defaultValue={item.strides2[1]}
                onChange={() => handleChangeStridesMax(index,1)}
              />
            </Form.Group>
          </Row>
        </>
      )}
    </>
  )
}
