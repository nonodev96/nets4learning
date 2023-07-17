import * as tfjs from '@tensorflow/tfjs'
import * as tfvis from '@tensorflow/tfjs-vis'
import * as dfd from 'danfojs'
import { DataFrame } from 'danfojs'

import { isProduction } from '@utils/utils'

/**
 * @typedef TrainModelTensor_t
 * @property inputs: any
 * @property labels: any
 */

/**
 * @typedef  {'elu' | 'hardSigmoid' | 'linear' | 'relu' | 'relu6' | 'selu' | 'sigmoid' | 'softmax' | 'softplus' | 'softsign' | 'tanh' | 'swish' | 'mish'} ActivationIdentifier_t
 */

/**
 * @typedef  LRConfigFeatures_t
 * @property {Set<string>} X_features
 * @property {string} y_target
 */

/**
 * @typedef  LRConfigParams_t
 * @property {number} n_of_epochs
 */

/**
 * @typedef {{x: number, y: number}[]} Point_t
 */

/**
 * @typedef ConfigLayerInput_t
 * @property {number} [units=1] - El número de unidades en la capa de entrada.
 * @property {ActivationIdentifier_t} [activation="relu"] - La función de activación para la capa.
 * @property {number[]} [inputShape=[1]] - La forma de entrada.
 */

/**
 * @typedef ConfigLayers_t
 * @property {number} [units=1] - El número de unidades en la capa.
 * @property {ActivationIdentifier_t} [activation="relu"] - La función de activación para la capa.
 */

/**
 * @typedef ConfigLayerOutput_t
 * @property {number} [units=1] - El número de unidades en la capa de salida.
 * @property {ActivationIdentifier_t} [activation="relu"] - La función de activación para la capa de salida.
 */

/**
 * @typedef LRConfigFit_t
 * @property {number} batchSize
 * @property {number} epochs
 * @property {boolean} shuffle
 * @property {string[]} metrics
 */

/**
 * @typedef LRConfigCompile_t
 * @property {string} id_optimizer
 * @property {string} id_loss
 * @property {string[]} id_metrics
 * @property {object} params
 */

/**
 * @typedef LRConfigLayers_t
 * @property {{units: number, activation: ActivationIdentifier_t, inputShape: number[]}} input
 * @property {{units: number, activation: ActivationIdentifier_t}[]} layers
 * @property {{units: number, activation: ActivationIdentifier_t}} output
 */

/**
 * @typedef  LRConfig_t
 * @property {LRConfigFit_t} fit
 * @property {LRConfigCompile_t} compile
 * @property {LRConfigFeatures_t} features
 * @property {LRConfigLayers_t} layers
 */

export default class LinearRegressionModelController {

  /**
   * @type {LRConfig_t}
   */
  config

  /**
   *
   * @param {any} t
   * @param {dfd.DataFrame} dataframe
   */
  constructor (t, dataframe) {
    this.t = t
    this.dataframe = new DataFrame(dfd.toJSON(dataframe))
    this.config = {
      features: {
        X_features: new Set(),
        y_target  : '',
      },
      compile : {
        id_optimizer: 'adam',
        id_loss     : 'losses-meanSquaredError',
        id_metrics  : ['mse'],
        params   : {
          learningRate: 0.001,
          momentum    : 1
        }
      },
      fit     : {
        batchSize     : 32,
        epochs        : 50,
        shuffle       : true,
        metrics       : ['loss', 'mse'],
        container_name: 'Training Performance',
      },
      layers  : {
        input : { units: 1, activation: 'relu', inputShape: [1] },
        layers: [
          { units: 10, activation: 'relu' },
        ],
        output: { units: 1, activation: 'relu' },
      },
    }
  }

  /**
   *
   * @param {LRConfigFeatures_t} features
   **/
  setFeatures (features) {
    this.config.features.X_features = features.X_features
    this.config.features.y_target = features.y_target
  }

  /**
   *
   * @param {LRConfigFit_t} configFit
   **/
  setFit (configFit) {
    this.config.fit.epochs = configFit.epochs
    this.config.fit.metrics = configFit.metrics
    this.config.fit.batchSize = configFit.batchSize
    this.config.fit.shuffle = configFit.shuffle
  }

  /**
   *
   * @param {LRConfigParams_t} configParams
   */
  setParams (configParams) {

  }

  /**
   *
   * @param {LRConfigCompile_t} configCompile
   */
  setCompile (configCompile) {

  }

