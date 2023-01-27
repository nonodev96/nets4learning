import React, { useState, useEffect } from 'react'
import * as tf from '@tensorflow/tfjs'
import { Col, Row, Container, Button, Form, Card, Accordion } from 'react-bootstrap'
import {
  getHTML_DATASET_DESCRIPTION,
  getNameDatasetByID_ClassicClassification,
  LIST_MODEL_OPTIONS,
  MODEL_CAR,
  MODEL_IRIS,
  MODEL_UPLOAD
} from "../../../DATA_MODEL";
import {
  createClassicClassification,
  createClassicClassificationCustomDataSet, objectToSelectOptions, TYPE_ACTIVATION_OBJECT,
  TYPE_LOSS, TYPE_METRICS, TYPE_OPTIMIZER,
} from '../../../modelos/ArchitectureHelper'
import * as iris from "../../../modelos/ClassificationHelper_IRIS";
import * as cars from '../../../modelos/data/coches.json'
import * as alertHelper from '../../../utils/alertHelper'
import GraphicRed from '../../../utils/graphicRed/GraphicRed'
import { CONSOLE_LOG_h3 } from "../../../Constantes";
import './ClassicClassification.css'

export default function CustomDataSetClassicClassification(props) {
  const { dataSet } = props

  // TODO: DEPENDIENDO DEL TIPO QUE SEA SE PRE CARGAN UNOS AJUSTES U OTROS
  const NumberEpochs = 50
  const learningValue = 1
  const [nLayer, setNLayer] = useState(0)
  const [Layer, setLayer] = useState([])
  const [Optimizer, setOptimizer] = useState('Adam')
  // LOSS_TYPE
  const [LossValue, setLossValue] = useState('CategoricalCrossentropy')
  // METRICS_TYPE
  const [MetricsValue, setMetricsValue] = useState('Accuracy')
  const [Model, setModel] = useState(null)
  const [String, setString] = useState("")
  const [NoEpochs, setNoEpochs] = useState(50)
  const [CustomDataSet, setCustomDataSet] = useState()
  const [DataSetClasses, setDataSetClasses] = useState([])
  const [UploadedArchitecture, setUploadedArchitecture] = useState(false)
  const [ActiveLayer, setActiveLayer] = useState()
  const [TargetSetClasses, setTargetSetClasses] = useState([])

  useEffect(() => {
    const uploadedArchitecture = localStorage.getItem('custom-architecture')
    if (uploadedArchitecture !== 'nothing') {
      setUploadedArchitecture(true)
      const uploadedJSON = JSON.parse(uploadedArchitecture)
      const auxLayer = uploadedJSON.modelTopology.config.layers
      let _layerArray = []
      for (let i = 0; i < auxLayer.length; i++) {
        _layerArray.push({
          units: auxLayer[i].config.units,
          activation: auxLayer[i].config.activation,
        })
      }
      // console.log({ _layerArray })
      setLayer(_layerArray)
      setNLayer(_layerArray.length)
    } else {
      setLayer([
        { units: 10, activation: 'sigmoid' },
        { units: 3, activation: 'softmax' },
      ])
      setNLayer(2)
      switch (getNameDatasetByID_ClassicClassification(dataSet)) {
        case MODEL_UPLOAD: {
          setString("")
          break
        }
        case MODEL_IRIS: {
          setString("5;5;4;2")
          break
        }
        case MODEL_CAR: {
          setString('vhigh;vhigh;2;2;big;med')
          break
        }
        default: {
          setString('0.1;4.3;2.1;0.2')
        }
      }
    }
    setActiveLayer(0)
  }, [])

  const handleClickPlay = async (event) => {
    event.preventDefault()
    console.log('Este es el conjunto de datos: ', { dataSet })
    switch (getNameDatasetByID_ClassicClassification(dataSet)) {
      case MODEL_UPLOAD: {
        if (CustomDataSet !== undefined) {
          await alertHelper.alertError('Primero debes de cargar la arquitectura')
          return
        }
        let _learningRate = parseInt(document.getElementById('formTrainRate').value) / 100
        let _unknownRate = 0.1
        let _numberOfEpoch = parseInt(NoEpochs)
        let _sLOptimizer = document.getElementById('FormOptimizer').value
        let _layerList = Layer
        let _idLoss = LossValue
        let _idMetrics = MetricsValue
        let _customDataSet = CustomDataSet
        const [model, TARGET_SET_CLASSES, DATA_SET_CLASSES] = await createClassicClassificationCustomDataSet(
          _learningRate,
          _unknownRate,
          _numberOfEpoch,
          _sLOptimizer,
          _layerList,
          _idLoss,
          _idMetrics,
          _customDataSet,
        )
        setDataSetClasses(DATA_SET_CLASSES)
        setTargetSetClasses(TARGET_SET_CLASSES)
        setModel(model)
        await alertHelper.alertSuccess('Modelo entrenado con éxito')

        break;
      }
      case MODEL_CAR: {
        let aux = cars
        console.log({ cochesDataset: cars })
        let _learningRate = parseInt(document.getElementById('formTrainRate').value) / 100
        let _unknownRate = 0.1
        let _numberOfEpoch = parseInt(NoEpochs)
        let _sLOptimizer = document.getElementById('FormOptimizer').value
        let _layerList = Layer
        let _idLoss = LossValue
        let _idMetrics = MetricsValue
        let _customDataSet = aux
        const [model, TARGET_SET_CLASSES, DATA_SET_CLASSES] = await createClassicClassificationCustomDataSet(
          _learningRate,
          _unknownRate,
          _numberOfEpoch,
          _sLOptimizer,
          _layerList,
          _idLoss,
          _idMetrics,
          _customDataSet
        )
        setDataSetClasses(DATA_SET_CLASSES)
        setTargetSetClasses(TARGET_SET_CLASSES)
        setModel(model)
        await alertHelper.alertSuccess('Modelo entrenado con éxito')
        break;
      }
      case MODEL_IRIS: {
        console.log('hola es el dataset 2')
        let _learningRate = parseInt(document.getElementById('formTrainRate').value) / 100
        let _unknownRate = 0.1
        let _numberOfEpoch = parseInt(NoEpochs)
        let _sLOptimizer = document.getElementById('FormOptimizer').value
        let _layerList = Layer
        let _idLoss = LossValue
        let _idMetrics = MetricsValue
        const model = await createClassicClassification(
          _learningRate,
          _unknownRate,
          _numberOfEpoch,
          _sLOptimizer,
          _layerList,
          _idLoss,
          _idMetrics
        )
        setDataSetClasses([0, 1, 2, 3])
        setTargetSetClasses(iris.IRIS_CLASSES)
        setModel(model)
        await alertHelper.alertSuccess('Modelo entrenado con éxito')
        break;
      }
      default: {
        console.error("Error, opción no disponible")
      }
    }
  }

  const handleVectorTest = async () => {
    // vhigh;vhigh;2;2;big;med
    let input = [[], [1, String.split(';').length]]
    if (getNameDatasetByID_ClassicClassification(dataSet) === MODEL_UPLOAD) {
      if (CustomDataSet === undefined) {
        await alertHelper.alertError('Primero debes de cargar un dataSet')
        return
      }
    }
    if (Model === undefined) {
      await alertHelper.alertError('Primero debes de entrenar el modelo')
      return
    }
    try {
      switch (getNameDatasetByID_ClassicClassification(dataSet)) {
        case MODEL_UPLOAD: {
          let i = 0
          String.split(';').forEach((element) => {
            if (isNaN(parseFloat(element))) {
              input[0].push(DataSetClasses[i].get(element))
            } else {
              input[0].push(DataSetClasses[i].get(parseFloat(element)))
            }
            i++
          })
          break
        }
        case MODEL_CAR: {
          // med;high;4;4;small;high
          String.split(';').forEach((element) => {
            input[0].push(parseFloat(element))
          })
          break
        }
        case MODEL_IRIS: {
          break
        }
        default: {
          console.error("Error, opción no permitida")
          break
        }
      }

      const tensor = tf.tensor2d(input[0], input[1])
      const prediction = Model.predict(tensor)
      const predictionWithArgMax = prediction.argMax(-1).dataSync()

      console.log('La solución es: ', { predictionWithArgMax })
      await alertHelper.alertInfo(
        'Tipo: ' + TargetSetClasses[predictionWithArgMax],
        TargetSetClasses[predictionWithArgMax],
      )
    } catch (error) {
      console.error(error)
    }
  }

  const handlerAddLayer = async () => {
    let aux = Layer
    if (aux === undefined) {
      await alertHelper.alertWarning("Error handlerAddLayer")
    }
    if (aux.length < 6) {
      aux.push({ units: 0, activation: 0 })
      setLayer(aux)
      setNLayer(nLayer + 1)
    } else {
      await alertHelper.alertWarning("No se pueden añadir más capas")
    }
  }

  const handlerRemoveLayer = async (idLayer) => {
    let aux = Layer
    if (aux === undefined) {
      await alertHelper.alertWarning(`Error handlerRemoveLayer`)
    }
    // console.log({ aux })
    let new_layer = []
    for (let i = 0; i < idLayer; i++) {
      new_layer.push(aux[i])
    }
    for (let i = idLayer + 1; i < aux.length; i++) {
      document.getElementById(`formUnitsLayer${i - 1}`).value =
        document.getElementById(`formUnitsLayer${i}`).value
      document.getElementById(`formActivationLayer${i - 1}`).value =
        document.getElementById(`formActivationLayer${i}`).value
      new_layer.push(aux[i])
    }
    setLayer(new_layer)
    setNLayer(nLayer - 1)
  }

  const handleChangeUnits = async (index) => {
    let aux = Layer
    if (aux === undefined) {
      await alertHelper.alertWarning(`Error handleChangeUnits`)
    }
    // console.log({ aux })
    aux[index].units = parseInt(document.getElementById(`formUnitsLayer${index}`).value)
    setLayer(aux)
  }

  const handleChangeTestInput = async () => {
    let aux = document.getElementById(`formTestInput`).value
    if (aux === undefined) {
      await alertHelper.alertWarning(`Error handleChangeTestInput`)
    }
    // console.log({ aux })
    setString(aux)
  }

  const handleChangeActivation = async (index) => {
    let aux = Layer
    if (aux === undefined) {
      await alertHelper.alertWarning(`Error handleChangeActivation`)
    }
    // console.log({ aux })
    aux[index].activation = document.getElementById(`formActivationLayer${index}`).value
    setLayer(aux)
  }

  const handleChangeNoEpochs = async () => {
    let aux = document.getElementById('FormNumberOfEpochs').value
    if (aux === undefined) {
      await alertHelper.alertWarning(`Error handleChangeNoEpochs`)
    }
    // console.log({ aux })
    setNoEpochs(aux)
  }

  const handleChangeLoss = async () => {
    let aux = document.getElementById('FormLoss').value
    if (aux === undefined) {
      await alertHelper.alertWarning(`Error handleChangeLoss`)
    }
    // console.log({ aux })
    setLossValue(aux)
  }

  const handleChangeOptimization = async () => {
    let aux = document.getElementById('FormOptimizer').value
    if (aux === undefined) {
      await alertHelper.alertWarning(`Error handleChangeLoss`)
    }
    // console.log({ aux })
    setOptimizer(aux)
  }

  const handleChangeMetrics = async () => {
    let aux = document.getElementById('FormMetrics').value
    if (aux === undefined) {
      await alertHelper.alertWarning(`Error handleChangeMetrics`)
    }
    // console.log({ aux })
    setMetricsValue(aux)
  }

  const handleDownloadModel = () => {
    Model.save('downloads://mymodel')
  }

  function download(filename, textInput) {
    const element = document.createElement('a')
    element.setAttribute('href', 'data:text/plain;charset=utf-8, ' + encodeURIComponent(textInput))
    element.setAttribute('download', filename)
    document.body.appendChild(element)
    element.click()
  }

  const downloadFile = () => {
    const url = 'plantilla.json'
    download(
      url,
      `
{
  "datos": [
    ["dato1", "dato2", "dato3", "dato4", "dato5","resultado1"],
    ["dato11", "dato12", "dato13", "dato14", "dato15","resultado2"],
    ["dato21", "dato22", "dato23", "dato24", "dato25","resultado3"],
    ["dato31", "dato32", "dato33", "dato34", "dato35","resultado4"],
    ["dato41", "dato42", "dato43", "dato44", "dato45","resultado5"],
    ["dato51", "dato52", "dato53", "dato54", "dato55","resultado6"]
  ]
}
`,
    )
  }

  const handleChangeFileUpload = (e) => {
    if (e.target.files.length !== 1) {
      console.log("%cError, no se ha podido leer el fichero", CONSOLE_LOG_h3)
      return;
    }
    try {
      let files = e.target.files
      let reader = new FileReader()
      reader.readAsText(files[0])
      let object
      reader.onload = (e) => {
        object = JSON.parse(e.target.result.toString())
        setCustomDataSet(object)
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <Form onSubmit={handleClickPlay} id={"CustomDataSetClassicClassification"}>
        <Container className={"mb-3"}>
          <Row>
            <Col xl={12} className={"mt-3"}>
              <Card>
                <Card.Body>
                  {UploadedArchitecture ? (
                    <Card.Text>
                      A continuación se ha pre cargado la arquitectura del fichero importado en la vista anterior.
                      Modifica los parámetros a tu gusto para jugar con la red y descubrir diferentes comportamientos de
                      la misma.
                    </Card.Text>
                  ) : (
                    <Card.Text>
                      A continuación se ha pre cargado una arquitectura.
                      Modifica los parámetros a tu gusto para jugar con la red y descubrir diferentes comportamientos de
                      la misma.
                    </Card.Text>
                  )}
                </Card.Body>
              </Card>
            </Col>


            <Col xl={12} className={"mt-3"}>
              <Card>
                <Card.Header><h3>{LIST_MODEL_OPTIONS[0][dataSet]}</h3></Card.Header>
                <Card.Body>
                  {{
                    0: <>
                      <p>
                        Carga tu propio conjunto de datos con la siguiente{" "}
                        <a href="#" onClick={() => downloadFile}>estructura</a> pulsando
                        este botón.
                      </p>
                      <div className="mb-3">
                        <label htmlFor="formFile"
                               className="form-label">Default file input example</label>
                        <input className="form-control"
                               type="file"
                               id="formFile"
                               onChange={() => handleChangeFileUpload}></input>
                      </div>
                    </>
                  }[dataSet]}
                  {dataSet !== 0 ? (
                    // DEFAULT
                    getHTML_DATASET_DESCRIPTION(0, dataSet)
                  ) : ("")}
                </Card.Body>
              </Card>
            </Col>

            <Col xl={12} className={"mt-3"}>
              {/* {numberClass.start()} */}
              <Card>
                <Card.Body>
                  <p>Ahora vamos a ver la interfaz de edición de arquitectura. </p>
                  <ul>
                    <li>
                      <b>A la izquierda </b><br/>
                      Se pueden ver las capas de neuronas, puedes agregar tantas como desees pulsando el botón "Añadir
                      capa". <br/>
                      Puedes modificar dos parámetros:
                    </li>
                    <ul>
                      <li><b>Unidades de la capa:</b><br/>Cuantas unidades deseas que tenga esa capa</li>
                      <li><b>Función de activación:</b><br/>Función de activación para esa capa</li>
                    </ul>

                    <li>
                      <b>A la derecha </b><br/>
                      Se pueden ver parámetros generales necesarios para la creación del modelo. <br/>
                      Estos parámetros son:
                    </li>
                    <ul>
                      <li>
                        <b>Tasa de entrenamiento:</b><br/>
                        Valor entre 0 y 100 el cual indica a la red qué cantidad de datos debe usar para el
                        entrenamiento y reglas para el test
                      </li>
                      <li>
                        <b>Nº de iteraciones:</b><br/>
                        Cantidad de ciclos que va a realizar la red (a mayor número, más tiempo tarda en entrenar)
                      </li>
                      <li>
                        <b>Optimizador:</b><br/>
                        Es una función que como su propio nombre indica se usa para optimizar los modelos.
                        Esto es frecuentemente usado para evitar estancarse en un máximo local.
                      </li>
                      <li>
                        <b>Función de pérdida:</b><br/>
                        Es un método para evaluar qué tan bien un algoritmo específico modela los datos otorgados
                      </li>
                      <li>
                        <b>Métrica:</b><br/>
                        Es evaluación para valorar el rendimiento de un modelo de aprendizaje automático
                      </li>
                    </ul>

                    <li>
                      <b>Crear y entrenar modelo.</b><br/>
                      Una vez se han rellenado todos los campos anteriores podemos crear el modelo pulsando el botón.
                    </li>

                    <li>
                      <b>Exportar modelo.</b><br/>
                      Si hemos creado el modelo correctamente nos aparece este botón que nos permite exportar el modelo
                      y guardarlo localmente.
                    </li>

                    <li>
                      <b>Resultado.</b><br/>
                      Un formulario que nos permite predecir el valor de salida a partir de los valores de entrada que
                      introducimos, para ver la salida solamente hay que pulsar "Ver resultado".
                    </li>

                  </ul>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* BLOCK 1 */}
          <Row className={"mt-3"}>
            <Col xl={12}>
              <Card>
                <Card.Header><h3>Diseño de capas</h3></Card.Header>
                <Card.Body>
                  <GraphicRed layer={Layer} setActiveLayer={setActiveLayer} tipo={0}/>
                </Card.Body>
              </Card>
            </Col>

            {/* SPECIFIC PARAMETERS */}
            <Col className={"mt-3"} xl={6}>
              {/* ADD LAYER */}
              <div className="d-grid gap-2">
                <Button type="button"
                        onClick={() => handlerAddLayer()}
                        size={"lg"}
                        variant="primary">
                  Añadir capa
                </Button>
              </div>

              <Accordion className={"mt-3"} defaultActiveKey={["0"]} alwaysOpen>
                {Layer.map((item, index) => {
                  return (
                    <Accordion.Item key={index} eventKey={index.toString()}>
                      <Accordion.Header>
                        Capa {index + 1}
                      </Accordion.Header>

                      <Accordion.Body>
                        <div className="d-grid gap-2">
                          <Button onClick={() => handlerRemoveLayer(index)}
                                  variant={"danger"}>
                            Eliminar capa {index + 1}
                          </Button>
                        </div>
                        {/* UNITS */}
                        <Form.Group className="mt-3"
                                    controlId={'formUnitsLayer' + index}>
                          <Form.Label>Unidades de la capa</Form.Label>
                          <Form.Control type="number"
                                        placeholder="Introduce el número de unidades de la capa"
                                        defaultValue={item.units}
                                        onChange={() => handleChangeUnits(index)}/>
                        </Form.Group>
                        {/* ACTIVATION FUNCTION */}
                        <Form.Group className="m3-3"
                                    controlId={'formActivationLayer' + index}>
                          <Form.Label>Selecciona la función de activación</Form.Label>
                          <Form.Select aria-label={"Default select example: " + item.activation}
                                       defaultValue={item.activation}
                                       onChange={() => handleChangeActivation(index)}>
                            <option>Selecciona la función de activación</option>
                            {objectToSelectOptions(TYPE_ACTIVATION_OBJECT)
                              .map(({ key, label }, indexAct) => {
                                return (<option key={indexAct} value={key}>{label}</option>)
                              })
                            }
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
            <Col className={"mt-3"} xl={6}>
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
                                  defaultValue={NumberEpochs}
                                  onChange={handleChangeNoEpochs}/>
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
                      {TYPE_LOSS.map((item, id) => {
                        return (<option key={id} value={item}>{item}</option>)
                      })}
                    </Form.Select>
                    <Form.Text className="text-muted">
                      Será la función que se usará.
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
            </Col>
          </Row>

          {/* BLOCK  BUTTON */}
          <Row className={"mt-3"}>
            <Col xl={12}>
              <div className="d-grid gap-2">
                <Button type="submit"
                        size={"lg"}
                        variant="primary">
                  Crear y entrenar modelo
                </Button>
              </div>
            </Col>
          </Row>

          {/* SALIDA */}
          <Row className={"mt-3"}>
            <Col xl={12}>
              <Card>
                <Card.Header><h3>Salida</h3></Card.Header>
                <Card.Body>
                  <div id="salida"></div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Botón descargar modelo */}
          {(Model !== undefined) && (<>
            <Row className={"mt-3"}>
              <Col xl={12}>
                <div className="d-grid gap-2">
                  <Button type="button"
                          onClick={handleDownloadModel}
                          size={"lg"}
                          variant="primary">
                    Exportar modelo
                  </Button>
                </div>
              </Col>
            </Row>
          </>)}

          {/*
          <Row className={"mt-3"}>
            <Col xl={12}>
              <Card>
                <Card.Body>

                </Card.Body>
              </Card>
            </Col>
          </Row>
          */}

          {/* BLOCK 2 */}
          <Row className={"mt-3"}>
            <Col xl={12}>
              <Card>
                <Card.Body>
                  <Card.Text>
                    Para <b>ocultar y mostrar</b> el panel lateral pulsa la tecla <b>ñ</b>.
                  </Card.Text>
                  {{
                    0: <>
                      <Card.Text>
                        Introduce separado por comas los valores: <br/>
                        <b>(buying, maint, doors, persons, lug_boot, safety).</b>
                      </Card.Text>
                    </>,
                    1: <>
                      <Card.Text>
                        Introduce separado por comas los siguientes valores correspondientes a el coche que se va a
                        evaluar:<br/>
                        <b>(buying, maint, doors, persons, lug_boot, safety).</b>
                      </Card.Text>
                    </>,
                    2: <>
                      <Card.Text>
                        Introduce separado por comas los siguientes valores correspondientes a la planta que se va a
                        evaluar: <br/>
                        <b>(longitud sépalo,anchura sépalo,longitud petalo,anchura petalo).</b>
                      </Card.Text>
                    </>
                  }[dataSet]}
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className={"mt-3"}>
            <Col xl={12}>
              <Card>
                <Card.Header><h3>Resultado</h3></Card.Header>
                <Card.Body>
                  <Form.Group className="mb-3" controlId={'formTestInput'}>
                    <Form.Label>Introduce el vector a probar</Form.Label>
                    <Form.Control placeholder="Introduce el vector a probar"
                                  defaultValue={
                                    dataSet === '0' ? '' :
                                      dataSet === '1' ? 'vhigh;vhigh;2;2;big;med' :
                                        dataSet === '2' ? '0.1;4.3;2.1;0.2' : ''
                                  }
                                  onChange={() => handleChangeTestInput()}/>
                  </Form.Group>

                  {/* SUBMIT BUTTON */}
                  <Button type="button"
                          onClick={handleVectorTest}
                          size={"lg"}
                          variant="primary">
                    Ver resultado
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>

        </Container>
      </Form>
    </>
  )
}
