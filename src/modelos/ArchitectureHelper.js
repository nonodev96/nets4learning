import * as tf from '@tensorflow/tfjs'
import * as tfvis from '@tensorflow/tfjs-vis'
import { alertError } from '../utils/alertHelper'
import { IRIS_CLASSES, IRIS_DATA } from "./ClassificationHelper_IRIS";
import * as clasificadorIRIS from "./ClassificationHelper_IRIS";


// TODO: prueba, eliminar function
export const clasificacionClasica = async function createArchitecture(type, learningRate, numberOfEpoch, optimizer, shape) {
  const model = type
  const lR = learningRate
  const nOE = numberOfEpoch
  const opt = optimizer

  const layerList = []
  layerList.push(tf.layers.dense({ units: 10, activation: 'sigmoid', inputShape: [shape] }))
  layerList.push(tf.layers.dense({ units: 3, activation: 'softmax' }))

  for (const layer of layerList) {
    model.add(layer)
  }

  model.compile({
    optimizer: optimizer,
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy'],
  })
}

export async function createClassicClassification(learningRate, unknownRate, numberOfEpoch, sLOptimizer, layerList, idLoss, idMetrics) {
  const [xTrain, yTrain, xTest, yTest] = clasificadorIRIS.getData(unknownRate, IRIS_CLASSES, IRIS_DATA)

  // modo secuencial
  const model = tf.sequential()
  const optimizer = createOptimizer(sLOptimizer, { learningRate })
  const loss = createLoss(idLoss)
  const metrics = createMetrics(idMetrics)

  const text = `
<p>MODELO CREADO A PARTIR DE: 
<b>learningRate:</b> ${learningRate} 
<b>unknownRate:</b> ${unknownRate} 
<b>numberOfEpoch:</b> ${numberOfEpoch} 
<b>sLOptimizer:</b> ${sLOptimizer} 
<b>idLoss:</b> ${idLoss} 
<b>idMetrics:</b> ${idMetrics}
</p>`
  document.getElementById('salida').innerHTML += text

  // Agregamos las capas
  layerList.forEach((layer, index) => {
    const newLayer = tf.layers.dense({
      units: layer.units,
      activation: layer.activation.toLowerCase(), ...(index === 0) && { inputShape: [xTrain.shape[1]] },
    })
    model.add(newLayer)
  })

  // Compilamos el modelo
  model.compile({
    optimizer: optimizer, loss: loss, metrics: metrics,
  })

  // Mostramos la información del modelo en el panel lateral
  const containerSummary = {
    name: 'Arquitectura del modelo', tab: 'Modelo', styles: {}
  }
  await tfvis.show.modelSummary(containerSummary, model)

  // Creamos las métricas que van a aparecer en los gráficos
  const metrics_labels = ['loss', 'val_loss', 'acc', 'val_acc']
  const containerFitCallbacks = {
    name: 'Entrenamiento del modelo', tab: 'Entrenamiento', styles: { /*height: '1000px'*/ },
  }

  const fitCallbacks = tfvis.show.fitCallbacks(containerFitCallbacks, metrics_labels, {
    callbacks: ['onEpochEnd'],
  })

  const history = await model.fit(xTrain, yTrain, {
    epochs: numberOfEpoch, validationData: [xTest, yTest], callbacks: fitCallbacks,
  })

  console.log('Layer list', { layerList })
  console.log('Tensor sequential compile', { model })
  console.log('xTRAIN', { xTrain })
  console.log('History', { history })
  console.log('Configuration model', { config: model.getConfig() })

  return model
}

export async function createClassicClassificationCustomDataSet(learningRate, unknownRate, numberOfEpoch, idOptimizer, layerList, idLoss, idMetrics, dataSet) {
  const [DATA_SET, TARGET_SET_CLASSES, DATA_SET_CLASSES] = await getClassesFromDataSet(dataSet)
  const [xTrain, yTrain, xTest, yTest] = clasificadorIRIS.getData(unknownRate, TARGET_SET_CLASSES, DATA_SET)

  console.log(xTrain, yTrain, xTest, yTest)
  document.getElementById('salida').innerHTML += `
<h3>MODELO CREADO A PARTIR DE: </h3>
<p><b>idOptimizer:</b> ${idOptimizer}</p> 
<ul>
    <li><b>learningRate:</b> ${learningRate}</li>
</ul>
<p><b>idLoss:</b> ${idLoss}</p> 
<p><b>idMetrics:</b> ${idMetrics}</p>
<p><b>unknownRate:</b> ${unknownRate}</p> 
<p><b>numberOfEpoch:</b> ${numberOfEpoch}</p> 
`

  // modo secuencial
  const model = tf.sequential()
  const optimizer = createOptimizer(idOptimizer, { learningRate })
  const loss = createLoss(idLoss)
  const metrics = createMetrics(idMetrics)

  //Agregamos las capas
  layerList.forEach((layer, index) => {
    model.add(tf.layers.dense({
      units: layer.units,
      activation: layer.activation.toLowerCase(), ...(index === 0) && { inputShape: [xTrain.shape[1]] },
    }))
  })

  // Compilamos el modelo
  model.compile({
    optimizer: optimizer, loss: loss, metrics: metrics
  })

  // Creamos las métricas que van a aparecer en los gráficos
  const fit_callbacks_metrics_labels = ['loss', 'val_loss', 'acc', 'val_acc']
  const fit_callbacks_container = {
    name: 'Entrenamiento del modelo', tab: 'Entrenamiento', styles: { height: '1000px' },
  }
  const fitCallbacks = tfvis.show.fitCallbacks(fit_callbacks_container, fit_callbacks_metrics_labels, {
    callbacks: ['onEpochEnd'],
  })

  await model.fit(xTrain, yTrain, {
    epochs: numberOfEpoch, validationData: [xTest, yTest], callbacks: fitCallbacks
  })

  return Promise.resolve([model, TARGET_SET_CLASSES, DATA_SET_CLASSES])
}

