import * as tfjs from '@tensorflow/tfjs'
import { Sequential } from '@tensorflow/tfjs'
import * as tfvis from '@tensorflow/tfjs-vis'
import * as dfd from 'danfojs'
import { DataFrame } from 'danfojs'

/**
 * @typedef TrainModelTensor_t
 * @property inputs: any
 * @property labels: any
 */

/**
 * @typedef  {'elu' | 'hardSigmoid' | 'linear' | 'relu' | 'relu6' | 'selu' | 'sigmoid' | 'softmax' | 'softplus' | 'softsign' | 'tanh' | 'swish' | 'mish'} ActivationIdentifier_t
 */

/**
 * @typedef {{x_name: string, y_name: string}} Columns_t
 */

/**
 * @typedef {{x: number, y: number}[]} Point_t
 */


/**
 * @typedef ConfigLayers_t
 * @property {number} units - El número de unidades en la capa.
 * @property {ActivationIdentifier_t} activation - La función de activación para la capa.
 */

/**
 * @typedef ConfigLayerInput_t
 * @property {number} units - El número de unidades en la capa de entrada.
 * @property {number[]} inputShape - La forma de entrada.
 */

/**
 * @typedef ConfigLayerOutput_t
 * @property {number} units - El número de unidades en la capa de salida.
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
 * @property {string} optimizer
 * @property {string} loss
 * @property {string[]} metrics
 */

/**
 * @typedef LRConfigLayers_t
 * @property {{units: number, inputShape: number[]}} input
 * @property {{units: number, activation: ActivationIdentifier_t}[]} layers
 * @property {{units: number}} output
 */

