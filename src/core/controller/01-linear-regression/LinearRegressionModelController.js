import * as tfjs from '@tensorflow/tfjs'
import * as tfvis from '@tensorflow/tfjs-vis'
import * as dfd from 'danfojs'
import * as sk from 'scikitjs'
import { createLoss, createMetrics, createOptimizer } from '@core/nn-utils/ArchitectureHelper'

sk.setBackend(dfd.tensorflow)

/**
 * @typedef {Object} CustomLinearRegression_DatasetParams_t
 * @property {DatasetProcessed_t} dataset_processed
 * @property {Array} layerList
 * @property {number} learningRate
 * @property {number} testSize
 * @property {number} numberOfEpoch
 * @property {string} idOptimizer
 * @property {string} idLoss
 * @property {string} idMetrics
 */

/**
 *
 * @param {CustomLinearRegression_DatasetParams_t} params
 * @returns {Promise<tfjs.Sequential>}
 */
export async function createLinearRegressionCustomModel (params) {
  const {
    dataset_processed,
    layerList,
    learningRate,
    testSize,
    numberOfEpoch,
    idOptimizer,
    idLoss,
    idMetrics,
  } = params
  tfvis.visor().open()

  const { data_processed } = dataset_processed
  const { X, y } = data_processed
  console.log({ dataset_processed, X, y })

  const [XTrain, XTest, yTrain, yTest] = sk.trainTestSplit(X.values, y.values, testSize)
  const XTrain_tensor = tfjs.tensor(XTrain)
  const XTest_tensor = tfjs.tensor(XTest)
  const yTrain_tensor = tfjs.tensor(yTrain)
  const yTest_tensor = tfjs.tensor(yTest)
  
  // region Define model
  const model = tfjs.sequential()
  for (const layer of layerList) {
    const index = layerList.indexOf(layer)
    const _layer = tfjs.layers.dense({
      units     : layer.units,
      activation: layer.activation.toLowerCase(),
      ...(index === 0) && {
        inputShape: [X.shape[1]],
      },
    })
    model.add(_layer)
  }

  const optimizer = createOptimizer(idOptimizer, { learningRate })
  const loss = createLoss(idLoss, {})
  const metrics = createMetrics(idMetrics, {})
  model.compile({ optimizer, loss, metrics })

  await tfvis.show.modelSummary({
    name: 'Model Summary',
    tab : 'Model Summary',
  }, model)

  
  const fit_callbacks_metrics_labels = ['loss', 'val_loss', 'acc', 'val_acc']
  const fit_callbacks_container = {
    name: 'Training',
    tab : 'Training',
  }
  const fitCallbacks = tfvis.show.fitCallbacks(fit_callbacks_container, fit_callbacks_metrics_labels, { callbacks: ['onBatchEnd', 'onEpochEnd'] })
  await model.fit(XTrain_tensor, yTrain_tensor, {
    batchSize     : 32,
    shuffle       : true,
    validationData: [XTest_tensor, yTest_tensor],
    epochs        : numberOfEpoch,
    callbacks     : fitCallbacks,
  })

  return model
}