  /**
   *
   * @param configLayers
   * @param {ConfigLayerInput_t} [configLayers.input={ units: number, activation: ActivationIdentifier_t, inputShape: number[] }]
   * @param {ConfigLayers_t[]} [configLayers.layers=[]]
   * @param {ConfigLayerOutput_t} [configLayers.output={ units: number, activation: ActivationIdentifier_t }]
   **/
  setLayers (configLayers) {
    const {
      input: {
        units     : inputUnits = 1,
        activation: inputActivation = 'relu',
        inputShape: inputInputShape = [1]
      } = {},
      layers = [],
      output: {
        units     : outputUnits = 1,
        activation: outputActivation = 'relu'
      } = {},
    } = configLayers

    this.config.layers = {
      input : { units: inputUnits, activation: inputActivation, inputShape: inputInputShape },
      layers: layers,
      output: { units: outputUnits, activation: outputActivation },
    }
  }

  /**
   * @private
   *
   * @return {Promise<object[]>}
   */
  async GetData () {
    if (!this.dataframe.columns.includes(this.config.features.y_target)) throw Error(`The dataset need to contain a column named ${this.config.features.y_target}`)

    const missingColumns = []
    const X_list = Array.from(this.config.features.X_features)
    for (let i = 0; i < X_list.length; i++) {
      if (!this.dataframe.columns.includes(X_list[i])) {
        missingColumns.push(X_list[i])
      }
    }
    if (missingColumns.length > 0) throw Error(`The dataset need to contain a column named ${missingColumns}`)
    const columns = [
      ...this.config.features.X_features,
      this.config.features.y_target,
    ]
    return Array.from(JSON.parse(JSON.stringify(dfd.toJSON(this.dataframe.loc({ columns })))))
  }

  /**
   * @private
   *
   * @param value
   * @param categoryCount
   * @returns {number[]}
   */
  OneHot (value, categoryCount) {
    return Array.from(tfjs.oneHot(value, categoryCount).dataSync())
  }

  /**
   * Rescales the range of values in the range of [0, 1]
   * @private
   *
   * @param tensor
   * @returns {Tensor}
   */
  Normalize (tensor) {
    return tfjs.div(
      tfjs.sub(tensor,
        tfjs.min(tensor),
      ),
      tfjs.sub(
        tfjs.max(tensor),
        tfjs.min(tensor),
      ),
    )
  }

  /**
   *
   * @param {object[]} data
   * @param {Array<string>} features
   * @param {Set<string>} categoricalFeatures
   * @param {number} testSize
   * @param {string} TARGET
   * @param {Map<string, number>} VARIABLE_CATEGORY_COUNT
   * @returns {Tensor<tfjs.Rank>[]}
   */
  CreateDataSets (data, features, categoricalFeatures, testSize, TARGET, VARIABLE_CATEGORY_COUNT) {
    const X = data.map(r =>
      features.flatMap(f => {
        if (categoricalFeatures.has(f)) {
          return this.OneHot(!r[f] ? 0 : r[f], VARIABLE_CATEGORY_COUNT[f])
        }
        return !r[f] ? 0 : r[f]
      }),
    )

    const X_t = this.Normalize(tfjs.tensor2d(X))

    const y = tfjs.tensor(data.map(r => (!r[TARGET] ? 0 : r[TARGET])))

    const splitIdx = parseInt(((1 - testSize) * data.length).toString(), 10)

    const [xTrain, xTest] = tfjs.split(X_t, [splitIdx, data.length - splitIdx])
    const [yTrain, yTest] = tfjs.split(y, [splitIdx, data.length - splitIdx])

    return [xTrain, xTest, yTrain, yTest]
  }

  /**
   *
   * @param {Tensor | Tensor[] | {[inputName: string]: Tensor}} xTrain
   * @param {Tensor | Tensor[] | {[inputName: string]: Tensor}} yTrain
   * @returns {Promise<tfjs.Sequential>}
   * @constructor
   */
  async TrainLinearModel (xTrain, yTrain) {
    const model = tfjs.sequential()
    // Input
    model.add(
      tfjs.layers.dense({
        inputShape: [xTrain.shape[1]],
        units     : xTrain.shape[1],
        activation: this.config.layers.input.activation,
      }),
    )
    // Layers
    for (const { units, activation } of this.config.layers.layers) {
      model.add(tfjs.layers.dense({ units, activation }))
    }
    // Output
    model.add(tfjs.layers.dense({
      units     : this.config.layers.output.units,
      activation: this.config.layers.output.activation
    }))

    const idOptimizer = this.config.compile.id_optimizer
    const params = this.config.compile.params
    const idLoss = this.config.compile.id_loss
    const idMetrics = this.config.compile.id_metrics

    const _optimizer = LinearRegressionModelController.CREATE_OPTIMIZER(idOptimizer, params)
    const _loss = LinearRegressionModelController.CREATE_LOSS(idLoss)
    const _metrics = LinearRegressionModelController.CREATE_METRICS(idMetrics)

    model.compile({
      optimizer: _optimizer,
      loss     : _loss,
      metrics  : _metrics,
    })

    const fit_callbacks_metrics_labels = ['loss', 'val_loss', 'acc', 'val_acc']
    const fit_callbacks_container = {
      name  : this.t('pages.playground.generator.models.history-train'),
      tab   : this.t('pages.playground.generator.models.train'),
      styles: { height: '1000px' },
    }
    const fit_callbacks = tfvis.show.fitCallbacks(fit_callbacks_container, fit_callbacks_metrics_labels, {
      callbacks: [
        'onBatchEnd',
        'onEpochEnd',
      ],
    })
    await model.fit(xTrain, yTrain, {
      batchSize      : 32,
      epochs         : 20,
      shuffle        : true,
      validationSplit: 0.1,
      callbacks      : fit_callbacks,
    })

    return model
  };

