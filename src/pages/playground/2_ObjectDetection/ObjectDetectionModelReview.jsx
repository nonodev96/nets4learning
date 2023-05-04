import React from "react";
import { Card, Col, Container, Form, Row } from "react-bootstrap";
import Webcam from "react-webcam";

import * as faceDetection from "@tensorflow-models/face-detection";
import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
import * as poseDetection from "@tensorflow-models/pose-detection";
import * as coCoSsdDetection from "@tensorflow-models/coco-ssd";
import * as tfjs from "@tensorflow/tfjs";

import * as alertHelper from "../../../utils/alertHelper";
import DragAndDrop from "../../../components/dragAndDrop/DragAndDrop";
import {
  getKeyDatasetByID_ObjectDetection,
  LIST_MODELS_OBJECT_DETECTION,
  MODEL_FACE_MESH,
  MODEL_FACE_DETECTOR,
  MODEL_MOVE_NET_POSE_NET,
  MODEL_COCO_SSD,
  MODEL_UPLOAD,
} from "../../../DATA_MODEL";
import ReactGA from "react-ga4";
import { Trans, withTranslation } from "react-i18next";
import { MODEL_OBJECT_DETECTION } from "./models/_model";

// tfjsWasm.setWasmPaths(process.env.PUBLIC_URL + "/wasm/tfjs-backend-wasm.wasm")


class ObjectDetectionModelReview extends React.Component {

  constructor(props) {
    super(props);
    this.translate = props.t;
    this.dataset = props.dataset;
    this.dataset_ID = parseInt(props.dataset ?? "0");
    this.dataset_key = getKeyDatasetByID_ObjectDetection(this.dataset_ID);
    ReactGA.send({ hitType: "pageview", page: "/ModelReviewObjectDetection/" + this.dataset_key, title: this.dataset_key });

    this.state = {
      isCameraEnable  : false,
      isProcessedImage: false,
      dataset         : parseInt(props.dataset ?? "0"),
      isShowedAlert   : false,
      modelDetector   : null,
      loading         :
        <>
          <div className="spinner-border"
               role="status"
               style={{
                 fontSize: "0.5em",
                 height  : "1rem",
                 width   : "1rem",
               }}>
            <span className="sr-only"></span>
          </div>
        </>,
    };
    this.webcamRef = React.createRef();
    this.canvasRef = React.createRef();
    this.handleChangeCamera = this.handleChangeCamera.bind(this);
    this.handleChangeFileUpload = this.handleChangeFileUpload.bind(this);
    this.onUserMediaEvent = this.onUserMediaEvent.bind(this);
    this.onUserMediaErrorEvent = this.onUserMediaErrorEvent.bind(this);
    this.animation_id = 0;

    this._model = new MODEL_OBJECT_DETECTION(props.t);
    switch (this.dataset_key) {
      case MODEL_FACE_MESH.KEY: {
        this._model = new MODEL_FACE_MESH(props.t);
        break;
      }
      case MODEL_FACE_DETECTOR.KEY: {
        this._model = new MODEL_FACE_DETECTOR(props.t);
        break;
      }
      case MODEL_MOVE_NET_POSE_NET.KEY: {
        this._model = new MODEL_MOVE_NET_POSE_NET(props.t);
        break;
      }
      case MODEL_COCO_SSD.KEY: {
        this._model = new MODEL_COCO_SSD(props.t);
        break;
      }
      default: {
        console.error("Error, option not valid");
      }
    }
  }

  componentDidMount() {
    tfjs.setBackend("webgl").then(() => {
      tfjs.ready().then(async () => {
        if (tfjs.getBackend() !== "webgl") {
          await alertHelper.alertError("Backend of tensorflow not installed");
        }
        await this.init();
      });
    });
  }

