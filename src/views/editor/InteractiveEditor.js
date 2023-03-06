import React, { useState } from 'react'
import { Col, Row, CloseButton, Container, Card, Form, Button, Accordion } from 'react-bootstrap'
import * as tf from '@tensorflow/tfjs'
import {
  TYPE_ACTIVATION,
  TYPE_OPTIMIZER,
  TYPE_LOSSES,
  TYPE_METRICS
} from "../../modelos/ArchitectureTypesHelper";
import { getIrisDataType } from "../../modelos/ClassificationHelper_IRIS"
import * as alertHelper from '../../utils/alertHelper'
import './InteractiveEditor.css'

// TODO: Pendiente de borrar
export default function InteractiveEditor(props) {
  const { tipo } = props

  //TODO: DEPENDIENDO DEL TIPO QUE SEA SE PRE CARGAN UNOS AJUSTES U OTROS
  const [nLayer, setNLayer] = useState(2)
  const [Layer, setLayer] = useState([
    { units: 10, activation: 'sigmoid' },
    { units: 3, activation: 'softmax' },
  ])
  const [Optimizer, setOptimizer] = useState('Adam')
  const [LossValue, setLossValue] = useState('CategoricalCrossentropy')
  const [MetricsValue, setMetricsValue] = useState('Accuracy')
  const [Model, setModel] = useState()
  const [string, setString] = useState()

  const NumberEpochs = 50
  const learningValue = 1

  const handleClickPlay = async (event) => {
    event.preventDefault()

    try {
      console.log('Estas si son las métricas', Layer)
      // const model = await createClassicClassification(
      //   parseInt(document.getElementById('formTrainRate').value) / 100,
      //   0.1,
      //   parseInt(document.getElementById('FormNumberOfEpochs').value),
      //   document.getElementById('FormOptimizer').value,
      //   Layer,
      //   LossValue,
      //   MetricsValue,
      // )
      // setModel(model)
      await alertHelper.alertSuccess("Modelo entrenado con éxito")
    } catch (error) {
      console.log(error)
    }
  }

  const handleVectorTest = async () => {
    console.log(string)
    let input = [[], [1, string.split(';').length]]

    string.split(';').forEach((element) => {
      input[0].push(parseFloat(element))
    })

    const tensor = tf.tensor2d(input[0], input[1])
    // const tensor = tf.tensor2d([0.1, 4.3, 2.1, 0.2], [1, 4])
    const prediction = Model.predict(tensor)
    const predictionWithArgMax = Model.predict(tensor).argMax(-1).dataSync()
    console.log('Probamos el modelo con [0.1, 4.3, 2.1, 0.2],0.1;4.3;2.1;0.2 [1, 4]',)

    console.log('La solución es:', predictionWithArgMax)

    document.getElementById('demo').innerHTML =
      prediction + 'tipo: ' + getIrisDataType(predictionWithArgMax)
    await alertHelper.alertInfo('Tipo: ' + getIrisDataType(predictionWithArgMax, predictionWithArgMax))
  }

  const handlerAddLayer = async () => {
    let array = Layer
    array.push({ units: 0, activation: 0 })
    setLayer(array)
    setNLayer(nLayer + 1)
  }

  const handlerRemoveLayer = (idLayer) => {
    let array = Layer
    let array2 = []
    let i
    for (i = 0; i < idLayer; i++) {
      array2.push(array[i])
    }
    for (i = idLayer + 1; i < array.length; i++) {
      document.getElementById(`formUnitsLayer${i - 1}`).value =
        document.getElementById(`formUnitsLayer${i}`).value
      document.getElementById(`formActivationLayer${i - 1}`).value =
        document.getElementById(`formActivationLayer${i}`).value
      array2.push(array[i])
    }
    setLayer(array2)
    setNLayer(nLayer - 1)
  }

  const handleChangeUnits = (index) => {
    let array = Layer
    array[index].units = parseInt(document.getElementById(`formUnitsLayer${index}`).value)
    setLayer(array)
  }

  const handleChangeTestInput = () => {
    setString(document.getElementById(`formTestInput`).value)
  }

  const handleChangeActivation = (index) => {
    let array = Layer
    array[index].activation = document.getElementById(`formActivationLayer${index}`).value
    setLayer(array)
  }

  const handleChangeLoss = () => {
    let aux = document.getElementById('FormLoss').value
    if (aux !== undefined) {
      setLossValue(aux)
    }
  }

  const handleChangeOptimization = () => {
    let aux = document.getElementById('FormOptimizer').value
    if (aux !== undefined) {
      setOptimizer(aux)
    }
  }

  const handleChangeMetrics = () => {
    let aux = document.getElementById('FormMetrics').value
    if (aux !== undefined) {
      setMetricsValue(aux)
    }
  }

  return (
    <>
      <Form onSubmit={handleClickPlay} id={"InteractiveEditor"}>
        <Container>
          <Row className={"mt-3"}>
            <Col>
              <Card>
                <Card.Header><h3>Interactive Editor</h3></Card.Header>
                <Card.Body>
                  <Card.Text>A continuación se ha pre cargado una arquitectura.</Card.Text>
                  <Card.Text>Programa dentro de la función "createArchitecture".</Card.Text>
                  <Card.Text>
                    A esta función se el pasa un array preparado que continue la información del conjunto de datos.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* BLOCK 1 */}
          <Row className={"mt-3"}>
            {/* SPECIFIC PARAMETERS */}
            <Col>
              <div className="d-grid gap-2">
                {/* ADD LAYER */}
                <Button type="button"
                        onClick={() => handlerAddLayer()}
                        variant="primary">
                  Añadir capa
                </Button>
              </div>
              <Accordion className={"mt-3"} defaultActiveKey={["0"]} alwaysOpen>
                {Layer.map((item, index) => {
                  return (
                    <Accordion.Item key={index} eventKey={index.toString()}>
                      <Accordion.Header>Capa {index + 1}</Accordion.Header>
                      <Accordion.Body>
                        <div className="d-grid gap-2">
                          <CloseButton onClick={() => handlerRemoveLayer(index)}/>
                        </div>
                        {/* UNITS */}
                        <Form.Group className="mb-3"
                                    controlId={'formUnitsLayer' + index}>
                          <Form.Label>Unidades de la capa</Form.Label>
                          <Form.Control type="number"
                                        placeholder="Introduce el número de unidades de la capa"
                                        defaultValue={item.units}
                                        onChange={() => handleChangeUnits(index)}/>
                        </Form.Group>
                        {/* ACTIVATION FUNCTION */}
                        <Form.Group className="mb-3"
                                    controlId={'formActivationLayer' + index}>
                          <Form.Label>Selecciona la función de activación</Form.Label>
                          <Form.Select aria-label="Default select example"
                                       defaultValue={item.activation}
                                       onChange={() => handleChangeActivation(index)}>
                            <option>Selecciona la función de activación</option>
                            {TYPE_ACTIVATION.map((itemAct, indexAct) => {
                              return (<option key={indexAct} value={itemAct}>{itemAct}</option>)
                            })}
                          </Form.Select>
                          <Form.Text className="text-muted">
                            Será el optimizador que se usará para activar la función
                          </Form.Text>
                        </Form.Group>
                      </Accordion.Body>
                    </Accordion.Item>
                  )
                })}
              </Accordion>
            </Col>

            {/* GENERAL PARAMETERS */}
            <Col>
              <Card className={"sticky-top"}>
                <Card.Body>
                  {/* LEARNING RATE */}
                  <Form.Group className="mb-3" controlId="formTrainRate">
                    <Form.Label>Tasa de entrenamiento</Form.Label>
                    <Form.Control type="number"
                                  placeholder="Introduce la tasa de entrenamiento"
                                  defaultValue={learningValue}/>
                    <Form.Text className="text-muted">
                      Recuerda que debe ser un valor entre 0 y 100 (es un porcentaje)
                    </Form.Text>
                  </Form.Group>

                  {/* Nº OT ITERATIONS */}
                  <Form.Group className="mb-3" controlId="FormNumberOfEpochs">
                    <Form.Label>Nº de iteraciones</Form.Label>
                    <Form.Control type="number"
                                  placeholder="Introduce el número de iteraciones"
                                  defaultValue={NumberEpochs}/>
                    <Form.Text className="text-muted">
                      *Mientras más alto sea, mas tardará en ejecutarse el entrenamiento
                    </Form.Text>
                  </Form.Group>

                  {/* OPTIMIZATION FUNCTION */}
                  <Form.Group className="mb-3" controlId="FormOptimizer">
                    <Form.Label>Selecciona el optimizador</Form.Label>
                    <Form.Select aria-label="Default select example"
                                 defaultValue={Optimizer}
                                 onChange={handleChangeOptimization}>
                      <option>Selecciona el optimizador</option>
                      {TYPE_OPTIMIZER.map((item, id) => {
                        return (<option key={id} value={item}>{item}</option>)
                      })}
                    </Form.Select>
                    <Form.Text className="text-muted">
                      Será el optimizador que se usará para activar la función
                    </Form.Text>
                  </Form.Group>
                  {/* LOSS FUNCTION */}
                  <Form.Group className="mb-3" controlId="FormLoss">
                    <Form.Label>Selecciona la función de pérdida</Form.Label>
                    <Form.Select aria-label="Default select example"
                                 defaultValue={LossValue}
                                 onChange={handleChangeLoss}>
                      <option>Selecciona la función de pérdida</option>
                      {TYPE_LOSSES.map((item, id) => {
                        return (<option key={id} value={item}>{item}</option>)
                      })}
                    </Form.Select>
                    <Form.Text className="text-muted">
                      Será el optimizador que se usará para activar la función
                    </Form.Text>
                  </Form.Group>

                  {/* METRICS FUNCTION */}
                  <Form.Group className="mb-3" controlId="FormMetrics">
                    <Form.Label>Selecciona la métrica</Form.Label>
                    <Form.Select aria-label="Default select example"
                                 defaultValue={MetricsValue}
                                 onChange={handleChangeMetrics}>
                      <option>Selecciona la métrica</option>
                      {TYPE_METRICS.map((item, id) => {
                        return (<option key={id} value={item}>{item}</option>)
                      })}
                    </Form.Select>
                    <Form.Text className="text-muted">
                      Será el optimizador que se usará para activar la función
                    </Form.Text>
                  </Form.Group>
                </Card.Body>
              </Card>


              {/* <Button variant="primary" type="submit">
              CREAR Y ENTRENAR MODELO
            </Button> */}
            </Col>
          </Row>

          {/* BLOCK  BUTTON */}
          <Row className="mt-3">
            <Col>
              <div className="d-grid gap-2">
                {/* TODO */}
                <Button type="submit"
                        size={"lg"}
                        variant="primary">
                  Crear y entrenar modelo
                </Button>
              </div>
            </Col>
          </Row>

          {/* BLOCK 2 */}
          <Row className="mt-3">
            <Col>
              <Card>
                <Card.Header><h3>Prueba</h3></Card.Header>
                <Card.Body>
                  {/* VECTOR TEST */}
                  <Form.Group className="mb-3" controlId={'formTestInput'}>
                    <Form.Label>Introduce el vector a probar</Form.Label>
                    <Form.Control placeholder="Introduce el vector a probar"
                                  defaultValue="0.1;4.3;2.1;0.2"
                                  onChange={() => handleChangeTestInput()}/>
                  </Form.Group>
                  {/* SUBMIT BUTTON */}
                  <div className="d-grid gap-2">
                    <Button type="button"
                            onClick={handleVectorTest}
                            variant="primary">
                      Ver resultado
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* BLOCK 3 */}
          <Row className="mt-3">
            <Col>
              <Card>
                <Card.Header><h3>Resultado</h3></Card.Header>
                <Card.Body>
                  <div id="demo" className="console">
                    Aquí se muestran los resultados
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="mt-3">
            <Col>
              <Card>
                <Card.Header><h3>Resultado</h3></Card.Header>
                <Card.Body>
                  <div id="demo" className="console">
                    Aquí se muestran los resultados
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </Form>
    </>
  )
}

