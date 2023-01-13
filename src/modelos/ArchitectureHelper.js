import * as tf from '@tensorflow/tfjs'
import * as clasificador from './Clasificador'
import * as tfvis from '@tensorflow/tfjs-vis'
import { alertError } from '../utils/alertHelper'

export function getIrisDataType(id) {
  return clasificador.IRIS_CLASSES[id]
}

//TODO: prueba, eliminar funcion
export const clasificacionClasica = async function createArchitecture(
  type,
  learningRate,
  numberOfEpoch,
  optimizer,
  shape,
) {
  const model = type
  const lR = learningRate
  const nOE = numberOfEpoch
  const opt = optimizer

  model.add(
    tf.layers.dense({
      units: 10,
      activation: 'sigmoid',
      inputShape: [shape],
    }),
  )

  model.add(tf.layers.dense({ units: 3, activation: 'softmax' }))

  model.compile({
    optimizer: optimizer,
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy'],
  })
}

export async function createClassicClassification(
  learningRate,
  unknownRate,
  numberOfEpoch,
  sLOptimizer,
  layerList,
  idLoss,
  idMetrics,
) {
  const [xTrain, yTrain, xTest, yTest] = clasificador.getData(
    unknownRate,
    clasificador.IRIS_CLASSES,
    clasificador.IRIS_DATA,
  )

  document.getElementById('salida').innerHTML +=
    '<p>MODELO CREADO A PARTIR DE: <b>learningRate:</b> ' +
    learningRate +
    ' <b>unknownRate:</b> ' +
    unknownRate +
    ' <b>numberOfEpoch:</b> ' +
    numberOfEpoch +
    ' <b>sLOptimizer:</b> ' +
    sLOptimizer +
    ' <b>idLoss:</b> ' +
    idLoss +
    ' <b>idMetrics:</b> ' +
    idMetrics +
    '</p>'

  //modo secuencial
  const model = tf.sequential()
  const optimizer = createOptimizer(learningRate, sLOptimizer)
  const loss = createLoss(idLoss)
  const metrics = createMetrics(idMetrics)

  console.log('Tennsor secuencial', model)
  console.log('Forma', model.shape)
  console.log('ESTAS SON LAS UNIDADES DE LAS CAPAS', layerList)
  //Agregamos las capas
  layerList.forEach((layer, index) => {
    if (index === 0) {
      model.add(
        tf.layers.dense({
          units: layer.units,
          activation: layer.activation.toLowerCase(),
          inputShape: [xTrain.shape[1]],
        }),
      )
    } else {
      model.add(
        tf.layers.dense({
          units: layer.units,
          activation: layer.activation.toLowerCase(),
        }),
      )
    }
    console.log(layer)
    console.log('Tennsor secuencial ' + index, model)
    console.log('Forma ' + index, model.shape)
  })

  //Compilamos el modelo
  model.compile({
    optimizer: optimizer,
    loss: loss,
    metrics: metrics,
  })

  //Mostramos la información del modelo en el panel lateral
  tfvis.show.modelSummary(
    { name: 'Arquitectura del modelo', tab: 'Modelo' },
    model,
  )

  console.log('Tennsor secuencial COMPILE', model)
  console.log('Forma', model.shape)
  console.log('ESTA ES LA FORMA DE XTRAIN', xTrain)

  //Creamos las métricas que van a aparecer en los gráficos
  const metrics2 = ['loss', 'val_loss', 'acc', 'val_acc']
  const container = {
    name: 'Entrenamiento del modelo',
    tab: 'Entrenamiento',
    styles: { height: '1000px' },
  }

  const fitCallbacks = tfvis.show.fitCallbacks(container, metrics2, {
    callbacks: ['onEpochEnd'],
  })

  const history = await model.fit(xTrain, yTrain, {
    epochs: numberOfEpoch,
    validationData: [xTest, yTest],
    callbacks: fitCallbacks,
  })

  console.log('Tensor secuencial TRAIN', model)
  console.log('Forma', model.shape)
  console.log(model)
  return model
}