  async init() {
    const key = getKeyDatasetByID_ObjectDetection(this.props.dataset);
    const isValid = LIST_MODELS_OBJECT_DETECTION.some((e) => e === key);

    if (!isValid) {
      await alertHelper.alertError("Error in selection of model");
      return;
    }

    switch (key) {
      case MODEL_UPLOAD: {
        // TODO
        break;
      }
      case MODEL_FACE_DETECTOR.KEY: {
        await this.enable_Model_FaceDetector();
        await alertHelper.alertSuccess(this.translate("model-loaded-successfully"))
        this.setState({ isShowedAlert: true });
        this.setState({ loading: "" });
        break;
      }
      case MODEL_FACE_MESH.KEY: {
        await this.enable_Model_FaceMesh();
        await alertHelper.alertSuccess(this.translate("model-loaded-successfully"))
        this.setState({ isShowedAlert: true });
        this.setState({ loading: "" });
        break;
      }
      case MODEL_MOVE_NET_POSE_NET.KEY: {
        await this.enable_Model_MoveNet();
        await alertHelper.alertSuccess(this.translate("model-loaded-successfully"))
        this.setState({ isShowedAlert: true });
        this.setState({ loading: "" });
        break;
      }
      case MODEL_COCO_SSD.KEY: {
        await this.enable_Model_CoCoSsd();
        await alertHelper.alertSuccess(this.translate("model-loaded-successfully"))
        this.setState({ isShowedAlert: true });
        this.setState({ loading: "" });
        break;
      }
      default: {
        console.error("Error, conjunto de datos no reconocido");
        break;
      }
    }
  }

  //region FACE DETECTOR
  async enable_Model_FaceDetector() {
    const model = faceDetection.SupportedModels.MediaPipeFaceDetector;
    const mediaPipeFaceDetectorMediaPipeModelConfig = {
      runtime     : "mediapipe",
      solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/face_detection",
      modelType   : "short",
      maxFaces    : 4,
    };
    this.setState({
      modelDetector: await faceDetection.createDetector(model, mediaPipeFaceDetectorMediaPipeModelConfig),
    });
  }

  renderFaceDetector(ctx, faces) {
    ctx.font = "8px Verdana";
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#FF0902";
    // ctx.strokeRect(element.x, element.y, 5, 5)
    faces.forEach((face) => {
      face.keypoints.forEach((element) => {
        ctx.beginPath();
        ctx.arc(element.x, element.y, 2, 0, (Math.PI / 180) * 360);
        ctx.stroke();
        ctx.fillText(`${element.name}`, element.x, element.y);
      });
    });
  }

  //endregion

  //region FACE MESH
  async enable_Model_FaceMesh() {
    const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
    const mediaPipeFaceMeshMediaPipeModelConfig = {
      runtime        : "mediapipe",
      refineLandmarks: true,
      solutionPath   : "https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh",
      maxFaces       : 4,
    };
    this.setState({
      modelDetector: await faceLandmarksDetection.createDetector(model, mediaPipeFaceMeshMediaPipeModelConfig),
    });
  }

  renderFaceMeshDetector(ctx, faces) {
    faces.forEach((face) => {
      ctx.strokeStyle = "#FF0902";
      face.keypoints.forEach((element) => {
        ctx.strokeRect(element.x, element.y, 1, 1);
      });
    });
  }

  //endregion

  //region MOVE NET
  async enable_Model_MoveNet() {
    const model = poseDetection.SupportedModels.MoveNet;
    // const moveNetModelConfig = {}

    this.setState({
      modelDetector: await poseDetection.createDetector(model),
    });
  }

  renderMoveNetDetector(ctx, poses) {
    // let lineas = [[10, 8], [8, 6], [6, 12], [6, 5], [5, 11], [5, 7], [7, 9], [12, 11], [12, 14], [14, 16], [11, 13], [13, 15],]
    let lineas = [[0, 1], [0, 2], [1, 3], [2, 4], [5, 6], [5, 7], [5, 11], [6, 8], [6, 12], [7, 9], [8, 10], [11, 12], [11, 13], [12, 14], [13, 15], [14, 16]];
    ctx.strokeStyle = "#FF0902";
    poses.forEach((pose) => {
      if (pose.score > 0.4) {
        lineas.forEach((index) => {
          ctx.beginPath();
          ctx.moveTo(pose.keypoints[index[0]].x, pose.keypoints[index[0]].y);
          ctx.lineTo(pose.keypoints[index[1]].x, pose.keypoints[index[1]].y);
          ctx.stroke();
        });
        pose.keypoints.forEach((element) => {
          ctx.beginPath();
          ctx.arc(element.x, element.y, 5, 0, (Math.PI / 180) * 360);
          ctx.stroke();
          ctx.fillText(`${element.name}`, element.x, element.y);
          // ctx.strokeRect(element.x, element.y, 10, 10)
        });
      }
    });
  }