async function getClassesFromDataSet(dataSet) {
  try {
    let dataAux = []
    const indexDataAux = []
    // console.log(dataSet)
    const typePos = dataSet.datos[0].length - 1
    for (let i = 0; i <= typePos; i++) {
      dataAux.push([])
    }

    dataSet.datos.forEach((array) => {
      for (let index = 0; index <= typePos; index++) {
        dataAux[index].push(array[index])
      }
    })

    for (let i = 0; i <= typePos; i++) {
      const mySet = new Set(dataAux[i])
      let mapaAux = new Map()
      let j = 0
      for (const [element] of mySet.entries()) {
        mapaAux.set(element, j)
        j++
      }
      indexDataAux.push(mapaAux)
    }

    dataAux = []

    dataSet.datos.forEach((array) => {
      let aux = []
      for (let index = 0; index <= typePos; index++) {
        aux.push(indexDataAux[index].get(array[index]))
      }
      dataAux.push(aux)
    })

    const targetData = []

    const iterator = indexDataAux[typePos].keys()
    for (let val of iterator) {
      targetData.push(val)
    }
    console.log({ dataAux, targetData, indexDataAux })
    return [dataAux, targetData, indexDataAux]
  } catch (error) {
    console.error(error)
    await alertError(error)
  }
}

/**
 * tf.train.
 * sgd
 * momentum
 * adadelta
 * adagrad
 * rmsprop
 * adamax
 * adam
 *
 * @param idOptimizer
 * @param params
 * @returns {Optimizer}
 */
function createOptimizer(idOptimizer, params) {
  console.log({ idOptimizer, params })
  let { learningRate } = params
  switch (idOptimizer) {
    case 'Sgd':
      return tf.train.sgd(learningRate)
    case 'Momentum':
      let { momentum = 0.9 } = params
      return tf.train.momentum(learningRate, momentum)
    case 'Rmsprop':
      return tf.train.rmsprop(learningRate)
    case 'Adam':
      return tf.train.adam(learningRate)
    case 'Adadelta':
      return tf.train.adadelta(learningRate)
    case 'Adamax':
      return tf.train.adamax(learningRate)
    case 'Adagrag':
      return tf.train.adagrad(learningRate)

    default:
      console.error("createOptimizer()", { idOptimizer, params })
      return tf.train.adam(learningRate)
  }
}

/**
 * tf.train.
 * sgd
 * momentum
 * adadelta
 * adagrad
 * rmsprop
 * adamax
 * adam
 *
 * @param idOptimizer
 * @param params
 * @returns {Optimizer}
 */
export function createOptimizerId(idOptimizer, params) {
  console.log({ idOptimizer, params })
  let { learningRate } = params
  switch (idOptimizer) {
    case 'Sgd':
      return tf.train.sgd(learningRate)
    case 'Momentum':
      let { momentum = 0.9 } = params
      return tf.train.momentum(learningRate, momentum)
    case 'Rmsprop':
      return tf.train.rmsprop(learningRate)
    case 'Adam':
      return tf.train.adam()
    case 'Adadelta':
      return tf.train.adadelta()
    case 'Adamax':
      return tf.train.adamax()
    case 'Adagrag':
      return tf.train.adagrad(learningRate)

    default:
      console.error("createOptimizerId()", { idOptimizer, params })
      return tf.train.adam()
  }
}

/**
 * tf.losses.{}
 *
 * absoluteDifference
 * computeWeightedLoss
 * cosineDistance
 * hingeLoss
 * huberLoss
 * logLoss
 * meanSquaredError
 * sigmoidCrossEntropy
 * softmaxCrossEntropy
 *
 * @param idLoss
 * @returns {string}
 */
