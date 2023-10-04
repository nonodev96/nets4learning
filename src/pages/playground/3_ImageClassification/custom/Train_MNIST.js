import * as tfvis from '@tensorflow/tfjs-vis'
import * as tf from '@tensorflow/tfjs'
import { MnistData } from '../models/MODEL_MNIST_Data'
import { createLoss, createMetrics, createOptimizer } from '@core/nn-utils/ArchitectureHelper'

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

async function showExamples (data) {
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
    canvas.style.margin = '4px'
    await tf.browser.toPixels(imageTensor, canvas)
    surface.drawArea.appendChild(canvas)

    imageTensor.dispose()
  }
}

async function train (model, data, numberOfEpoch) {
  const metrics = ['loss', 'val_loss', 'acc', 'val_acc']
  const container = {
    name  : 'Entrenamiento del modelo',
    tab   : 'Entrenamiento',
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
    batchSize     : BATCH_SIZE,
    validationData: [testXs, testYs],
    epochs        : numberOfEpoch,
    shuffle       : true,
    callbacks     : fitCallbacks,
  })
}

function doPrediction (model, data, testDataSize = 500) {
  const IMAGE_WIDTH = 28
  const IMAGE_HEIGHT = 28
  const testData = data.nextTestBatch(testDataSize)
  const tests_reshape = testData.xs.reshape([
    testDataSize,
    IMAGE_WIDTH,
    IMAGE_HEIGHT,
    1,
  ])
  const labels = testData.labels.argMax(-1)
  const prediction = model.predict(tests_reshape).argMax(-1)

  tests_reshape.dispose()
  return [prediction, labels]
}

async function showAccuracy (model, data) {
  const [preds, labels] = doPrediction(model, data)
  const classAccuracy = await tfvis.metrics.perClassAccuracy(labels, preds)
  const container = { name: 'Exactitud', tab: 'Evaluación' }
  await tfvis.show.perClassAccuracy(container, classAccuracy, classNames)

  labels.dispose()
}

async function showConfusion (model, data) {
  const [preds, labels] = doPrediction(model, data)
  const confusionMatrix = await tfvis.metrics.confusionMatrix(labels, preds)
  const container = { name: 'Matriz de confusión', tab: 'Evaluación' }
  await tfvis.render.confusionMatrix(container, {
    values    : confusionMatrix,
    tickLabels: classNames,
  })

  labels.dispose()
}

function getModel (idOptimizer, layerList, idLoss, idMetrics, params) {
  const { LearningRate } = params
  const model = tf.sequential()
  const IMAGE_WIDTH = 28
  const IMAGE_HEIGHT = 28
  const IMAGE_CHANNELS = 1
  const optimizer = createOptimizer(idOptimizer, { learningRate: (LearningRate / 100), momentum: 0.99 })
  const loss = createLoss(idLoss, {})
  const metrics = createMetrics(idMetrics, {})

  layerList.forEach((element, index) => {
    if (index === 0) {
      model.add(
        tf.layers.conv2d({
          inputShape       : [IMAGE_WIDTH, IMAGE_HEIGHT, IMAGE_CHANNELS],
          kernelSize       : element.kernelSize,
          filters          : element.filters,
          strides          : element.strides,
          activation       : element.activation.toLowerCase(),
          kernelInitializer: element.kernelInitializer,
        }),
      )
    } else {
      if (element._class === 'Conv2D') {
        model.add(
          tf.layers.conv2d({
            kernelSize       : element.kernelSize,
            filters          : element.filters,
            strides          : element.strides,
            activation       : element.activation.toLowerCase(),
            kernelInitializer: element.kernelInitializer,
          }),
        )
      } else if(element._class === 'MaxPooling2D') {
        model.add(
          tf.layers.maxPooling2d({
            poolSize: element.poolSize,
            strides : element.strides,
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
      units            : NUM_OUTPUT_CLASSES,
      kernelInitializer: 'varianceScaling',
      activation       : 'softmax',
    }),
  )

  // Choose an optimizer, loss function and accuracy metric,
  // then compile and return the model
  model.compile({
    optimizer: optimizer,
    loss     : loss,
    metrics  : metrics,
  })

  return model
}

export async function MNIST_run (params_data) {

  const {
    numberOfEpoch,
    idOptimizer,
    idLoss,
    idMetrics,
    layerList,
    params
  } = params_data

  document.getElementById('salida').innerHTML += `
<p>MODELO CREADO A PARTIR DE: 
<b>numberOfEpoch:</b> ${numberOfEpoch.toString()} 
<b>idOptimizer:</b> ${idOptimizer} 
<b>idLoss:</b> ${idLoss} 
<b>idMetrics:</b> ${idMetrics}</p>
`

  const data = new MnistData()
  await data.load()
  await showExamples(data)

  const model = getModel(idOptimizer, layerList, idLoss, idMetrics, params)
  await tfvis.show.modelSummary({ name: 'Arquitectura del modelo', tab: 'Modelo' }, model)

  await train(model, data, numberOfEpoch)

  await showAccuracy(model, data)
  await showConfusion(model, data)
  return model
}