  //endregion

  //region COCO SSD
  async enable_Model_CoCoSsd() {
    // const moveNetModelConfig = {}
    this.setState({
      modelDetector: await coCoSsdDetection.load(),
    });
  }

  renderCoCoSsd(ctx, predictions) {
    let score = 0;
    ctx.fillStyle = "#fc0400";
    ctx.font = "1em Verdana";
    ctx.lineWidth = 5;
    ctx.strokeStyle = "rgba(0,255,21,0.84)";

    predictions.forEach((prediction) => {
      score = Math.round(parseFloat(prediction.score) * 100);
      ctx.strokeRect(prediction.bbox[0], prediction.bbox[1], prediction.bbox[2], prediction.bbox[3]);
      ctx.fillText(`${prediction.class.toUpperCase()} with ${score}% confidence`, prediction.bbox[0], prediction.bbox[1] + 20);
    });
  }

  //endregion

  runModelWithDetector() {
    const frame = async () => {
      if (this.state.isCameraEnable) {
        try {
          this.animation_id = requestAnimationFrame(async () => {
            await this.processWebcam(this.state.modelDetector);
            await frame();
          });
        } catch (e) {
          console.log(`catch cancelAnimationFrame(${this.animation_id});`);
          cancelAnimationFrame(this.animation_id);
        }
      }
    };
    this.animation_id = requestAnimationFrame(frame);
  }

  async processWebcam(model) {
    if (typeof this.webcamRef.current === "undefined"
      || this.webcamRef.current === null
      || this.webcamRef.current.video.readyState !== 4) {
      return;
    }
    // Get Video Properties
    const video = this.webcamRef.current.video;
    const videoWidth = this.webcamRef.current.video.videoWidth;
    const videoHeight = this.webcamRef.current.video.videoHeight;

    // Set video width
    this.webcamRef.current.video.width = videoWidth;
    this.webcamRef.current.video.height = videoHeight;

    // Set canvas width
    this.canvasRef.current.width = videoWidth;
    this.canvasRef.current.height = videoHeight;
    const img_or_video = video;

    const ctx = this.canvasRef.current.getContext("2d");
    await this.processData(model, ctx, img_or_video);
  }

  async processData(model, ctx, img_or_video) {
    switch (getKeyDatasetByID_ObjectDetection(this.state.dataset)) {
      case MODEL_UPLOAD: {
        // TODO
        break;
      }
      case MODEL_FACE_DETECTOR.KEY: {
        const faces = await model.estimateFaces(img_or_video);
        this.renderFaceDetector(ctx, faces);
        break;
      }
      case MODEL_FACE_MESH.KEY: {
        const faces = await model.estimateFaces(img_or_video);
        this.renderFaceMeshDetector(ctx, faces);
        break;
      }
      case MODEL_MOVE_NET_POSE_NET.KEY: {
        const poses = await model.estimatePoses(img_or_video);
        this.renderMoveNetDetector(ctx, poses);
        break;
      }
      case MODEL_COCO_SSD.KEY: {
        const predictions = await model.detect(img_or_video);
        this.renderCoCoSsd(ctx, predictions);
        break;
      }
      default: {
        console.error("Error, conjunto de datos no reconocido");
        break;
      }
    }
  }

  async handleChangeCamera(event) {
    const webcamChecked = event.target.checked;
    this.setState({ isCameraEnable: !!webcamChecked });
    if (webcamChecked === true) {
      this.runModelWithDetector();
    }
  }

