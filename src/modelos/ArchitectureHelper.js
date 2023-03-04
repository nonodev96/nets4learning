import * as tf from '@tensorflow/tfjs'
import * as tfvis from '@tensorflow/tfjs-vis'
import { alertError } from '../utils/alertHelper'


// TODO: prueba, eliminar function
export async function createArchitecture(type, learningRate, numberOfEpoch, optimizer, shape) {
  const model = type

  const layerList = []
  layerList.push(tf.layers.dense({ units: 10, activation: 'sigmoid', inputShape: [shape] }))
  layerList.push(tf.layers.dense({ units: 3, activation: 'softmax' }))

  for (const layer of layerList) {
    model.add(layer)
  }

  model.compile({
    optimizer: optimizer,
    loss     : 'categoricalCrossentropy',
    metrics  : ['accuracy'],
  })
}

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

export async function createClassicClassificationCustomDataSet(learningRate, testSize, numberOfEpoch, idOptimizer, layerList, idLoss, idMetrics, dataSet) {
  const [DATA_SET, TARGET_SET_CLASSES, DATA_SET_CLASSES] = await getClassesFromDataSet(dataSet)
  const [xTrain, yTrain, xTest, yTest] = trainTestSplit(DATA_SET, TARGET_SET_CLASSES, testSize)
  // Modo secuencial
  const model = tf.sequential()

  // Agregamos las capas
  layerList.forEach((layer, index) => {
    model.add(tf.layers.dense({
      units     : layer.units,
      activation: layer.activation.toLowerCase(),
      ...(index === 0) && {
        inputShape: [xTrain.shape[1]]
      },
    }))
  })

  const optimizer = createOptimizer(idOptimizer, { learningRate })
  const loss = createLoss(idLoss)
  const metrics = createMetrics(idMetrics)

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
    styles: {
      height: '1000px'
    }
  }
  const fitCallbacks = tfvis.show.fitCallbacks(fit_callbacks_container, fit_callbacks_metrics_labels, {
    callbacks: [
      'onEpochEnd',
      'onBatchEnd'
    ],
  })

  await model.fit(xTrain, yTrain, {
    epochs        : numberOfEpoch,
    validationData: [xTest, yTest],
    callbacks     : fitCallbacks
  })

  return Promise.resolve([model, TARGET_SET_CLASSES, DATA_SET_CLASSES])
}

export async function getClassesFromDataSet(dataSet) {
  try {
    let dataAux = []
    const typePos = dataSet.data[0].length - 1
    for (let i = 0; i <= typePos; i++) {
      dataAux.push([])
    }

    for (const array of dataSet.data) {
      for (let index = 0; index <= typePos; index++) {
        dataAux[index].push(array[index])
      }
    }

    // Pasamos los atributos a identificadores
    // Por columna (atributo) vamos Mapa con K = el valor del atributo y V = ID del atributo
    const indexDataAux = []
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
    for (const array of dataSet.data) {
      let aux = []
      for (let index = 0; index <= typePos; index++) {
        aux.push(indexDataAux[index].get(array[index]))
      }
      dataAux.push(aux)
    }

    const targetData = []
    for (let val of indexDataAux[typePos].keys()) {
      targetData.push(val)
    }
    console.log("Quiero llorar: ", { dataAux, targetData, indexDataAux })
    return [dataAux, targetData, indexDataAux]
  } catch (error) {
    console.error(error)
    await alertError(error)
  }
}

export function convertToTensors(data, targets, testSize, numClasses) {
  const numExamples = data.length;
  if (numExamples !== targets.length) {
    throw new Error("data and split have different numbers of examples");
  }

  // Split the data into a training set and a tet set, based on `testSize`.
  const numTestExamples = Math.round(numExamples * testSize);
  const numTrainExamples = numExamples - numTestExamples;

  const xDims = data[0].length;

  // Create a `tf.Tensor` to hold the feature data.
  //var dataByClass = tf.oneHot(dataByClass2, 27);
  const xs = tf.tensor2d(data, [numExamples, xDims]);
  // console.log(targets)
  // Create a 1D `tf.Tensor` to hold the labels, and convert the number label
  // from the set {0, 1, 2} into one-hot encoding (.e.g., 0 --> [1, 0, 0]).
  const ys = tf.oneHot(tf.tensor1d(targets).toInt(), numClasses);

  // Split the data into training and test sets, using `slice`.
  // console.log("Este es el xTrain dentro del convert to tensors", data, xDims)
  const xTrain = xs.slice(
    [0, 0],
    [numTrainExamples, xDims]
  );
  const xTest = xs.slice(
    [numTrainExamples, 0],
    [numTestExamples, xDims]
  );
  const yTrain = ys.slice(
    [0, 0],
    [numTrainExamples, numClasses]
  );
  const yTest = ys.slice(
    [0, 0],
    [numTestExamples, numClasses]
  );
  return [xTrain, yTrain, xTest, yTest];
}

