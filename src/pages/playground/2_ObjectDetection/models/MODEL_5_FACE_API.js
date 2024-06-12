import * as faceapi from '@vladmandic/face-api/dist/face-api.esm-nobundle.js'
import { Trans } from 'react-i18next'
import I_MODEL_OBJECT_DETECTION from './_model'

export class MODEL_5_FACE_API extends I_MODEL_OBJECT_DETECTION {
  static KEY = 'FACE-API'
  TITLE = 'TITLE Face API'
  i18n_TITLE = ''
  URL = 'https://justadudewhohacks.github.io/face-api.js/docs/index.html'

  DESCRIPTION() {
    const prefix = 'datasets-models.2-object-detection.move-net--pose-net.description.'
    return <>
      <p><Trans i18nKey={prefix + 'text-0'} /></p>
      <details>
        <summary><Trans i18nKey={prefix + 'details-input.title'} /></summary>
      </details>
      <details>
        <summary><Trans i18nKey={prefix + 'details-output.title'} /></summary>
      </details>
      <details>
        <summary><Trans i18nKey={prefix + 'details-references.title'} /></summary>
      </details>
    </>
  }

  async ENABLE_MODEL() {
    // const modelPath = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/';
    const modelPath = process.env.REACT_APP_PATH + '/models/02-object-detection/face-api-js/'
    await faceapi.nets.ssdMobilenetv1.load(modelPath)
    await faceapi.nets.ageGenderNet.load(modelPath)
    await faceapi.nets.faceExpressionNet.load(modelPath)
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
    if(input.constructor === ImageData) {
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
    const font = '16px Barlow-SemiBold, Barlow-Regular, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto'
    const font2 = '12px Barlow-SemiBold, Barlow-Regular, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto'

    predictions.forEach(({ detection, expressions, gender, genderProbability, age }) => {
      const { x, y, width, height } = detection.box
      this._drawRect(ctx, x, y, width, height)

      let i = 0
      for (const [expresion, score] of Object.entries(expressions)) {
        const scoreParsed = Math.round(parseFloat(score) * 100)
        const txt_expression = `${expresion} ${scoreParsed}%`
        this._drawTextBG(ctx, txt_expression, font2, x + width, y + (24 * i), 12)
        i++
      }

      const ageParsed = Math.round(parseFloat(age))
      const genderProbabilityParsed = Math.round(parseFloat(genderProbability) * 100)
      const txt = `${gender} with ${genderProbabilityParsed}%, ${ageParsed} years`
      this._drawTextBG(ctx, txt, font, x, y-32, 16)
    })
  }
}
