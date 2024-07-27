import React from 'react'
import I_MODEL_OBJECT_DETECTION from './_model'
import { Trans } from 'react-i18next'
import * as poseDetection from '@tensorflow-models/pose-detection'

export class MODEL_3_MOVE_NET_POSE_NET extends I_MODEL_OBJECT_DETECTION {
  static KEY = 'MOVE-NET--POSE-NET'
  TITLE = 'datasets-models.2-object-detection.move-net--pose-net.title'
  i18n_TITLE = 'datasets-models.2-object-detection.move-net--pose-net.title'
  URL = 'https://github.com/tensorflow/tfjs-models/tree/master/pose-detection'
  mirror = false

  COCO_CONNECTED_KEYPOINTS_PAIRS = [
    // CARA
    [0, 1], [0, 2], [1, 3], [2, 4],
    // TORSO
    [5, 6], [5, 11], [6, 12], [11, 12],
    // BRAZO DERECHO
    [5, 7], [7, 9],
    // BRAZO IZQUIERDO
    [6, 8], [8, 10],
    // PIERNA DERECHA
    [11, 13], [13, 15],
    // PIERNA IZQUIERDA
    [12, 14], [14, 16]
  ]

  DESCRIPTION () {
    const prefix = 'datasets-models.2-object-detection.move-net--pose-net.description.'
    return <>
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
            <Trans i18nKey={prefix + 'details-references.list.0'}
                   components={{
                     link1: <a href={'https://tfhub.dev/google/movenet/multipose/lightning/1'} target={'_blank'} rel="noreferrer">link</a>,
                   }} />
          </li>
        </ol>
      </details>
      <details>
        <summary>BibTeX</summary>
        <pre>
{`
@article{DBLP:journals/corr/KendallGC15,
  author       = {Alex Kendall and
                  Matthew Grimes and
                  Roberto Cipolla},
  title        = {Convolutional networks for real-time 6-DOF camera relocalization},
  journal      = {CoRR},
  volume       = {abs/1505.07427},
  year         = {2015},
  url          = {https://arxiv.org/abs/1505.07427},
  eprinttype    = {arXiv},
  eprint       = {1505.07427},
  timestamp    = {Mon, 13 Aug 2018 16:46:52 +0200},
  biburl       = {https://dblp.org/rec/journals/corr/KendallGC15.bib},
  bibsource    = {dblp computer science bibliography, https://dblp.org}
}
`}
        </pre>
      </details>
    </>
  }
  /**
   * @type {poseDetection.PoseDetector} 
   */
  _modelDetector

  // https://github.com/tensorflow/tfjs-models/tree/master/pose-detection/src/movenet
  // https://github.com/tensorflow/tfjs-models/tree/master/pose-detection/src/posenet
  async ENABLE_MODEL () {
    const model = poseDetection.SupportedModels.MoveNet
    /**
     * @type {poseDetection.MoveNetModelConfig}
     */
    const modelConfig__MoveNet = {
      modelType      : poseDetection.movenet.modelType.MULTIPOSE_LIGHTNING,
      enableTracking : true,
      trackerType    : poseDetection.TrackerType.BoundingBox,
      minPoseScore   : 0.2,
      enableSmoothing: true
    }
    this._modelDetector = await poseDetection.createDetector(model, modelConfig__MoveNet)
  }

  async PREDICTION (input_image_or_video, config = { flipHorizontal: false }) {
    if (this._modelDetector === null) return []
    /**
     * @type {poseDetection.MoveNetEstimationConfig}
     */
    const estimationConfig__MoveNet = {
      flipHorizontal: config.flipHorizontal,
      maxPoses      : 5
    }
    /**
     * @type {poseDetection.PoseNetEstimationConfig}
    */
    // eslint-disable-next-line no-unused-vars
    const estimationConfig__PoseNet = {
      maxPoses      : 5,
      flipHorizontal: config.flipHorizontal,
      scoreThreshold: 0.3,
      nmsRadius     : 20
    }
    return await this._modelDetector.estimatePoses(input_image_or_video, estimationConfig__MoveNet)
  }

  RENDER (ctx, poses) {
    const font = '24px Barlow-SemiBold, Barlow-Regular, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto'
    ctx.fillStyle = '#FF0902'
    ctx.strokeStyle = 'white'
    ctx.font = font
    const scoreThreshold = 0.20
    poses.forEach((pose) => {

      this.COCO_CONNECTED_KEYPOINTS_PAIRS.forEach(([i, j]) => {
        const kp1 = pose.keypoints[i]
        const kp2 = pose.keypoints[j]
        const score1 = kp1.score != null ? kp1.score : 1
        const score2 = kp2.score != null ? kp2.score : 1

        if (score1 >= scoreThreshold && score2 >= scoreThreshold) {
          ctx.beginPath()
          ctx.moveTo(kp1.x, kp1.y)
          ctx.lineTo(kp2.x, kp2.y)
          ctx.stroke()

          ctx.beginPath()
          ctx.arc(kp1.x, kp1.y, 5, 0, (Math.PI / 180) * 360)
          ctx.stroke()
          ctx.fillText(`${kp1.name}`, kp1.x, kp1.y)

          ctx.beginPath()
          ctx.arc(kp2.x, kp2.y, 5, 0, (Math.PI / 180) * 360)
          ctx.stroke()
          ctx.fillText(`${kp2.name}`, kp2.x, kp2.y)
        }
      })

      const x = pose.keypoints[6].x
      const y = pose.keypoints[6].y
      this._drawTextBG(ctx, `ID: ${pose.id}`, font, x, y + 40, 16)
    })
  }
}
