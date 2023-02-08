import React from "react"
import { Button, Card, Col, Container, Modal, Row } from "react-bootstrap"
import * as tf from "@tensorflow/tfjs"
import * as tf_mobilenet from "@tensorflow-models/mobilenet"
import * as numberClass from "../../../modelos/ClassificationHelper_MNIST"
import * as datosAuxiliares from "../../../modelos/data/imageClassification/imgaClassificationHelper"
import * as alertHelper from "../../../utils/alertHelper"
import {
  getHTML_DATASET_DESCRIPTION,
  getNameDatasetByID_ImageClassification,
  LIST_MODEL_OPTIONS,
  LIST_OF_IMAGES,
  MODEL_IMAGE_MNIST,
  MODEL_IMAGE_MOBILENET,
  MODEL_IMAGE_RESNET,
  MODEL_UPLOAD
} from "../../../DATA_MODEL"
import CustomCanvasDrawer from "../../../utils/customCanvasDrawer"
import DragAndDrop from "../../../components/dragAndDrop/DragAndDrop"

import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip, } from "chart.js"
import { Bar } from "react-chartjs-2"
import { isMobile } from "../../../utils/utils";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)


export default class ModelReviewClassicImageClassification extends React.Component {
  bar_options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Predicción",
      },
    },
  }

  constructor(props) {
    super(props)

    const labels = []
    const min = 0
    const max = 1000
    this.model = null
    this.files = {
      json: null,
      binary: null
    }
    const bar_data_default = {
      labels: labels,
      datasets: [{
        label: "",
        data: [],
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      }],
    }
    this.state = {
      dataset_ID: parseInt(props.dataSet ?? "0"),
      dataSet: props.dataSet ?? "0",
      modelLoaded: false,
      // mobilenet
      isImageUploaded: false,
      // variables de [mobilenet]
      isModalShow: false,
      url_image: "/imágenes/cat.jpg",
      bar_data_image: bar_data_default,
      bar_data_modal: bar_data_default
    }

    this.chartRef = React.createRef()
    this.chartRef_image = React.createRef()

    this.handleModal_Close = this.handleModal_Close.bind(this)
    this.handleModal_Entered = this.handleModal_Entered.bind(this)
    this.handleModal_Exited = this.handleModal_Exited.bind(this)
    // this.handleClick_btn_MNIST_PRUEBAS = this.handleClick_btn_MNIST_PRUEBAS.bind(this)
    this.handleClick_TestImageUpload = this.handleClick_TestImageUpload.bind(this)
    this.handleSubmit_TestCanvasDraw = this.handleSubmit_TestCanvasDraw.bind(this)

    this.handleFileUpload_JSON = this.handleFileUpload_JSON.bind(this)
    this.handleFileUpload_Binary = this.handleFileUpload_Binary.bind(this)
    this.handleFileUpload_Image = this.handleFileUpload_Image.bind(this)

  }

  componentDidMount() {
    this.loadModel()
      .catch(console.error)
  }

  async loadModel() {
    switch (getNameDatasetByID_ImageClassification(this.state.dataSet)) {
      case MODEL_UPLOAD: {
        // FIXME
        console.log({ files: [this.files.json, this.files.binary] })
        this.model = await tf.loadLayersModel(
          tf.io.browserFiles([this.files.json, this.files.binary]),
        )
        this.setState({ modelLoaded: true })
        await alertHelper.alertSuccess("Modelo cargado con éxito")
        break
      }
      case MODEL_IMAGE_MNIST: {
        try {
          this.model = await tf.loadLayersModel(
            process.env.REACT_APP_PATH + "/models/mnistClassification/mymodel.json")
          this.setState({ modelLoaded: true })
          await alertHelper.alertSuccess("Modelo cargado con éxito")
        } catch (error) {
          console.error(error)
        }
        break
      }
      case MODEL_IMAGE_MOBILENET: {
        try {
          this.model = await tf_mobilenet.load()
          this.setState({ modelLoaded: true })
          await alertHelper.alertSuccess("Modelo cargado con éxito")
        } catch (error) {
          console.error(error)
        }
        break
      }
      case MODEL_IMAGE_RESNET: {
        try {
          this.model = await tf.loadGraphModel(
            "https://tfhub.dev/google/tfjs-model/imagenet/resnet_v2_50/classification/3/default/1",
            { fromTFHub: true }
          )
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

  async ProcessMNIST() {
    const canvas = document.getElementById("originalImage")
    let smallCanvas = document.getElementById("smallcanvas")
    numberClass.resample_single(canvas, 28, 28, smallCanvas)
    let smallCanvas_ctx = smallCanvas.getContext("2d")
    let imgData = smallCanvas_ctx.getImageData(0, 0, 28, 28)
    let arr = [], arr28 = []
    for (let p = 0; p < imgData.data.length; p += 4) {
      imgData.data[p] = 255 - imgData.data[p];
      imgData.data[p + 1] = 255 - imgData.data[p + 1];
      imgData.data[p + 2] = 255 - imgData.data[p + 2];
      imgData.data[p + 3] = 255;

      let valor = imgData.data[p] / 255
      arr28.push([valor])
      if (arr28.length === 28) {
        arr.push(arr28)
        arr28 = []
      }
    }
    let tensor4 = tf.tensor4d([arr])
    let results = this.model.predict(tensor4).dataSync()
    let index = results.indexOf(Math.max.apply(null, results))
    return { results, index }
  }

  async handleSubmit_TestCanvasDraw() {
    const canvas = document.getElementById("bigcanvas")
    let smallCanvas = document.getElementById("smallcanvas")
    numberClass.resample_single(canvas, 28, 28, smallCanvas)
    let smallCanvas_ctx = smallCanvas.getContext("2d")
    let imgData = smallCanvas_ctx.getImageData(0, 0, 28, 28)
    let arr = [], arr28 = []
    for (let p = 0; p < imgData.data.length; p += 4) {
      let valor = imgData.data[p + 3] / 255
      arr28.push([valor])
      if (arr28.length === 28) {
        arr.push(arr28)
        arr28 = []
      }
    }
    let tensor4 = tf.tensor4d([arr])
    let results = this.model.predict(tensor4).dataSync()
    let index = results.indexOf(Math.max.apply(null, results))
    return { results, index }
  }

  async handleClick_TestImageUpload() {
    if (!this.state.isImageUploaded) {
      await alertHelper.alertError("Primero debes de subir una imagen")
      return
    }
    // FIXME

    switch (getNameDatasetByID_ImageClassification(this.state.dataSet)) {
      case MODEL_UPLOAD: {
        // FIXME
        try {
          const tensor4 = [[], [], [], []]
          const results = this.model.predict(tensor4).dataSync()
          const index = results.indexOf(Math.max.apply(null, results))
          await alertHelper.alertInfo("La predicción es: " + index, index)
        } catch (error) {
          console.error(error)
          await alertHelper.alertError(error)
        }
        break
      }
      case MODEL_IMAGE_MNIST: {
        const { results, index } = await this.ProcessMNIST()
        const bar_data_image = {
          labels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
          datasets: [{
            label: "numbers",
            data: results,
            backgroundColor: "rgba(255, 99, 132, 0.5)"
          }]
        }
        this.setState({ bar_data_image: bar_data_image })
        this.updateChart(this.chartRef_image.current)

        // await alertHelper.alertInfo(`¿El número es un ${index}?`, index)
        break
      }
      case MODEL_IMAGE_MOBILENET: {
        const originalImage = document.getElementById("originalImage")
        const predictions = await this.model.classify(originalImage)
        const bar_data_image = {
          labels: [""],
          datasets: predictions.map((value) => {
            return {
              label: value.className,
              data: [value.probability],
              backgroundColor: "rgba(255, 99, 132, 0.5)",
            }
          })
        }
        this.setState({ bar_data_image: bar_data_image })
        break
      }
      case MODEL_IMAGE_RESNET: {
        // TODO
        const originalImage = document.getElementById("originalImage")
        const originalImage_ctx = originalImage.getContext("2d")

        const resultCanvas = document.getElementById("resultCanvas")
        const resultCanvas_ctx = resultCanvas.getContext("2d")

        resultCanvas.height = 224
        resultCanvas.width = 224

        const newCanvas = document.createElement("canvas")
        const newCanvas_ctx = newCanvas.getContext("2d")
        newCanvas.width = originalImage.width * 0.75
        newCanvas.height = originalImage.height * 0.75

        newCanvas_ctx.drawImage(originalImage, 0, 0, newCanvas.width, newCanvas.height)
        resultCanvas_ctx.drawImage(newCanvas, 0, 0, newCanvas.width, newCanvas.height)

        const tensorImage = tf.browser.fromPixels(originalImage)
          .resizeNearestNeighbor([224, 224])
          .toFloat();
        const normalize = tensorImage
          .sub(tf.scalar(127.5))
          .div(tf.scalar(127.5))
          .expandDims();
        const predict = this.model.predict(normalize)
        const index = predict.as1D().argMax(-1).dataSync()[0]

        // console.log({
        //   data: await predict.data(),
        //   predict,
        //   index,
        //   IMAGENET: datosAuxiliares.IMAGENET[index],
        //   imageNameList: datosAuxiliares.imageNameList[index]
        // })
        await alertHelper.alertInfo(
          "El modelo predice que la imagen es: " + datosAuxiliares.IMAGENET[index],
          datosAuxiliares.imageNameList[index]
        )
        break
      }
      default: {
        console.error("Error, opción no válida")
        break
      }
    }
  }

  // TODO Pruebas MNIST
  // async handleClick_btn_MNIST_PRUEBAS() {
  //   const tf_model = await tf.loadLayersModel(process.env.REACT_APP_PATH + "/models/model-mnist/model.json")
  //   const canvas_ctx = document.getElementById("bigcanvas").getContext("2d")
  //   const tensor_3D_img = tf.browser.fromPixels(canvas_ctx.getImageData(0, 0, 200, 200), 1);
  //   let smallImg = tf.image.resizeBilinear(tensor_3D_img, [28, 28]);
  //   smallImg = tf.cast(smallImg, "float32");
  //   const tensor = smallImg.expandDims(0).div(tf.scalar(255));
  //   const predictedValues = tf_model.predict(tensor).dataSync();
  //
  //   let maxPrediction = 0;
  //   let predictionIndex = -1;
  //   for (let index = 0; index < predictedValues.length; index++) {
  //     if (predictedValues[index] > maxPrediction) {
  //       maxPrediction = predictedValues[index];
  //       predictionIndex = index;
  //     }
  //   }
  //   console.log({ prediction: predictionIndex, score: maxPrediction })
  // }

  async PredictImageByExamples({ target }) {
    const predictions = await this.model.classify(target)
    const labels = predictions.map(v => v.className)
    const datasets = predictions.map(v => {
      return {
        label: v.className,
        data: [v.probability],
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      }
    })
    const bar_data_modal = {
      labels: [""],
      datasets: datasets
    }

    this.setState({ url_image: target.src })
    this.setState({ bar_data_modal: bar_data_modal })
    this.setState({ isModalShow: true })
    const chart = this.chartRef.current;
    this.updateChart(chart)
  }

  Print_HTML_Section() {
    switch (getNameDatasetByID_ImageClassification(this.state.dataset_ID)) {
      case MODEL_UPLOAD: {
        return <>
          <div>
            <Card.Text>Carga tu propio Modelo.</Card.Text>
            <Card.Text>Primero el archivo .json y después el fichero .bin</Card.Text>
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
            </Row>
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
    chart.update();
  }

  handleFileUpload_Image(files) {
    try {
      const blob = files[0]
      const image = new File([blob], blob.name, { type: blob.type });
      let originalImage = document.getElementById("originalImage")
      let originalImage_ctx = originalImage.getContext("2d")
      let __that = this
      const container_w = document.getElementById("container-canvas").getBoundingClientRect().width
      let designer_width = container_w * 0.75
      let designer_height = container_w * 0.50

      // TODO HEY
      function draw() {
        const original_ratio = this.width / this.height
        let designer_ratio = designer_width / designer_height
        if (original_ratio > designer_ratio) {
          designer_height = designer_width / original_ratio
        } else {
          designer_width = designer_height * original_ratio
        }
        this.width = designer_width
        this.height = designer_height
        // Dibujamos a tam original
        originalImage.width = this.width
        originalImage.height = this.height
        originalImage_ctx.drawImage(this, 0, 0, originalImage.width, originalImage.height)
        __that.setState({ isImageUploaded: true })
      }

      function failed(event) {
        console.error(event)
      }

      let img = new Image()
      img.src = URL.createObjectURL(image)
      img.onload = draw
      img.onerror = failed
    } catch (error) {
      console.error(error)
    }
  }

  handleFileUpload_JSON(files) {
    this.files.json = new File([files[0]], files[0].name, { type: files[0].type });
  }

  handleFileUpload_Binary(files) {
    this.files.binary = new File([files[0]], files[0].name, { type: files[0].type });
  }

  handleModal_Close() {
    this.setState({ isModalShow: false })
  }

  handleModal_Entered() {

  }

  handleModal_Exited() {

  }

  isMNIST() {
    return getNameDatasetByID_ImageClassification(this.state.dataset_ID) === MODEL_IMAGE_MNIST
  }

  render() {
    return (
      <>
        <Container id={"ModelReviewClassicImageClassification"}>

          <Row>
            <Col xs={12} sm={12} md={12} xl={3} xxl={3}>
              <Card className={"sticky-top mt-3 mb-3 border-info"}>
                <Card.Body>
                  <Card.Title>{this.Print_HTML_TextOptions()}</Card.Title>
                  {this.Print_HTML_Section()}
                </Card.Body>
              </Card>
            </Col>

            <Col xs={12} sm={12} md={12} xl={9} xxl={9}>
              <Row>
                {this.isMNIST() && <>
                  <Col className={"d-grid"}
                       xs={this.isMNIST() ? 12 : 12}
                       sm={this.isMNIST() ? 12 : 12}
                       md={this.isMNIST() ? 6 : 12}
                       xl={this.isMNIST() ? 6 : 12}
                       xxl={this.isMNIST() ? 6 : 12}>
                    <Card className={"mt-3"}>
                      <Card.Header><h3>Procesamiento del dibujo</h3></Card.Header>
                      <Card.Body>
                        <CustomCanvasDrawer submitFunction={() => {
                          this.handleSubmit_TestCanvasDraw().then(({ results, index }) => {
                            const bar_data_image = {
                              labels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                              datasets: [{
                                label: "numbers",
                                data: results,
                                backgroundColor: "rgba(255, 99, 132, 0.5)"
                              }]
                            }
                            this.setState({ bar_data_image: bar_data_image })
                            this.updateChart(this.chartRef_image.current)
                          })
                        }}/>
                        {/*
                        <div className="d-flex justify-content-center mt-3">
                          <Button onClick={this.handleClick_btn_MNIST_PRUEBAS}>Pruebas MNIST</Button>
                        </div>
                        */}
                      </Card.Body>
                    </Card>
                  </Col>
                </>}
                <Col className={"d-grid"}
                     xs={this.isMNIST() ? 12 : 12}
                     sm={this.isMNIST() ? 12 : 12}
                     md={this.isMNIST() ? 6 : 12}
                     xl={this.isMNIST() ? 6 : 12}
                     xxl={this.isMNIST() ? 6 : 12}>
                  <Card className={"mt-3"}>
                    <Card.Header><h3>Procesamiento de imágenes</h3></Card.Header>
                    <Card.Body className={"d-grid"} style={{ alignContent: "space-between" }}>
                      <DragAndDrop name={"doc"}
                                   text={"Añada una imagen de ejemplo"}
                                   labelFiles={"Fichero:"}
                                   accept={{
                                     "image/png": [".png"],
                                     "image/jpg": [".jpg"]
                                   }}
                                   function_DropAccepted={this.handleFileUpload_Image}/>

                      <div className="d-grid gap-2 col-6 mx-auto">
                        <Button type="button"
                                onClick={this.handleClick_TestImageUpload}
                                variant={"primary"}>
                          Validar
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>


              <Card className={"mt-3"}>
                <Card.Header><h3>Resultado</h3></Card.Header>
                <Card.Body>
                  <Container fluid={true}>
                    <Row className="mt-3">
                      <Col className={"d-flex align-items-center justify-content-center"} id={"container-canvas"}>
                        <Row>
                          <Col className={"col-12 d-flex justify-content-center"}>
                            <canvas id="originalImage"
                                    width={200} height={200}
                                    className={"nets4-border-1"}></canvas>
                          </Col>
                          <Col className={"col-12 d-flex justify-content-center"}>
                            <canvas id="resultCanvas"
                                    style={{ display: "none" }}
                                    width={250} height={250}
                                    className={"nets4-border-1"}></canvas>
                          </Col>
                          <Col className={"col-12 d-flex justify-content-center"}>
                            <canvas id="imageCanvas"
                                    style={{ display: "none" }}
                                    width={250} height={250}
                                    className={"nets4-border-1"}></canvas>
                          </Col>
                          <Col className={"col-12 d-flex justify-content-center"}>
                            <canvas id="smallcanvas"
                                    style={this.isMNIST() ? {} : { display: "none" }}
                                    width="28" height="28"
                                    className={"nets4-border-1"}></canvas>
                          </Col>
                        </Row>
                      </Col>
                      <Col className={"d-flex align-items-center justify-content-center"}>
                        <Bar ref={this.chartRef_image}
                             options={this.bar_options}
                             data={this.state.bar_data_image}/>
                      </Col>
                    </Row>
                  </Container>
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
                                 src={process.env.REACT_APP_PATH + "/assets/" + image}
                                 alt={image}
                                 onClick={($event) => this.PredictImageByExamples($event)}></img>
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
            <Modal show={this.state.isModalShow}
                   fullscreen={isMobile}
                   onHide={this.handleModal_Close}
                   onEntered={this.handleModal_Entered}
                   onExited={this.handleModal_Exited}
                   size="lg"
                   aria-labelledby="contained-modal-title-vcenter"
                   centered>
              <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                  Predicción
                </Modal.Title>
              </Modal.Header>
              <Modal.Body className={"d-flex align-items-center justify-content-center"}>
                <Container fluid={true}>
                  <Row>
                    <Col xs={12} sm={12} md={4} xl={3} xxl={3}
                         className={"d-flex align-items-center justify-content-center"}>
                      <img src={this.state.url_image}
                           alt={"Imágen auxiliar"}
                           className={"img-fluid w-100"}/>
                    </Col>
                    <Col xs={12} sm={12} md={8} xl={9} xxl={9}
                         className={"d-flex align-items-end justify-content-center"}>
                      <Bar ref={this.chartRef}
                           options={this.state.bar_options}
                           data={this.state.bar_data_modal}/>
                    </Col>
                  </Row>
                </Container>
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={this.handleModal_Close}>Aceptar</Button>
              </Modal.Footer>
            </Modal>
          </>
        }
      </>
    )
  }
}