export async function createClassicClassificationCustomDataSet(
  learningRate,
  unknowRate,
  numberOfEpoch,
  sLOptimizer,
  layerList,
  idLoss,
  idMetrics,
  dataSet,
) {
  const [
    DATA_SET,
    TARGET_SET_CLASSES,
    DATA_SET_CLASSES,
  ] = getClassesFromDataSet(dataSet)

  const [xTrain, yTrain, xTest, yTest] = clasificador.getData(
    unknowRate,
    TARGET_SET_CLASSES,
    DATA_SET,
  )
  console.log(xTrain, yTrain, xTest, yTest)
  document.getElementById('salida').innerHTML +=
    '<p>MODELO CREADO A PARTIR DE: <b>learningRate:</b> ' +
    learningRate +
    ' <b>unknowRate:</b> ' +
    unknowRate +
    ' <b>numberOfEpoch:</b> ' +
    numberOfEpoch +
    ' <b>sLOptimizer:</b> ' +
    sLOptimizer +
    ' <b>idLoss:</b> ' +
    idLoss +
    ' <b>idMetrics:</b> ' +
    idMetrics +
    '</p>'

  //modo secuencial
  const model = tf.sequential()
  const optimizer = createOptimizer(learningRate, sLOptimizer)
  const loss = createLoss(idLoss)
  const metrics = createMetrics(idMetrics)

  console.log('loss', loss, idLoss, createLoss(idLoss))
  console.log('Tensor secuencial', model)
  console.log('Forma', model.shape)

  //Agregamos las capas
  layerList.forEach((layer, index) => {
    if (index === 0) {
      model.add(
        tf.layers.dense({
          units: layer.units,
          activation: layer.activation.toLowerCase(),
          inputShape: [xTrain.shape[1]],
        }),
      )
    } else {
      model.add(
        tf.layers.dense({
          units: layer.units,
          activation: layer.activation.toLowerCase(),
        }),
      )
    }

    console.log(layer)
    console.log('Tensor secuencial ' + index, model)
    console.log('Forma ' + index, model.shape)
  })

  //Compilamos el modelo
  model.compile({
    optimizer,
    loss,
    metrics,
  })

  console.log('Tensor secuencial COMPILE', model)
  console.log('Forma', xTrain.shape)

  //Creamos las métricas que van a aparecer en los gráficos
  const metrics2 = ['loss', 'val_loss', 'acc', 'val_acc']
  const container = {
    name: 'Entrenamiento del modelo',
    tab: 'Entrenamiento',
    styles: { height: '1000px' },
  }

  const fitCallbacks = tfvis.show.fitCallbacks(container, metrics2, {
    callbacks: ['onEpochEnd'],
  })

  await model.fit(xTrain, yTrain, {
    epochs: numberOfEpoch,
    validationData: [xTest, yTest],
    callbacks: fitCallbacks,
    // onEpochEnd: async (epoch, logs) => {
    //   document.getElementById('salida').innerHTML +=
    //     '<p>Epoch: ' + epoch + ' Logs:' + logs.loss + '</p>'
    //   await tf.nextFrame()
    // },
  })

  console.log(model)
  return [model, TARGET_SET_CLASSES, DATA_SET_CLASSES]
}

function getDataSetModif(dataSet, types) {
  const typePos = dataSet.datos[0].length - 1
  for (let i = 0; i < dataSet.datos.length; i++) {
    dataSet.datos[i][typePos] = types.findIndex(
      (types) => types === dataSet.datos[i][typePos],
    )
  }
  console.log('Aquí esta el data', dataSet.datos[0])
  return dataSet.datos
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
    console.log(dataAux, targetData, indexDataAux)
    return [dataAux, targetData, indexDataAux]
  } catch (error) {
    await alertError(error)
  }
}

// Devueve el optimizador seleccionado por el usuario
function createOptimizer(learningRate, idOptimizer) {
  console.log(idOptimizer, 'ESTE ES EL OPTIMIZADOR')
  switch (idOptimizer) {
    case 'Sgd':
      // Sgd,
      return tf.train.Sgd(learningRate)
    case 'Momentum':
      // momentum,
      return tf.train.momentum(learningRate)
    case 'Adagrag':
      // adagrag,
      return tf.train.adagrag(learningRate)
    case 'Adadelta':
      // adadelta,
      return tf.train.adadelta(learningRate)
    case 'Adam':
      // Adam,
      return tf.train.adam(learningRate)
    case 'Adamax':
      // adamax,
      return tf.train.adamax(learningRate)
    case 'Rmsprop':
      // rmsprop
      return tf.train.rmsprop(learningRate)

    default:
      return tf.train.adam(learningRate)
  }
}

