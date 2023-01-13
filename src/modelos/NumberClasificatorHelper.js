import * as tf from '@tensorflow/tfjs'
import * as tfvis from '@tensorflow/tfjs-vis'
import { MnistData } from './data/NumberClassificationData'
import { createLoss, createMetrics, createOptimizerId } from './ArchitectureHelper'

async function showExamples(data) {
  // Create a container in the visor
  const surface = tfvis
    .visor()
    .surface({ name: 'Ejemplo datos de entrada', tab: 'Datos de entrada' })

  // Get the examples
  const examples = data.nextTestBatch(20)
  const numExamples = examples.xs.shape[0]

  // Create a canvas element to render each example
  for (let i = 0; i < numExamples; i++) {
    const imageTensor = tf.tidy(() => {
      // Reshape the image to 28x28 px
      return examples.xs
        .slice([i, 0], [1, examples.xs.shape[1]])
        .reshape([28, 28, 1])
    })

    const canvas = document.createElement('canvas')
    canvas.width = 28
    canvas.height = 28
    canvas.style = 'margin: 4px;'
    await tf.browser.toPixels(imageTensor, canvas)
    surface.drawArea.appendChild(canvas)

    imageTensor.dispose()
  }
}

export async function run(
  numberOfEpoch,
  sLOptimizer,
  layerList,
  idLoss,
  idMetrics,
) {
  document.getElementById('salida').innerHTML +=
    `
<p>MODELO CREADO A PARTIR DE: 
<b>numberOfEpoch:</b> ${numberOfEpoch} 
<b>sLOptimizer:</b> ${sLOptimizer} 
<b>idLoss:</b> ${idLoss} 
<b>idMetrics:</b> ${idMetrics}</p>
`

  const data = new MnistData()
  await data.load()
  await showExamples(data)

  const model = getModel(sLOptimizer, layerList, idLoss, idMetrics)
  await tfvis.show.modelSummary(
    { name: 'Arquitectura del modelo', tab: 'Modelo' },
    model,
  )

  await train(model, data, numberOfEpoch)

  await showAccuracy(model, data)
  await showConfusion(model, data)
  return model
}

function getModel(sLOptimizer, layerList, idLoss, idMetrics) {
  const model = tf.sequential()

  const IMAGE_WIDTH = 28
  const IMAGE_HEIGHT = 28
  const IMAGE_CHANNELS = 1

  const optimizer = createOptimizerId(sLOptimizer)
  const loss = createLoss(idLoss)
  const metrics = createMetrics(idMetrics)

  layerList.forEach((element, index) => {
    if (index === 0) {
      model.add(
        tf.layers.conv2d({
          inputShape: [IMAGE_WIDTH, IMAGE_HEIGHT, IMAGE_CHANNELS],
          kernelSize: element.kernelSize,
          filters: element.filters,
          strides: element.strides,
          activation: element.activation.toLowerCase(),
          kernelInitializer: element.kernelInitializer,
        }),
      )
    } else {
      if (element.class === 'Conv2D') {
        model.add(
          tf.layers.conv2d({
            kernelSize: element.kernelSize,
            filters: element.filters,
            strides: element.strides,
            activation: element.activation.toLowerCase(),
            kernelInitializer: element.kernelInitializer,
          }),
        )
      } else {
        model.add(
          tf.layers.maxPooling2d({
            poolSize: element.poolSize,
            strides: element.strides,
          }),
        )
      }
    }
  })

  // In the first layer of our convolutional neural network we have
  // to specify the input shape. Then we specify some parameters for
  // the convolution operation that takes place in this layer.

  // The MaxPooling layer acts as a sort of downsampling using max values
  // in a region instead of averaging.

  // Repeat another conv2d + maxPooling stack.
  // Note that we have more filters in the convolution.

  // Now we flatten the output from the 2D filters into a 1D vector to prepare
  // it for input into our last layer. This is common practice when feeding
  // higher dimensional data to a final classification output layer.
  model.add(tf.layers.flatten())

  // Our last layer is a dense layer which has 10 output units, one for each
  // output class (i.e. 0, 1, 2, 3, 4, 5, 6, 7, 8, 9).
  const NUM_OUTPUT_CLASSES = 10
  model.add(
    tf.layers.dense({
      units: NUM_OUTPUT_CLASSES,
      kernelInitializer: 'varianceScaling',
      activation: 'softmax',
    }),
  )

  // Choose an optimizer, loss function and accuracy metric,
  // then compile and return the model
  model.compile({
    optimizer: optimizer,
    loss: loss,
    metrics: metrics,
  })

  return model
}

async function train(model, data, numberOfEpoch) {
  const metrics = ['loss', 'val_loss', 'acc', 'val_acc']
  const container = {
    name: 'Entrenamiento del modelo',
    tab: 'Entrenamiento',
    styles: { height: '1000px' },
  }
  const fitCallbacks = tfvis.show.fitCallbacks(container, metrics)

  const BATCH_SIZE = 512
  const TRAIN_DATA_SIZE = 11000
  const TEST_DATA_SIZE = 2000

  const [trainXs, trainYs] = tf.tidy(() => {
    const d = data.nextTrainBatch(TRAIN_DATA_SIZE)
    return [d.xs.reshape([TRAIN_DATA_SIZE, 28, 28, 1]), d.labels]
  })

  const [testXs, testYs] = tf.tidy(() => {
    const d = data.nextTestBatch(TEST_DATA_SIZE)
    return [d.xs.reshape([TEST_DATA_SIZE, 28, 28, 1]), d.labels]
  })

  return model.fit(trainXs, trainYs, {
    batchSize: BATCH_SIZE,
    validationData: [testXs, testYs],
    epochs: numberOfEpoch,
    shuffle: true,
    callbacks: fitCallbacks,
  })
}

