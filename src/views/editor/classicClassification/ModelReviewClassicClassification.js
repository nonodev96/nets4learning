import React from 'react'
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap'
import * as tf from '@tensorflow/tfjs'
import DragAndDrop from "../../../components/dragAndDrop/DragAndDrop";
import * as alertHelper from '../../../utils/alertHelper'
import { CONSOLE_LOG_h3 } from "../../../Constantes";
import {
  getHTML_DATASET_DESCRIPTION,
  getNameDatasetByID_ClassicClassification,
  MODEL_UPLOAD,
  MODEL_CAR,
  MODEL_IRIS,
  MODEL_HEPATITIS,
} from "../../../DATA_MODEL";
import { isProduction } from "../../../utils/utils";
import N4L_TablePagination from "../../../components/table/N4L_TablePagination";

export default class ModelReviewClassicClassification extends React.Component {
  constructor(props) {
    super(props);
    this.dataSet = props.dataSet
    this.dataset_ID = parseInt(props.dataSet ?? "0")
    this.dataset_key = getNameDatasetByID_ClassicClassification(this.dataset_ID)
    this.state = {
      loading:
        <>
          <div className="spinner-border"
               role="status"
               style={{
                 fontSize: "0.5em",
                 height: "1rem",
                 width: "1rem"
               }}>
            <span className="sr-only"></span>
          </div>
        </>,
      model: null,
      activePage: 0,
      textToTest: "",
      isButtonDisabled: true,
      dataToTest: {},
      filesUpload: true
    }
    this.files = {
      binary: null,
      json: null,
      csv: null
    }


    switch (this.dataset_key) {
      case MODEL_UPLOAD: {
        this.setState({ loading: "" })
        break
      }
      case MODEL_CAR.KEY: {
        this._model = MODEL_CAR
        if (!isProduction) console.log('%cCargando modelo coches', CONSOLE_LOG_h3)
        break;
      }
      case MODEL_IRIS.KEY: {
        this._model = MODEL_IRIS
        if (!isProduction) console.log('%cCargando modelo petalos', CONSOLE_LOG_h3)
        break;
      }
      case MODEL_HEPATITIS.KEY: {
        this._model = MODEL_HEPATITIS
        if (!isProduction) console.log('%cCargando modelo hepatitis', CONSOLE_LOG_h3)
        break;
      }
      default: {
        console.error("Error, conjunto de datos no reconocido")
        return;
      }
    }

    this.handleChange_TestInput = this.handleChange_TestInput.bind(this)
    this.handleChangeParameter = this.handleChangeParameter.bind(this)
    this.handleClick_TestVector = this.handleClick_TestVector.bind(this)
    this.handleClick_ChangePage = this.handleClick_ChangePage.bind(this)
    this.handleClick_LoadModel = this.handleClick_LoadModel.bind(this)

    this.handle_JSONFileUpload = this.handle_JSONFileUpload.bind(this)
    this.handle_BinaryFileUpload = this.handle_BinaryFileUpload.bind(this)
    this.handle_CSVFileUpload = this.handle_CSVFileUpload.bind(this)
  }

  componentDidMount() {
    this.init()
      .then(() => undefined)
      .catch((reason) => console.log(reason))
  }

  async init() {
    switch (this.dataset_key) {
      case MODEL_UPLOAD: {
        break
      }
      case MODEL_CAR.KEY:
      case MODEL_IRIS.KEY:
      case MODEL_HEPATITIS.KEY:
        try {
          this.setState({ dataToTest: this._model.DATA_DEFAULT }, () => {
            this.setState({ textToTest: Object.values(this.state.dataToTest).join(";") })
          })
          this.model = await this._model.loadModel()
          this.setState({ loading: "" })
          this.setState({ isButtonDisabled: false })
          await alertHelper.alertSuccess("Modelo cargado con éxito")
        } catch (e) {
          console.error("Error, no se ha podido cargar el modelo")
        }
        break
      default: {
        console.error("Opción no válida")
        return
      }
    }
  }

  handleChange_TestInput() {
    this.setState({ textToTest: document.getElementById(`formTestInput`).value })
  }

