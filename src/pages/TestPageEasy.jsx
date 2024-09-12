import React, { useRef, useState } from 'react'
import { Button, Card, Col, Container, Row } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import Plot from 'react-plotly.js'
import * as tfvis from '@tensorflow/tfjs-vis'
import * as tfjs from '@tensorflow/tfjs'
import MLR from 'ml-regression-multivariate-linear'

import * as LinearRegressionModelExample from '@core/controller/01-linear-regression/LinearRegressionModelExample'
import { VERBOSE } from '@/CONSTANTS'
import { PLOTLY_CONFIG_DEFAULT } from '@/CONSTANTS_ChartsJs'
import AlertHelper from '@utils/alertHelper'
import TestComponentEasy from '@components/TestComponentEasy'
import { MODEL_1_SALARY } from '@/DATA_MODEL'
import { createLinearRegressionCustomModel } from '@/core/controller/01-linear-regression/LinearRegressionModelController'

export default function TestPageEasy () {

  const refPlotly = useRef()

  const [dataPredictionList, setDataPredictionList] = useState([])
  const [counter, setCounter] = useState(0)
  const { t } = useTranslation()

  const handleClick_init = async () => {
    // const filename = process.env.REACT_APP_PATH + '/datasets/01-linear-regression/auto-mpg/auto-mpg.csv'
    // const columns = { x_name: 'horsepower', y_name: 'mpg' }
    // const columns = { x_name: 'cylinders', y_name: 'mpg' }

    // const filename = process.env.REACT_APP_PATH + '/datasets/01-linear-regression/salary/salary.csv'
    // const columns = { X: ['YearsExperience'], Y: 'Salary' }

    const filename = process.env.REACT_APP_PATH + '/datasets/01-linear-regression/housing-prices/boston-housing.csv'
    // const columns = { x_name: 'LSTAT', y_name: 'MEDV' } // features = ['LSTAT', 'RM']
    const columns = { X: ['LSTAT', 'RM'], Y: 'MEDV' } // features = ['LSTAT', 'RM']

    const { original, predicted } = await LinearRegressionModelExample.run(filename, columns)

    const original_x = original.map((v) => v.x)
    const original_y = original.map((v) => v.y)
    const predicted_x = predicted.map((v) => v.x)
    const predicted_y = predicted.map((v) => v.y)

    const newPrediction_group = [
      {
        name  : columns.x_name,
        x     : original_x,
        y     : original_y,
        type  : 'scatter',
        mode  : 'markers',
        marker: { color: 'blue' },
      },
      {
        name  : columns.y_name,
        x     : predicted_x,
        y     : predicted_y,
        type  : 'scatter',
        mode  : 'lines+markers',
        marker: { color: 'red' },
      },
    ]
    setDataPredictionList((prevState) => [...prevState, ...newPrediction_group])
  }

  const handleClick_toggle = () => {
    tfvis.visor().toggle()
  }

  const handleClick_Simple = () =>{
    const x = [
      [0, 0],
      [1, 2],
      [2, 3],
      [3, 4]
    ]
    // Y0 = X0 * 2, Y1 = X1 * 2, Y2 = X0 + X1
    const y = [
      [0, 0, 0],
      [2, 4, 3],
      [4, 6, 5],
      [6, 8, 12]
    ]
    const mlr = new MLR(x, y)
    console.log(mlr.predict([3, 3]))
  }
  
  const handleClick_TFJSMultiple = async () =>{
    // // Sample data: let's assume X1, X2 are independent variables and Y is the dependent variable.
    // const X1 = [1, 2, 3, 4]
    // const X2 = [2, 2, 4, 3]
    const X = [[1,2], [2,2], [3,4], [4,3], [5,5]]
    const Y = [2, 4, 6, 8, 12]

    // Convert data to tensors
    const xs = tfjs.tensor2d(X) // Shape is [num_samples, num_features]
    const ys = tfjs.tensor1d(Y)

    // Build a model
    const model = tfjs.sequential()
    // inputShape is 2 because we have 2 independent variables
    model.add(tfjs.layers.dense({units: 1, inputShape: [2]})) 

    // Compile the model
    model.compile({loss: 'meanSquaredError', optimizer: 'sgd'})

    // Train the model
    await model.fit(xs, ys, { epochs: 100 })
    model.predict(tfjs.tensor2d([[5, 5], [6, 7]])).print() // Predicting for new data
  }
  
  const handleClick_TFJSMultiple_2 = async () => {
    // Generate a synthetic dataset
    const generateDataset = (numSamples) => {
      const sizes = Array.from(
        { length: numSamples },
        (_v, i) => i * 3000 + 500
      )
      const bedrooms = Array.from(
        { length: numSamples },
        (_v, i) => Math.floor(i * 5) + 1
      )
      const distances = Array.from(
        { length: numSamples },
        (_v, i) => i * 20
      )

      const prices = sizes.map(
        (size, i) =>
          1000 * size +
          20000 * bedrooms[i] -
          1000 * distances[i] +
          i * 10000
      )

      return { sizes, bedrooms, distances, prices }
    }

    const numSamples = 1000
    const { sizes, bedrooms, distances, prices } = generateDataset(numSamples)

    // Store the generated dataset for inspection
    const datasetForInspection = { sizes, bedrooms, distances, prices }
    console.debug({ datasetForInspection })

    // Create tensors from the data
    const xs = tfjs
      .tensor2d([sizes, bedrooms, distances], [3, numSamples])
      .transpose()
    const ys = tfjs.tensor2d(prices, [numSamples, 1])

    // Model architecture
    const model = tfjs.sequential()
    model.add(tfjs.layers.dense({ units: 64, inputShape: [3], activation: 'relu' }))
    model.add(tfjs.layers.dense({ activation: 'relu', units: 32 }))
    model.add(tfjs.layers.dense({ activation: 'relu', units: 16 }))
    model.add(tfjs.layers.dense({ activation: 'relu', units: 8 }))
    model.add(tfjs.layers.dense({ activation: 'relu', units: 1 }))

    model.compile({ optimizer: 'adam', loss: 'meanSquaredError' })

    // Training
    await model.fit(xs, ys, {
      epochs   : 10, 
      callbacks: tfvis.show.fitCallbacks(
        { name: 'Training Performance' },
        ['loss', 'mse'],
        { height: 200, callbacks: ['onEpochEnd', 'onBatchEnd'] }
      )
     })
    // Model is trained
    // You can use the trained model to make predictions
    const newHouseFeatures = tfjs.tensor2d([[1500, 3, 10]])
    const prediction = model.predict(newHouseFeatures)
    console.log('Predicted Price:', prediction.dataSync()[0])
  }

  const handleClick_TFJSMultiple_3 = async () => {
    const model_salary = new MODEL_1_SALARY(t)
    const datasets_salary = await model_salary.DATASETS()
    console.log({ datasets_salary })

    const model = await createLinearRegressionCustomModel({
      dataset_processed: datasets_salary[0],
      learningRate     : 0.01,
      testSize         : 0.3,
      numberOfEpoch    : 20,
      idOptimizer      : 'sgd',
      idLoss           : 'losses-meanSquaredError',
      idMetrics        : 'meanSquaredError',
      layerList        : [
        {units: 64, activation: 'relu'},
        {units: 32, activation: 'relu'},
        {units: 16, activation: 'relu'}
      ],

    })

    console.log({ model })
  }

  if (VERBOSE) console.debug('render TestPageEasy')
  return <>
    <Container className={'mt-3'}>
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <h2>Alerts</h2>
            </Card.Header>
            <Card.Body>
              <div className="d-flex gap-2">
                <Button variant={'danger'}
                        onClick={async () => await AlertHelper.alertError('Error')}>Error</Button>
                <Button variant={'warning'}
                        onClick={async () => await AlertHelper.alertWarning('Waring')}>Waring</Button>
                <Button variant={'info'}
                        onClick={async () => await AlertHelper.alertInfo('Info')}>Info</Button>
                <Button variant={'success'}
                        onClick={async () => await AlertHelper.alertSuccess('Success')}>Success</Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className='mt-3'>
        <Col>
          <Card>
            <Card.Header><h2>TestPage-Easy</h2></Card.Header>
            <Card.Body>
              <Button variant={'primary'}
                      onClick={() => setCounter(c => c + 1)}>
                Counter {counter}
              </Button>
              <hr />
              <TestComponentEasy />

              <Button variant={'outline-primary'}
                      size={'sm'}
                      onClick={handleClick_init}>
                Init
              </Button>
              <Button variant={'outline-primary'}
                      size={'sm'}
                      className={'ms-2'}
                      onClick={handleClick_toggle}>
                Toggle visor
              </Button>
              <hr />
              <Button variant={'outline-primary'}
                      size={'sm'}
                      onClick={handleClick_Simple}>
                ml-regression-multivariate-linear
              </Button>
              <Button variant={'outline-primary'}
                      size={'sm'}
                      className={'ms-2'}
                      onClick={handleClick_TFJSMultiple}>
                TFJS Multiple
              </Button>
              <Button variant={'outline-primary'}
                      size={'sm'}
                      className={'ms-2'}
                      onClick={handleClick_TFJSMultiple_2}>
                TFJS Multiple 2
              </Button>
              <Button variant={'outline-primary'}
                      size={'sm'}
                      className={'ms-2'}
                      onClick={handleClick_TFJSMultiple_3}>
                TFJS Multiple 3
              </Button>

              <Container>
                <Row>
                  <Col>
                    <Plot ref={refPlotly}
                          data={dataPredictionList}
                          useResizeHandler={true}
                          style={PLOTLY_CONFIG_DEFAULT.STYLES}
                          layout={{ title: 'A Fancy Plot', autoSize: true, height: undefined, width: undefined }}
                    />
                  </Col>
                </Row>
              </Container>

            </Card.Body>
          </Card>

        </Col>
      </Row>
    </Container>
  </>
}
