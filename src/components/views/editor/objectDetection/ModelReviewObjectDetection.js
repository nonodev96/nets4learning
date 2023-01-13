import React, { useState, useEffect, useRef } from 'react'
import { Col, Row, Form } from 'react-bootstrap'
import Webcam from 'react-webcam'
import * as faceDetection from '@tensorflow-models/face-detection'
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection'
import * as poseDetection from '@tensorflow-models/pose-detection'
import { dataSetList, dataSetDescription } from '../../uploadArcitectureMenu/UploadArchitectureMenu'
import { ModelList } from '../../uploadModelMenu/UploadModelMenu'
import { alertSuccess, alertError } from '../../../../utils/alertHelper'


export default function ModelReviewObjectDetection(props) {
  const { dataSet } = props

  const [ImageUploaded, setImageUploaded] = useState()
  const [Detector, setDetector] = useState()
  const [Model, setModel] = useState()
  const [Camera, setCamera] = useState(false)
  const [ShowedAlert, setShowedAlert] = useState(false)
  const canvasRef = useRef(null)
  const webcamRef = useRef(null)


  useEffect(() => {
    async function getModel() {
      const model = faceDetection.SupportedModels.MediaPipeFaceDetector
      const detectorConfig = {
        runtime: 'tfjs', // or 'tfjs'
      }
      const detector = await faceDetection.createDetector(model, detectorConfig)
      setDetector(detector)
      console.log(Detector)
    }

    async function getModel0() {
      const model = await faceDetection.createDetector(
        faceDetection.SupportedModels.MediaPipeFaceDetector,
        {
          runtime: 'tfjs', // or 'tfjs'
        },
      )
      await runFaceDetector(model)
    }

    async function getModel2() {
      const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh
      // FIXME
      const detectorConfig = {
        runtime: 'tfjs', // or 'tfjs'
        solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh',
      }
      const detector = await faceLandmarksDetection.createDetector(model, detectorConfig)
      await runFaceDetector(detector)
    }

    async function getModel2b() {
      const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh
      // FIXME
      const detectorConfig = {
        runtime: 'tfjs', // or 'tfjs'
        solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh',
      }
      const detector = await faceLandmarksDetection.createDetector(model, detectorConfig)
      setDetector(detector)
    }

    async function getModel3() {
      const model = poseDetection.SupportedModels.MoveNet
      const detector = await poseDetection.createDetector(model)
      await runFaceDetector(detector)
    }

    async function getModel3b() {
      const model = poseDetection.SupportedModels.MoveNet
      const detector = await poseDetection.createDetector(model)
      setDetector(detector)
    }

    const init = async () => {
      if (dataSet === 1) {
        if (Camera) {
          await getModel0()
        } else {
          await getModel()
        }
        if (!ShowedAlert) {
          await alertSuccess("Modelo cargado con éxito")
          setShowedAlert(true)
        }
      } else if (dataSet === 2) {
        if (Camera) {
          await getModel2()
        } else {
          await getModel2b()
        }
        if (!ShowedAlert) {
          await alertSuccess("Modelo cargado con éxito")
          setShowedAlert(true)
        }
      } else if (dataSet === 3) {
        if (Camera) {
          await getModel3()
        } else {
          await getModel3b()
        }
        if (!ShowedAlert) {
          await alertSuccess("Modelo cargado con éxito")
          setShowedAlert(true)
        }
      } else {
        console.error('NO ENTRAMOS')
        console.trace();
      }
    }

    init()
      .catch(console.error)
  }, [Camera])

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
      if (dataSet === 3) {
        console.log("antes de la estimación")

        const pose = await model.estimatePoses(video)
        console.log(pose)
        // Get canvas context
        const ctx = canvasRef.current.getContext('2d')
        ctx.strokeStyle = '#FF0902'

        requestAnimationFrame(() => {
          let lineas = [
            [10, 8],
            [8, 6],
            [6, 12],
            [6, 5],
            [5, 11],
            [5, 7],
            [7, 9],
            [12, 11],
            [12, 14],
            [14, 16],
            [11, 13],
            [13, 15],
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
      if (dataSet !== 3) {
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

  const handleVectorTest = async () => {
    if (ImageUploaded) {
      const canvas = document.getElementById('originalImage')
      const ctx1 = canvas.getContext('2d')

      const resultCanvas = document.getElementById('resultCanvas')
      const ctx2 = resultCanvas.getContext('2d')
      resultCanvas.height = canvas.height
      resultCanvas.width = canvas.width
      ctx2.drawImage(canvas, 0, 0)
      // console.log("TRANSFORMACIÓN A 64")
      const imgData = ctx1.getImageData(0, 0, canvas.height, canvas.width)

      if (dataSet !== 3) {
        const faces = await Detector.estimateFaces(imgData)

        console.log(faces)
        ctx2.strokeStyle = '#FF0902'

        faces[0].keypoints.forEach((element) => {
          if (dataSet === 1) {
            ctx2.strokeRect(element.x, element.y, 10, 10)
          }
          ctx2.strokeRect(element.x, element.y, 1, 1)
        })
      }

      if (dataSet === 3) {
        const poses = await Detector.estimatePoses(imgData)

        console.log(poses[0].keypoints)
        ctx2.strokeStyle = '#FF0902'

        let key = poses[0].keypoints

        poses[0].keypoints.forEach((element) => {
          ctx2.beginPath()
          ctx2.arc(element.x, element.y, 5, 0, (Math.PI / 180) * 360)
          ctx2.stroke()
          // ctx2.strokeRect(element.x, element.y, 10, 10)
        })
        let lineas = [
          [10, 8],
          [8, 6],
          [6, 12],
          [6, 5],
          [5, 11],
          [5, 7],
          [7, 9],
          [12, 11],
          [12, 14],
          [14, 16],
          [11, 13],
          [13, 15],
        ]
        lineas.forEach((index) => {
          ctx2.beginPath()
          ctx2.moveTo(key[index[0]].x, key[index[0]].y)
          ctx2.lineTo(key[index[1]].x, key[index[1]].y)
          ctx2.stroke()
        })
      }
    } else {
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
        console.log('HEMOS OBTENIDO LOS TAMAÑOS')
        // Make Detections
        // OLD MODEL
        //       const face = await net.estimateFaces(video);
        // NEW MODEL
        if (dataSet !== 3) {
          const face = await Detector.estimateFaces(video)
          console.log(face)

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
        if (dataSet === 3) {
          const pose = await Detector.estimatePoses(video)
          console.log(pose)

          // Get canvas context
          const ctx = canvasRef.current.getContext('2d')

          requestAnimationFrame(() => {
            let lineas = [
              [10, 8],
              [8, 6],
              [6, 12],
              [6, 5],
              [5, 11],
              [5, 7],
              [7, 9],
              [12, 11],
              [12, 14],
              [14, 16],
              [11, 13],
              [13, 15],
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
      }
      // alert('Primero debes de subir una imagen')
    }
  }

  const handleChangeFileUpload = async (e) => {
    let tgt = e.target || window.event.srcElement
    let files = tgt.files

    const canvas = document.getElementById('originalImage')
    const ctx = canvas.getContext('2d')

    const canvas2 = document.getElementById('imageCanvas')
    const ctx2 = canvas.getContext('2d')

    function draw() {
      canvas.width = 500
      canvas.height = 500

      console.log(
        this.height,
        this.width,
        this.height / this.width,
        this.width * 0.75,
      )
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

    function failed() {
      alertError('Error al cargar el fichero')
    }

    const img = new Image()
    img.onload = draw
    img.onerror = failed
    img.src = URL.createObjectURL(files[0])
  }

  const handleChangeCamera = () => {
    if (Camera) {
      setCamera(false)
    } else {
      setCamera(true)
    }
  }

  return (
    <div className="container">
      <div className="container">
        <h2>{ModelList[2][dataSet]}</h2>
      </div>
      <Col className="col-specific cen">
        <div className="container-fluid container-fluid-w1900">
          {dataSet === 0 ? (
            <div className="header-model-editor">
              <p>
                Carga tu propio Modelo. Ten en cuenta que tienes que subir
                primero el archivo .json y despues el fichero .bin{' '}
              </p>
              <input id="json-upload"
                     style={{ marginLeft: '1rem' }}
                     type="file"
                     name="json"
                     accept=".json"></input>
              <input id="weights-upload"
                     style={{ marginLeft: '1rem' }}
                     type="file"
                     accept=".bin"
                     name="bin"></input>
            </div>
          ) : (
            <div className="header-model-editor">
              {dataSetDescription[2][dataSet]}
            </div>
          )}

          <div className="container xtraPane borde">
            <Form>
              <div key={`default-checkbox`} className="mb-3">
                <Form.Check type="checkbox"
                            id={`default-checkbox`}
                            label={`Usar webcam`}
                            value={Camera}
                            onChange={handleChangeCamera}/>
              </div>
            </Form>
            <div className="title-pane">Resultado</div>
            {/* <input type="checkbox" onChange={handleChangeCamera}>
              Cámara activa
            </input> */}
            {/* VECTOR TEST */}
            {/* <Form.Group className="mb-3" controlId={'formTestInput'}>
              <Form.Label>Introduce el vector a probar</Form.Label>
              <Form.Control
                placeholder="Introduce el vector a probar"
                onChange={() => handleChangeTestInput()}
              />
            </Form.Group> */}

            <div className="">
              {Camera ? (
                <div style={{ position: 'relative' }}>
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
                </div>
              ) : (
                <div>
                  <input type="file"
                         style={{
                           marginBottom: '2rem',
                           maxWidth: '100%'
                         }}
                         name="doc"
                         onChange={handleChangeFileUpload}></input>
                  <Row>
                    <Col>
                      <canvas id="originalImage"></canvas>
                      <canvas id="imageCanvas"></canvas>
                    </Col>
                    <Col>
                      <canvas id="resultCanvas"></canvas>
                    </Col>
                  </Row>
                </div>
              )}
            </div>

            {/* SUBMIT BUTTON */}
            {!Camera ? (
              <button style={{ marginTop: '2rem' }}
                      className="btn-add-layer"
                      type="button"
                      onClick={handleVectorTest}
                      variant="primary">
                Ver resultado
              </button>
            ) : ('')}
          </div>
        </div>
      </Col>
    </div>
  )
}