const classNames = [
  'Zero',
  'One',
  'Two',
  'Three',
  'Four',
  'Five',
  'Six',
  'Seven',
  'Eight',
  'Nine',
]

function doPrediction(model, data, testDataSize = 500) {
  const IMAGE_WIDTH = 28
  const IMAGE_HEIGHT = 28
  const testData = data.nextTestBatch(testDataSize)
  const testxs = testData.xs.reshape([
    testDataSize,
    IMAGE_WIDTH,
    IMAGE_HEIGHT,
    1,
  ])
  const labels = testData.labels.argMax(-1)
  const preds = model.predict(testxs).argMax(-1)

  testxs.dispose()
  return [preds, labels]
}

async function showAccuracy(model, data) {
  const [preds, labels] = doPrediction(model, data)
  const classAccuracy = await tfvis.metrics.perClassAccuracy(labels, preds)
  const container = { name: 'Exactitud', tab: 'Evaluación' }
  await tfvis.show.perClassAccuracy(container, classAccuracy, classNames)

  labels.dispose()
}

async function showConfusion(model, data) {
  const [preds, labels] = doPrediction(model, data)
  const confusionMatrix = await tfvis.metrics.confusionMatrix(labels, preds)
  const container = { name: 'Matriz de confusión', tab: 'Evaluación' }
  await tfvis.render.confusionMatrix(container, {
    values: confusionMatrix,
    tickLabels: classNames,
  })

  labels.dispose()
}

/**
 * Hermite resize - fast image resize/resample using Hermite filter. 1 cpu version!
 *
 * @param {HtmlElement} canvas
 * @param {int} width
 * @param {int} height
 * @param {string} resize_canvas if true, canvas will be resized. Optional.
 * Cambiado por RT, resize canvas ahora es donde se pone el chiqitillllllo
 */
export function resample_single(canvas, width, height, resize_canvas) {
  let width_source = canvas.width
  let height_source = canvas.height
  width = Math.round(width)
  height = Math.round(height)

  let ratio_w = width_source / width
  let ratio_h = height_source / height
  let ratio_w_half = Math.ceil(ratio_w / 2)
  let ratio_h_half = Math.ceil(ratio_h / 2)

  let ctx = canvas.getContext('2d')
  let ctx2 = resize_canvas.getContext('2d')
  let img = ctx.getImageData(0, 0, width_source, height_source)
  let img2 = ctx2.createImageData(width, height)
  let data = img.data
  let data2 = img2.data

  for (let j = 0; j < height; j++) {
    for (let i = 0; i < width; i++) {
      let x2 = (i + j * width) * 4
      let weight = 0
      let weights = 0
      let weights_alpha = 0
      let gx_r = 0
      let gx_g = 0
      let gx_b = 0
      let gx_a = 0
      let center_y = (j + 0.5) * ratio_h
      let yy_start = Math.floor(j * ratio_h)
      let yy_stop = Math.ceil((j + 1) * ratio_h)
      for (let yy = yy_start; yy < yy_stop; yy++) {
        let dy = Math.abs(center_y - (yy + 0.5)) / ratio_h_half
        let center_x = (i + 0.5) * ratio_w
        let w0 = dy * dy //pre-calc part of w
        let xx_start = Math.floor(i * ratio_w)
        let xx_stop = Math.ceil((i + 1) * ratio_w)
        for (let xx = xx_start; xx < xx_stop; xx++) {
          let dx = Math.abs(center_x - (xx + 0.5)) / ratio_w_half
          let w = Math.sqrt(w0 + dx * dx)
          if (w >= 1) {
            //pixel too far
            continue
          }
          //hermite filter
          weight = 2 * w * w * w - 3 * w * w + 1
          let pos_x = 4 * (xx + yy * width_source)
          //alpha
          gx_a += weight * data[pos_x + 3]
          weights_alpha += weight
          //colors
          if (data[pos_x + 3] < 255) weight = (weight * data[pos_x + 3]) / 250
          gx_r += weight * data[pos_x]
          gx_g += weight * data[pos_x + 1]
          gx_b += weight * data[pos_x + 2]
          weights += weight
        }
      }
      data2[x2] = gx_r / weights
      data2[x2 + 1] = gx_g / weights
      data2[x2 + 2] = gx_b / weights
      data2[x2 + 3] = gx_a / weights_alpha
    }
  }

  // Ya que esta, exagerarlo. Blancos blancos y negros negros..?

  for (let p = 0; p < data2.length; p += 4) {
    let gris = data2[p] // Está en blanco y negro

    if (gris < 100) {
      gris = 0 //exagerarlo
    } else {
      gris = 255 //al infinito
    }

    data2[p] = gris
    data2[p + 1] = gris
    data2[p + 2] = gris
  }

  ctx2.putImageData(img2, 0, 0)
}