  async run () {
    const data = await this.GetData()

    // TODO lista de características categoricas
    const categoricalFeatures = new Set([])

    const TARGET = 'Salary'
    const X_features = ['YearsExperience']

    /** @type Map<string, number> */
    const VARIABLE_CATEGORY_COUNT = new Map()

    // params
    const testSize = 0.1

    const [xTrain, xTest, yTrain, yTest] = this.CreateDataSets(data, X_features, categoricalFeatures, testSize, TARGET, VARIABLE_CATEGORY_COUNT)
    const linearModel = await this.TrainLinearModel(xTrain, yTrain)

    const original = yTest.dataSync()
    const predicted = linearModel.predict(xTest).dataSync()

    return { original, predicted }
  }

  static CREATE_OPTIMIZER (idOptimizer, params) {
    if (!isProduction()) console.debug('>> createOptimizer', { idOptimizer, params })

    let { learningRate = 0.01, momentum = 1 } = params
    const optimizerMap = {
      'sgd'     : (params) => tfjs.train.sgd(params.learningRate),
      'momentum': (params) => tfjs.train.momentum(params.learningRate, params.momentum),
      'adagrad' : (params) => tfjs.train.adagrad(params.learningRate),
      'adadelta': (params) => tfjs.train.adadelta(params.learningRate),
      'adam'    : (params) => tfjs.train.adam(params.learningRate),
      'adamax'  : (params) => tfjs.train.adamax(params.learningRate),
      'rmsprop' : (params) => tfjs.train.rmsprop(params.learningRate)
    }
    const optimizerFunction = optimizerMap[idOptimizer]
    if (optimizerFunction) {
      return optimizerFunction({ learningRate, momentum })
    } else {
      console.warn('createOptimizer()', { idOptimizer, params })
      return tfjs.train.adam(params.learningRate)
    }
  }

  static CREATE_LOSS (idLoss) {
    if (!isProduction()) console.debug('>> createLoss', { idLoss })

    const lossAndMetricFunctions = {
      'losses-absoluteDifference' : tfjs.losses.absoluteDifference,
      'losses-computeWeightedLoss': tfjs.losses.computeWeightedLoss,
      'losses-cosineDistance'     : tfjs.losses.cosineDistance,
      'losses-hingeLoss'          : tfjs.losses.hingeLoss,
      'losses-huberLoss'          : tfjs.losses.huberLoss,
      'losses-logLoss'            : tfjs.losses.logLoss,
      'losses-meanSquaredError'   : tfjs.losses.meanSquaredError,
      'losses-sigmoidCrossEntropy': tfjs.losses.sigmoidCrossEntropy,
      'losses-softmaxCrossEntropy': tfjs.losses.softmaxCrossEntropy,
    }

    return lossAndMetricFunctions[idLoss] || 'categoricalCrossentropy'
  }

  static CREATE_METRICS (idMetrics) {
    if (!isProduction()) console.debug('>> createMetrics', { idMetrics })
    const metricMap = {
      'metrics-binaryAccuracy'             : tfjs.metrics.binaryAccuracy,
      'metrics-binaryCrossentropy'         : tfjs.metrics.binaryCrossentropy,
      'metrics-categoricalAccuracy'        : tfjs.metrics.categoricalAccuracy,
      'metrics-categoricalCrossentropy'    : tfjs.metrics.categoricalCrossentropy,
      'metrics-cosineProximity'            : tfjs.metrics.cosineProximity,
      'metrics-meanAbsoluteError'          : tfjs.metrics.meanAbsoluteError,
      'metrics-meanAbsolutePercentageError': tfjs.metrics.meanAbsolutePercentageError,
      'metrics-meanSquaredError'           : tfjs.metrics.meanSquaredError,
      'metrics-precision'                  : tfjs.metrics.precision,
      'metrics-recall'                     : tfjs.metrics.recall,
      'metrics-sparseCategoricalAccuracy'  : tfjs.metrics.sparseCategoricalAccuracy,
    }

    return idMetrics.map((idMetric) => metricMap[idMetric] || 'accuracy')
  }

}