export function createLoss(idLoss) {
  console.log({ idLoss })

  switch (idLoss) {
    case 'AbsoluteDifference':
      return 'absoluteDifference'
    case 'ComputeWeightedLoss':
      return 'computeWeightedLoss'
    case 'CosineDistance':
      return 'cosineDistance'
    case 'HingeLoss':
      return 'hingeLoss'
    case 'HuberLoss':
      return 'huberLoss'
    case 'LogLoss':
      return 'logLoss'
    case 'MeanSquaredError':
      return 'meanSquaredError'
    case 'SigmoidCrossEntropy':
      return 'sigmoidCrossEntropy'
    case 'SoftmaxCrossEntropy':
      return 'softmaxCrossEntropy'
    case 'CategoricalCrossentropy':
      return 'categoricalCrossentropy'

    default:
      console.warn("createLoss()", { idLoss })
      return 'categoricalCrossentropy'
  }
}

/**
 * 0  => binaryAccuracy
 * 1  => binaryCrossEntropy
 * 2  => categoricalAccuracy
 * 3  => categoricalCrossentropy
 * 4  => cosineProximity
 * 5  => meanAbsoluteError
 * 6  => meanAbsolutePercentageError
 * 7  => meanSquaredError
 * 8  => precision
 * 9  => recall
 * 10 => sparseCategoricalAccuracy
 * 11 => accuracy
 *
 * @param idMetrics
 * @returns {string[]}
 */
export function createMetrics(idMetrics) {
  console.log({ idMetrics })
  switch (idMetrics) {
    case 0:
      return ['binaryAccuracy']
    case 1:
      return ['binaryCrossEntropy']
    case 2:
      return ['categoricalAccuracy']
    case 3:
      return ['categoricalCrossentropy']
    case 4:
      return ['cosineProximity']
    case 5:
      return ['meanAbsoluteError']
    case 6:
      return ['meanAbsolutePercentageError']
    case 7:
      return ['meanSquaredError']
    case 8:
      return ['precision']
    case 9:
      return ['recall']
    case 10:
      return ['sparseCategoricalAccuracy']
    case 11:
      return ['accuracy']

    default:
      console.warn("createMetrics()", { idMetrics })
      return ['accuracy']
  }
}

export const TYPE_OPTIMIZER_OBJECT = {
  Sgd: 'Sgd',
  Momentum: 'Momentum',
  Adagrag: 'Adagrag',
  Adadelta: 'Adadelta',
  Adam: 'Adam',
  Adamax: 'Adamax',
  Rmsprop: 'Rmsprop',
}
export const TYPE_OPTIMIZER = Object.values(TYPE_OPTIMIZER_OBJECT)

export const TYPE_LOST_OBJECT = {
  AbsoluteDifference: 'AbsoluteDifference',
  ComputeWeightedLoss: 'ComputeWeightedLoss',
  CosineDistance: 'CosineDistance',
  HingeLoss: 'HingeLoss',
  HuberLoss: 'HuberLoss',
  LogLoss: 'LogLoss',
  MeanSquaredError: 'MeanSquaredError',
  SigmoidCrossEntropy: 'SigmoidCrossEntropy',
  SoftmaxCrossEntropy: 'SoftmaxCrossEntropy',
  CategoricalCrossentropy: 'CategoricalCrossentropy',
}
export const TYPE_LOSS = Object.values(TYPE_LOST_OBJECT)

export const TYPE_METRICS_OBJECT = {
  BinaryAccuracy: 'BinaryAccuracy',
  BinaryCrossentropy: 'BinaryCrossentropy',
  CategoricalAccuracy: 'CategoricalAccuracy',
  CategoricalCrossentropy: 'CategoricalCrossentropy',
  CosineProximity: 'CosineProximity',
  MeanAbsoluteError: 'MeanAbsoluteError',
  MeanAbsolutePercentageErr: 'MeanAbsolutePercentageErr',
  MeanSquaredError: 'MeanSquaredError',
  Precision: 'Precision',
  Recall: 'Recall',
  SparseCategoricalAccuracy: 'SparseCategoricalAccuracy',
  Accuracy: 'Accuracy',
}
export const TYPE_METRICS = Object.values(TYPE_METRICS_OBJECT)

export const TYPE_ACTIVATION_OBJECT = {
  Sigmoid: 'Sigmoid',
  Softmax: 'Softmax',
}
export const TYPE_ACTIVATION = Object.values(TYPE_ACTIVATION_OBJECT)

export const TYPE_CLASS_OBJECT = {
  Conv2D: 'Conv2D',
  MaxPooling2D: 'MaxPooling2D',
}

export const TYPE_CLASS = Object.values(TYPE_CLASS_OBJECT)

export function objectToSelectOptions(obj) {
  return Object.entries(obj).map((v) => {
    return {
      key: v[0].toLowerCase(),
      label: v[0],
    }
  })
}
