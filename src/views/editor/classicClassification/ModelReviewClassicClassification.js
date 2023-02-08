import React from 'react'
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap'
import * as tf from '@tensorflow/tfjs'
import DragAndDrop from "../../../components/dragAndDrop/DragAndDrop";
import * as alertHelper from '../../../utils/alertHelper'
import { CONSOLE_LOG_h3 } from "../../../Constantes";
import {
  CAR_CLASSES,
  CAR_DATA_CLASSES,
  CAR_DATA_DEFAULT,
  CAR_DATA_OBJECT
} from '../../../modelos/ClassificationHelper_CAR'
import {
  IRIS_CLASSES,
  IRIS_DATA_DEFAULT,
  IRIS_DATA_OBJECT
} from '../../../modelos/ClassificationHelper_IRIS'
import {
  getHTML_DATASET_DESCRIPTION,
  getNameDatasetByID_ClassicClassification,
  LIST_MODEL_OPTIONS,
  MODEL_CAR,
  MODEL_IRIS,
  MODEL_UPLOAD,
} from "../../../DATA_MODEL";
import { isProduction } from "../../../utils/utils";

export default class ModelReviewClassicClassification extends React.Component {
  constructor(props) {
    super(props);
    this.dataSet = props.dataSet
    this.state = {
      model: null,
      textToTest: "",
      isButtonDisabled: false,
      dataToTest: {}
    }
    this.files = {
      binary: null,
      json: null
    }
    this.handleChange_TestInput = this.handleChange_TestInput.bind(this)
    this.handleClick_TestVector = this.handleClick_TestVector.bind(this)
    this.handleChangeParameter = this.handleChangeParameter.bind(this)

    this.handle_BinaryFileUpload = this.handle_BinaryFileUpload.bind(this)
    this.handle_JSONFileUpload = this.handle_JSONFileUpload.bind(this)
  }

  componentDidMount() {
    this.init()
      .then(() => undefined)
      .catch((reason) => console.log(reason))
  }

  async init() {
    switch (getNameDatasetByID_ClassicClassification(this.dataSet)) {
      case MODEL_UPLOAD: {
        break
      }
      case MODEL_CAR: {
        await this.loadModel_CAR()
        this.setState({ dataToTest: CAR_DATA_DEFAULT }, () => {
          this.setState({ textToTest: Object.values(this.state.dataToTest).join(";") })
        })
        break;
      }
      case MODEL_IRIS: {
        await this.loadModel_IRIS()
        this.setState({ dataToTest: IRIS_DATA_DEFAULT }, () => {
          this.setState({ textToTest: Object.values(this.state.dataToTest).join(";") })
        })
        break;
      }
      default: {
        console.error("Error, conjunto de datos no reconocido")
        break
      }
    }
  }

  async loadModel_CAR() {
    if (!isProduction) console.log('%cCargando modelo coches', CONSOLE_LOG_h3)
    this.model = await tf.loadLayersModel(
      process.env.REACT_APP_PATH + "/models/carClassification/mymodelCar.json")
    await alertHelper.alertSuccess("Modelo cargado con éxito")
  }

  async loadModel_IRIS() {
    if (!isProduction) console.log('%cCargando modelo petalos', CONSOLE_LOG_h3)
    this.model = await tf.loadLayersModel(
      process.env.REACT_APP_PATH + "/models/irisClassification/mymodelIris.json")
    await alertHelper.alertSuccess("Modelo cargado con éxito")
    // model.summary()
  }

  handleChange_TestInput() {
    this.setState({
      textToTest: document.getElementById(`formTestInput`).value
    })
  }

