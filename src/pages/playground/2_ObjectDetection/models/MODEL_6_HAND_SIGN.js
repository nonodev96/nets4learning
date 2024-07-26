// import * as handpose from '@tensorflow-models/handpose'
import * as fp from 'fingerpose'
import * as handPoseDetection from '@tensorflow-models/hand-pose-detection'
import * as handsignMultiligual from 'handsign-multilingual'
import { Trans } from 'react-i18next'
import { Container, Row, Col } from 'react-bootstrap'
import I_MODEL_OBJECT_DETECTION from './_model'
import { HandSignInfo } from './MODEL_6_HAND_SIGN_HandSignInfo'
import { TFJS_handpose_bibtex } from './MODEL_6_HAND_SIGN_INFO'

export class MODEL_6_HAND_SIGN extends I_MODEL_OBJECT_DETECTION {
  static KEY = 'HAND-SIGN'
  TITLE = 'datasets-models.2-object-detection.hand-sign.title'
  i18n_TITLE = 'datasets-models.2-object-detection.hand-sign.title'
  URL = 'https://github.com/nonodev96/handsign-multilingual'
  mirror = true

  gestureEstimator = null
  FINGER_JOINTS = {
    thumb: [0, 1, 2, 3, 4],
    index: [0, 5, 6, 7, 8],
    mid  : [0, 9, 10, 11, 12],
    ring : [0, 13, 14, 15, 16],
    pinky: [0, 17, 18, 19, 20]
  }

  DESCRIPTION() {
    const prefix = 'datasets-models.2-object-detection.hand-sign.description.'

    return <>
      <Container>
        <Row>
          <Col>
            <p><Trans i18nKey={prefix + 'text-0'} /></p>
            <details>
              <summary><Trans i18nKey={prefix + 'details-input.title'} /></summary>
              <ol>
                <li><Trans i18nKey={prefix + 'details-input.list.0'} /></li>
              </ol>
            </details>
            <details>
              <summary><Trans i18nKey={prefix + 'details-output.title'} /></summary>
              <ol>
                <li><Trans i18nKey={prefix + 'details-output.list.0'} /></li>
              </ol>
            </details>
            <details>
              <summary><Trans i18nKey={prefix + 'details-references.title'} /></summary>
              <ol>
                <li>
                  <details>
                    <summary><Trans i18nKey={prefix + 'details-output.list.0'} /></summary>
                    <pre>{TFJS_handpose_bibtex}</pre>
                  </details>
                </li>
              </ol>
            </details>
          </Col>
        </Row>
        <Row>
          <Col>
            <HandSignInfo />
          </Col>
        </Row>
      </Container>

    </>
  }

  async ENABLE_MODEL() {
    const { HandSignsSSL } = handsignMultiligual
    console.log({ HandSignsSSL })
    const signos = Object.values(HandSignsSSL.signs)
    this.gestureEstimator = new fp.GestureEstimator([
      // fp.Gestures.ThumbsUpGesture,
      // fp.Gestures.VictoryGesture,
      ...signos
    ])

    const model = handPoseDetection.SupportedModels.MediaPipeHands
    const detectorConfig = {
      runtime     : 'mediapipe', // or 'tfjs',
      solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/hands',
      modelType   : 'full',
      maxHands    : 4
    }
    this._modelDetector = await handPoseDetection.createDetector(model, detectorConfig)
    // this._modelDetector = await handpose.load()
  }


  async PREDICTION(input) {
    const predictions_hands = await this._modelDetector.estimateHands(input, {flipHorizontal: true})
    return predictions_hands
  }

  RENDER(ctx, predictions = []) {
    const font = '32px Barlow-SemiBold, Barlow-Regular, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto'
    // const font2 = '12px Barlow-SemiBold, Barlow-Regular, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto'
    predictions.forEach((hand) => {
      const landmark = hand.keypoints.map(({ x, y, z }) => [x, y, z])
      this._drawFinger(ctx, landmark)
      const landmark3D = hand.keypoints3D.map(({ x, y, z }) => [x, y, z])
      const estimatedGestures = this.gestureEstimator.estimate(landmark3D, 8.5)
      const { x, y } = hand.keypoints[0]
      this._drawTextBG(ctx, `${estimatedGestures.gestures.map(({ name }) => name)}`, font, x, y, 16)
    })
  }
  
  _drawFinger(ctx, landmarks) {
    for (let j = 0; j < Object.keys(this.FINGER_JOINTS).length; j++) {
      let finger = Object.keys(this.FINGER_JOINTS)[j]
      for (let k = 0; k < this.FINGER_JOINTS[finger].length - 1; k++) {
        const firstJointIndex = this.FINGER_JOINTS[finger][k]
        const secondJointIndex = this.FINGER_JOINTS[finger][k + 1]
        //draw joints
        ctx.beginPath()
        ctx.moveTo(
          landmarks[firstJointIndex][0],
          landmarks[firstJointIndex][1]
        )
        ctx.lineTo(
          landmarks[secondJointIndex][0],
          landmarks[secondJointIndex][1]
        )
        ctx.strokeStyle = 'gold'
        ctx.lineWidth = 2
        ctx.stroke()
      }
    }
    for (const [x, y] of landmarks) {
      this._drawPoint(ctx, x, y)
    }
  }
}