  handleClick_ChangePage = (pageNumber) => {
    this.setState({ activePage: pageNumber });
  }

  async handleClick_LoadModel() {
    if (this.files.json === null || this.files.binary === null) {
      await alertHelper.alertError(`Debes subir los ficheros JSON y binario`)
      return;
    }
    try {
      this.model = await tf.loadLayersModel(tf.io.browserFiles([this.files.json, this.files.binary]),)
      this.setState({ loading: "", isButtonDisabled: false })
      await alertHelper.alertSuccess("Modelo cargado con éxito")
    } catch (error) {
      console.error(error)
    }
  }

  async handleClick_TestVector() {
    this.setState({ isButtonDisabled: true })
    if (this.state.textToTest === undefined || this.state.textToTest.length < 1) {
      await alertHelper.alertWarning('Introduce unos valores a probar')
      this.setState({ isButtonDisabled: false })
      return;
    }

    switch (this.dataset_key) {
      case MODEL_UPLOAD: {
        try {
          let array = this.state.textToTest.split(';')
          let input = [[], [1, array.length]]
          let i = 0
          array.forEach(() => {
            input[0].push(MODEL_CAR.DATA_CLASSES[i].findIndex((element) => element === array[i]))
            i++
          })
          const tensor = tf.tensor2d(input[0], input[1])
          const prediction = this.model.predict(tensor)
          const predictionWithArgMax = prediction.argMax(-1).dataSync()
          await alertHelper.alertInfo(`La solución es el tipo: ${predictionWithArgMax}.${prediction}`, MODEL_CAR.CLASSES[predictionWithArgMax])
        } catch (error) {
          console.error(error)
          await alertHelper.alertError(error)
        }
        break;
      }
      case MODEL_CAR.KEY: {
        try {
          let array = this.state.textToTest.split(';')
          let input = [[], [1, array.length]]
          let i = 0
          array.forEach(() => {
            input[0].push(MODEL_CAR.DATA_CLASSES[i].findIndex((element) => element === array[i]))
            i++
          })
          const tensor = tf.tensor2d(input[0], input[1])
          const prediction = this.model.predict(tensor)
          const predictionWithArgMax = this.model.predict(tensor).argMax(-1).dataSync()
          await alertHelper.alertInfo(`Este es el resultado: ${MODEL_CAR.CLASSES[predictionWithArgMax]}.${prediction}`, MODEL_CAR.CLASSES[predictionWithArgMax])
        } catch (error) {
          console.error(error)
          await alertHelper.alertError("Error al evaluar el modelo. Revisa que los datos introducidos son correctos")
        }
        break;
      }
      case MODEL_IRIS.KEY: {
        try {
          let array = this.state.textToTest.split(';')
          let input = [[], [1, array.length]]
          array.forEach((element) => {
            input[0].push(parseFloat(element))
          })
          const tensor = tf.tensor2d(input[0], input[1])
          const prediction = this.model.predict(tensor)
          const predictionWithArgMax = this.model.predict(tensor).argMax(-1).dataSync()
          await alertHelper.alertInfo(`Este es el resultado: ${MODEL_IRIS.CLASSES[predictionWithArgMax]}. ${prediction}`, MODEL_IRIS.CLASSES[predictionWithArgMax])
        } catch (error) {
          console.error(error)
          await alertHelper.alertError("Error al evaluar el modelo. Revisa que los datos introducidos son correctos")
        }
        break
      }
      case MODEL_HEPATITIS.KEY: {
        // TODO
        console.log("TODO")
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
    this.setState({ filesUpload: (this.files.json === null || this.files.binary === null) })
  }

  handle_BinaryFileUpload(files) {
    this.files.binary = new File([files[0]], files[0].name, { type: files[0].type });
    this.setState({ filesUpload: (this.files.json === null || this.files.binary === null) })
  }

  handle_CSVFileUpload(files) {
    this.files.csv = new File([files[0]], files[0].name, { type: files[0].type });
    const reader = new FileReader();
    reader.readAsText(this.files.csv)

    const that = this
    reader.onload = function ($event) {
      const csv = $event.target.result
      const lines = csv.split("\n")
      const header = lines[0].split(",")
      const body = []
      for (let row_i = 1; row_i < lines.length; row_i++) {
        const new_row = []
        const row = lines[row_i].split(",")
        for (let col_i = 0; col_i < row.length; col_i++) {
          new_row.push(row[col_i])
        }
        body.push(new_row)
      }

      that.setState({ header, body })
    }
  }

  Print_HTML_InfoDataset() {
    switch (this.dataset_key) {
      case MODEL_UPLOAD:
        return <>
          <p>
            Introduce separado por punto y coma los valores.
            <br/>
            <b>(parámetro-1; parámetro-2; parámetro-3; ... ;parámetro-n).</b>
          </p>
        </>
      case MODEL_CAR.KEY:
      case MODEL_IRIS.KEY:
      case MODEL_HEPATITIS.KEY:
        return this._model.HTML_EXAMPLE
      default:
        return <>DEFAULT</>
    }
  }

  Print_HTML_EXAMPLES() {
    switch (this.dataset_key) {
      case MODEL_UPLOAD:
        return <></>
      case MODEL_CAR.KEY:
      case MODEL_IRIS.KEY:
      case MODEL_HEPATITIS.KEY:
        return <>
          <div className="d-flex gap-2">
            {this._model.LIST_EXAMPLES.map((example, index) => {
              return <Button key={"example_" + index}
                             onClick={() => this.setExample(example)}>Ejemplo {index + 1}</Button>
            })}
          </div>
        </>
      default:
        return <>DEFAULT</>
    }
  }

  Print_HTML_TABLE_DATASET() {
    switch (this.dataset_key) {
      case MODEL_UPLOAD: {
        if (this.files.csv !== null) {
          return <>
            <Col xs={12} sm={12} md={12} xl={12} xxl={12}>
              <Card className={"mt-3"}>
                <Card.Header><h3>Dataset</h3></Card.Header>
                <Card.Body>

                  <N4L_TablePagination data_head={this.state.header}
                                       data_body={this.state.body}/>

                </Card.Body>
              </Card>
            </Col>
          </>
        }
        break
      }
      case MODEL_CAR.KEY:
      case MODEL_IRIS.KEY:
      case MODEL_HEPATITIS.KEY:
        return <>
          <Col xs={12} sm={12} md={12} xl={12} xxl={12}>
            <Card className={"mt-3"}>
              <Card.Header><h3>Dataset</h3></Card.Header>
              <Card.Body>

                <N4L_TablePagination data_head={this._model.TABLE_HEADER}
                                     data_body={this._model.DATA}/>
              </Card.Body>
            </Card>
          </Col>
        </>
      default: {
        console.error("Opción no válida")
        return
      }
    }
  }

  handleChangeParameter(key_parameter, value) {
    this.setState((prevState) => ({
      dataToTest: { ...prevState.dataToTest, [key_parameter]: value },
      textToTest: Object.values({ ...prevState.dataToTest, [key_parameter]: value }).join(";")
    }))
  }

  setExample(example) {
    this.setState({
      dataToTest: example,
      textToTest: Object.values(example).join(";")
    })
  }

  render() {
    console.log("render")
    return (
      <>
        <Container id={"ModelReviewClassicClassification"}>
          <Row>
            <Col xs={12} sm={12} md={12} xl={3} xxl={3}>
              <Card className={"sticky-top mt-3 border-info"}>
                <Card.Header><h3>Modelo</h3></Card.Header>
                <Card.Body>
                  <Card.Title>{this._model?.TITLE ?? "Upload"} {this.state.loading}</Card.Title>

                  {this.dataset_key === MODEL_UPLOAD ? (
                    <>
                      <Card.Subtitle className="mb-3 text-muted">Carga tu propio Modelo.</Card.Subtitle>
                      <Card.Text>
                        Ten en cuenta que tienes que subir el archivo .json y el fichero .bin para luego cargar el
                        modelo
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
                        <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                          <div className="d-grid gap-2">
                            <Button type="button"
                                    onClick={this.handleClick_LoadModel}
                                    size={"lg"}
                                    disabled={this.state.filesUpload}
                                    variant="primary">
                              Cargar modelo
                            </Button>
                          </div>
                        </Col>
                        <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12} className={"mt-3"}>
                          <DragAndDrop name={"csv"}
                                       id={"dataset-upload"}
                                       accept={{ 'text/csv': ['.csv'] }}
                                       text={"Añada el fichero csv"}
                                       labelFiles={"Fichero:"}
                                       function_DropAccepted={this.handle_CSVFileUpload}/>
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
                    {this.Print_HTML_InfoDataset()}
                    {this.Print_HTML_EXAMPLES()}
                  </Card.Body>
                </Card>
              </Col>

              <Col xs={12} sm={12} md={12} xl={12} xxl={12}>
                <Card className={"mt-3"}>
                  <Card.Header><h3>Prueba</h3></Card.Header>
                  <Card.Body>
                    <div>
                      {(this.dataset_key === MODEL_CAR.KEY) &&
                        <>
                          <Row className={"mt-3"}>
                            {Object.entries(MODEL_CAR.DATA_OBJECT).map(([key_parameter, values]) => {
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
                      {(this.dataset_key === MODEL_IRIS.KEY) &&
                        <>
                          <Row className={"mt-3"}>
                            {Object.entries(MODEL_IRIS.DATA_OBJECT).map(([key_parameter, value]) => {
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
                      {(this.dataset_key === MODEL_HEPATITIS.KEY) &&
                        <>
                          <Row className={"mt-3"}>
                            {MODEL_HEPATITIS.FORM.map((value, index) => {
                              // VALUES:
                              // {name: "type1", type: "number" },
                              // {name: "type2", type: "float" },
                              // {name: "type3", type: "select", options: [{value: "", text: ""] },
                              switch (value.type) {
                                case "number": {
                                  return <Col key={"form" + index} xs={6} sm={6} md={4} lg={4} xl={4} xxl={6}>
                                    <Form.Group>
                                      <Form.Label>Selecciona el parámetro <b>{value.name}</b></Form.Label>
                                      <Form.Control type="number"
                                                    min={0}
                                                    placeholder={"Introduce el entero"}
                                                    step={1}
                                                    value={this.state.dataToTest[value.name] ?? 0}
                                                    onChange={($event) => this.handleChangeParameter(value.name, $event.target.value)}/>
                                      <Form.Text className="text-muted">Parámetro entero: {value.name}</Form.Text>
                                    </Form.Group>
                                  </Col>
                                }

                                case "float": {
                                  return <Col key={"form" + index} xs={6} sm={6} md={4} lg={4} xl={4} xxl={6}>
                                    <Form.Group controlId={value.name}>
                                      <Form.Label>Selecciona el parámetro <b>{value.name}</b></Form.Label>
                                      <Form.Control type="number"
                                                    min={0}
                                                    placeholder={"Introduce el decimal"}
                                                    step={0.1}
                                                    value={this.state.dataToTest[value.name] ?? 0.0}
                                                    onChange={($event) => this.handleChangeParameter(value.name, $event.target.value)}/>
                                      <Form.Text className="text-muted">Parámetro decimal: {value.name}</Form.Text>
                                    </Form.Group>
                                  </Col>
                                }
                                case "select": {
                                  return <Col key={"form" + index} xs={6} sm={6} md={4} lg={4} xl={4} xxl={6}>
                                    <Form.Group controlId={value.name}>
                                      <Form.Label>Selecciona el parámetro <b>{value.name}</b></Form.Label>
                                      <Form.Select aria-label="Default select example"
                                                   value={this.state.dataToTest[value.name] ?? 0}
                                                   onChange={($event) => this.handleChangeParameter(value.name, $event.target.value)}>
                                        {value.options.map((option_value, option_index) => {
                                          return <option key={value.name + "_option_" + option_index}
                                                         value={option_value.value}>
                                            {option_value.text}
                                          </option>
                                        })}
                                      </Form.Select>
                                      <Form.Text className="text-muted">Parámetro decimal: {value.name}</Form.Text>
                                    </Form.Group>
                                  </Col>
                                }
                              }
                              console.log()
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
                                          disabled={this.dataset_key !== MODEL_UPLOAD}
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

              {this.Print_HTML_TABLE_DATASET()}
            </Col>
          </Row>
        </Container>
      </>
    )
  }
}
