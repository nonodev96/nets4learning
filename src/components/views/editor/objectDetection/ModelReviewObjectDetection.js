import React, { useState, useEffect, useRef } from 'react'
import { Col, Row, Form, Container, Card, Button } from 'react-bootstrap'
import Webcam from 'react-webcam'
import * as faceDetection from '@tensorflow-models/face-detection'
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection'
import * as poseDetection from '@tensorflow-models/pose-detection'
import { getHTML_DataSetDescription } from '../../uploadArcitectureMenu/UploadArchitectureMenu'
import { ModelList } from '../../uploadModelMenu/UploadModelMenu'
import { alertSuccess, alertError } from '../../../../utils/alertHelper'
import DragAndDrop from "../../../dragAndDrop/DragAndDrop";
import {
  getNameDatasetByID_ObjectDetection,
  MODEL_UPLOAD,
  MODEL_FACE_DETECTION,
  MODEL_FACE_MESH,
  MODEL_MOVE_NET
} from "../../../../ModelList";


export default function ModelReviewObjectDetection(props) {
  const { dataSet } = props

  // null, "IMAGE", "WEBCAM"
  const [ImageUploaded, setImageUploaded] = useState(null)
  const [Detector, setDetector] = useState()
  const [Model, setModel] = useState()
  const [isCameraEnable, setIsCameraEnable] = useState(false)
  const [isShowedAlert, setIsShowedAlert] = useState(false)
  const canvasRef = useRef(null)
  const webcamRef = useRef(null)

  useEffect(() => {
    async function getModel_FaceDetector() {
      const model = await faceDetection.createDetector(
        faceDetection.SupportedModels.MediaPipeFaceDetector,
        {
          runtime: 'tfjs', // or 'tfjs'
        },
      )
      await runFaceDetector(model)
    }

    async function getModel_FaceDetector_2() {
      const model = faceDetection.SupportedModels.MediaPipeFaceDetector
      const detectorConfig = {
        runtime: 'tfjs', // or 'tfjs'
      }
      const detector = await faceDetection.createDetector(model, detectorConfig)
      setDetector(detector)
    }

    async function getModel_FaceMesh() {
      const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh
      // FIXME: tfjs es para detectorModelUrl y landmarkModelUrl
      // FIXME: mediapipe es para solutionPath
      const detectorConfig = {
        runtime: 'tfjs', // 'mediapipe' or 'tfjs'
        solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh',

        // runtime: 'tfjs', // 'mediapipe' or 'tfjs'
        // detectorModelUrl?: string | io.IOHandler;
        // landmarkModelUrl?: string | io.IOHandler;
      }
      const detector = await faceLandmarksDetection.createDetector(model, detectorConfig)
      await runFaceDetector(detector)
    }

    async function getModel_FaceMesh_2() {
      const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh
      // FIXME función: getModel_FaceMesh
      const detectorConfig = {
        runtime: 'tfjs', // or 'tfjs'
        solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh',
      }
      const detector = await faceLandmarksDetection.createDetector(model, detectorConfig)
      setDetector(detector)
    }

    async function getModel_MoveNet() {
      const model = poseDetection.SupportedModels.MoveNet
      const detector = await poseDetection.createDetector(model)
      await runFaceDetector(detector)
    }

    async function getModel_MoveNet_2() {
      const model = poseDetection.SupportedModels.MoveNet
      const detector = await poseDetection.createDetector(model)
      setDetector(detector)
    }

    const init = async () => {
      console.log("ModelReviewObjectDetection -> INIT", { dataSet })
      switch (getNameDatasetByID_ObjectDetection(dataSet)) {
        case MODEL_UPLOAD: {
          // TODO
          break;
        }
        case MODEL_FACE_DETECTION: {
          if (isCameraEnable) {
            await getModel_FaceDetector()
          } else {
            await getModel_FaceDetector_2()
          }
          if (!isShowedAlert) {
            await alertSuccess("Modelo cargado con éxito")
            setIsShowedAlert(true)
          }
          break;
        }
        case MODEL_FACE_MESH: {
          if (isCameraEnable) {
            await getModel_FaceMesh()
          } else {
            await getModel_FaceMesh_2()
          }
          if (!isShowedAlert) {
            await alertSuccess("Modelo cargado con éxito")
            setIsShowedAlert(true)
          }
          break;
        }
        case MODEL_MOVE_NET: {
          if (isCameraEnable) {
            await getModel_MoveNet()
          } else {
            await getModel_MoveNet_2()
          }
          if (!isShowedAlert) {
            await alertSuccess("Modelo cargado con éxito")
            setIsShowedAlert(true)
          }
          break;
        }
      }
    }
    init()
      .catch(console.error)
  }, [isCameraEnable])

  const runFaceDetector = async (model) => {
    setInterval(() => {
      detect(model)
    }, 10)
  }

  const detect = async (model) => {
    if (
      typeof webcamRef.current !== 'undefined' &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
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
      if (dataSet === '3') {
        console.log("antes de la estimación")

        const pose = await model.estimatePoses(video)
        console.log(pose)
        // Get canvas context
        const ctx = canvasRef.current.getContext('2d')
        ctx.strokeStyle = '#FF0902'

        requestAnimationFrame(() => {
          let lineas = [
            [10, 8], [8, 6], [6, 12], [6, 5], [5, 11], [5, 7],
            [7, 9], [12, 11], [12, 14], [14, 16], [11, 13], [13, 15],
          ]
          lineas.forEach((index) => {
            ctx.beginPath()
            ctx.moveTo(
              pose[0].keypoints[index[0]].x,
              pose[0].keypoints[index[0]].y,
            )
            ctx.lineTo(
              pose[0].keypoints[index[1]].x,
              pose[0].keypoints[index[1]].y,
            )
            ctx.stroke()
          })
          pose.map((array) => {
            array.keypoints.forEach((element) => {
              ctx.beginPath()
              ctx.arc(element.x, element.y, 5, 0, (Math.PI / 180) * 360)
              ctx.stroke()
              // ctx.strokeRect(element.x, element.y, 10, 10)
            })
          })
        })
      }
      if (dataSet !== '3') {
        const face = await model.estimateFaces(video)
        console.log(face)
        // Get canvas context
        const ctx = canvasRef.current.getContext('2d')
        requestAnimationFrame(() => {
          face.map((array) => {
            // let box = array.box
            ctx.strokeStyle = '#FF0902'
            // ctx.strokeRect(box.xMin, box.yMin, box.width, box.height)
            array.keypoints.forEach((element) => {
              if (dataSet === 1) {
                ctx.strokeRect(element.x, element.y, 5, 5)
              }
              ctx.strokeRect(element.x, element.y, 1, 1)
            })
          })
        })
      }
    }
  }


  const func_animation = (ctx, pose) => {
    let lineas = [
      [10, 8], [8, 6], [6, 12], [6, 5], [5, 11], [5, 7],
      [7, 9], [12, 11], [12, 14], [14, 16], [11, 13], [13, 15]
    ]
    lineas.forEach((index) => {
      ctx.beginPath()
      ctx.moveTo(
        pose[0].keypoints[index[0]].x,
        pose[0].keypoints[index[0]].y,
      )
      ctx.lineTo(
        pose[0].keypoints[index[1]].x,
        pose[0].keypoints[index[1]].y,
      )
      ctx.stroke()
    })
    pose.map((array) => {
      array.keypoints.forEach((element) => {
        ctx.beginPath()
        ctx.arc(element.x, element.y, 5, 0, (Math.PI / 180) * 360)
        ctx.stroke()
        // ctx.strokeRect(element.x, element.y, 10, 10)
      })
    })
  }

  const handleVectorTest = async () => {
    if (ImageUploaded !== "IMAGE" && ImageUploaded !== "WEBCAM") {
      console.error("Debes subir una imagen o activar la webcam")
      return;
    }
    if (ImageUploaded === "IMAGE") {
      const canvas = document.getElementById('originalImage')
      const ctx1 = canvas.getContext('2d')

      const resultCanvas = document.getElementById('resultCanvas')
      const ctx2 = resultCanvas.getContext('2d')
      resultCanvas.height = canvas.height
      resultCanvas.width = canvas.width
      ctx2.drawImage(canvas, 0, 0)
      // console.log("TRANSFORMACIÓN A 64")
      const imgData = ctx1.getImageData(0, 0, canvas.height, canvas.width)

      switch (getNameDatasetByID_ObjectDetection(dataSet)) {
        case MODEL_MOVE_NET: {
          if (dataSet === '3') {
            const poses = await Detector.estimatePoses(imgData)

            console.log({ keypoints: poses[0].keypoints })
            ctx2.strokeStyle = '#FF0902'

            let key = poses[0].keypoints

            poses[0].keypoints.forEach((element) => {
              ctx2.beginPath()
              ctx2.arc(element.x, element.y, 5, 0, (Math.PI / 180) * 360)
              ctx2.stroke()
              // ctx2.strokeRect(element.x, element.y, 10, 10)
            })
            let lineas = [
              [10, 8], [8, 6], [6, 12], [6, 5], [5, 11], [5, 7],
              [7, 9], [12, 11], [12, 14], [14, 16], [11, 13], [13, 15],
            ]
            lineas.forEach((index) => {
              ctx2.beginPath()
              ctx2.moveTo(key[index[0]].x, key[index[0]].y)
              ctx2.lineTo(key[index[1]].x, key[index[1]].y)
              ctx2.stroke()
            })
          }
          break;
        }
        default: {
          if (dataSet !== '3') {
            const faces = await Detector.estimateFaces(imgData)

            console.log({ faces })
            ctx2.strokeStyle = '#FF0902'

            faces[0].keypoints.forEach((element) => {
              if (dataSet === '1') {
                ctx2.strokeRect(element.x, element.y, 10, 10)
              }
              ctx2.strokeRect(element.x, element.y, 1, 1)
            })
          }
          break
        }
      }



    } else if (
      typeof webcamRef.current !== 'undefined' &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
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

      // Make Detections
      // OLD MODEL
      //       const face = await net.estimateFaces(video);
      // NEW MODEL
      switch (getNameDatasetByID_ObjectDetection(dataSet)) {
        case MODEL_MOVE_NET: {
          let pose = await Detector.estimatePoses(video)
          const ctx = canvasRef.current.getContext('2d')
          console.log({ ctx, pose })

          requestAnimationFrame(() => {
            func_animation(ctx, pose)
          })
          break;
        }
        default: {
          if (dataSet !== '3') {
            const face = await Detector.estimateFaces(video)

            // Get canvas context
            const ctx = canvasRef.current.getContext('2d')

            requestAnimationFrame(() => {
              face.map((array) => {
                let box = array.box
                ctx.strokeStyle = '#FF0902'
                ctx.strokeRect(box.xMin, box.yMin, box.width, box.height)
                array.keypoints.forEach((element) => {
                  ctx.strokeRect(element.x, element.y, 10, 10)
                })
              })
            })
          }
        }
      }
    }

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
      setImageUploaded(true)
    }

    async function failed() {
      await alertError('Error al crear la imagen')
    }

    const img = new Image()
    img.onload = draw
    img.onerror = failed
    img.src = URL.createObjectURL(files[0])
  }

  const handleChangeCamera = () => {
    if (isCameraEnable) {
      setIsCameraEnable(false)
    } else {
      setIsCameraEnable(true)
    }
  }

  return (
    <Container id={"ModelReviewObjectDetection"}>
      {/*FIXME (Puede que se borre)*/}
      {/*<Row className={"mt-3"}>*/}
      {/*  <Col>*/}
      {/*    <Card>*/}
      {/*      <Card.Body>*/}
      {/*      </Card.Body>*/}
      {/*    </Card>*/}
      {/*  </Col>*/}
      {/*</Row>*/}

      <Row className={"mt-3"}>
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>{ModelList[2][dataSet]}</Card.Title>
              <Card.Subtitle className="mb-3 text-muted">Carga tu propio Modelo.</Card.Subtitle>
              {/*FIXME: change {=== '0'} by a validator*/}
              {dataSet === '0' ? (
                <>
                  <Card.Text>
                    Ten en cuenta que tienes que subir primero el archivo .json y después el fichero .bin
                  </Card.Text>
                  {/*https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types*/}
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
              <Card.Title>Resultado</Card.Title>
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

              <Container fluid={true}>
                {isCameraEnable ? (
                  <>
                    <Row className={"mt-3"}>
                      <Col>
                        <Webcam ref={webcamRef}
                                style={{
                                  marginLeft: 'auto',
                                  marginRight: 'auto',
                                  left: 0,
                                  right: 0,
                                  textAlign: 'center',
                                  zIndex: 9,
                                  width: '100%',
                                  height: '100%',
                                }}/>
                        <canvas ref={canvasRef}
                                style={{
                                  position: 'absolute',
                                  marginLeft: 'auto',
                                  marginRight: 'auto',
                                  textAlign: 'center',
                                  left: 0,
                                  zIndex: 10,
                                  width: '100%',
                                  height: '100%'
                                }}></canvas>
                      </Col>
                    </Row>
                  </>
                ) : (
                  <>
                    <Row className={"mt-3"}>
                      <Col>
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
                    <Row className={"mt-3"}>
                      <Col>
                        <canvas id="originalImage"></canvas>
                        <canvas id="imageCanvas"></canvas>
                      </Col>
                      <Col>
                        <canvas id="resultCanvas"></canvas>
                      </Col>
                    </Row>
                  </>
                )}
              </Container>

              {/* SUBMIT BUTTON */}
              {(!isCameraEnable) ? (
                <div className="d-grid gap-2">
                  <Button type="button"
                          onClick={handleVectorTest}
                          variant="primary">
                    Ver resultado
                  </Button>
                </div>
              ) : ('')}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}
