import { React, useState, useParams } from 'react'
import * as tf from '@tensorflow/tfjs'
import { Col, Row, CloseButton } from 'react-bootstrap'
import { Form, Button } from 'react-bootstrap'
import {
  createClassicClassification,
  getIrisDataType,
} from '../../../modelos/ArchitectureHelper'
import './InteractiveEditor.css'
import * as alertHelper from '../../../utils/alertHelper'

function InteractiveEditor(props) {
  const { tipo } = props

  const modelsType = [
    'Clasificación clásica',
    'Clasificación de imágenes',
    'Identificación de objetos',
    'Regresión lineal',
  ]

  //TODO: DEPENDIENDO DEL TIPO QUE SEA SE PRECARGAN UNOS AJUSTRS U OTROS
  const [nLayer, setNLayer] = useState(2)
  const [Layer, setLayer] = useState([
    { units: 10, activation: 'Sigmoid' },
    { units: 3, activation: 'Softmax' },
  ])
  const NumberEpochs = 50
  const learningValue = 1
  const [Optimizer, setOptimizer] = useState('Adam')
  const [LossValue, setLossValue] = useState('CategoricalCrossentropy')
  const [MetricsValue, setMetricsValue] = useState('Accuracy')
  const [Model, setModel] = useState()
  const [string, setstring] = useState()

  const OPTIMIZER_TYPE = [
    'Sgd',
    'Momentum',
    'Adagrag',
    'Adadelta',
    'Adam',
    'Adamax',
    'Rmsprop',
  ]

  const LOSS_TYPE = [
    'AbsoluteDifference',
    'ComputeWeightedLoss',
    'CosineDistance',
    'HingeLoss',
    'HuberLoss',
    'LogLoss',
    'MeanSquaredError',
    'SigmoidCrossEntropy',
    'SoftmaxCrossEntropy',
    'CategoricalCrossentropy',
  ]

  const METRICS_TYPE = [
    'BinaryAccuracy',
    'BinaryCrossentropy',
    'CategoricalAccuracy',
    'CategoricalCrossentropy',
    'CosineProximity',
    'MeanAbsoluteError',
    'MeanAbsolutePercentageErr',
    'MeanSquaredError',
    'Precision',
    'Recall',
    'SparseCategoricalAccuracy',
    'Accuracy',
  ]

  const ACTIVATION_TYPE = ['Sigmoid', 'Softmax']

  const handleClickPlay = async (event) => {
    event.preventDefault()

    console.log('Comenzamos a crear el modelo')

    try {
      console.log('Estas sion las metricas', Layer)
      const model = await createClassicClassification(
        parseInt(document.getElementById('formTrainRate').value) / 100,
        0.1,
        parseInt(document.getElementById('formNumberOfEpochs').key),
        document.getElementById('FormOptimizer').key,
        Layer,
        LossValue,
        MetricsValue,
      )
      console.log('Modelo creado y entrenado')
      console.log(model)
      setModel(model)

      alertHelper.alertSuccess("Modelo entrenado con éxito")
      // const input = tf.tensor2d([0.1, 4.3, 2.1, 0.2], [1, 4])
      // const prediction = model.predict(input)
      // const predictionWithArgMax = model.predict(input).argMax(-1).dataSync()
      // console.log('Probamos el modelo con [0.1, 4.3, 2.1, 0.2], [1, 4]')

      // console.log('La solucion es:', predictionWithArgMax)

      // document.getElementById('demo').innerHTML =
      //   prediction + 'tipo: ' + getIrisDataType(predictionWithArgMax)
      // alert('Tipo: ' + getIrisDataType(predictionWithArgMax))
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
    console.log(input)

    const tensor = tf.tensor2d(input[0], input[1])
    // const tensor = tf.tensor2d([0.1, 4.3, 2.1, 0.2], [1, 4])
    const prediction = Model.predict(tensor)
    const predictionWithArgMax = Model.predict(tensor).argMax(-1).dataSync()
    console.log(
      'Probamos el modelo con [0.1, 4.3, 2.1, 0.2],0.1;4.3;2.1;0.2 [1, 4]',
    )

    console.log('La solucion es:', predictionWithArgMax)

    document.getElementById('demo').innerHTML =
      prediction + 'tipo: ' + getIrisDataType(predictionWithArgMax)
    alertHelper.alertInfo(
      'Tipo: ' + getIrisDataType(predictionWithArgMax, predictionWithArgMax),
    )
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
    var i
    for (i = 0; i < idLayer; i++) {
      array2.push(array[i])
    }
    for (i = idLayer + 1; i < array.length; i++) {
      document.getElementById(
        `formUnitsLayer${i - 1}`,
      ).value = document.getElementById(`formUnitsLayer${i}`).value
      document.getElementById(
        `formActivationLayer${i - 1}`,
      ).value = document.getElementById(`formActivationLayer${i}`).value
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
    setstring(document.getElementById(`formTestInput`).value)
  }

  const handleChangeActivation = (index) => {
    let array = Layer
    array[index].activation = document.getElementById(
      `formActivationLayer${index}`,
    ).value
    setLayer(array)
  }

  const handleChangeLoss = () => {
    let aux = document.getElementById('FormLoss').value
    if (aux !== undefined) {
      setLossValue(aux)
    } else {
    }
  }

  const handleChangeOptimization = () => {
    let aux = document.getElementById('FormOptimizer').value
    if (aux !== undefined) {
      setOptimizer(aux)
    } else {
    }
  }

  const handleChangeMetrics = () => {
    let aux = document.getElementById('FormMetrics').value
    if (aux !== undefined) {
      setMetricsValue(aux)
    } else {
    }
  }

  return (
    <>
      <Form onSubmit={handleClickPlay}>
        <div className="container">
          <div className="header-model-editor">
            <p>
              A continuación se ha precargado una arquitectura. Programa dentro
              de la función "createArchitecture". A esta función se el pasa un
              array preparado que contine la información del dataset.
            </p>
          </div>
        </div>

        {/* BLOCK 1 */}
        <div className="column">
          {/* SPECIFIC PARAMETERS */}
          <Col className="col-specific">
            <div className="container-fluid container-fluid-w1900">
              {Layer.map((item, index) => {
                return (
                  <div key={index}>
                    <div className="container pane borde">
                      <div className="title-pane">
                        Capa {index + 1}
                        {/* <div className="spacer"></div> */}
                        <CloseButton
                          onClick={() => handlerRemoveLayer(index)}
                        />
                      </div>
                      {/* UNITS */}
                      <Form.Group
                        className="mb-3"
                        controlId={'formUnitsLayer' + index}
                      >
                        <Form.Label>Unidades de la capa</Form.Label>
                        <Form.Control
                          type="number"
                          placeholder="Introduce el número de unidades de la capa"
                          defaultValue={item.units}
                          onChange={() => handleChangeUnits(index)}
                        />
                      </Form.Group>

                      {/* ACTIVATION FUNCTION */}
                      <Form.Group
                        className="mb-3"
                        controlId={'formActivationLayer' + index}
                      >
                        <Form.Label>
                          Selecciona la función de activación
                        </Form.Label>
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
                          Será el optimizador que se usará para activar la
                          funcion
                        </Form.Text>
                      </Form.Group>
                    </div>
                  </div>
                )
              })}

              {/* ADD LAYER */}
              <button
                className="btn-add-layer"
                type="button"
                onClick={() => handlerAddLayer()}
                variant="primary"
              >
                Añadir capa
              </button>
            </div>
          </Col>

          {/* GENERAL PARAMETERS */}
          <Col className="col-general">
            <div className="container borde general-settings">
              {/* LEARNING RATE */}
              <Form.Group className="mb-3" controlId="formTrainRate">
                <Form.Label>Tasa de entrenamiento</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Introduce la tasa de entrenamiento"
                  defaultValue={learningValue}
                />
                <Form.Text className="text-muted">
                  Recuerda que debe ser un valor entre 0 y 100 (es un
                  porcentaje)
                </Form.Text>
              </Form.Group>

              {/* Nº OT ITERATIONS */}
              <Form.Group className="mb-3" controlId="formNumberOfEpochs">
                <Form.Label>Nº de iteraciones</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Introduce el número de iteraciones"
                  defaultValue={NumberEpochs}
                />
                <Form.Text className="text-muted">
                  *Mientras más alto sea, mas taradará en ejecutarse el
                  entrenamiento
                </Form.Text>
              </Form.Group>

              {/* OPTIMIZATION FUNCTION */}
              <Form.Group className="mb-3" controlId="FormOptimizer">
                <Form.Label>Selecciona el optimizador</Form.Label>
                <Form.Select
                  aria-label="Default select example"
                  defaultValue={Optimizer}
                  onChange={handleChangeOptimization}
                >
                  <option>Selecciona el optimizador</option>
                  {OPTIMIZER_TYPE.map((item, id) => {
                    return (
                      <option key={id} value={item}>
                        {item}
                      </option>
                    )
                  })}
                </Form.Select>
                <Form.Text className="text-muted">
                  Será el optimizador que se usará para activar la funcion
                </Form.Text>
              </Form.Group>
              {/* LOSS FUNCTION */}
              <Form.Group className="mb-3" controlId="FormLoss">
                <Form.Label>Selecciona la función de pérdida</Form.Label>
                <Form.Select
                  aria-label="Default select example"
                  defaultValue={LossValue}
                  onChange={handleChangeLoss}
                >
                  <option>Selecciona la función de pérdida</option>
                  {LOSS_TYPE.map((item, id) => {
                    return (
                      <option key={id} value={item}>
                        {item}
                      </option>
                    )
                  })}
                </Form.Select>
                <Form.Text className="text-muted">
                  Será el optimizador que se usará para activar la funcion
                </Form.Text>
              </Form.Group>

              {/* METRICS FUNCTION */}
              <Form.Group className="mb-3" controlId="FormMetrics">
                <Form.Label>Selecciona la métrica</Form.Label>
                <Form.Select
                  aria-label="Default select example"
                  defaultValue={MetricsValue}
                  onChange={handleChangeMetrics}
                >
                  <option>Selecciona la métrica</option>
                  {METRICS_TYPE.map((item, id) => {
                    return (
                      <option key={id} value={item}>
                        {item}
                      </option>
                    )
                  })}
                </Form.Select>
                <Form.Text className="text-muted">
                  Será el optimizador que se usará para activar la funcion
                </Form.Text>
              </Form.Group>
            </div>
            {/* <Button variant="primary" type="submit">
              CREAR Y ENTRENAR MODELO
            </Button> */}
          </Col>
        </div>

        {/* BLOCK  BUTTON */}
        <div className="column2">
          <Col className="col-specific">
            <button
              className="btn-add-layer"
              type="submit"
              // onClick=
              variant="primary"
            >
              Crear y entrenar modelo
            </button>
          </Col>
        </div>

        {/* BLOCK 2 */}
        <div className="column2">
          <Col className="col-specific">
            <div className="container-fluid container-fluid-w1900">
              <div className="container pane borde">
                <div className="title-pane">Resultado</div>
                {/* VECTOR TEST */}
                <Form.Group className="mb-3" controlId={'formTestInput'}>
                  <Form.Label>Introduce el vector a probar</Form.Label>
                  <Form.Control
                    placeholder="Introduce el vector a probar"
                    defaultValue="0.1;4.3;2.1;0.2"
                    onChange={() => handleChangeTestInput()}
                  />
                </Form.Group>
                {/* SUBMIT BUTOON */}
                <button
                  className="btn-add-layer"
                  type="button"
                  onClick={handleVectorTest}
                  variant="primary"
                >
                  Ver resultado
                </button>
              </div>
            </div>
          </Col>
        </div>

        {/* BLOCK 3 */}
        <div id="salida">Aqui va el Resultado</div>
        <div className="resultados">
          <Row>
            <Col>
              <div
                id="demo"
                className="borde console"
                width="100%"
                height="100%"
              >
                Aquí se muestran los resultados
              </div>
            </Col>
          </Row>
        </div>
      </Form>
    </>
  )
}

export default InteractiveEditor