export function createOptimizerId(idOptimizer) {
  switch (idOptimizer) {
    case 'Sgd':
      // Sgd,
      return tf.train.Sgd()
    case 'Momentum':
      // momentum,
      return tf.train.momentum()
    case 'Adagrag':
      // adagrag,
      return tf.train.adagrag()
    case 'Adadelta':
      // adadelta,
      return tf.train.adadelta()
    case 'Adam':
      // Adam,
      return tf.train.adam()
    case 'Adamax':
      // adamax,
      return tf.train.adamax()
    case 'Rmsprop':
      // rmsprop
      return tf.train.rmsprop()

    default:
      return tf.train.adam()
  }
}

// Devueve la pérdida seleccionada por el usuario
export function createLoss(idLoss) {
  switch (idLoss) {
    //categoricalCrossentropy??????
    case 'AbsoluteDifference':
      // absoluteDifference,
      return 'absoluteDifference'
    case 'ComputeWeightedLoss':
      // computeWeightedLoss,
      return 'computeWeightedLoss'
    case 'CosineDistance':
      // cosineDistance,
      return 'cosineDistance'
    case 'HingeLoss':
      // hingeLoss,
      return 'hingeLoss'
    case 'HuberLoss':
      // huberLoss,
      return 'huberLoss'
    case 'LogLoss':
      // logLoss,
      return 'logLoss'
    case 'MeanSquaredError':
      // meanSquaredError
      return 'meanSquaredError'
    case 'SigmoidCrossEntropy':
      // sigmoidCrossEntropy
      return 'sigmoidCrossEntropy'
    case 'SoftmaxCrossEntropy':
      // softmaxCrossEntropy
      return 'softmaxCrossEntropy'
    case 'CategoricalCrossentropy':
      return 'categoricalCrossentropy'

    default:
      return 'categoricalCrossentropy'
  }
}

// Devueve la métrica seleccionada por el usuario
export function createMetrics(idMetrics) {
  console.log(idMetrics, 'EL ID DE LA METRICa')
  switch (idMetrics) {
    case 0:
      // binaryAccuracy,
      return ['binaryAccuracy']
    case 1:
      // binaryCrossentropy,
      return ['binaryCrossentropy']
    case 2:
      // categoricalAccuracy,
      return ['categoricalAccuracy']
    case 3:
      // categoricalCrossentropy,
      return ['categoricalCrossentropy']
    case 4:
      // cosineProximity,
      return ['cosineProximity']
    case 5:
      // meanAbsoluteError,
      return ['meanAbsoluteError']
    case 6:
      // meanAbsolutePercentageError
      return ['meanAbsolutePercentageError']
    case 7:
      // meanSquaredError
      return ['meanSquaredError']
    case 8:
      // precision
      return ['precision']
    case 9:
      // recall
      return ['recall']
    case 10:
      // sparseCategoricalAccuracy
      return ['sparseCategoricalAccuracy']
    case 11:
      //accuracy
      return ['accuracy']

    default:
      return ['accuracy']
  }
}

// async function showAccuracy(model, data) {
//   const [preds, labels] = doPrediction(model, data)
//   const classAccuracy = await tfvis.metrics.perClassAccuracy(labels, preds)
//   const container = { name: 'Exactitud', tab: 'Evaluación' }
//   tfvis.show.perClassAccuracy(container, classAccuracy, classNames)

//   labels.dispose()
// }

// function doPrediction(model, data, testDataSize = 500) {

//   const testData = data.nextTestBatch(testDataSize)
//   const testxs = testData.xs.reshape([
//     testDataSize,
//     IMAGE_WIDTH,
//     IMAGE_HEIGHT,
//     1,
//   ])
//   const labels = testData.labels.argMax(-1)
//   const preds = model.predict(testxs).argMax(-1)

//   testxs.dispose()
//   return [preds, labels]
// }
