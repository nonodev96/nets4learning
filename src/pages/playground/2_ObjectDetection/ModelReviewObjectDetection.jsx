import 'bootstrap/dist/css/bootstrap.min.css'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Card, Col, Container, Form, Row } from 'react-bootstrap'
import Webcam from 'react-webcam'
import { Trans, useTranslation } from 'react-i18next'
import * as tfjs from '@tensorflow/tfjs'
import ReactGA from 'react-ga4'

import { VERBOSE } from '@/CONSTANTS'
import alertHelper from '@utils/alertHelper'
import DragAndDrop from '@components/dragAndDrop/DragAndDrop'
import { UPLOAD } from '@/DATA_MODEL'
import { MAP_OD_CLASSES } from '@pages/playground/2_ObjectDetection/models'
import I_MODEL_OBJECT_DETECTION from './models/_model'
import FakeProgressBar from '@components/loading/FakeProgressBar';

tfjs
  .setBackend('webgl')
  .then(() => undefined)

export default function ModelReviewObjectDetection ({ dataset }) {

  const isWebView = navigator.userAgent.toLowerCase().indexOf('wv') !== -1

  const { t } = useTranslation()
  const history = useHistory()

  const [isLoading, setLoading] = useState(true)
  const [isCameraEnable, setCameraEnable] = useState(false)
  const [cameraPermission, setCameraPermission] = useState(/**@type {'denied' | 'granted' | 'prompt'} */'prompt')
  const [isProcessedImage, setIsProcessedImage] = useState(false)

  const [deviceId, setDeviceId] = useState('default')
  const [devices, setDevices] = useState([])

  const iModelRef = useRef(new I_MODEL_OBJECT_DETECTION(t))

  const [ratioCamera, setRatioCamera] = useState('ratio-16x9')
  const requestAnimation_ref = useRef()
  const WebCamContainer_ref = useRef(/** @type HTMLDivElement */null)
  const WebCam_ref = useRef(null)
  const canvas_ref = useRef(/** @type HTMLCanvasElement */null)
  const CanvasTemp_ref = useRef(/** @type HTMLCanvasElement */null)

  useEffect(() => {
    ReactGA.send({ hitType: 'pageview', page: '/ModelReviewObjectDetection/' + dataset, title: dataset })
  }, [dataset])

  const handleDevices = useCallback(async () => {
    if (VERBOSE) console.debug('useCallback[handleDevices]')
    if (!navigator?.mediaDevices?.getUserMedia) {
      console.log('not support navigator?.mediaDevices?.getUserMedia')
      return
    }
    if (!navigator?.mediaDevices?.enumerateDevices) {
      console.log('not support navigator?.mediaDevices?.enumerateDevices')
      return
    }
    const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
    mediaStream.getTracks().forEach((track) => {
      track.stop()
    })
    const mediaDevices = await navigator.mediaDevices.enumerateDevices()
    setDevices(mediaDevices.filter(({ kind }) => kind === 'videoinput'))
  }, [setDevices])

  useEffect(() => {
    if (VERBOSE) console.debug('useEffect[]')

    async function checkCameraPermission () {
      if (isWebView) {
        await handleDevices()
      }
      if (!navigator?.permissions?.query) {
        console.error('navigator.permissions.query | not supported.')
        return
      }
      const permission = await navigator.permissions.query({ name: 'camera' })
      setCameraPermission(permission.state)

      if (permission.state === 'prompt' || permission.state === 'denied') {
        setDevices([])
      }
      if (permission.state === 'granted') {
        await handleDevices()
      }
      permission.onchange = async (ev) => {
        console.log(`permission state has changed to ${permission.state}`, { ev: ev })
        setCameraPermission(permission.state)

        if (permission.state === 'granted') {
          setDeviceId('default')
          await handleDevices()
        }
        if (permission.state === 'prompt' || permission.state === 'denied') {
          setDeviceId('default')
          setDevices([])
          setCameraEnable(false)
        }
      }
    }

    checkCameraPermission().then(() => undefined)
  }, [isWebView, handleDevices])

  useEffect(() => {
    if (VERBOSE) console.debug('useEffect[dataset, t]')

    async function init () {
      await tfjs.ready()
      if (tfjs.getBackend() !== 'webgl') {
        console.error('Error tensorflow backend webgl not installed in your browser')
        return
      }
      try {
        if (dataset === UPLOAD) {
          console.error('Error, data set not valid')
        } else if (dataset in MAP_OD_CLASSES) {
          const _iModelClass = MAP_OD_CLASSES[dataset]
          iModelRef.current = new _iModelClass(t)
          await iModelRef.current.ENABLE_MODEL()
          setLoading(false)
          await alertHelper.alertSuccess(t('model-loaded-successfully'))
        } else {
          console.error('Error, option not valid', { ID: dataset })
          history.push('/404');
        }
      } catch (error) {
        console.error('Error', error)
      }
    }

    init().then(() => undefined)

    return () => {
    }
  }, [dataset, t, history])

  useEffect(() => {
    if (VERBOSE) console.debug('useEffect[isCameraEnable]', { isCameraEnable })
    if (isCameraEnable === false) {
      console.debug(`stop AnimationFrame(${requestAnimation_ref.current});`)
      cancelAnimationFrame(requestAnimation_ref.current)
    }
    try {
      let fps = 20
      let fpsInterval, now, then, elapsed
      // let startTime

      const animate = async () => {
        if (isCameraEnable) {
          requestAnimation_ref.current = requestAnimationFrame(animate)
          now = Date.now()
          elapsed = now - then
          if (elapsed > fpsInterval) {
            then = now - (elapsed % fpsInterval)
            const _processWebcam = processWebcam()
            if (_processWebcam !== null) await processData(_processWebcam.ctx, _processWebcam.video)
          }
        }
      }

      // Comienza la animación al cargar el componente
      const startAnimating = (fps) => {
        fpsInterval = 1000 / fps
        then = Date.now()
        // startTime = then
        animate()
          .then(() => {
            console.debug('start animation')
          })
      }
      startAnimating(fps)
    } catch (error) {
      console.error(error)
      console.debug(`catch cancelAnimationFrame(${requestAnimation_ref.current});`)
      cancelAnimationFrame(requestAnimation_ref.current)
    }
    // Limpia la animación cuando el componente se desmonta
    return () => {
      console.log(`delete AnimationFrame(${requestAnimation_ref.current});`)
      cancelAnimationFrame(requestAnimation_ref.current)
    }
  }, [isCameraEnable])

  const processWebcam = () => {
    if (WebCam_ref.current === null || typeof WebCam_ref.current === 'undefined' || WebCam_ref.current.video.readyState !== 4) {
      return null
    }
    // Get Video Properties
    const video = WebCam_ref.current.video
    const videoWidth = WebCam_ref.current.video.videoWidth
    const videoHeight = WebCam_ref.current.video.videoHeight

    // const w = WebCamContainer_ref.current.clientWidth
    // const h = WebCamContainer_ref.current.clientHeight


    // const videoD = videoDimensions(video)
    // console.log(videoD)

    // Set video width
    // WebCam_ref.current.video.width = videoD.width
    // WebCam_ref.current.video.height = videoD.height

    // Set canvas width
    canvas_ref.current.width = videoWidth
    canvas_ref.current.height = videoHeight

    // const canvas_temp = CanvasTemp_ref.current
    // canvas_temp.getContext('2d').drawImage(video, 0, 0, videoWidth, videoHeight)

    const ctx = canvas_ref.current.getContext('2d')
    ctx.clearRect(0, 0, canvas_ref.current.width, canvas_ref.current.height)

    return { ctx, video }
  }

  const processData = async (ctx, img_or_video) => {
    const predictions = await iModelRef.current.PREDICTION(img_or_video)
    iModelRef.current.RENDER(ctx, predictions)
  }

  const handleChange_Camera = (e) => {
    const webcamChecked = e.target.checked
    setCameraEnable(!!webcamChecked)
  }

  const handleChange_Device = (e) => {
    const _deviceId = e.target.value
    setDeviceId(_deviceId)
  }

  const onUserMediaEvent = (mediaStream) => {
    console.debug({ mediaStream, s: mediaStream.getVideoTracks()[0].getSettings() })
    const aspectRatio = mediaStream.getVideoTracks()[0].getSettings().aspectRatio
    if (aspectRatio < 1) {
      setRatioCamera('ratio-3x4');
    } else if (aspectRatio === 1) {
      setRatioCamera('ratio-1x1');
    } else if (aspectRatio >= 1.33 && aspectRatio < 1.75) {
      // setRatioCamera('ratio-4x3');
      // } else if (aspectRatio >= 1.5 && aspectRatio < 1.75) {
      setRatioCamera('ratio-16x9');
    } else {
      setRatioCamera('ratio-1x1');
    }
    // mediaStream.scale(-1, 1)
  }

  const onUserMediaErrorEvent = (error) => {
    console.error({ error })
    // cancelAnimationFrame(animation_id)
  }

  const handleChangeFileUpload = async (_files) => {
    if (VERBOSE) console.debug('ModelReviewObjectDetection -> handleChangeFileUpload', { _files })
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

    async function draw () {
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
      console.error('Error, not created the image')
    }

    const img = new Image()
    img.src = URL.createObjectURL(files[0])
    img.onload = draw
    img.onerror = failed
  }

  const disabledPermissionsCamera = () => {
    if (isWebView) {
      const permissionsInWebview = (devices.length > 0)
      return isLoading || isCameraEnable || (!permissionsInWebview)
    }
    if (!isWebView) {
      return isLoading || isCameraEnable || (cameraPermission === 'denied' || cameraPermission === 'prompt')
    }
    return isLoading || isCameraEnable || isWebView;
  }

  if (VERBOSE) console.debug('render ModelReviewObjectDetection')
  return <>
    <Container id={'ModelReviewObjectDetection'} data-testid={'Test-ModelReviewObjectDetection'}>
      <Row className={'mt-2'}>
        <Col>
          <h1><Trans i18nKey={'modality.2'} /></h1>
        </Col>
      </Row>

      <Row>
        <Col>
          <FakeProgressBar isLoading={isLoading} />
        </Col>
      </Row>

      <Row>
        <Col xs={12} sm={12} md={12} xl={3} xxl={3}>
          <Card className={'sticky-top mt-3 mb-3 border-info'}>
            <Card.Header className={'d-flex align-items-center justify-content-between'}>
              <h2><Trans i18nKey={iModelRef.current.TITLE} /></h2>
              {/*{process.env.REACT_APP_SHOW_NEW_FEATURE === 'true' &&*/}
              {/*  <div className="d-flex">*/}
              {/*    <Button size={'sm'}*/}
              {/*            variant={'outline-info'}*/}
              {/*            onClick={handleClick_openSummary}>Summary</Button>*/}
              {/*  </div>*/}
              {/*}*/}
            </Card.Header>
            <Card.Body>
              {dataset !== UPLOAD && <>{iModelRef.current.DESCRIPTION()}</>}
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
                                  checked={isCameraEnable}
                                  disabled={isLoading || cameraPermission === 'denied'}
                                  onChange={(e) => handleChange_Camera(e)}
                      />
                    </div>
                    <Form.Group controlId={'select-device'} className={'ms-3 w-50'}>
                      <Form.Select aria-label={'select-device'}
                                   size={'sm'}
                                   value={deviceId}
                                   disabled={disabledPermissionsCamera()}
                                   onChange={(e) => handleChange_Device(e)}>
                        {isWebView && <>
                          <option value={'default'} disabled><Trans i18nKey={'Default Android permissions'} /></option>
                        </>}
                        {!isWebView && <>
                          {(cameraPermission === 'granted') &&
                            <option value={'default'} disabled><Trans i18nKey={'Default'} /></option>
                          }
                          {(cameraPermission === 'prompt' || cameraPermission === 'denied') &&
                            <option value={'default'} disabled><Trans i18nKey={'Need permissions'} /></option>}
                        </>}
                        {devices.map((device, index) => {
                          return <option key={'device-id-' + index} value={device.deviceId}>
                            {device.label !== '' ? device.label : 'Camera ' + index}
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
                  <Col>
                    {isCameraEnable && <>
                      <div id={'webcamContainer'}
                           ref={WebCamContainer_ref}
                           className={'ratio ' + ratioCamera}
                           style={{
                             position: 'relative',
                             overflow: 'hidden',
                             // paddingBottom: '56.25%'
                           }}>
                        <Webcam ref={WebCam_ref}
                                onUserMedia={onUserMediaEvent}
                                onUserMediaError={onUserMediaErrorEvent}
                                videoConstraints={{
                                  deviceId: deviceId
                                }}
                                mirrored={false}
                                style={{
                                  position: 'absolute',
                                  width   : '100%',
                                  height  : '100%',
                                }}
                        />
                        <canvas ref={canvas_ref}
                                style={{
                                  objectFit: 'contain',
                                  position : 'absolute',
                                  width    : '100%',
                                  height   : '100%',
                                }}></canvas>
                        <canvas ref={CanvasTemp_ref}></canvas>
                      </div>
                    </>}
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
                                     'image/png': ['.png'], 'image/jpg': ['.jpg'],
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