  onUserMediaEvent(mediaStream) {

  }

  onUserMediaErrorEvent(error) {
    console.log({ error });
    cancelAnimationFrame(this.animation_id);
  }

  async handleChangeFileUpload(_files) {
    // let tgt = e.target || window.event.srcElement
    console.log("ModelReviewObjectDetection -> handleChangeFileUpload", { _files });
    let files = _files;

    const originalImageCanvas = document.getElementById("originalImageCanvas");
    const originalImageCanvas_ctx = originalImageCanvas.getContext("2d");

    const processImageCanvas = document.getElementById("processImageCanvas");
    const processImageCanvas_ctx = processImageCanvas.getContext("2d");

    const resultCanvas = document.getElementById("resultCanvas");
    const resultCanvas_ctx = resultCanvas.getContext("2d");
    const container_w = document.getElementById("container-canvas").getBoundingClientRect().width;
    let that = this;

    let designer_width = container_w * 0.75;
    let designer_height = container_w * 0.50;

    async function draw(event) {
      const original_ratio = this.width / this.height;
      let designer_ratio = designer_width / designer_height;

      if (original_ratio > designer_ratio) {
        designer_height = designer_width / original_ratio;
      } else {
        designer_width = designer_height * original_ratio;
      }

      this.width = designer_width;
      this.height = designer_height;
      originalImageCanvas.width = this.width;
      originalImageCanvas.height = this.height;
      processImageCanvas.width = this.width;
      processImageCanvas.height = this.height;
      resultCanvas.width = this.width;
      resultCanvas.height = this.height;

      originalImageCanvas_ctx.drawImage(this, 0, 0, originalImageCanvas.width, originalImageCanvas.height);
      const imgData = originalImageCanvas_ctx.getImageData(0, 0, originalImageCanvas.height, originalImageCanvas.width);

      await that.processData(that.state.modelDetector, processImageCanvas_ctx, imgData);

      resultCanvas_ctx.drawImage(this, 0, 0, originalImageCanvas.width, originalImageCanvas.height);
      await that.processData(that.state.modelDetector, resultCanvas_ctx, imgData);
      that.setState({ isProcessedImage: true });
    }

    function failed() {
      console.error("Error al crear la imagen");
    }

    const img = new Image();
    img.src = URL.createObjectURL(files[0]);
    img.onload = draw;
    img.onerror = failed;
  }

