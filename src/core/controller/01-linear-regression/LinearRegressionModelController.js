import * as tfjs from '@tensorflow/tfjs'
import * as tfvis from '@tensorflow/tfjs-vis'
import * as dfd from 'danfojs'
import * as sk from 'scikitjs'

import * as _Types from '@core/types'
import { createLoss, createMetrics, createOptimizer } from '@core/nn-utils/ArchitectureHelper'

sk.setBackend(dfd.tensorflow)

/**
 * @typedef {Object} CustomLinearRegression_DatasetParams_t
 * @property {_Types.DatasetProcessed_t} dataset_processed
 * @property {string} [name_model = 'Linear Regression']
 * @property {Array} layerList
 * @property {number} [learningRate = 0.01] Rango [0 - 1]
 * @property {number} [momentum = 0]
 * @property {number} [testSize = 0.3]
 * @property {number} numberOfEpoch
 * @property {string} idOptimizer
 * @property {string} idLoss
 * @property {string|string[]} idMetrics
 */

/**
 *
 * @param {CustomLinearRegression_DatasetParams_t} params
 * @returns {Promise<tfjs.Sequential>}
 */
export async function createLinearRegressionCustomModel (params) {
  const {
    dataset_processed,
    name_model = 'Linear regression',
    layerList,
    learningRate = 0.01,
    momentum = 0,
    testSize = 0.3,
    numberOfEpoch,
    idOptimizer,
    idLoss,
    idMetrics,
  } = params
  tfvis.visor().open()
  // console.log({ tfjs_backend: tfjs.getBackend() })

  const { data_processed } = dataset_processed
  const { X, y } = data_processed
  console.log({ dataset_processed, X, y })

  // @ts-ignore
  const [XTrain, XTest, yTrain, yTest] = sk.trainTestSplit(X.values, y.values, testSize)
  const XTrain_tensor = tfjs.tensor(XTrain)
  const XTest_tensor = tfjs.tensor(XTest)
  const yTrain_tensor = tfjs.tensor(yTrain)
  const yTest_tensor = tfjs.tensor(yTest)

  // console.log({
  //   o: [XTrain, XTest, yTrain, yTest], 
  //   t: [XTrain_tensor, XTest_tensor, yTrain_tensor, yTest_tensor]
  // })
  
  const model = new tfjs.Sequential()
  for (const [index, layer] of layerList.entries()) {
    const _layer = tfjs.layers.dense({
      units     : layer.units,
      activation: layer.activation,
      ...(index === 0) && {
        inputShape: [X.shape[1]],
      },
    })
    model.add(_layer)
  }

  const optimizer = createOptimizer(idOptimizer, { learningRate, momentum })
  const loss = createLoss(idLoss, {})
  const metrics = createMetrics(idMetrics, {})
  model.compile({ optimizer, loss, metrics })

  // @ts-ignore
  await tfvis.show.modelSummary({ name: 'Model Summary', tab: name_model }, model)
  
  const fit_callbacks_container = {
    name: 'Training',
    tab : name_model,
  }
  const fit_callbacks_metrics_labels = ['loss', 'val_loss', 'acc', 'val_acc']
  const fitCallbacks = tfvis.show.fitCallbacks(fit_callbacks_container, fit_callbacks_metrics_labels, { 
    callbacks: [
      'onBatchEnd',
      'onEpochEnd'
    ] 
  })
  await model.fit(XTrain_tensor, yTrain_tensor, {
    batchSize     : 32,
    shuffle       : true,
    validationData: [XTest_tensor, yTest_tensor],
    epochs        : numberOfEpoch,
    callbacks     : fitCallbacks,
  })

  return model
}