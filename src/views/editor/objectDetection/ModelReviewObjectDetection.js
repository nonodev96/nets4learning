import React, { useEffect, useRef, useState } from 'react'
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap'
import Webcam from 'react-webcam'

import * as faceDetection from '@tensorflow-models/face-detection'
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection'
import * as poseDetection from '@tensorflow-models/pose-detection'
import * as coCoSsdDetection from '@tensorflow-models/coco-ssd'
import * as tfjsWasm from '@tensorflow/tfjs-backend-wasm';


import { getHTML_DataSetDescription } from '../../uploadArcitectureMenu/UploadArchitectureMenu'
import * as alertHelper from '../../../utils/alertHelper'
import DragAndDrop from "../../../components/dragAndDrop/DragAndDrop";
import {
  getNameDatasetByID_ObjectDetection, LIST_MODELS,
  LIST_MODELS_OBJECT_DETECTION,
  MODEL_COCO_SSD,
  MODEL_FACE_DETECTION,
  MODEL_FACE_MESH,
  MODEL_MOVE_NET,
  MODEL_UPLOAD
} from "../../../ModelList";

tfjsWasm.setWasmPaths(
  `https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm@${tfjsWasm.version_wasm}/dist/`
);
export default function ModelReviewObjectDetection(props) {
  const { dataSet } = props

  // null, "IMAGE", "WEBCAM"
  const [ImageOrWebcamUploaded, setImageOrWebcam] = useState(null)
  const [Detector, setDetector] = useState(null)
  const [Model, setModel] = useState()
  const [isCameraEnable, setIsCameraEnable] = useState(false)
  const [isShowedAlert, setIsShowedAlert] = useState(false)
  const canvasRef = useRef(null)
  const webcamRef = useRef(null)

  async function enable_Model_FaceDetector() {
    const model = faceDetection.SupportedModels.MediaPipeFaceDetector;
    const mediaPipeFaceDetectorTfjsModelConfig = {
      runtime: 'tfjs',
      maxFaces: 4
    }
    const detector = await faceDetection.createDetector(model, mediaPipeFaceDetectorTfjsModelConfig)
    await runDetector(detector)
  }

  async function enable_Model_FaceDetector_Picture() {
    const model = faceDetection.SupportedModels.MediaPipeFaceDetector
    const mediaPipeFaceDetectorTfjsModelConfig = {
      runtime: 'tfjs',
    }
    const detector = await faceDetection.createDetector(model, mediaPipeFaceDetectorTfjsModelConfig)
    setDetector(detector)
  }

  // TODO
  const renderFaceDetector = (ctx, faces) => {
    faces.forEach((face) => {
      ctx.strokeStyle = '#FF0902'
      face.keypoints.forEach((element) => {
        ctx.strokeRect(element.x, element.y, 5, 5)
      })
    })
  }

  async function enable_Model_FaceMesh() {
    const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh
    const mediaPipeFaceMeshMediaPipeModelConfig = {
      runtime: 'mediapipe',
      refineLandmarks: true,
      solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh',
      maxFaces: 4
    }
    const detector = await faceLandmarksDetection.createDetector(model, mediaPipeFaceMeshMediaPipeModelConfig)
    await runDetector(detector)
  }

  async function enable_Model_FaceMesh_Picture() {
    const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh
    const mediaPipeFaceMeshTfjsModelConfig = {
      runtime: 'mediapipe',
      refineLandmarks: true,
      solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh',
      maxFaces: 4
    }
    const detector = await faceLandmarksDetection.createDetector(model, mediaPipeFaceMeshTfjsModelConfig)
    setDetector(detector)
  }

  const renderFaceMeshDetector = (ctx, faces) => {
    faces.forEach((face) => {
      ctx.strokeStyle = '#FF0902'
      face.keypoints.forEach((element) => {
        ctx.strokeRect(element.x, element.y, 1, 1)
      })
    })
  }

  async function enable_Model_MoveNet() {
    const model = poseDetection.SupportedModels.MoveNet
    // const moveNetModelConfig = {}
    const detector = await poseDetection.createDetector(model)
    await runDetector(detector)
  }

  async function enable_Model_MoveNet_Picture() {
    const model = poseDetection.SupportedModels.MoveNet
    // const moveNetModelConfig = {}
    const detector = await poseDetection.createDetector(model)
    setDetector(detector)
  }

  const renderMoveNetDetector = (ctx, poses) => {
    let lineas = [
      [10, 8], [8, 6], [6, 12], [6, 5], [5, 11], [5, 7],
      [7, 9], [12, 11], [12, 14], [14, 16], [11, 13], [13, 15],
    ]
    ctx.strokeStyle = '#FF0902'
    poses.forEach((pose) => {
      lineas.forEach((index) => {
        ctx.beginPath()
        ctx.moveTo(pose.keypoints[index[0]].x, pose.keypoints[index[0]].y)
        ctx.lineTo(pose.keypoints[index[1]].x, pose.keypoints[index[1]].y)
        ctx.stroke()
      })
      pose.keypoints.forEach((element) => {
        ctx.beginPath()
        ctx.arc(element.x, element.y, 5, 0, (Math.PI / 180) * 360)
        ctx.stroke()
        // ctx.strokeRect(element.x, element.y, 10, 10)
      })
    })
  }

  const renderMoveNetDetector_Image = (ctx, poses) => {
    renderMoveNetDetector(ctx, poses)
  }

  async function enable_Model_CoCoSsd() {
    const model = await coCoSsdDetection.load()
    // const moveNetModelConfig = {}
    await runDetector(model)
  }

  async function enable_Model_CoCoSsd_Picture() {
    const model = poseDetection.SupportedModels.MoveNet
    // const moveNetModelConfig = {}
    const detector = await poseDetection.createDetector(model)
    setDetector(detector)
  }

  const renderCoCoSsd = (ctx, predictions) => {
    let score
    ctx.fillStyle = '#fc0400'
    ctx.font = "1em Verdana";
    ctx.lineWidth = 5
    ctx.strokeStyle = 'rgba(0,255,21,0.84)'

    predictions.forEach((prediction) => {
      score = Math.round(parseFloat(prediction.score) * 100)
      ctx.fillText(`${prediction.class.toUpperCase()} with ${score}% confidence`, prediction.bbox[0], prediction.bbox[1] - 20)
      ctx.strokeRect(prediction.bbox[0], prediction.bbox[1], prediction.bbox[2], prediction.bbox[3])
    })
  }

  const init = async () => {
    const dataSetName = getNameDatasetByID_ObjectDetection(dataSet);
    console.log("ModelReviewObjectDetection -> INIT", { dataSet, dataSetName })
    const isValid = LIST_MODELS_OBJECT_DETECTION.some((e) => e === dataSetName)

    if (!isValid) {
      await alertHelper.alertError("Error en la selección del modelo")
      return;
    }

    if (!isShowedAlert) {
      await alertHelper.alertSuccess("Modelo cargado con éxito")
      setIsShowedAlert(true)
    }

    switch (dataSetName) {
      case MODEL_UPLOAD: {
        // TODO
        break;
      }
      case MODEL_FACE_DETECTION: {
        if (isCameraEnable) {
          await enable_Model_FaceDetector()
        } else {
          await enable_Model_FaceDetector_Picture()
        }
        break;
      }
      case MODEL_FACE_MESH: {
        if (isCameraEnable) {
          await enable_Model_FaceMesh()
        } else {
          await enable_Model_FaceMesh_Picture()
        }
        break;
      }
      case MODEL_MOVE_NET: {
        if (isCameraEnable) {
          await enable_Model_MoveNet()
        } else {
          await enable_Model_MoveNet_Picture()
        }
        break;
      }
      case MODEL_COCO_SSD: {
        if (isCameraEnable) {
          await enable_Model_CoCoSsd()
        } else {
          await enable_Model_CoCoSsd_Picture()
        }
        break;
      }
    }
  }
  // https://github.com/tensorflow/tfjs-models

  useEffect(() => {
    init().catch(console.error)
  }, [isCameraEnable])

  function handleChangeCamera(event) {
    const checked = event.target.checked
    setIsCameraEnable(checked)
    if (checked) {
      setImageOrWebcam("WEBCAM")
    } else {
      setImageOrWebcam(null)
    }
    console.log({ checked, isCameraEnable })
  }

  async function runDetector(model) {
    function _init() {
      detect(model)
      requestAnimationFrame(_init)
    }

    requestAnimationFrame(_init)
  }


  /**
   *
   * @param model
   * @returns {Promise<void>}
   */
  async function detect(model) {
    if (ImageOrWebcamUploaded !== "IMAGE" && ImageOrWebcamUploaded !== "WEBCAM") {
      await alertHelper.alertError("Error, no se ha seleccionado procesar una imagen o usar una webcam");
    }
    let img_or_video
    if (ImageOrWebcamUploaded === "WEBCAM") {
      // Get Video Properties
      const video = webcamRef.current.video
      const videoWidth = webcamRef.current.video.videoWidth

      const videoHeight = webcamRef.current.video.videoHeight
      // Set video width
      webcamRef.current.video.width = videoWidth

      webcamRef.current.video.height = videoHeight
      // Set canvas width
      canvasRef.current.width = videoWidth
      canvasRef.current.height = videoHeight
      img_or_video = video
    }
    if (ImageOrWebcamUploaded === "IMAGE") {
      const canvas = document.getElementById('originalImage')
      const ctx1 = canvas.getContext('2d')

      const resultCanvas = document.getElementById('resultCanvas')
      const ctx2 = resultCanvas.getContext('2d')
      resultCanvas.height = canvas.height
      resultCanvas.width = canvas.width
      ctx2.drawImage(canvas, 0, 0)

      img_or_video = ctx1.getImageData(0, 0, canvas.height, canvas.width)
    }

    switch (getNameDatasetByID_ObjectDetection(dataSet)) {
      case MODEL_UPLOAD: {
        // TODO
        break
      }
      case MODEL_FACE_DETECTION: {
        const faces = await model.estimateFaces(img_or_video)
        const ctx = canvasRef.current.getContext('2d')
        requestAnimationFrame(() => {
          renderFaceDetector(ctx, faces)
        })
        break
      }
      case MODEL_FACE_MESH: {
        const faces = await model.estimateFaces(img_or_video)
        const ctx = canvasRef.current.getContext('2d')
        requestAnimationFrame(() => {
          renderFaceMeshDetector(ctx, faces)
        })
        break
      }
      case MODEL_MOVE_NET: {
        const poses = await model.estimatePoses(img_or_video)
        const ctx = canvasRef.current.getContext('2d')
        requestAnimationFrame(() => {
          renderMoveNetDetector(ctx, poses)
        })
        break
      }
      case MODEL_COCO_SSD: {
        const predictions = await model.detect(img_or_video)
        const ctx = canvasRef.current.getContext('2d')
        requestAnimationFrame(() => {
          renderCoCoSsd(ctx, predictions)
        })
        break
      }


    }
  }

  const handleVectorTest = async () => {
    console.log("ERROR")
  }

  const handleChangeFileUpload = (_files) => {
    // let tgt = e.target || window.event.srcElement
    console.log("ModelReviewObjectDetection -> handleChangeFileUpload", { _files })
    let files = _files

    const canvas = document.getElementById('originalImage')
    const ctx = canvas.getContext('2d')

    const canvas2 = document.getElementById('imageCanvas')
    const ctx2 = canvas.getContext('2d')

    function draw() {
      canvas.width = 500
      canvas.height = 500
      console.log({
        height: this.height,
        width: this.width,
        ratio: this.height / this.width,
        resize: this.width * 0.75,
      })
      canvas2.height = canvas2.width * (this.height / this.width)
      // step 1 - resize to 75%
      const oc = document.createElement('canvas')
      const oc_ctx = oc.getContext('2d')
      // Set the width & height to 75% of image
      oc.width = this.width * 0.75
      oc.height = this.height * 0.75
      // step 2, resize to temporary size
      oc_ctx.drawImage(this, 0, 0, oc.width, oc.height)
      // step 3, resize to final size
      ctx.drawImage(oc, 0, 0, oc.width, oc.height, 0, 0, canvas.width, canvas.height)
      setImageOrWebcam("IMAGE")
    }

    async function failed() {
      await alertHelper.alertError('Error al crear la imagen')
    }

    const img = new Image()
    img.onload = draw
    img.onerror = failed
    img.src = URL.createObjectURL(files[0])
  }

  return (
    <Container id={"ModelReviewObjectDetection"}>

      <Row className={"mt-3"}>
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>{LIST_MODELS[2][dataSet]}</Card.Title>
              {/*FIXME: change {=== '0'} by a validator*/}
              {getNameDatasetByID_ObjectDetection(dataSet) === MODEL_UPLOAD ? (
                <>
                  <Card.Subtitle className="mb-3 text-muted">Carga tu propio Modelo.</Card.Subtitle>
                  <Card.Text>
                    Ten en cuenta que tienes que subir primero el archivo .json y después el fichero .bin
                  </Card.Text>
                  {/*https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types*/}
                  <Container fluid={true}>
                    <Row>
                      <Col xs={6} sm={6} md={6} lg={6} xl={6} xxl={6}>
                        <DragAndDrop name={"json"}
                                     accept={{ 'application/octet-stream': ['.bin'] }}
                                     text={"Añada el fichero binario"}
                                     labelFiles={"Fichero:"}/>
                      </Col>
                      <Col xs={6} sm={6} md={6} lg={6} xl={6} xxl={6}>
                        <DragAndDrop name={"bin"}
                                     accept={{ 'application/json': ['.json'] }}
                                     text={"Añada el fichero JSON"}
                                     labelFiles={"Fichero:"}/>
                      </Col>
                    </Row>
                  </Container>
                </>
              ) : (
                <>{getHTML_DataSetDescription(2, dataSet)}</>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className={"mt-3"}>
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Seleccionar webcam o imagen</Card.Title>

              <Container fluid={true}>
                <Row className={"mt-3"}>
                  <Col xl={6}>
                    <Form>
                      <div key={`default-checkbox`}
                           className="mb-3">
                        <Form.Check type="checkbox"
                                    id={'default-checkbox'}
                                    label={`Usar webcam`}
                                    value={isCameraEnable ? "true" : "false"}
                                    onChange={handleChangeCamera}/>
                      </div>
                    </Form>
                  </Col>
                  <Col xl={6}>
                    <DragAndDrop name={"doc"}
                                 text={"Añada una imagen de ejemplo"}
                                 labelFiles={"Fichero:"}
                                 accept={{
                                   'image/png': ['.png']
                                 }}
                                 function_DropAccepted={handleChangeFileUpload}
                    />
                  </Col>
                </Row>
              </Container>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className={"mt-3"}>
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Resultado</Card.Title>
              <Container>

                <Row className={"mt-3"}>
                  <Col xl={3}></Col>
                  <Col xl={6}>
                    <div id={"webcamContainer"}
                         style={{
                           position: 'relative'
                         }}>
                      <Webcam ref={webcamRef}
                              style={{
                                position: 'relative',
                                display: 'block',
                                width: '100%',
                                height: '100%',
                              }}/>
                      <canvas ref={canvasRef}
                              style={{
                                position: 'absolute',
                                display: 'block',
                                left: 0,
                                top: 0,
                                zIndex: 10,
                                width: '100%',
                                height: '100%'
                              }}></canvas>
                    </div>
                  </Col>
                  <Col xl={3}></Col>
                </Row>

                <Row className={"mt-3"}>
                  <Col xs={4} sm={4} md={4} lg={4} xl={4} xxl={4}>
                    <canvas id="originalImage"></canvas>
                  </Col>
                  <Col xs={4} sm={4} md={4} lg={4} xl={4} xxl={4}>
                    <canvas id="imageCanvas"></canvas>
                  </Col>
                  <Col xs={4} sm={4} md={4} lg={4} xl={4} xxl={4}>
                    <canvas id="resultCanvas"></canvas>
                  </Col>
                </Row>

                {/* SUBMIT BUTTON */}
                {(!isCameraEnable) ? (
                  <Row className={"mt-3"}>
                    <div className="d-grid gap-2">
                      <Button type="button"
                              onClick={handleVectorTest}
                              variant="primary">
                        Ver resultado
                      </Button>
                    </div>
                  </Row>
                ) : ('')}
              </Container>


            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}
