import * as tf from '@tensorflow/tfjs'
import * as tfvis from '@tensorflow/tfjs-vis'
import { getClassesFromDataSet, trainTestSplit } from "./ClassificationHelper";
import { isProduction } from "../../utils/utils";


/*
export async function createClassicClassification(learningRate, unknownRate, numberOfEpoch, sLOptimizer, layerList, idLoss, idMetrics) {
  const [xTrain, yTrain, xTest, yTest] = getData(unknownRate, IRIS_CLASSES, IRIS_DATA)

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
      units     : layer.units,
      activation: layer.activation.toLowerCase(),
      ...(index === 0) && { inputShape: [xTrain.shape[1]] },
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
    name  : 'Entrenamiento del modelo',
    tab   : 'Entrenamiento',
    styles: {
     // height: '1000px'
    },
  }

  const fitCallbacks = tfvis.show.fitCallbacks(containerFitCallbacks, metrics_labels, {
    callbacks: ['onEpochEnd'],
  })

  const history = await model.fit(xTrain, yTrain, {
    epochs        : numberOfEpoch,
    validationData: [xTest, yTest],
    callbacks     : fitCallbacks,
  })

  console.log('Layer list', { layerList })
  console.log('Tensor sequential compile', { model })
  console.log('xTRAIN', { xTrain })
  console.log('History', { history })
  console.log('Configuration model', { config: model.getConfig() })

  return model
}
*/

export async function createTabularClassificationCustomDataSet_upload(params) {
  console.log(params)
  const {
    learningRate,
    testSize,
    numberOfEpoch,
    layerList,
    idOptimizer,
    idLoss,
    idMetrics,

    Xtrain,
    ytrain
  } = params
  console.log({ Xtrain_shape: Xtrain.shape })

  const model = tf.sequential()
  for (const layer of layerList) {
    const index = layerList.indexOf(layer);
    model.add(tf.layers.dense({
      units     : layer.units,
      activation: layer.activation.toLowerCase(),
      ...(index === 0) && {
        inputShape: [Xtrain.shape[1]]
      },
    }))
  }


  const optimizer = createOptimizer(idOptimizer, { learningRate })
  const loss = createLoss(idLoss, {})
  const metrics = createMetrics(idMetrics, {})

  // Compilamos el modelo
  model.compile({
    optimizer: optimizer,
    loss     : loss,
    metrics  : metrics
  })

  // Creamos las métricas que van a aparecer en los gráficos
  const fit_callbacks_metrics_labels = ['loss', 'val_loss', 'acc', 'val_acc']
  const fit_callbacks_container = {
    name  : 'Historial del entrenamiento',
    tab   : 'Entrenamiento',
    styles: { height: '1000px' }
  }
  const fitCallbacks = tfvis.show.fitCallbacks(fit_callbacks_container, fit_callbacks_metrics_labels, {
    callbacks: [
      // 'onBatchEnd',
      'onEpochEnd'
    ],
  })

  if (!isProduction()) console.log("En este punto perdí la poca cordura que me quedaba", { Xtrain, ytrain })
  await model.fit(Xtrain, ytrain, {
    validationSplit: testSize,
    epochs         : numberOfEpoch,
    callbacks      : fitCallbacks
  })

  return model
}

