// eslint-disable-next-line 
import * as faceapi from '@vladmandic/face-api/dist/face-api.esm.js'
import { Trans } from 'react-i18next'
import I_MODEL_OBJECT_DETECTION from './_model'
import { MTCNN_bibtex, SSD_bibtex, MobileNets_bibtex, tiny_bibtex, faceRecognitionModel_bitex } from './MODEL_5_FACE_API_INFO'

export class MODEL_5_FACE_API extends I_MODEL_OBJECT_DETECTION {
  static KEY = 'FACE-API'
  TITLE = 'datasets-models.2-object-detection.face-api.title'
  i18n_TITLE = 'datasets-models.2-object-detection.face-api.title'
  URL = 'https://justadudewhohacks.github.io/face-api.js/docs/index.html'
  mirror = false

  DESCRIPTION() {
    const prefix = 'datasets-models.2-object-detection.face-api.description.'
    return <>
      <p><Trans i18nKey={prefix + 'text-0'} /></p>
      <details>
        <summary><Trans i18nKey={prefix + 'details-input.title'} /></summary>
        <p><Trans i18nKey={prefix + 'details-input.text-0'} /></p>
      </details>
      <details>
        <summary><Trans i18nKey={prefix + 'details-output.title'} /></summary>
        <p><Trans i18nKey={prefix + 'details-output.text-0'} /></p>
        <ol>
          <li><Trans i18nKey={prefix + 'details-output.list.bounding'} /></li>
          <li><Trans i18nKey={prefix + 'details-output.list.0'} /></li>
          <li><Trans i18nKey={prefix + 'details-output.list.1'} /></li>
          <li><Trans i18nKey={prefix + 'details-output.list.2'} /></li>
          <li><Trans i18nKey={prefix + 'details-output.list.3'} /></li>
          <li><Trans i18nKey={prefix + 'details-output.list.4'} /></li>
          <li><Trans i18nKey={prefix + 'details-output.list.5'} /></li>
          <li><Trans i18nKey={prefix + 'details-output.list.6'} /></li>
          <li><Trans i18nKey={prefix + 'details-output.list.7'} /></li>
        </ol>
      </details>
      <details>
        <summary><Trans i18nKey={prefix + 'details-references.title'} /></summary>
        <p><strong>Face Detection Models</strong></p>
        <ol className='small'>
          <li>
            <details>
              <summary>SSD Mobilenet V1 (5.4MB)</summary>
              <p><small>SSD: Single Shot MultiBox Detector</small></p>
              <pre>{SSD_bibtex}</pre>
              <p><small>MobileNets: Efficient Convolutional Neural Networks for Mobile Vision Applications</small></p>
              <pre>{MobileNets_bibtex}</pre>
            </details>
          </li>
          <li>
            <details>
              <summary>Tiny Face Detector (190kb)</summary>
              <pre>{tiny_bibtex}</pre>
            </details>
          </li>
          <li>
            <details>
              <summary>MTCNN (2MB)</summary>
              <pre>{MTCNN_bibtex}</pre>
            </details>
          </li>
        </ol>

        <p><strong>Face Landmark Detection Models</strong></p>
        <ol className='small'>
          <li>
            <details>
              <summary>face_landmark_68_model (350kb)</summary>
              <pre>{MTCNN_bibtex}</pre>
            </details>
          </li>
          <li>
            <details>
              <summary>face_landmark_68_tiny_model (80kb)</summary>
              <pre>{MTCNN_bibtex}</pre>
            </details>
          </li>
        </ol>

        <p><strong>Face Recognition Model</strong></p>
        <ol className='small'>
          <li>
            <details>
              <summary>face_recognition_model (6.2MB)</summary>
              <pre>{faceRecognitionModel_bitex}</pre>
            </details>
          </li>
        </ol>

        <p><strong>Face Expression Recognition Model</strong></p>
        <ol className='small'>
          <li>face_expression_recognition_model (310kb)</li>
        </ol>
      </details>
    </>
  }

  async ENABLE_MODEL() {
    // const modelPath = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/';
    const modelPath = process.env.REACT_APP_PATH + '/models/02-object-detection/face-api-js/'
    await Promise.all([
      faceapi.nets.ssdMobilenetv1.load(modelPath),
      faceapi.nets.tinyFaceDetector.load(modelPath),
      faceapi.nets.ageGenderNet.load(modelPath),
      faceapi.nets.faceExpressionNet.load(modelPath)
    ])
    // await faceapi.nets.faceLandmark68Net.load(modelPath);
    // await faceapi.nets.faceRecognitionNet.load(modelPath);
  }

  _ImageData_To_Image(imagedata) {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    canvas.width = imagedata.width
    canvas.height = imagedata.height
    ctx.putImageData(imagedata, 0, 0)

    const image = new Image()
    image.src = canvas.toDataURL()
    return image
  }

  async PREDICTION(input) {
    let _input = input
    if (input.constructor === ImageData) {
      _input = this._ImageData_To_Image(input)
    }
    const minScore = 0.2
    const maxResults = 10
    const optionsSSDMobileNet = new faceapi.SsdMobilenetv1Options({ minConfidence: minScore, maxResults })
    const predictions = await faceapi
      .detectAllFaces(_input, optionsSSDMobileNet)
      .withAgeAndGender()
      .withFaceExpressions()
    // .withFaceLandmarks()
    // .withFaceDescriptors()
    return predictions
  }

  RENDER(ctx, predictions = []) {
    const font = '32px Barlow-SemiBold, Barlow-Regular, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto'
    const font2 = '24px Barlow-SemiBold, Barlow-Regular, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto'

    predictions.forEach(({ detection, expressions, age }) => {
      const { x, y, width, height } = detection.box
      this._drawRect(ctx, x, y, width, height)

      let i = 1
      for (const [expresion, score] of Object.entries(expressions)) {
        const scoreParsed = Math.round(parseFloat(score) * 100)
        const txt_expression = `${expresion} ${scoreParsed}%`
        this._drawTextBG(ctx, txt_expression, font2, x + width, y + (48 * i), 12)
        i++
      }

      const ageParsed = Math.round(parseFloat(age))
      const txt = `${ageParsed} years`
      this._drawTextBG(ctx, txt, font, x, y - 32, 16)
    })
  }
}
