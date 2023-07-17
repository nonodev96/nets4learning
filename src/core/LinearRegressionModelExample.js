import * as tfjs from '@tensorflow/tfjs'
import * as tfvis from '@tensorflow/tfjs-vis'
import * as dfd from 'danfojs'

/**
 * @param {string} filename
 * @param {{x_name: string, y_name: string}} columns
 * @return {Promise<Array<{x: Array<number>, y: number}>>}
 */
async function getData (filename, columns) {
  const df = await dfd.readCSV(filename)
  return Array.from(JSON.parse(JSON.stringify(dfd.toJSON(df.loc({ columns: [columns.x_name, columns.y_name] })))))
}

/*
 * el sesgo en TensorFlow.js se utiliza para introducir una componente aditiva a las salidas de las neuronas en una capa,
 * permitiendo así que la red neuronal modele relaciones no lineales en los datos.
 *
 * salida = función_activación(sumatorio(pesos * entradas) + sesgo)
 */
function createModel () {
  // Create a sequential model
  const model = tfjs.sequential()
  // Add a single input layer
  model.add(tfjs.layers.dense({ units: 1, inputShape: [1] }))
  model.add(tfjs.layers.dense({ units: 20, activation: 'relu', }))
  model.add(tfjs.layers.dense({ units: 20, activation: 'relu', }))
  model.add(tfjs.layers.dense({ units: 20, activation: 'relu', }))
  model.add(tfjs.layers.dense({ units: 20, activation: 'relu', }))
  model.add(tfjs.layers.dense({ units: 20, activation: 'sigmoid', }))
  // Add an output layer
  model.add(tfjs.layers.dense({ units: 1 }))
  return model
}

function convertToTensor (data, columns) {

  return tfjs.tidy(() => {
    // Step 1. Shuffle the data
    tfjs.util.shuffle(data)

    // Step 2. Convert data to Tensor
    const inputs = data.map(d => d[columns.x_name])
    const labels = data.map(d => d[columns.y_name])

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
 * @param {{ inputs: any, labels:any }} tensorData
 * @return {Promise<tfjs.History>}
 */
async function trainModel (model, tensorData) {
  model.compile({
    optimizer: tfjs.train.adam(),
    loss     : tfjs.losses.meanSquaredError,
    metrics  : ['mse'],
  })

  return await model.fit(tensorData.inputs, tensorData.labels, {
    batchSize: 32,
    epochs   : 50,
    shuffle  : true,
    verbose  : 1,
    callbacks: tfvis.show.fitCallbacks(
      { name: 'Training Performance' },
      ['loss', 'mse'],
      { height: 200, callbacks: ['onEpochEnd'] }
    )
  })
}

async function testModel (model, inputData, normalizationData, columns) {
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
    x: d[columns.x_name],
    y: d[columns.y_name],
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

export async function run (filename, columns) {

  const data = await getData(filename, columns)
  console.log(data)

  let values = data.map(d => ({
    x: d['x'],
    y: d['y'],
  }))

  await tfvis.render.scatterplot(
    { name: 'Dataset' },
    { values },
    {
      xLabel: 'x',
      yLabel: 'y',
    }
  )

  // More code will be added below

  // Create the model
  const model = createModel()
  await tfvis.show.modelSummary({ name: 'Model Summary' }, model)

  // Convert the data to a form we can use for training.
  const tensorData = convertToTensor(data, columns)

  // Train the model
  await trainModel(model, tensorData)
  console.log('Done trainModel')

  // Make some predictions using the model and compare them to the
  // original data
  const original_and_predicted = await testModel(model, data, tensorData)
  console.log('Done testModel', original_and_predicted)

  return original_and_predicted
}