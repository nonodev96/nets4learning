import React from 'react'
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap'
import * as tf from '@tensorflow/tfjs'
import * as tfVis from '@tensorflow/tfjs-vis'
import * as alertHelper from '../../../utils/alertHelper'
import {
  getHTML_DATASET_DESCRIPTION,
  getNameDatasetByID_ClassicClassification,
  MODEL_UPLOAD,
  MODEL_CAR,
  MODEL_IRIS,
  MODEL_HEPATITIS_C
} from "../../../DATA_MODEL";
import { CONSOLE_LOG_h3 } from "../../../Constantes";
import { isProduction } from "../../../utils/utils";
import N4LTablePagination from "../../../components/table/N4LTablePagination";
import DragAndDrop from "../../../components/dragAndDrop/DragAndDrop";

export default class ModelReviewClassicClassification extends React.Component {
  constructor(props) {
    super(props);
    this.dataSet = props.dataSet
    this.dataset_ID = parseInt(props.dataSet ?? "0")
    this.dataset_key = getNameDatasetByID_ClassicClassification(this.dataset_ID)
    this.state = {
      loading         :
        <>
          <div className="spinner-border"
               role="status"
               style={{
                 fontSize: "0.5em",
                 height  : "1rem",
                 width   : "1rem"
               }}>
            <span className="sr-only"></span>
          </div>
        </>,
      model           : null,
      activePage      : 0,
      textToTest      : "",
      isButtonDisabled: true,
      dataToTest      : {},
      filesUpload     : true
    }
    this.files = {
      binary: null,
      json  : null,
      csv   : null
    }
    this._isDebug = process.env.REACT_APP_ENVIRONMENT !== "production"


    switch (this.dataset_key) {
      case MODEL_UPLOAD: {
        this.state.loading = ""
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
      case MODEL_HEPATITIS_C.KEY: {
        this._model = MODEL_HEPATITIS_C
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

    this.handleFileUpload_JSON = this.handleFileUpload_JSON.bind(this)
    this.handleFileUpload_Binary = this.handleFileUpload_Binary.bind(this)
    this.handleFileUpload_CSV = this.handleFileUpload_CSV.bind(this)

    // Debug
    this.handleClick_Layers = this.handleClick_Layers.bind(this)
    this.handleClick_Compile = this.handleClick_Compile.bind(this)
    this.handleClick_Fit = this.handleClick_Fit.bind(this)
    this.handleClick_Download = this.handleClick_Download.bind(this)

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
      case MODEL_HEPATITIS_C.KEY:
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

  async handleClick_Layers() {
    // https://stackoverflow.com/questions/44747343/keras-input-explanation-input-shape-units-batch-size-dim-etc
    this.___model = tf.sequential()
    this.___model.add(tf.layers.dense({ name: 'layer1', activation: 'relu', units: 10, inputDim: 12 }))
    this.___model.add(tf.layers.dense({ name: 'layer2', activation: 'relu', units: 10 }))
    this.___model.add(tf.layers.dense({ name: 'layer3', activation: 'relu', units: 10 }))
    this.___model.add(tf.layers.dense({ name: 'layer4', activation: 'relu', units: 10 }))
    this.___model.add(tf.layers.dense({ name: 'layer5', activation: 'relu', units: 10 }))
    this.___model.add(tf.layers.dense({ name: 'layer6', activation: 'softmax', units: 5 }))

    const surface = { name: 'Model Summary', tab: 'Model Inspection' };
    await tfVis.show.modelSummary(surface, this.___model);

    for (let i = 1; i < 6; i++) {
      const surface1 = { name: 'Layer Summary' + i, tab: 'Layer ' + i };
      await tfVis.show.layer(surface1, this.___model.getLayer('layer' + 1));
    }
  }

  async handleClick_Compile() {
    // Prepare the model for training: Specify the loss and the optimizer.
    this.___model.compile({
      optimizer: 'adam',
      loss     : 'categoricalCrossentropy',
      metrics  : ['acc']
    })
  }

  async handleClick_Fit() {
    // const data = MODEL_HEPATITIS_C._CLEAR_DATA
    // Generate some synthetic data for training.
    const xs = tf.tensor1d([32, 1, 38.5, 52.5, 7.7, 22.1, 7.5, 6.93, 3.23, 106, 12.1, 69])
    const ys = tf.tensor1d([32, 1, 38.5, 70.3, 18, 24.7, 3.9, 11.17, 4.8, 74, 15.6, 76.5])
    // Train the model using the data.

    this.___model.fit(xs, ys, { batchSize: 128, epochs: 200 }).then(() => {
      // Use the model to do inference on a data point the model hasn't seen before:
      let d = this.___model.predict(tf.tensor1d([32, 1, 38.5, 70.3, 18, 24.7, 3.9, 11.17, 4.8, 74, 15.6, 76.5]))
      console.log(d)
    })
  }

  handleClick_Download() {
    this.___model.save('downloads://my-model')
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

        break;
      }
      case MODEL_CAR.KEY:
      case MODEL_IRIS.KEY:
      case MODEL_HEPATITIS_C.KEY: {
        try {
          let array = this.state.textToTest.split(';')
          let input = [[], [1, array.length]]
          for (let index = 0; index < array.length; index++) {
            input[0].push(await this._model.function_v_input(array[index], index, this._model.DATA_OBJECT_KEYS[index]))
          }
          const tensor = tf.tensor2d(input[0], input[1])
          console.log({ input_0: input[0], tensor })
          const prediction = this.model.predict(tensor)
          const predictionWithArgMax = prediction.argMax(-1).dataSync()
          await alertHelper.alertInfo(`La solución es el tipo: ${predictionWithArgMax}`, this._model.CLASSES[predictionWithArgMax], prediction)
        } catch (error) {
          console.error(error)
          await alertHelper.alertError(error)
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

  handleFileUpload_JSON(files) {
    this.files.json = new File([files[0]], files[0].name, { type: files[0].type });
    this.setState({ filesUpload: (this.files.json === null || this.files.binary === null) })
  }

  handleFileUpload_Binary(files) {
    this.files.binary = new File([files[0]], files[0].name, { type: files[0].type });
    this.setState({ filesUpload: (this.files.json === null || this.files.binary === null) })
  }

  handleFileUpload_CSV(files) {
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
      case MODEL_HEPATITIS_C.KEY:
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
      case MODEL_HEPATITIS_C.KEY:
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
    let head = []
    let body = [[]]
    switch (this.dataset_key) {
      case MODEL_UPLOAD: {
        if (this.files.csv !== null) {
          return <>
            <Col xs={12} sm={12} md={12} xl={12} xxl={12}>
              <Card className={"mt-3"}>
                <Card.Header><h3>Conjunto de datos</h3></Card.Header>
                <Card.Body>

                  <N4LTablePagination data_head={this.state.header}
                                      data_body={this.state.body}/>

                </Card.Body>
              </Card>
            </Col>
          </>
        }
        break
      }
      case MODEL_CAR.KEY: {
        head = this._model.TABLE_HEADER
        body = this._model.DATA
        break
      }
      case MODEL_IRIS.KEY: {
        head = this._model.TABLE_HEADER
        body = this._model.DATA
        break
      }
      case MODEL_HEPATITIS_C.KEY: {
        head = this._model.TABLE_HEADER
        body = this._model._CLEAR_DATA
        break
      }
      default: {
        console.error("Opción no válida")
        return <></>
      }
    }

    return <>
      <Col xs={12} sm={12} md={12} xl={12} xxl={12}>
        <Card className={"mt-3"}>
          <Card.Header><h3>Dataset</h3></Card.Header>
          <Card.Body>

            <N4LTablePagination data_head={head}
                                data_body={body}/>
          </Card.Body>
        </Card>
      </Col>
    </>
  }

  handleChangeParameter(key_parameter, value) {
    this.setState((prevState) => ({
      dataToTest: { ...prevState.dataToTest, [key_parameter]: value },
      textToTest: Object.values({ ...prevState.dataToTest, [key_parameter]: value }).join(";")
    }))
  }

  setExample(example) {
    console.log(example)
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
              <Card className={"sticky-top mt-3 border-info"} style={{ "zIndex": 0 }}>
                <Card.Header><h3>Modelo</h3></Card.Header>
                <Card.Body>
                  <Card.Title>{this._model?.TITLE ?? "Subir"} {this.state.loading}</Card.Title>

                  {this.dataset_key === MODEL_UPLOAD ? (
                    <>
                      <Card.Subtitle className="mb-3 text-muted">Carga tu propio modelo.</Card.Subtitle>
                      <Card.Text>
                        Ten en cuenta que tienes que subir el archivo <b>.json</b> y el fichero <b>.bin</b> para luego cargar el modelo
                      </Card.Text>
                      <Row>
                        <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                          <DragAndDrop name={"json"}
                                       id={"json-upload"}
                                       accept={{ 'application/json': ['.json'] }}
                                       text={"Añada el fichero JSON"}
                                       labelFiles={"Fichero:"}
                                       function_DropAccepted={this.handleFileUpload_JSON}/>
                        </Col>
                        <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                          <DragAndDrop name={"bin"}
                                       id={"weights-upload"}
                                       accept={{ 'application/octet-stream': ['.bin'] }}
                                       text={"Añada el fichero binario"}
                                       labelFiles={"Fichero:"}
                                       function_DropAccepted={this.handleFileUpload_Binary}/>
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
                                       function_DropAccepted={this.handleFileUpload_CSV}/>
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
                      {(this.dataset_key === MODEL_HEPATITIS_C.KEY) &&
                        <>
                          <Row className={"mt-3"}>
                            {this._model.FORM.map((value, index) => {
                              // VALUES:
                              // {name: "type1", type: "number" },
                              // {name: "type2", type: "float" },
                              // {name: "type3", type: "select", options: [{value: "", text: ""] },
                              switch (value.type) {
                                case "number": {
                                  return <Col key={"form" + index} className={"mb-3"}
                                              xs={6} sm={6} md={4} lg={4} xl={4} xxl={3}>
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
                                  return <Col key={"form" + index} className={"mb-3"}
                                              xs={6} sm={6} md={4} lg={4} xl={4} xxl={3}>
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
                                  return <Col key={"form" + index} className={"mb-3"}
                                              xs={6} sm={6} md={4} lg={4} xl={4} xxl={3}>
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
                                default:
                                  return <></>
                              }
                            })}
                          </Row>
                        </>
                      }

                      {
                        (this.dataset_key === MODEL_HEPATITIS_C.KEY) &&
                        <>
                          <hr/>
                          <Row className="mt-3">
                            <Col>
                              <Form.Group>
                                <Form.Label>Selecciona el parámetro</Form.Label>
                                <Form.Select aria-label="Default select example"
                                             onChange={($event) => this.setExample(JSON.parse($event.target.value))}>
                                  {this._model._CLEAR_DATA.map((row, index) => {
                                    let value = JSON.stringify({
                                      age : row[0],
                                      sex : row[1],
                                      alb : row[2],
                                      alp : row[3],
                                      alt : row[4],
                                      ast : row[5],
                                      bil : row[6],
                                      che : row[7],
                                      chol: row[8],
                                      crea: row[9],
                                      ggt : row[10],
                                      prot: row[11],
                                    })
                                    return (<option key={"option_" + index} value={value}>Ejemplo {index} - {value}</option>)
                                  })}
                                </Form.Select>
                                <Form.Text className="text-muted">Ejemplo</Form.Text>
                              </Form.Group>
                            </Col>
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

          {
            (this._isDebug) &&
            <Row className={"mt-3"}>
              <Col>
                <Card>
                  <Card.Header><h3>Debug</h3></Card.Header>
                  <Card.Body>
                    <Card.Title>Pruebas modelo</Card.Title>


                    <div className="d-grid gap-2 mt-3">
                      <Button type="button"
                              onClick={async () => {
                                let m = await MODEL_CAR.loadModel()
                                m.summary()
                              }}
                              size={"small"}
                              variant="primary">
                        CLEAR DATA
                      </Button>
                      <hr/>

                      <Button type="button"
                              onClick={() => tfVis.visor().toggle()}
                              size={"small"}
                              variant="outline-primary">
                        Conmutar visor
                      </Button>
                      <Button type="button"
                              onClick={this.handleClick_Layers}
                              size={"small"}
                              variant="outline-secondary">
                        Definir capas
                      </Button>
                      <Button type="button"
                              onClick={this.handleClick_Compile}
                              size={"small"}
                              variant="outline-warning">
                        Compilar
                      </Button>
                      <Button type="button"
                              onClick={this.handleClick_Fit}
                              size={"small"}
                              variant="outline-danger">
                        Entrenar
                      </Button>
                      <Button type="button"
                              onClick={this.handleClick_Download}
                              size={"small"}
                              variant="outline-success">
                        Descargar
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          }

        </Container>
      </>
    )
  }
}