/**
 * @typedef  LRConfig_t
 * @property {LRConfigFit_t} fit
 * @property {LRConfigCompile_t} compile
 * @property {Columns_t} columns
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
      columns: {
        x_name: '',
        y_name: ''
      },
      compile: {
        optimizer: 'adam',
        loss     : 'meanSquaredError',
        metrics  : ['mse'],
      },
      fit    : {
        batchSize     : 32,
        epochs        : 50,
        shuffle       : true,
        metrics       : ['loss', 'mse'],
        container_name: 'Training Performance'
      },
      layers : {
        input : { units: 1, inputShape: [1] },
        layers: [
          { units: 10, activation: 'relu' },
          { units: 10, activation: 'relu' },
          { units: 10, activation: 'relu' },
          { units: 10, activation: 'relu' },
          { units: 10, activation: 'relu' },
        ],
        output: { units: 1 }
      },
    }
  }

  /**
   *
   * @param {{x_name: string, y_name: string}} columns
   **/
  setColumns (columns) {
    this.config.columns.x_name = columns.x_name
    this.config.columns.y_name = columns.y_name
  }

  /**
   * @param {ConfigLayers_t[]} layers
   * @param {ConfigLayerInput_t} [input={ units: 1, inputShape: [1] }]
   * @param {ConfigLayerOutput_t} [output={ units: 1 }]
   */
  setLayers (layers, input = { units: 1, inputShape: [1] }, output = { units: 1 }) {
    this.config.layers = {
      layers: layers,
      input : input,
      output: output
    }
  }

  /**
   * @private
   *
   * @param model
   * @param {TrainModelTensor_t} tensorData
   * @return {Promise<*>}
   */
  async TrainModel (model, tensorData) {
    model.compile({
      optimizer: this.config.compile.optimizer,
      loss     : this.config.compile.loss,
      metrics  : this.config.compile.metrics,
    })

    return await model.fit(tensorData.inputs, tensorData.labels,
      {
        batchSize: this.config.fit.batchSize,
        epochs   : this.config.fit.epochs,
        shuffle  : this.config.fit.shuffle,
        verbose  : 1,
        callbacks: tfvis.show.fitCallbacks(
          { name: this.config.fit.container_name },
          [...this.config.fit.metrics],
          { height: 200, callbacks: ['onEpochEnd'] }
        )
      }
    )
  }

  /**
   * @private
   *
   * @return {Promise<unknown[]>}
   */
  async GetData () {
    if (!this.dataframe.columns.includes(this.config.columns.x_name)) throw Error(`The dataset need to contain a column named ${this.config.columns.x_name}`)
    if (!this.dataframe.columns.includes(this.config.columns.y_name)) throw Error(`The dataset need to contain a column named ${this.config.columns.y_name}`)
    const columns = [
      this.config.columns.x_name,
      this.config.columns.y_name
    ]
    return Array.from(JSON.parse(JSON.stringify(dfd.toJSON(this.dataframe.loc({ columns })))))
  }

  /**
   * @private
   *
   * @return {Sequential} model
   */
  CreateModel () {
    const model = new Sequential()
    model.add(tfjs.layers.dense({ units: this.config.layers.input.units, inputShape: this.config.layers.input.inputShape, useBias: true }))

    for (const layer of this.config.layers.layers) {
      model.add(tfjs.layers.dense({ units: layer.units, activation: layer.activation, useBias: true }))
    }

    model.add(tfjs.layers.dense({ units: this.config.layers.output.units, useBias: true }))
    return model
  }

  /**
   * @private
   *
   * @return {{
   * inputMax: Tensor<tfjs.Rank>,
   * inputs: Tensor<tfjs.Rank>,
   * inputMin: Tensor<tfjs.Rank>,
   * labelMax: Tensor<tfjs.Rank>,
   * labelMin: Tensor<tfjs.Rank>,
   * labels: Tensor<tfjs.Rank>
   * }}
   * @constructor
   */
  ConvertDataFrameToTensor () {
    /**
     * @type {Array<Object> | Object}
     */
    const data_json = dfd.toJSON(this.dataframe)
    return tfjs.tidy(() => {
      // Step 1. Shuffle the data
      tfjs.util.shuffle(data_json)

      // Step 2. Convert data to Tensor
      const inputs = data_json.map(d => d[this.config.columns.x_name])
      const labels = data_json.map(d => d[this.config.columns.y_name])

      const inputTensor = tfjs.tensor2d(inputs, [inputs.length, 1])
      const labelTensor = tfjs.tensor2d(labels, [labels.length, 1])

      //Step 3. Normalize the data to the range 0 - 1 using min-max scaling
      const inputMax = inputTensor.max()
      const inputMin = inputTensor.min()
      const labelMax = labelTensor.max()
      const labelMin = labelTensor.min()

      const normalizedInputs = inputTensor.sub(inputMin).div(inputMax.sub(inputMin))
      const normalizedLabels = labelTensor.sub(labelMin).div(labelMax.sub(labelMin))

      return {
        inputs: normalizedInputs,
        labels: normalizedLabels,
        // Return the min/max bounds, so we can use them later.
        inputMax,
        inputMin,
        labelMax,
        labelMin,
      }
    })
  }

  /**
   *
   * @param {tfjs.Sequential} model
   * @param inputData
   * @param normalizationData
   * @return {Promise<{original: *, predicted: {x: *, y: *}[]}>}
   * @constructor
   */
  async TestModel (model, inputData, normalizationData) {
    const { inputMax, inputMin, labelMin, labelMax } = normalizationData

    const [xs, preds] = tfjs.tidy(() => {

      const xs = tfjs.linspace(0, 1, 100)
      const preds = model.predict(xs.reshape([100, 1]))

      const unNormXs = xs
        .mul(inputMax.sub(inputMin))
        .add(inputMin)

      const unNormPreds = preds
        .mul(labelMax.sub(labelMin))
        .add(labelMin)

      return [unNormXs.dataSync(), unNormPreds.dataSync()]
    })

    const predictedPoints = Array.from(xs).map((val, i) => {
      return {
        x: val,
        y: preds[i]
      }
    })

    const originalPoints = inputData.map(d => ({
      x: d[this.config.columns.x_name],
      y: d[this.config.columns.y_name],
    }))

    await tfvis.render.scatterplot(
      { name: 'Model Predictions vs Original Data' },
      { values: [originalPoints, predictedPoints], series: ['original', 'predicted'] },
      {
        xLabel: 'Horsepower',
        yLabel: 'MPG',
        height: 200
      }
    )

    return { original: originalPoints, predicted: predictedPoints }
  }

  /**
   *
   * @return {Promise<{original: Point_t, model: Sequential, predicted: Point_t}>}
   */
  async run () {

    // 1. Generas los datos
    const data = await this.GetData()
    const tensorData = this.ConvertDataFrameToTensor()

    // 2. Defines la estructura del modelo
    const model = this.CreateModel()

    // 3. Entrenas el modelo
    await this.TrainModel(model, tensorData)

    const { original, predicted } = await this.TestModel(model, data, tensorData)

    return {
      model,

      original,
      predicted,
    }
  }
}