  async handleClick_TestVector() {
    this.setState({ isButtonDisabled: true })
    // Ejemplo modelo del coche
    // vhigh;vhigh;2;2;big;med
    if (this.state.textToTest === undefined || this.state.textToTest.length < 1) {
      await alertHelper.alertWarning('Introduce unos valores a probar')
      this.setState({ isButtonDisabled: false })
      return;
    }

    switch (getNameDatasetByID_ClassicClassification(this.dataSet)) {
      case MODEL_UPLOAD: {
        try {
          const model = await tf.loadLayersModel(
            tf.io.browserFiles([this.files.json, this.files.binary]),
          )
          let array = this.state.textToTest.split(';')
          let input = [[], [1, array.length]]
          let i = 0
          array.forEach((element) => {
            input[0].push(CAR_DATA_CLASSES[i].findIndex((element) => element === array[i]))
            i++
          })
          const tensor = tf.tensor2d(input[0], input[1])
          const prediction = model.predict(tensor)
          const predictionWithArgMax = prediction
            .argMax(-1)
            .dataSync()
          await alertHelper.alertInfo(
            `La solución es el tipo: ${predictionWithArgMax}.${prediction}`,
            prediction
          )
        } catch (error) {
          console.error(error)
          await alertHelper.alertError(error)
        }
        break;
      }
      case MODEL_CAR: {
        // FIXME
        try {
          let array = this.state.textToTest.split(';')
          let input = [[], [1, array.length]]
          let i = 0
          array.forEach((element) => {
            input[0].push(CAR_DATA_CLASSES[i].findIndex((element) => element === array[i]))
            i++
          })
          const tensor = tf.tensor2d(input[0], input[1])
          const prediction = this.model.predict(tensor)
          const predictionWithArgMax = this.model.predict(tensor)
            .argMax(-1)
            .dataSync()
          await alertHelper.alertInfo(
            `Este es el resultado: ${CAR_CLASSES[predictionWithArgMax]}.${prediction}`,
            CAR_CLASSES[predictionWithArgMax],
          )
        } catch (error) {
          console.error(error)
          await alertHelper.alertError("Error al evaluar el modelo. Revisa que los datos introducidos son correctos")
        }
        break;
      }
      case MODEL_IRIS: {
        try {
          let input = [[], [1, this.state.textToTest.split(';').length]]
          this.state.textToTest.split(';').forEach((element) => {
            input[0].push(parseFloat(element))
          })
          const tensor = tf.tensor2d(input[0], input[1])
          const prediction = this.model.predict(tensor)
          const predictionWithArgMax = this.model.predict(tensor)
            .argMax(-1)
            .dataSync()
          await alertHelper.alertInfo(
            `Este es el resultado: ${IRIS_CLASSES[predictionWithArgMax]}. ${prediction}`,
            IRIS_CLASSES[predictionWithArgMax],
          )
        } catch (error) {
          console.error(error)
          await alertHelper.alertError("Error al evaluar el modelo. Revisa que los datos introducidos son correctos")
        }
        break;
      }
      default: {
        console.error("Error, conjunto de datos no reconocido")
        break
      }
    }

    this.setState({ isButtonDisabled: false })
  }

  handle_JSONFileUpload(files) {
    this.files.json = new File([files[0]], files[0].name, { type: files[0].type });
  }

  handle_BinaryFileUpload(files) {
    this.files.binary = new File([files[0]], files[0].name, { type: files[0].type });
  }

  getInfoDataset() {
    switch (getNameDatasetByID_ClassicClassification(this.dataSet)) {
      case MODEL_UPLOAD:
        return <>
          <p>
            Introduce separado por punto y coma los valores.
            <br/>
            <b>(parámetro-1; parámetro-2; parámetro-3; ... ;parámetro-n).</b>
          </p>
        </>
      case MODEL_CAR:
        return <>
          <p>
            Introduce separado por punto y coma los siguientes valores correspondientes a el coche que se va a evaluar:
            <br/>
            <b>(buying; maint; doors; persons; lug_boot; safety).</b>
          </p>
          <p>Ejemplos:</p>
          <div className="d-flex gap-2">
            <Button onClick={() => this.setExampleCar(1)}>Ejemplo 1</Button>
            <Button onClick={() => this.setExampleCar(2)}>Ejemplo 2</Button>
            <Button onClick={() => this.setExampleCar(3)}>Ejemplo 3</Button>
            <Button onClick={() => this.setExampleCar(4)}>Ejemplo 4</Button>
            <Button onClick={() => this.setExampleCar(5)}>Ejemplo 5</Button>
          </div>
        </>
      case MODEL_IRIS:
        return <>
          <p>
            Introduce separado por punto y coma los siguientes valores correspondientes a la planta que se va a evaluar:
            <br/>
            <b>(longitud sépalo;anchura sépalo;longitud petalo;anchura petalo).</b>
          </p>
          <p>Ejemplos:</p>
          <div className="d-flex gap-2">
            <Button onClick={() => this.setExampleIris(1)}>Ejemplo 1</Button>
            <Button onClick={() => this.setExampleIris(2)}>Ejemplo 2</Button>
            <Button onClick={() => this.setExampleIris(3)}>Ejemplo 3</Button>
          </div>
        </>
      default:
        return <>DEFAULT</>
    }
  }

