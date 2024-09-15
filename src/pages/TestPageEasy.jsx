import React, { useRef, useState } from 'react'
import { Button, Card, Col, Container, Row } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import Plot from 'react-plotly.js'
import * as tfvis from '@tensorflow/tfjs-vis'
import * as tfjs from '@tensorflow/tfjs'
import MLR from 'ml-regression-multivariate-linear'

import { VERBOSE } from '@/CONSTANTS'
import { PLOTLY_CONFIG_DEFAULT } from '@/CONSTANTS_ChartsJs'
import AlertHelper from '@utils/alertHelper'
import TestComponentEasy from '@components/TestComponentEasy'
import { MODEL_1_SALARY, MODEL_2_AUTO_MPG, MODEL_3_HOUSING_PRICES } from '@/DATA_MODEL'
import { createLinearRegressionCustomModel } from '@/core/controller/01-linear-regression/LinearRegressionModelController'
import * as LinearRegressionModelExample from '@core/controller/01-linear-regression/LinearRegressionModelExample'
import { X } from 'react-bootstrap-icons'

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
        name  : columns.X.join(','),
        x     : original_x,
        y     : original_y,
        type  : 'scatter',
        mode  : 'markers',
        marker: { color: 'blue' },
      },
      {
        name  : columns.Y,
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
    // Sample data: let's assume X1, X2 are independent variables and Y is the dependent variable.
    // const X1 = [1, 2, 3, 4]
    // const X2 = [2, 2, 4, 3]
    const X = [[1,2], [2,2], [3,4], [4,3], [5,5]]
    const Y = [2,     4,      6,    8,     12]

    // Convert data to tensors
    const xs = tfjs.tensor2d(X)
    const ys = tfjs.tensor1d(Y)

    // Build a model
    const model = tfjs.sequential()
    // inputShape is 2 because we have 2 independent variables
    model.add(tfjs.layers.dense({units: 64, inputShape: [2]})) 
    model.add(tfjs.layers.dense({units: 32, activation: 'relu'})) 
    model.add(tfjs.layers.dense({units: 16, activation: 'relu'})) 
    model.add(tfjs.layers.dense({units: 8, activation: 'relu'})) 
    model.add(tfjs.layers.dense({units: 1, activation: 'linear'})) 

    // Compile the model
    model.compile({loss: 'meanSquaredError', optimizer: 'sgd'})

    await tfvis.show.modelSummary({
      name: 'Model Summary',
      tab : 'Example 1',
    }, model)

    // Train the model
    await model.fit(xs, ys, { 
      epochs   : 100,
      callbacks: tfvis.show.fitCallbacks(
        { 
          name: 'Training Performance' ,
          tab : 'Example 1',
        },
        ['loss', 'val_loss', 'acc', 'val_acc'],
        { 
          callbacks: ['onEpochEnd', 'onBatchEnd'] 
        }
      )
    })
    const p = model.predict(tfjs.tensor2d([[5, 5], [6, 7]])).dataSync() 
    console.log({ predict_1: p })
  }
  
  const handleClick_TFJSMultiple_2 = async () => {
    // Generate a synthetic dataset
    const generateDataset = (numSamples) => {
      const sizes = Array.from(
        { length: numSamples },
        (_v, i) => i + 500
      )
      const bedrooms = Array.from(
        { length: numSamples },
        (_v, i) => Math.floor(i * 5) + 1
      )
      const distances = Array.from(
        { length: numSamples },
        (_v, i) => i + 20
      )

      const prices = sizes.map(
        (size, i) =>
          size +
          bedrooms[i] -
          distances[i] +
          i 
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
    model.add(tfjs.layers.dense({ activation: 'linear', units: 1 }))

    model.compile({ optimizer: 'adam', loss: 'meanSquaredError' })

    await tfvis.show.modelSummary({
      name: 'Model Summary',
      tab : 'Example 2',
    }, model)

    // Training
    await model.fit(xs, ys, {
      epochs   : 10, 
      callbacks: tfvis.show.fitCallbacks(
        { 
          name: 'Training Performance' ,
          tab : 'Example 2',
        },
        ['loss', 'val_loss', 'acc', 'val_acc'],
        { 
          callbacks: ['onEpochEnd', 'onBatchEnd'] 
        }
      )
     })
    // Model is trained
    // You can use the trained model to make predictions
    const to_predict_size_bedroom_distance = [500, 1, 0]
    const prediction = model.predict( tfjs.tensor2d([to_predict_size_bedroom_distance]) )
    console.log('Predicted Price:', { predict_2: prediction.dataSync() })
  }

  const handleClick_TFJSMultiple_3 = async () => {
    const model_salary = new MODEL_1_SALARY(t)
    const datasets_salary = await model_salary.DATASETS()
    console.log({ datasets_salary })
    const salary = datasets_salary[0]
    const { scaler, X, y } = salary.data_processed
    console.log({ scaler, X, y })
    

    const model = await createLinearRegressionCustomModel({
      dataset_processed: salary,
      learningRate     : 0.01,
      testSize         : 0.3,
      numberOfEpoch    : 40,
      idOptimizer      : 'sgd',
      idLoss           : 'losses-meanSquaredError',
      idMetrics        : 'meanSquaredError',
      layerList        : [
        {units: 64, activation: 'sigmoid'},
        {units: 1, activation: 'linear'},
      ],

    })

    console.log({ model })
    const years = 7.7200
    
    const years_n = scaler.transform([years])
    console.log(years_n)

    console.log({ 
      predict_3: model.predict( tfjs.tensor2d([years_n])).dataSync()[0],
      objetivo : 13 
    })
  }


  const handleClick_TFJSMultiple_4 = async () => {
    const model_auto = new MODEL_2_AUTO_MPG(t)
    const datasets_auto = await model_auto.DATASETS()
    console.log({ datasets_auto })
    const auto = datasets_auto[0]
    const { scaler, X, y } = auto.data_processed
    console.log({ scaler, X, y })
    
    const model = await createLinearRegressionCustomModel({
      dataset_processed: auto,
      learningRate     : 0.01,
      testSize         : 0.3,
      numberOfEpoch    : 40,
      idOptimizer      : 'sgd',
      idLoss           : 'losses-meanSquaredError',
      idMetrics        : 'meanSquaredError',
      layerList        : [
        {units: 64, activation: 'sigmoid'},
        {units: 1, activation: 'linear'},
      ],
    })

    console.log({ model })
    const example_instance = [2,250,100,3329,15.5,1]
    
    const example_instance_n = scaler.transform(example_instance)
    console.log({example_instance_n})

    console.log({ 
      predict_3: model.predict( tfjs.tensor2d([example_instance_n])).dataSync()[0],
      objetivo : 17 
    })
  }
  

  const handleClick_TFJSMultiple_5 = async () => {
    const model_housing_prices = new MODEL_3_HOUSING_PRICES(t)
    const datasets_housing_prices = await model_housing_prices.DATASETS()
    console.log({ datasets_housing_prices })
    const housing_prices = datasets_housing_prices[1]
    const { scaler, encoders, X, y } = housing_prices.data_processed
    console.log({ scaler, encoders, X, y })
    
    const model = await createLinearRegressionCustomModel({
      dataset_processed: housing_prices,
      learningRate     : 0.01,
      testSize         : 0.3,
      numberOfEpoch    : 25,
      idOptimizer      : 'sgd',
      idLoss           : 'losses-meanSquaredError',
      idMetrics        : 'meanSquaredError',
      layerList        : [
        {units: 16, activation: 'sigmoid'},
        {units: 1, activation: 'linear'},
      ],
    })


    console.log({ model })
    // California
    const _example_instance_c = [2.4038,41,535,123,317,119,37.85,-122.28]

    const example_instance = [0.00632,18.00,2.310,0,0.5380,6.5750,65.20,4.0900,296.0,15.30,396.90,4.98]
    
    const example_instance_n = scaler.transform(example_instance)
    console.log({example_instance_n})

    console.log({ 
      predict_3 : model.predict( tfjs.tensor2d([example_instance_n])).dataSync()[0],
      objetivo_c: 107500,
      objetivo_b: 24.00 
    })
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

              <div className='d-grid gap-2 mt-3'>
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
                <Button variant={'outline-primary'}
                        size={'sm'}
                        className={'ms-2'}
                        onClick={handleClick_TFJSMultiple_4}>
                  TFJS Multiple 4
                </Button>
                <Button variant={'outline-primary'}
                        size={'sm'}
                        className={'ms-2'}
                        onClick={handleClick_TFJSMultiple_5}>
                  TFJS Multiple 5
                </Button>
              </div>

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