  render() {
    console.log("render");
    return (
      <Container id={"ModelReviewObjectDetection"}>
        <Row>
          <Col xs={12} sm={12} md={12} xl={3} xxl={3}>
            <Card className={"sticky-top mt-3 mb-3 border-info"}>
              <Card.Body>
                <Card.Title>
                  <Trans i18nKey={this._model.TITLE} /> {this.state.loading}
                </Card.Title>
                {getKeyDatasetByID_ObjectDetection(this.state.dataset) === MODEL_UPLOAD ?
                  <>
                    <Card.Subtitle className="mb-3 text-muted">Carga tu propio Modelo.</Card.Subtitle>
                    <Card.Text>
                      Ten en cuenta que tienes que subir primero el archivo .json y después el fichero .bin
                    </Card.Text>
                    <Container fluid={true}>
                      <Row>
                        <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                          {/*TODO*/}
                          <DragAndDrop name={"bin"}
                                       accept={{ "application/octet-stream": [".bin"] }}
                                       text={"Añada el fichero binario"}
                                       labelFiles={"Fichero:"} />
                        </Col>
                        <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                          <DragAndDrop name={"json"}
                                       accept={{ "application/json": [".json"] }}
                                       text={"Añada el fichero JSON"}
                                       labelFiles={"Fichero:"} />
                        </Col>
                      </Row>
                    </Container>
                  </>
                  :
                  <>
                    {this._model.DESCRIPTION()}

                    {/*{getHTML_DATASET_DESCRIPTION(2, this.state.dataset)}*/}
                  </>
                }
              </Card.Body>
            </Card>
          </Col>

          <Col xs={12} sm={12} md={12} xl={9} xxl={9}>
            {/*Es necesario un "Col" 9 y otro dentro*/}
            <Col xs={12} sm={12} md={12} xl={12} xxl={12}>
              <Card className={"mt-3"}>
                <Card.Header>
                  <h3><Trans i18nKey={"datasets-models.2-object-detection.interface.process-webcam.title"} /></h3>
                </Card.Header>
                <Card.Body>
                  <Card.Title><Trans i18nKey={"datasets-models.2-object-detection.interface.process-webcam.sub-title"} /></Card.Title>

                  <Container fluid={true}>
                    <Row className={"mt-3"}>
                      <Form>
                        <div key={`default-checkbox`}
                             className="mb-3">
                          <Form.Check type="checkbox"
                                      id={"default-checkbox"}
                                      label={this.props.t("datasets-models.2-object-detection.interface.process-webcam.button")}
                                      value={this.state.isCameraEnable ? "true" : "false"}
                                      onChange={this.handleChangeCamera} />
                        </div>
                      </Form>
                    </Row>
                    <hr />
                    <Row className={"mt-3"}>
                      <Col className={"d-flex justify-content-center"}>
                        {this.state.isCameraEnable &&
                          <div id={"webcamContainer"}
                               className={"nets4-border-1"}
                               style={{
                                 position: "relative",
                                 overflow: "hidden",
                               }}>
                            <Webcam ref={this.webcamRef}
                                    onUserMedia={this.onUserMediaEvent}
                                    onUserMediaError={this.onUserMediaErrorEvent}
                                    width={250} height={250}
                                    style={{
                                      position: "relative",
                                      display : "block",
                                    }} />
                            <canvas ref={this.canvasRef}
                                    width={250} height={250}
                                    style={{
                                      position: "absolute",
                                      display : "block",
                                      left    : 0,
                                      top     : 0,
                                      zIndex  : 10,
                                    }}></canvas>
                          </div>
                        }
                      </Col>
                    </Row>
                  </Container>
                </Card.Body>
              </Card>
            </Col>

            <Col xs={12} sm={12} md={12} xl={12} xxl={12}>
              <Card className={"mt-3"}>
                <Card.Header>
                  <h3><Trans i18nKey={"datasets-models.2-object-detection.interface.process-image.title"} /></h3>
                </Card.Header>
                <Card.Body>
                  <Card.Title>
                    <Trans i18nKey={"datasets-models.2-object-detection.interface.process-image.sub-title"} />
                  </Card.Title>
                  <Container fluid={true} id={"container-canvas"}>
                    <Row className={"mt-3"}>
                      <Col>
                        <DragAndDrop name={"doc"}
                                     text={this.props.t("drag-and-drop.image")}
                                     labelFiles={this.props.t("drag-and-drop.label-files-one")}
                                     accept={{
                                       "image/png": [".png"],
                                       "image/jpg": [".jpg"],
                                     }}
                                     function_DropAccepted={this.handleChangeFileUpload} />
                      </Col>
                    </Row>
                    <hr />
                    <Row className={"mt-3"}
                         style={this.state.isProcessedImage ? {} : { display: "none" }}>
                      <Col className={"col-12 d-flex justify-content-center"}>
                        <canvas id="originalImageCanvas"
                                className={"nets4-border-1"}
                                width={250} height={250}></canvas>
                      </Col>
                      <Col className={"col-12 d-flex justify-content-center"}>
                        <canvas id="processImageCanvas"
                                className={"nets4-border-1"}
                                width={250} height={250}></canvas>
                      </Col>
                      <Col className={"col-12 d-flex justify-content-center"}>
                        <canvas id="resultCanvas"
                                className={"nets4-border-1"}
                                width={250} height={250}></canvas>
                      </Col>
                    </Row>
                  </Container>
                </Card.Body>
              </Card>
            </Col>

          </Col>
        </Row>

      </Container>
    );
  }
}

export default withTranslation()(ObjectDetectionModelReview);