export async function createTabularClassificationCustomDataSet(params) {
  const {
    learningRate,
    testSize,
    numberOfEpoch,
    layerList,
    dataset_JSON,
    idOptimizer,
    idLoss,
    idMetrics
  } = params
  const [DATA, ARRAY_TARGETS, DATA_SET_CLASSES] = getClassesFromDataSet(dataset_JSON)
  const [xTrain, yTrain, xTest, yTest] = trainTestSplit(DATA, ARRAY_TARGETS, testSize)
  // Modo secuencial
  if (!isProduction()) console.debug("createTabularClassificationCustomDataSet", params)
  if (!isProduction()) console.debug("getClassesFromDataSet", { DATA, ARRAY_TARGETS, DATA_SET_CLASSES })
  if (!isProduction()) console.debug("trainTestSplit", { xTrain, yTrain, xTest, yTest })


  const model = tf.sequential()
  // Agregamos las capas
  for (const layer of layerList) {
    const index = layerList.indexOf(layer);
    model.add(tf.layers.dense({
      units     : layer.units,
      activation: layer.activation.toLowerCase(),
      ...(index === 0) && {
        inputShape: [xTrain.shape[1]]
      },
    }))
  }

  const optimizer = createOptimizer(idOptimizer, { learningRate })
  const loss = createLoss(idLoss, {})
  const metrics = createMetrics(idMetrics, {})

  // Compilamos el modelo
  model.compile({
    optimizer: optimizer,
    loss     : loss,
    metrics  : metrics
  })

  // Creamos las métricas que van a aparecer en los gráficos
  const fit_callbacks_metrics_labels = ['loss', 'val_loss', 'acc', 'val_acc']
  const fit_callbacks_container = {
    name  : 'Historial del entrenamiento',
    tab   : 'Entrenamiento',
    styles: { height: '1000px' }
  }
  const fitCallbacks = tfvis.show.fitCallbacks(fit_callbacks_container, fit_callbacks_metrics_labels, {
    callbacks: [
      // 'onBatchEnd',
      'onEpochEnd'
    ],
  })

  if (!isProduction()) console.log("En este punto perdí la poca cordura que me quedaba", { xTrain, yTrain })
  await model.fit(xTrain, yTrain, {
    epochs        : numberOfEpoch,
    validationData: [xTest, yTest],
    callbacks     : fitCallbacks
  })

  return Promise.resolve([model, ARRAY_TARGETS, DATA_SET_CLASSES])
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
export function createOptimizer(idOptimizer, params) {
  if (!isProduction()) console.debug(">> createOptimizer", { idOptimizer, params })

  let { learningRate = 0.01 } = params
  switch (idOptimizer) {
    case 'sgd':
      return tf.train.sgd(learningRate)
    case 'momentum':
      let { momentum = 0.99 } = params
      return tf.train.momentum(learningRate, momentum)
    case 'adagrad':
      return tf.train.adagrad(learningRate)
    case 'adadelta':
      return tf.train.adadelta(learningRate)
    case 'adam':
      return tf.train.adam(learningRate)
    case 'adamax':
      return tf.train.adamax(learningRate)
    case 'rmsprop':
      return tf.train.rmsprop(learningRate)

    default:
      console.warn("createOptimizer()", { idOptimizer, params })
      return tf.train.adam(learningRate)
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
 * @param params
 * @returns {string}
 */
export function createLoss(idLoss, params) {
  if (!isProduction()) console.debug(">> createLoss", { idLoss, params })
  //
  // https://github.com/tensorflow/tfjs/issues/1315
  switch (idLoss) {
    case 'absoluteDifference':
      return [tf.losses.absoluteDifference]
    case 'computeWeightedLoss':
      return [tf.losses.computeWeightedLoss]
    case 'cosineDistance':
      return [tf.losses.cosineDistance]
    case 'hingeLoss':
      return [tf.losses.hingeLoss]
    case 'huberLoss':
      return [tf.losses.huberLoss]
    case 'logLoss':
      return [tf.losses.logLoss]
    case 'meanSquaredError':
      return [tf.losses.meanSquaredError]
    case 'sigmoidCrossEntropy':
      return [tf.losses.sigmoidCrossEntropy]
    case 'softmaxCrossEntropy':
      return [tf.losses.softmaxCrossEntropy]
    // Metric
    case 'categoricalCrossentropy':
      return 'categoricalCrossentropy'

    default:
      console.warn("createLoss()", { idLoss })
      return 'categoricalCrossentropy'
  }
}

/**
 * 0  => binaryAccuracy
 * 1  => binaryCrossentropy
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
 * @param params
 * @returns {string[]}
 */
export function createMetrics(idMetrics, params) {
  if (!isProduction()) console.debug(">> createMetrics", { idMetrics, params })

  switch (idMetrics) {
    case 'binaryAccuracy':
      return [tf.metrics.binaryAccuracy]
    case 'binaryCrossentropy':
      return [tf.metrics.binaryCrossentropy]
    case 'categoricalAccuracy':
      return [tf.metrics.categoricalAccuracy]
    case 'categoricalCrossentropy':
      return [tf.metrics.categoricalCrossentropy]
    case 'cosineProximity':
      return [tf.metrics.cosineProximity]
    case 'meanAbsoluteError':
      return [tf.metrics.meanAbsoluteError]
    case 'meanAbsolutePercentageError':
      return [tf.metrics.meanAbsolutePercentageError]
    case 'meanSquaredError':
      return [tf.metrics.meanSquaredError]
    case 'precision':
      return [tf.metrics.precision]
    case 'recall':
      return [tf.metrics.recall]
    case 'sparseCategoricalAccuracy':
      return [tf.metrics.sparseCategoricalAccuracy]
    // DEFAULT Tensorflow js
    case 'accuracy':
      return ['accuracy']

    default:
      console.warn("createMetrics()", { idMetrics })
      return ['accuracy']
  }
}

