import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Card, Col, Container, Form, ProgressBar, Row } from 'react-bootstrap'
import Webcam from 'react-webcam'
import { Trans, useTranslation } from 'react-i18next'
import * as tfjs from '@tensorflow/tfjs'
import ReactGA from 'react-ga4'

import { VERBOSE } from '@/CONSTANTS'
import alertHelper from '@utils/alertHelper'
import DragAndDrop from '@components/dragAndDrop/DragAndDrop'
import { LIST_MODELS_OBJECT_DETECTION, UPLOAD } from '@/DATA_MODEL'
import I_MODEL_OBJECT_DETECTION from './models/_model'
import { MAP_OD_CLASSES } from '@pages/playground/2_ObjectDetection/models'

tfjs.setBackend('webgl').then((r) => {
  console.log('setBackend', { r })
})

export default function ModelReviewObjectDetection (props) {
  const dataset = props.dataset

  const { t } = useTranslation()

  const [isLoading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [isCameraEnable, setCameraEnable] = useState(false)
  const [isProcessedImage, setIsProcessedImage] = useState(false)

  const [deviceId, setDeviceId] = useState('default')
  const [devices, setDevices] = useState([])

  const [iModel, setIModel] = useState(new I_MODEL_OBJECT_DETECTION(t))

  const requestRef = useRef()
  const webcamRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    ReactGA.send({ hitType: 'pageview', page: '/ModelReviewObjectDetection/' + dataset, title: dataset })
  }, [dataset])

  useEffect(() => {
    console.log('useEffect [progress]')
    const interval = setInterval(() => {
      if (progress < 90) {
        setProgress(progress + 1)
      } else {
        clearInterval(interval)
      }
    }, 10)
    return () => clearInterval(interval)
  }, [progress])

  useEffect(() => {
    console.log('useEffect [dataset]')

    async function init () {
      const isValid = LIST_MODELS_OBJECT_DETECTION.some((e) => e === dataset)
      if (!isValid) {
        await alertHelper.alertError('Error in selection of model')
        return
      }

      if (dataset === UPLOAD) {
        console.error('Error, data set not valid')
      }

      if (MAP_OD_CLASSES.hasOwnProperty(dataset)) {
        const _iModelClass = MAP_OD_CLASSES[dataset]
        const _iModelInstance = new _iModelClass(t)
        setIModel(_iModelInstance)

        try {
          await tfjs.ready()
          console.log('ready', {
            kernel        : tfjs.getKernel(),
            backend       : tfjs.getBackend(),
            kernel_backend: tfjs.getKernelsForBackend(),
          })
          if (tfjs.getBackend() !== 'webgl') {
            await alertHelper.alertError('Backend of tensorflow not installed')
            return
          }

          await _iModelInstance.ENABLE_MODEL()
          setLoading(false)
          setProgress(100)
          await alertHelper.alertSuccess(t('model-loaded-successfully'))
        } catch (error) {
          console.error('Error initializing TensorFlow', error)
        }
      }
    }

    init().then((r) => {
      console.log('endInit')
    })

    return () => {}
  }, [dataset, t])

  const processWebcam = () => {
    if (webcamRef.current === null
      || typeof webcamRef.current === 'undefined'
      || webcamRef.current.video.readyState !== 4) {
      return null
    }
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

    const ctx = canvasRef.current.getContext('2d')

    return { video, ctx }
  }

  const processData = async (ctx, img_or_video) => {
    if (dataset === UPLOAD) {
      console.error('Error, option not valid')
      return
    }
    const predictions = await iModel.PREDICTION(img_or_video)
    iModel.RENDER(ctx, predictions)
  }

  useEffect(() => {
    console.log('useEffect[isCameraEnable]', { isCameraEnable })
    if (isCameraEnable === false) {
      console.log(`stop AnimationFrame(${requestRef.current});`)
      cancelAnimationFrame(requestRef.current)
    }
    try {
      let fps = 20
      let fpsInterval, now, then, elapsed
      // let startTime

      const animate = async () => {
        if (isCameraEnable) {
          requestRef.current = requestAnimationFrame(animate)
          now = Date.now()
          elapsed = now - then
          if (elapsed > fpsInterval) {
            then = now - (elapsed % fpsInterval)
            // Put your drawing code here
            const _processWebcam = processWebcam()
            if (_processWebcam !== null) await processData(_processWebcam.ctx, _processWebcam.video)

            // end
            // TESTING...Report #seconds since start and achieved fps.
            // let sinceStart = now - startTime
            // let currentFps = Math.round(1000 / (sinceStart / ++frameCount) * 100) / 100
            // console.debug('Elapsed time= ' + Math.round(sinceStart / 1000 * 100) / 100 + ' secs @ ' + currentFps + ' fps.')
          }
        }
      }

      // Comienza la animación al cargar el componente
      const startAnimating = (fps) => {
        fpsInterval = 1000 / fps
        then = Date.now()
        // startTime = then
        animate().then(r => {
          console.log('start animation')
        })
      }
      startAnimating(fps)
    } catch (e) {
      console.log(`catch cancelAnimationFrame(${requestRef.current});`)
      cancelAnimationFrame(requestRef.current)
    }
    // Limpia la animación cuando el componente se desmonta
    return () => {
      console.log(`delete AnimationFrame(${requestRef.current});`)
      cancelAnimationFrame(requestRef.current)
    }
  }, [isCameraEnable])

  const handleDevices = useCallback((mediaDevices) => {
    console.log('useCallback[handleDevices]')
    setDevices(mediaDevices.filter(({ kind }) => kind === 'videoinput'))
  }, [setDevices])

  useEffect(() => {
    console.log('useEffect[handleDevices]')
    if (!navigator.mediaDevices?.enumerateDevices) {
      console.error('enumerateDevices() not supported.')
    } else {
      navigator.mediaDevices.enumerateDevices().then(handleDevices)
    }
  }, [handleDevices])

  const handleChange_Camera = (e) => {
    console.log('handleChange_Camera')
    const webcamChecked = e.target.checked
    setCameraEnable(!!webcamChecked)
  }

  const handleChange_Device = (e) => {
    const _deviceId = e.target.value
    setDeviceId(_deviceId)
  }

  const onUserMediaEvent = (mediaStream) => {
    console.log({ mediaStream })
    // mediaStream.scale(-1, 1)
  }

  const onUserMediaErrorEvent = (error) => {
    console.log({ error })
    // cancelAnimationFrame(animation_id)
  }

  const handleChangeFileUpload = async (_files) => {
    // let tgt = e.target || window.event.srcElement
    console.log('ModelReviewObjectDetection -> handleChangeFileUpload', { _files })
    let files = _files

    const originalImageCanvas = document.getElementById('originalImageCanvas')
    const originalImageCanvas_ctx = originalImageCanvas.getContext('2d')

    const processImageCanvas = document.getElementById('processImageCanvas')
    const processImageCanvas_ctx = processImageCanvas.getContext('2d')

    const resultCanvas = document.getElementById('resultCanvas')
    const resultCanvas_ctx = resultCanvas.getContext('2d')
    const container_w = document.getElementById('container-canvas').getBoundingClientRect().width

    let designer_width = container_w * 0.75
    let designer_height = container_w * 0.50

    async function draw (_event) {
      const original_ratio = this.width / this.height
      let designer_ratio = designer_width / designer_height

      if (original_ratio > designer_ratio) {
        designer_height = designer_width / original_ratio
      } else {
        designer_width = designer_height * original_ratio
      }

      this.width = designer_width
      this.height = designer_height
      originalImageCanvas.width = this.width
      originalImageCanvas.height = this.height
      processImageCanvas.width = this.width
      processImageCanvas.height = this.height
      resultCanvas.width = this.width
      resultCanvas.height = this.height

      originalImageCanvas_ctx.drawImage(this, 0, 0, originalImageCanvas.width, originalImageCanvas.height)
      const imgData = originalImageCanvas_ctx.getImageData(0, 0, originalImageCanvas.height, originalImageCanvas.width)
      await processData(processImageCanvas_ctx, imgData)
      resultCanvas_ctx.drawImage(this, 0, 0, originalImageCanvas.width, originalImageCanvas.height)
      await processData(resultCanvas_ctx, imgData)
      setIsProcessedImage(true)
    }

    function failed () {
      console.error('Error al crear la imagen')
    }

    const img = new Image()
    img.src = URL.createObjectURL(files[0])
    img.onload = draw
    img.onerror = failed
  }

  if (VERBOSE) console.debug('render ModelReviewObjectDetection')
  return <>
    <Container>
      <Row className={'mt-2'}>
        <Col xl={12}>
          <div className="d-flex justify-content-between">
            <h1><Trans i18nKey={'modality.2'} /></h1>
          </div>
        </Col>
      </Row>
    </Container>

    <Container id={'ModelReviewObjectDetection'} data-testid={'Test-ModelReviewObjectDetection'}>
      <Row>
        <Col>
          {isLoading &&
            <ProgressBar label={progress < 100 ? t('downloading') : t('downloaded')}
                         striped={true}
                         animated={true}
                         now={progress} />}
        </Col>
      </Row>
      <Row>
        <Col xs={12} sm={12} md={12} xl={3} xxl={3}>
          <Card className={'sticky-top mt-3 mb-3 border-info'}>
            <Card.Body>
              <Card.Title>
                <Trans i18nKey={iModel.TITLE} />
              </Card.Title>
              {dataset !== UPLOAD && <>{iModel.DESCRIPTION()}</>}
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} sm={12} md={12} xl={9} xxl={9}>
          <Col xs={12} sm={12} md={12} xl={12} xxl={12}>
            <Card className={'mt-3'}>
              <Card.Header>
                <div className="d-flex align-items-center justify-content-between">
                  <h3><Trans i18nKey={'datasets-models.2-object-detection.interface.process-webcam.title'} /></h3>
                  <div className={'d-flex align-items-center justify-content-end'}>
                    <div key={'default-switch'}>
                      <Form.Check type="switch"
                                  id={'default-switch'}
                                  reverse={true}
                                  size={'sm'}
                                  name={'switch-webcam'}
                                  label={t('datasets-models.2-object-detection.interface.process-webcam.button')}
                                  defaultValue={isCameraEnable}
                                  onChange={(e) => handleChange_Camera(e)}
                      />
                    </div>
                    <Form.Group controlId={'select-device'} className={'ms-3 w-50'}>
                      <Form.Select aria-label={'select-device'}
                                   size={'sm'}
                                   value={deviceId}
                                   disabled={isCameraEnable}
                                   onChange={(e) => handleChange_Device(e)}>
                        <option value={'default'} disabled>Default</option>
                        {devices.map((device, index) => {
                          return <option key={'device-id-' + index}
                                         value={device.deviceId}>
                            {device.label}
                          </option>
                        })}
                      </Form.Select>
                    </Form.Group>
                  </div>
                </div>
              </Card.Header>
              <Card.Body>
                <Card.Title className={'text-center'}>
                  <Trans i18nKey={'datasets-models.2-object-detection.interface.process-webcam.sub-title'} />
                </Card.Title>
                <Row className={'mt-3'}>
                  <Col className={'d-flex justify-content-center'}>
                    {isCameraEnable && (
                      <div id={'webcamContainer'}
                           className={'nets4-border-1'}
                           style={{
                             position: 'relative',
                             overflow: 'hidden',
                           }}>
                        <Webcam ref={webcamRef}
                                onUserMedia={onUserMediaEvent}
                                onUserMediaError={onUserMediaErrorEvent}
                                videoConstraints={{
                                  facingMode: 'environment',
                                  deviceId  : deviceId,
                                }}

                                mirrored={false}
                                width={250}
                                height={250}
                                style={{
                                  position: 'relative',
                                  display : 'block',
                                }}
                        />
                        <canvas ref={canvasRef}
                                width={250}
                                height={250}
                                style={{
                                  position: 'absolute',
                                  display : 'block',
                                  left    : 0,
                                  top     : 0,
                                  zIndex  : 10,
                                }}></canvas>
                      </div>
                    )}
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer>
                <details>
                  <summary>Device info</summary>
                  <ol>
                    {devices.map((device, index) => {
                      return <li key={index}>{device.kind} | {device.label}</li>
                    })}
                  </ol>
                </details>
              </Card.Footer>
            </Card>
          </Col>

          <Col xs={12} sm={12} md={12} xl={12} xxl={12}>
            <Card className={'mt-3'}>
              <Card.Header>
                <h3><Trans i18nKey={'datasets-models.2-object-detection.interface.process-image.title'} /></h3>
              </Card.Header>
              <Card.Body>
                <Card.Title>
                  <Trans i18nKey={'datasets-models.2-object-detection.interface.process-image.sub-title'} />
                </Card.Title>
                <Container fluid={true} id={'container-canvas'}>
                  <Row className={'mt-3'}>
                    <Col>
                      <DragAndDrop name={'doc'}
                                   text={t('drag-and-drop.image')}
                                   labelFiles={t('drag-and-drop.label-files-one')}
                                   accept={{
                                     'image/png': ['.png'],
                                     'image/jpg': ['.jpg'],
                                   }}
                                   function_DropAccepted={handleChangeFileUpload}
                      />
                    </Col>
                  </Row>
                  <hr />
                  <Row className={'mt-3'} style={isProcessedImage ? {} : { display: 'none' }}>
                    <Col className={'col-12 d-flex justify-content-center'}>
                      <canvas id="originalImageCanvas"
                              className={'nets4-border-1 d-none'}
                              width={250}
                              height={250}></canvas>
                    </Col>
                    <Col className={'col-12 d-flex justify-content-center'}>
                      <canvas id="processImageCanvas"
                              className={'nets4-border-1 d-none'}
                              width={250}
                              height={250}></canvas>
                    </Col>
                    <Col className={'col-12 d-flex justify-content-center'}>
                      <canvas id="resultCanvas"
                              className={'nets4-border-1'}
                              width={250}
                              height={250}></canvas>
                    </Col>
                  </Row>
                </Container>
              </Card.Body>
            </Card>
          </Col>
        </Col>
      </Row>
    </Container>
  </>
}

