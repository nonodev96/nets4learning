import React from "react"
import { Button, Col, Container, Row, Card, Modal } from "react-bootstrap"
import * as tf from "@tensorflow/tfjs"
import * as tf_mobilenet from "@tensorflow-models/mobilenet"
import * as numberClass from "../../../modelos/ClassificationHelper_MNIST"
import * as datosAuxiliares from "../../../modelos/data/imageClassification/imgaClassificationHelper"
import * as alertHelper from "../../../utils/alertHelper"
import {
  getHTML_DATASET_DESCRIPTION,
  getNameDatasetByID_ImageClassification,
  LIST_MODEL_OPTIONS,
  MODEL_IMAGE_MNIST,
  MODEL_IMAGE_MOBILENET,
  MODEL_IMAGE_RESNET,
  MODEL_UPLOAD,
  LIST_OF_IMAGES
} from "../../../DATA_MODEL"
import CustomCanvasDrawer from "../../../utils/customCanvasDrawer"
import DragAndDrop from "../../../components/dragAndDrop/DragAndDrop"

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import { Bar } from "react-chartjs-2"
import { isMobile } from "../../../utils/utils";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default class ModelReviewClassicImageClassification extends React.Component {
  constructor(props) {
    super(props)

    this.handleCloseModal = this.handleCloseModal.bind(this)
    this.handleEnteredModal = this.handleEnteredModal.bind(this)
    this.handleExitedModal = this.handleExitedModal.bind(this)
    this.isMobile = navigator?.userAgentData?.mobile
    if (this.isMobile === undefined) {
      this.isMobile = isMobile()
    }
    const labels = ["January", "February", "March", "April", "May", "June", "July"]
    const min = 0
    const max = 1000

    this.state = {
      dataset_ID: parseInt(props.dataSet ?? "0"),
      dataSet: props.dataSet ?? "0",
      model: null,
      modelLoaded: false,
      // mobilenet
      ImageUploaded: null,
      // variables de [mobilenet]
      modalShow: false,
      url_image: "/imágenes/cat.jpg",
      bar_options: {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
          title: {
            display: true,
            text: "Predicción MOBILENET",
          },
        },
      },
      bar_data: {
        labels: labels,
        datasets: [
          {
            label: "Mobilenet",
            data: labels.map(() => {
              return Math.floor(Math.random() * (max - min + 1)) + min
            }),
            backgroundColor: "rgba(255, 99, 132, 0.5)",
          }
        ],
      }
    }

    this.chartRef = React.createRef()
  }

  componentDidMount() {
    this.loadModel()
      .catch(console.error)
  }

  async loadModel() {
    switch (getNameDatasetByID_ImageClassification(this.state.dataSet)) {
      case MODEL_UPLOAD: {
        const json = document.getElementById("json-upload")
        const weights = document.getElementById("weights-upload")
        // FIXME
        const model = await tf.loadLayersModel(
          tf.io.browserFiles([json.files[0], weights.files[0]]),
        )
        this.setState({ model: model })
        this.setState({ modelLoaded: true })
        await alertHelper.alertSuccess("Modelo cargado con éxito")
        break
      }
      case MODEL_IMAGE_MNIST: {
        // const model = await tf.loadLayersModel(
        //   "http://localhost:3000/models/mnistClassification/mymodel.json"
        // );
        // model.summary()
        try {
          const model = await tf.loadGraphModel(
            "https://tfhub.dev/tensorflow/tfgan/eval/mnist/logits/1",
            { fromTFHub: true }
          )
          this.setState({ model: model })
          this.setState({ modelLoaded: true })
          await alertHelper.alertSuccess("Modelo cargado con éxito")
        } catch (error) {
          console.log(error)
        }
        break
      }
      case MODEL_IMAGE_MOBILENET: {
        try {
          // // "https://tfhub.dev/google/tfjs-model/imagenet/resnet_v1_50/classification/1/default/1",
          // const model = await tf.loadGraphModel(
          //   "https://tfhub.dev/google/tfjs-model/imagenet/mobilenet_v1_050_192/classification/3/default/1",
          //   { fromTFHub: true }
          // )
          // this.setState({ model })
          // await alertHelper.alertSuccess("Modelo cargado con éxito")
          this.setState({ model: await tf_mobilenet.load() })
          this.setState({ modelLoaded: true })
          await alertHelper.alertSuccess("Modelo cargado con éxito")
        } catch (error) {
          console.error(error)
        }
        break
      }
      case MODEL_IMAGE_RESNET: {
        try {
          const model = await tf.loadGraphModel(
            "https://tfhub.dev/google/tfjs-model/imagenet/resnet_v2_50/classification/3/default/1",
            { fromTFHub: true }
          )
          this.setState({ model: model })
          this.setState({ modelLoaded: true })
          await alertHelper.alertSuccess("Modelo cargado con éxito")
        } catch (e) {
          console.error(e)
        }
        break
      }
      default: {
        console.error("Error, opción no válida")
        break
      }
    }
  }

  async handleVectorTest() {
    if (!this.state.ImageUploaded) {
      await alertHelper.alertError("Primero debes de subir una imagen")
      return
    }
    // FIXME
    let tensor4

    switch (getNameDatasetByID_ImageClassification(this.state.dataSet)) {
      case MODEL_UPLOAD: {
        try {
          let resultados = this.state.model.predict(tensor4).dataSync()
          let mayorIndice = resultados.indexOf(Math.max.apply(null, resultados))
          console.log("Predicción", mayorIndice)
          // alert("¿El número es un " + mayorIndice + "?")
          await alertHelper.alertInfo("¿El número es un : " + mayorIndice + "?", mayorIndice)
        } catch (error) {
          await alertHelper.alertError(error)
        }
        break
      }
      case MODEL_IMAGE_MNIST: {
        const originalImage = document.getElementById("originalImage")
        const smallCanvas = document.getElementById("smallcanvas")
        numberClass.resample_single(originalImage, 28, 28, smallCanvas)

        let smallCanvas_ctx = smallCanvas.getContext("2d")
        let imgData = smallCanvas_ctx.getImageData(0, 0, 28, 28)

        let arr = []
        let arr28 = []
        for (let p = 0; p < imgData.data.length; p += 4) {
          let valor = imgData.data[p + 3] / 255
          // Agregar al arr28 y normalizar a 0-1. Aparte guarde dentro de un arreglo en el índice 0... again
          arr28.push([valor])
          if (arr28.length === 28) {
            arr.push(arr28)
            arr28 = []
          }
        }
        arr = [arr]
        tensor4 = tf.tensor4d(arr)

        // FIXME: antes estaba abajo
        let resultados = this.state.model.predict(tensor4).dataSync()
        console.log({ resultados: resultados })
        let mayorIndice = resultados.indexOf(Math.max.apply(null, resultados))
        await alertHelper.alertInfo(`¿El número es un : ${mayorIndice}?`, mayorIndice)
        break
      }
      case MODEL_IMAGE_MOBILENET: {
        break
      }
      case MODEL_IMAGE_RESNET: {
        const originalImage = document.getElementById("originalImage")
        const originalImage_ctx = originalImage.getContext("2d")

        const resultCanvas = document.getElementById("resultCanvas")
        const resultCanvas_ctx = resultCanvas.getContext("2d")

        resultCanvas.height = 224
        resultCanvas.width = 224

        const newCanvas = document.createElement("canvas")
        const newCanvas_ctx = newCanvas.getContext("2d")
        // Set the width & height to 75% of image
        newCanvas.width = originalImage.width * 0.75
        newCanvas.height = originalImage.height * 0.75

        // step 2, resize to temporary size
        newCanvas_ctx.drawImage(originalImage, 0, 0, newCanvas.width, newCanvas.height)
        resultCanvas_ctx.drawImage(newCanvas, 0, 0, newCanvas.width, newCanvas.height, 0, 0, resultCanvas.width, resultCanvas.height)

        const cat = document.getElementById("originalImage")
        // let tensor =  cast(browser.fromPixels(cat),"float32")
        let tensor = tf.browser.fromPixels(cat)
        console.log(tensor)
        tensor = tensor.expandDims(0)
        // tensor = expandDims(tensor, 0,)
        console.log(await tensor.data())

        tensor = tf.image.resizeBilinear(tensor, [224, 224])
        const offset = tf.scalar(127.5)

        const normalized = tensor
          .toFloat()
          .div(tf.scalar(127))
          .sub(tf.scalar(1))
        const result = this.state.model.predict(normalized)

        let a = result.as1D().argMax().dataSync()[0]


        // let b=solution.as1D().argMax().print()
        console.log(a, datosAuxiliares.imageNameList[a])
        // alert("El modelo predice que la imagen es: "+datosAuxiliares.imageNameList[a])
        await alertHelper.alertInfo(
          "El modelo predice que la imagen es: " + datosAuxiliares.imageNameList[a],
          datosAuxiliares.imageNameList[a]
        )
        break
      }
      default: {
        console.error("Error, opción no válida")
        break
      }
    }
  }

  async handleVectorTest_CanvasDraw() {
    const bigCanvas = document.getElementById("bigcanvas")
    const smallCanvas = document.getElementById("smallcanvas")
    let smallCanvas_ctx = smallCanvas.getContext("2d")
    numberClass.resample_single(bigCanvas, 28, 28, smallCanvas)
    let imgData = smallCanvas_ctx.getImageData(0, 0, 28, 28)
    // El arreglo completo
    let arr = []
    // Al llegar a 28 posiciones se pone en "arr" como un nuevo índice
    let arr28 = []
    for (let p = 0; p < imgData.data.length; p += 4) {
      let valor = imgData.data[p + 3] / 255
      // Agregar al arr28 y normalizar a 0-1. Aparte guarda dentro de un arreglo en el índice 0... again
      arr28.push([valor])
      if (arr28.length === 28) {
        arr.push(arr28)
        arr28 = []
      }
    }
    arr = [arr]
    let tensor4 = tf.tensor4d(arr)
    let resultados = this.state.model.predict(tensor4).dataSync()
    let mayorIndice = resultados.indexOf(Math.max.apply(null, resultados))
    console.log("Predicción", mayorIndice)
    await alertHelper.alertInfo(`¿El número es un ${mayorIndice}?`, mayorIndice)
  }

  async handleChangeFileUpload(e) {
    try {
      let tgt = e.target || window.event.srcElement;
      let files = tgt.files

      let canvas = document.getElementById("originalImage")
      let ctx1 = canvas.getContext("2d")

      let imageCanvas = document.getElementById("imageCanvas")
      let ctx2 = imageCanvas.getContext("2d")

      imageCanvas.height = 500
      imageCanvas.width = 500

      function draw() {
        // Dibujamos a tam original
        canvas.width = this.width
        canvas.height = this.height
        ctx1.drawImage(this, 0, 0)

        // Convertimos tam adaptado
        const oc = document.createElement("canvas")
        oc.width = canvas.width * 0.75
        oc.height = canvas.height * 0.75
        // step 2, resize to temporary size
        const octx = oc.getContext("2d")
        octx.drawImage(canvas, 0, 0, oc.width, oc.height)

        ctx2.drawImage(oc, 0, 0, oc.width, oc.height, 0, 0, imageCanvas.width, imageCanvas.height)
        this.setState({ ImageUploaded: true })
      }

      function failed() {
        alertHelper.alertError("Error al cargar el fichero")
      }

      let img = new Image()
      img.onload = draw
      img.onerror = failed
      img.src = URL.createObjectURL(files[0])
    } catch (error) {
      await alertHelper.alertError("Error al carga", error)
      console.log(error)
    }
  }

  async PredictImage({ target }) {
    const predictions = await this.state.model.classify(target)
    console.log({ predictions })
    const labels = predictions.map(v => v.className)
    const datasets = predictions.map(v => {
      return {
        label: v.className,
        data: [v.probability],
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      }
    })
    const bar_data = {
      labels: [""],
      datasets: datasets
    }
    console.log({ bar_data })

    this.setState({ url_image: target.src })
    this.setState({ bar_data })
    this.setState({ modalShow: true })
    const chart = this.chartRef.current;
    this.updateChart(chart)
  }

  Print_HTML_Section() {
    switch (getNameDatasetByID_ImageClassification(this.state.dataset_ID)) {
      case MODEL_UPLOAD: {
        return <>
          <div>
            <p>Carga tu propio Modelo.</p>
            <p>Primero el archivo .json y después el fichero .bin</p>
            <input id="json-upload"
                   style={{ marginLeft: "1rem" }}
                   type="file"
                   name="json"
                   accept=".json"></input>
            <input id="weights-upload"
                   style={{ marginLeft: "1rem" }}
                   type="file"
                   accept=".bin"
                   name="bin"></input>
          </div>
        </>
      }
      case MODEL_IMAGE_MNIST:
      case MODEL_IMAGE_RESNET:
      case MODEL_IMAGE_MOBILENET: {
        return getHTML_DATASET_DESCRIPTION(3, this.state.dataset_ID)
      }
      default: {
        console.error("Error, opción no disponible")
        break
      }
    }
  }

  Print_HTML_TextOptions() {
    return LIST_MODEL_OPTIONS[3][this.state.dataset_ID]
  }

  updateChart(chart) {
    console.log("updateChart")
    chart.update();
  }

  handleCloseModal() {
    this.setState({ modalShow: false })
  }

  handleEnteredModal() {

  }

  handleExitedModal() {

  }

  render() {
    return (
      <>
        <Container id={"ModelReviewClassicImageClassification"}>

          <Row className={"mt-3"}>
            <Col xs={12} sm={12} md={12} xl={3}>
              <Card className={"sticky-top mb-3"}>
                <Card.Body>
                  <Card.Title>{this.Print_HTML_TextOptions()}</Card.Title>
                  {this.Print_HTML_Section()}
                </Card.Body>
              </Card>
            </Col>

            <Col xs={12} sm={12} md={12} xl={9}>
              <Card>
                <Card.Header><h3>Procesamiento de imágenes</h3></Card.Header>
                <Card.Body>
                  <DragAndDrop name={"doc"}
                               text={"Añada una imagen de ejemplo"}
                               labelFiles={"Fichero:"}
                               accept={{ "image/png": [".png"] }}
                               function_DropAccepted={this.handleChangeFileUpload}/>

                  <div className="d-grid gap-2 col-6 mx-auto">
                    <Button type="button"
                            onClick={() => this.handleVectorTest}
                            variant={"primary"}>
                      Validar
                    </Button>
                  </div>
                </Card.Body>
              </Card>

              <Card className={"mt-3"}>
                <Card.Header><h3>Prueba dibujo</h3></Card.Header>
                <Card.Body>
                  <CustomCanvasDrawer submitFunction={() => {
                    this.handleVectorTest_CanvasDraw().then((r) => {
                      console.log("End", r)
                    })
                  }}/>
                  <hr/>
                  <div className="d-grid justify-content-center mt-3">
                    <canvas id="originalImage"
                            className={"nets4-border-1"}
                            style={{ display: "none" }}></canvas>
                    <canvas id="imageCanvas"
                            className={"nets4-border-1"}
                            style={{ display: "none" }}></canvas>
                    <canvas id="resultCanvas"
                            className={"nets4-border-1"}
                            style={{ display: "none" }}></canvas>
                    <canvas id="smallcanvas"
                            className={"nets4-border-1"}
                            style={{ display: "none" }}
                            width="28" height="28"></canvas>
                  </div>
                </Card.Body>
              </Card>

              {getNameDatasetByID_ImageClassification(this.state.dataset_ID) === MODEL_IMAGE_MOBILENET &&
                <Card className={"mt-3"}>
                  <Card.Header><h3>Procesamiento con ejemplos</h3></Card.Header>
                  <Card.Body>
                    <Container fluid={true}>
                      <Row className={
                        "row-cols-1 row-cols-xs-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-3 row-cols-xxl-3 g-2"
                      }>
                        {LIST_OF_IMAGES.map((image, index) => {
                          return <div className={"border bg-light d-flex"} key={image}>
                            <img className={"img-fluid w-100 h-100 object-fit-cover"}
                                 src={process.env.REACT_APP_PATH + "/imágenes/" + image}
                                 alt={image}
                                 onClick={($event) => this.PredictImage($event)}></img>
                          </div>
                        })}
                      </Row>
                    </Container>
                  </Card.Body>
                </Card>
              }
            </Col>
          </Row>
        </Container>

        {getNameDatasetByID_ImageClassification(this.state.dataset_ID) === MODEL_IMAGE_MOBILENET &&
          <>
            <Modal show={this.state.modalShow}
                   fullscreen={this.isMobile}
                   onHide={this.handleCloseModal}
                   onEntered={this.handleEnteredModal}
                   onExited={this.handleExitedModal}
                   size="lg"
                   aria-labelledby="contained-modal-title-vcenter"
                   centered>
              <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                  Estadísticas
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Container>
                  <Row>
                    <Col xl={3}
                         style={{
                           display: "flex",
                           alignItems: "center"
                         }}>
                      <img src={this.state.url_image}
                           alt={"Imágen auxiliar"}
                           className={"img-fluid w-100"}/>
                    </Col>
                    <Col xl={9}>
                      <Bar ref={this.chartRef}
                           options={this.state.bar_options}
                           data={this.state.bar_data}/>
                    </Col>
                  </Row>
                </Container>
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={this.handleCloseModal}>Aceptar</Button>
              </Modal.Footer>
            </Modal>
          </>
        }
      </>
    )
  }
}