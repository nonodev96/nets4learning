import { useState } from 'react'
import { Col, Row, Form, CloseButton, Button, Container, Card } from 'react-bootstrap'
import * as tf from '@tensorflow/tfjs'
import *  as alertHelper from "../../../utils/alertHelper"
import {
  TYPE_ACTIVATION,
  TYPE_OPTIMIZER,
  TYPE_LOSSES,
  TYPE_METRICS,
} from '../../../core/nn-utils/ArchitectureTypesHelper'
import { getIrisDataType } from "../../../core/nn-review-models/ClassificationHelper_IRIS"

export default function LinearRegression(props) {

  // TODO: DEPENDIENDO DEL TIPO QUE SEA SE PRE CARGAN UNOS AJUSTES U OTROS
  const [nLayer, setNLayer] = useState(2)
  const [Layer, setLayer] = useState([
    { units: 10, activation: 'sigmoid' },
    { units: 3, activation: 'softmax' },
  ])
  const NumberEpochs = 50
  const learningValue = 1
  const [Optimizer, setOptimizer] = useState('Adam')
  const [LossValue, setLossValue] = useState('CategoricalCrossentropy')
  const [MetricsValue, setMetricsValue] = useState('Accuracy')
  const [Model, setModel] = useState()
  const [string, setString] = useState()

  const handleSubmit_Play = async (event) => {
    event.preventDefault()

    try {
      // TODO
      const model = {}
      setModel(model)
      await alertHelper.alertSuccess("Modelo entrenado con éxito")
    } catch (error) {
      console.log(error)
    }
  }

  const handleVectorTest = async () => {
    console.log(string)
    let input = [[], [1, string.split(";").length]];

    string.split(";").forEach(element => {
      input[0].push(parseFloat(element))
    });
    console.log(input)

    const tensor = tf.tensor2d(input[0], input[1])
    // const tensor = tf.tensor2d([0.1, 4.3, 2.1, 0.2], [1, 4])
    const prediction = Model.predict(tensor)
    const predictionWithArgMax = Model.predict(tensor).argMax(-1).dataSync()
    console.log('Probamos el modelo con [0.1, 4.3, 2.1, 0.2],0.1;4.3;2.1;0.2 [1, 4]')
    console.log('La solución es:', predictionWithArgMax)

    document.getElementById('demo').innerHTML = prediction + 'tipo: ' + getIrisDataType(predictionWithArgMax)
    await alertHelper.alertInfo('Tipo: ' + getIrisDataType(predictionWithArgMax), getIrisDataType(predictionWithArgMax),)
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
      document.getElementById(`formUnitsLayer${i - 1}`,).value =
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
    array[index].units = parseInt(
      document.getElementById(`formUnitsLayer${index}`).value,
    )
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
      <Form onSubmit={handleSubmit_Play} id={"LinearRegression"}>
        <Container>
          <Row className={"mt-3"}>
            <Col>
              <Card>
                <Card.Header><h3>Regresión linear</h3></Card.Header>
                <Card.Body>
                  <Card.Text>A continuación se ha pre cargado una arquitectura.</Card.Text>
                  <Card.Text>Programa dentro de la función "createArchitecture".</Card.Text>
                  <Card.Text>
                    A esta función se el pasa un vector preparado que continue la información del conjunto de datos.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* BLOCK 1 */}
          <Row className={"mt-3"}>
            <Col>
              <div className="container-fluid container-fluid-w1900">
                {Layer.map((item, index) => {
                  return (
                    <div key={index}>
                      <div className="container pane borde">
                        <div className="title-pane">
                          Capa {index + 1}
                          {/* <div className="spacer"></div> */}
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
                          <Form.Select aria-label="Selecciona la función de activación"
                                       defaultValue={item.activation}
                                       onChange={() => handleChangeActivation(index)}>
                            {TYPE_ACTIVATION.map((itemAct, indexAct) => {
                              return (<option key={indexAct} value={itemAct}>{itemAct}</option>)
                            })}
                          </Form.Select>
                          <Form.Text className="text-muted">
                            Será el optimizador que se usará para activar la
                            función
                          </Form.Text>
                        </Form.Group>
                      </div>
                    </div>
                  )
                })}

                {/* ADD LAYER */}
                <Button className="btn-add-layer"
                        type="button"
                        onClick={() => handlerAddLayer()}
                        variant="primary">
                  Añadir capa
                </Button>
              </div>
            </Col>
            <Col>
              <div className="container borde general-settings">
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

                {/* Número OT ITERATIONS */}
                <Form.Group className="mb-3" controlId="FormNumberOfEpochs">
                  <Form.Label>Número de iteraciones</Form.Label>
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
                  <Form.Select aria-label="Selecciona el optimizador"
                               defaultValue={Optimizer}
                               onChange={handleChangeOptimization}>
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
                  <Form.Select aria-label="Selecciona la función de pérdida"
                               defaultValue={LossValue}
                               onChange={handleChangeLoss}>
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
                  <Form.Select aria-label="Selecciona la métrica"
                               defaultValue={MetricsValue}
                               onChange={handleChangeMetrics}>
                    {TYPE_METRICS.map((item, id) => {
                      return (<option key={id} value={item}>{item}</option>)
                    })}
                  </Form.Select>
                  <Form.Text className="text-muted">
                    Será el optimizador que se usará para activar la función
                  </Form.Text>
                </Form.Group>
              </div>
            </Col>
          </Row>

          {/* BLOCK  BUTTON */}
          <Row className={"mt-3"}>
            <Col>
              {/* FIXME No hace nada*/}
              <div className={"d-grid gap-2"}>
                <Button type="submit"
                        variant="primary"
                        size={"lg"}>
                  Crear y entrenar modelo
                </Button>
              </div>
            </Col>
          </Row>

          {/* BLOCK 2 */}
          <Row className={"mt-3"}>
            <Col>
              <Card>
                <Card.Header><h3>Resultado</h3></Card.Header>
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
                            variant="primary"
                            size={"lg"}>
                      Ver resultado
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className={"mt-3"}>
            <Col>
              <Card>
                <Card.Header><h3>Resultado</h3></Card.Header>
                <Card.Body>
                  <div id="salida"></div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* BLOCK 3 */}
          <Row className="mt-3">
            <Col>
              <Card>
                <Card.Header><h3>Resultados</h3></Card.Header>
                <Card.Body>
                  <div id="demo"
                       width="100%"
                       height="100%">
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