  handleChangeParameter(key_parameter, value) {
    this.setState((prevState) => ({ dataToTest: { ...prevState.dataToTest, [key_parameter]: value } }),
      () => {
        this.setState({ textToTest: Object.values(this.state.dataToTest).join(";") })
      }
    )
  }

  setExampleCar(key) {
    const examples = {
      1: { buying: "vhigh", maint: "vhigh", doors: "2", persons: "2", lug_boot: "big", safety: "med" },
      2: { buying: "vhigh", maint: "vhigh", doors: "2", persons: "2", lug_boot: "small", safety: "low" },
      3: { buying: "low", maint: "vhigh", doors: "4", persons: "2", lug_boot: "small", safety: "low" },
      4: { buying: "low", maint: "low", doors: "5more", persons: "more", lug_boot: "big", safety: "high" },
      5: { buying: "med", maint: "med", doors: "2", persons: "4", lug_boot: "med", safety: "high" }
    }
    this.setState({ dataToTest: examples[key] })
    this.setState({ textToTest: Object.values(examples[key]).join(";") })
  }

  setExampleIris(key) {
    const examples = {
      1: { longitud_sepalo: 5.1, anchura_sepalo: 3.5, longitud_petalo: 1.4, anchura_petalo: 0.2 },
      2: { longitud_sepalo: 6.1, anchura_sepalo: 3.0, longitud_petalo: 4.6, anchura_petalo: 1.4 },
      3: { longitud_sepalo: 5.8, anchura_sepalo: 2.7, longitud_petalo: 5.1, anchura_petalo: 1.9 },
    }
    this.setState({ dataToTest: examples[key] })
    this.setState({ textToTest: Object.values(examples[key]).join(";") })
  }