function trainTestSplit(data, classes, testSize) {
  return tf.tidy(() => {
    const dataByClass = [];
    const targetByClass = [];
    for (let i = 0; i < classes.length; i++) {
      dataByClass.push([]);
      targetByClass.push([]);
    }
    for (const example of data) {
      const target = example[example.length - 1];
      const data = example.slice(0, example.length - 1);

      dataByClass[target].push(data);
      targetByClass[target].push(target);
    }
    const xTrains = [], yTrains = [], xTests = [], yTests = [];
    for (let i = 0; i < classes.length; i++) {
      const [xTrain, yTrain, xTest, yTest] = convertToTensors(dataByClass[i], targetByClass[i], testSize, classes.length);
      xTrains.push(xTrain);
      yTrains.push(yTrain);
      xTests.push(xTest);
      yTests.push(yTest);
    }

    const concatAxis = 0;
    return [
      tf.concat(xTrains, concatAxis),
      tf.concat(yTrains, concatAxis),
      tf.concat(xTests, concatAxis),
      tf.concat(yTests, concatAxis),
    ];
  });
}

export async function trainModel(xTrain, yTrain, xTest, yTest, verbose) {
  // https://www.tensorflow.org/js/guide/models_and_layers
  const model = tf.sequential();
  model.add(tf.layers.dense({
    inputShape: [xTrain.shape[1]],
    units     : 10,
    activation: "sigmoid",
  }));

  model.add(tf.layers.dense({
    units     : 3,
    activation: "softmax"
  }));

  const learningRate = 0.01;
  const numberOfEpoch = 40;
  const optimizer = tf.train.adam(learningRate);
  model.compile({
    optimizer: optimizer,
    loss     : "categoricalCrossentropy",
    metrics  : ["accuracy"],
  });

  const history = await model.fit(xTrain, yTrain, {
    epochs        : numberOfEpoch,
    validationData: [xTest, yTest],
    callbacks     : {
      onEpochEnd: async (epoch, logs) => {
        if (verbose) {
          document.getElementById("demo").innerHTML += `
<p>EPOCH (${epoch + 1}): </p>
<ul>
  <li>Train Accuracy: ${(logs.acc * 100).toFixed(2)}</li>
  <li>  Val Accuracy: ${(logs.val_acc * 100).toFixed(2)}</li>
</ul>
`;
        }
        await tf.nextFrame();
      },
    },
  });
  console.log("History " + history.history.loss[0]);

  return model;
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
  console.debug({ idOptimizer, params })

  let { learningRate = 0.01 } = params
  switch (idOptimizer) {
    case 'sgd':
      return tf.train.sgd(learningRate)
    case 'momentum':
      let { momentum = 0.99 } = params
      return tf.train.momentum(learningRate, momentum)
    case 'adagrag':
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
 * @returns {string}
 */
export function createLoss(idLoss, params) {
  console.debug({ idLoss, params })

  switch (idLoss) {
    case 'absoluteDifference':
      return 'absoluteDifference'
    case 'computeWeightedLoss':
      return 'computeWeightedLoss'
    case 'cosineDistance':
      return 'cosineDistance'
    case 'hingeLoss':
      return 'hingeLoss'
    case 'huberLoss':
      return 'huberLoss'
    case 'logLoss':
      return 'logLoss'
    case 'meanSquaredError':
      return 'meanSquaredError'
    case 'sigmoidCrossEntropy':
      return 'sigmoidCrossEntropy'
    case 'softmaxCrossEntropy':
      return 'softmaxCrossEntropy'
    case 'categoricalCrossentropy':
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
export function createMetrics(idMetrics, params) {
  console.debug({ idMetrics, params })

  switch (idMetrics) {
    case 'binaryAccuracy':
      return ['binaryAccuracy']
    case 'binaryCrossentropy':
      return ['binaryCrossEntropy']
    case 'categoricalAccuracy':
      return ['categoricalAccuracy']
    case 'categoricalCrossentropy':
      return ['categoricalCrossentropy']
    case 'cosineProximity':
      return ['cosineProximity']
    case 'meanAbsoluteError':
      return ['meanAbsoluteError']
    case 'meanAbsolutePercentageError':
      return ['meanAbsolutePercentageError']
    case 'meanSquaredError':
      return ['meanSquaredError']
    case 'precision':
      return ['precision']
    case 'recall':
      return ['recall']
    case 'sparseCategoricalAccuracy':
      return ['sparseCategoricalAccuracy']
    // DEFAULT Tensorflow js
    case 'accuracy':
      return ['accuracy']

    default:
      console.warn("createMetrics()", { idMetrics })
      return ['accuracy']
  }
}

export const TYPE_OBJECT_GRADIENTS = {
  grad         : "grad",
  grads        : "grads",
  customGrad   : "customGrad",
  valueAndGrad : "valueAndGrad",
  valueAndGrads: "valueAndGrads",
  variableGrads: "variableGrads",
}
export const TYPE_GRADIENTS = Object.entries(TYPE_OBJECT_GRADIENTS)

const TYPE_OBJECT_OPTIMIZER = {
  sgd     : 'SGD',
  momentum: 'Momentum',
  adagrad : 'Adagrad',
  adadelta: 'Adadelta',
  adam    : 'Adam',
  adamax  : 'Adamax',
  rmsprop : 'RMSProp',
}
export const TYPE_OPTIMIZER = Object.entries(TYPE_OBJECT_OPTIMIZER)

// tf.losses.absoluteDifference
// tf.losses.computeWeightedLoss
// tf.losses.cosineDistance
// tf.losses.hingeLoss
// tf.losses.huberLoss
// tf.losses.logLoss
// tf.losses.meanSquaredError
// tf.losses.sigmoidCrossEntropy
// tf.losses.softmaxCrossEntropy
export const TYPE_OBJECT_LOSSES = {
  absoluteDifference : 'AbsoluteDifference',
  computeWeightedLoss: 'ComputeWeightedLoss',
  cosineDistance     : 'CosineDistance',
  hingeLoss          : 'HingeLoss',
  huberLoss          : 'HuberLoss',
  logLoss            : 'LogLoss',
  meanSquaredError   : 'MeanSquaredError',
  sigmoidCrossEntropy: 'SigmoidCrossEntropy',
  softmaxCrossEntropy: 'SoftmaxCrossEntropy',
}
export const TYPE_LOSSES = Object.entries(TYPE_OBJECT_LOSSES)

// Metrics
// tf.metrics.binaryAccuracy
// tf.metrics.binaryCrossentropy
// tf.metrics.categoricalAccuracy
// tf.metrics.categoricalCrossentropy
// tf.metrics.cosineProximity
// tf.metrics.meanAbsoluteError
// tf.metrics.meanAbsolutePercentageError
// tf.metrics.meanSquaredError
// tf.metrics.precision
// tf.metrics.recall
// tf.metrics.sparseCategoricalAccuracy
export const TYPE_OBJECT_METRICS = {
  binaryAccuracy             : 'BinaryAccuracy',
  binaryCrossentropy         : 'BinaryCrossentropy',
  categoricalAccuracy        : 'CategoricalAccuracy',
  categoricalCrossentropy    : 'CategoricalCrossentropy',
  cosineProximity            : 'CosineProximity',
  meanAbsoluteError          : 'MeanAbsoluteError',
  meanAbsolutePercentageError: 'MeanAbsolutePercentageError',
  meanSquaredError           : 'MeanSquaredError',
  precision                  : 'Precision',
  recall                     : 'Recall',
  sparseCategoricalAccuracy  : 'SparseCategoricalAccuracy',
  accuracy                   : 'Accuracy'
}
export const TYPE_METRICS = Object.entries(TYPE_OBJECT_METRICS)

const TYPE_OBJECT_ACTIVATION = {
  sigmoid    : 'sigmoid',
  softmax    : 'softmax',
  elu        : 'elu',
  hardSigmoid: 'hardSigmoid',
  linear     : 'linear',
  relu       : 'relu',
  relu6      : 'relu6',
  selu       : 'selu',
  softplus   : 'softplus',
  softsign   : 'softsign',
  tanh       : 'tanh',
  swish      : 'swish',
  mish       : 'mish',
}
export const TYPE_ACTIVATION = Object.entries(TYPE_OBJECT_ACTIVATION)

export const TYPE_OBJECT_CLASS = {
  Conv2D      : 'Conv2D',
  MaxPooling2D: 'MaxPooling2D',
}
export const TYPE_CLASS = Object.values(TYPE_OBJECT_CLASS)

export function objectToSelectOptions(obj) {
  return Object.entries(obj).map((v) => {
    return {
      key  : v[0].toLowerCase(),
      label: v[0],
    }
  })
}