  render() {
    return (
      <>
        <Container id={"ModelReviewClassicClassification"}>
          <Row>
            <Col xs={12} sm={12} md={12} xl={3} xxl={3}>
              <Card className={"sticky-top mt-3 mb-3 border-info"}>
                <Card.Header><h3>Modelo</h3></Card.Header>
                <Card.Body>
                  <Card.Title>{LIST_MODEL_OPTIONS[0][this.dataSet]}</Card.Title>
                  {getNameDatasetByID_ClassicClassification(this.dataSet) === MODEL_UPLOAD ? (
                    <>
                      <Card.Subtitle className="mb-3 text-muted">Carga tu propio Modelo.</Card.Subtitle>
                      <Card.Text>
                        Ten en cuenta que tienes que subir primero el archivo .json y después el fichero .bin
                      </Card.Text>
                      <Row>
                        <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                          <DragAndDrop name={"json"}
                                       id={"json-upload"}
                                       accept={{ 'application/json': ['.json'] }}
                                       text={"Añada el fichero JSON"}
                                       labelFiles={"Fichero:"}
                                       function_DropAccepted={this.handle_JSONFileUpload}/>
                        </Col>
                        <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                          <DragAndDrop name={"bin"}
                                       id={"weights-upload"}
                                       accept={{ 'application/octet-stream': ['.bin'] }}
                                       text={"Añada el fichero binario"}
                                       labelFiles={"Fichero:"}
                                       function_DropAccepted={this.handle_BinaryFileUpload}/>
                        </Col>
                      </Row>
                    </>
                  ) : (
                    <> {getHTML_DATASET_DESCRIPTION(0, this.dataSet)}</>
                  )}
                </Card.Body>
              </Card>
            </Col>

            <Col xs={12} sm={12} md={12} xl={9} xxl={9}>
              <Col xs={12} sm={12} md={12} xl={12} xxl={12}>
                <Card className={"mt-3"}>
                  <Card.Header><h3>Configuración</h3></Card.Header>
                  <Card.Body>
                    {this.getInfoDataset()}
                  </Card.Body>
                </Card>
              </Col>

              <Col xs={12} sm={12} md={12} xl={12} xxl={12}>
                <Card className={"mt-3"}>
                  <Card.Header><h3>Prueba</h3></Card.Header>
                  <Card.Body>
                    <div>
                      {(getNameDatasetByID_ClassicClassification(this.dataSet) === MODEL_CAR) &&
                        <>
                          <Row className={"mt-3"}>
                            {Object.entries(CAR_DATA_OBJECT).map(([key_parameter, values]) => {
                              return <Col key={key_parameter} xs={6} sm={6} md={4} xl={4} xxl={4}>
                                <Form.Group controlId={key_parameter}>
                                  <Form.Label>Selecciona el parámetro</Form.Label>
                                  <Form.Select aria-label="Default select example"
                                               value={this.state.dataToTest[key_parameter]}
                                               defaultValue={this.state.dataToTest[key_parameter] ?? values[0]}
                                               onChange={($event) => this.handleChangeParameter(key_parameter, $event.target.value)}>
                                    {values.map((itemAct, indexAct) => {
                                      return (<option key={indexAct} value={itemAct}>{itemAct}</option>)
                                    })}
                                  </Form.Select>
                                  <Form.Text className="text-muted">Parámetro: {key_parameter}</Form.Text>
                                </Form.Group>
                              </Col>
                            })}
                          </Row>
                        </>
                      }
                      {(getNameDatasetByID_ClassicClassification(this.dataSet) === MODEL_IRIS) &&
                        <>
                          <Row className={"mt-3"}>
                            {Object.entries(IRIS_DATA_OBJECT).map(([key_parameter, value]) => {
                              return <Col key={key_parameter} xs={6} sm={6} md={4} xl={6} xxl={6}>
                                <Form.Group controlId={key_parameter}>
                                  <Form.Label>Selecciona el parámetro</Form.Label>
                                  <Form.Control type="number"
                                                min={0}
                                                placeholder={"Enter parameter"}
                                                step={0.1}
                                                value={this.state.dataToTest[key_parameter] ?? value}
                                                onChange={($event) => this.handleChangeParameter(key_parameter, $event.target.value)}/>
                                  <Form.Text className="text-muted">Parámetro: {key_parameter}</Form.Text>
                                </Form.Group>
                              </Col>
                            })}
                          </Row>
                        </>
                      }

                      <Row className={"mt-3"}>
                        <Col>
                          {/* VECTOR TEST */}
                          <Form.Group controlId={'formTestInput'}>
                            <Form.Label>Vector a probar</Form.Label>
                            <Form.Control placeholder="Vector a probar"
                                          autoComplete="off"
                                          disabled={getNameDatasetByID_ClassicClassification(this.dataSet) !== MODEL_UPLOAD}
                                          value={this.state.textToTest}
                                          onChange={this.handleChange_TestInput}/>
                          </Form.Group>
                        </Col>
                      </Row>

                      <Row className={"mt-3"}>
                        <Col>
                          {/* SUBMIT BUTTON */}
                          <div className="d-grid gap-2 mt-3">
                            <Button type="button"
                                    onClick={this.handleClick_TestVector}
                                    disabled={this.state.isButtonDisabled}
                                    size={"lg"}
                                    variant="primary">
                              {this.state.isButtonDisabled ? (
                                <>
                                  <span className="spinner-border spinner-border-sm"
                                        role="status"
                                        aria-hidden="true"></span>
                                  <span className="visually-hidden">Cargando...</span>
                                </>
                              ) : (
                                <>Comprobar resultado</>
                              )}
                            </Button>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Col>
          </Row>
        </Container>
      </>
    )
  }
}
