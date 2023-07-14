import { useRef, useState } from 'react'
import { Button, Card, Col, Container, Row } from 'react-bootstrap'
import * as tfvis from '@tensorflow/tfjs-vis'
import Plot from 'react-plotly.js'

import TestComponentEasy from '@components/TestComponentEasy'
import * as LinearRegressionModelExample from '@core/LinearRegressionModelExample'

export default function TestPageEasy () {

  const refPlotly = useRef()

  const [dataPredictionList, setDataPredictionList] = useState([])

  const handleClick_init = async () => {
    // const filename = process.env.REACT_APP_PATH + '/datasets/linear-regression/auto-mpg/auto-mpg.csv'
    // const columns = { x_name: 'horsepower', y_name: 'mpg' }
    // const filename = process.env.REACT_APP_PATH + '/datasets/linear-regression/salary/salary.csv'
    // const columns = { x_name: 'YearsExperience', y_name: 'Salary' }
    const filename = process.env.REACT_APP_PATH + '/datasets/linear-regression/boston-housing/housing.csv'
    const columns = { x_name: 'LSTAT', y_name: 'MEDV' } // features = ['LSTAT', 'RM']
    const { original, predicted } = await LinearRegressionModelExample.run(filename, columns)
    console.log({ original, predicted })

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
    setDataPredictionList((prevState)=>[...prevState, ...newPrediction_group])
  }

  const handleClick_toggle = () => {
    tfvis.visor().toggle()
  }

  return <>
    <Container className={'mt-3'}>
      <Row>
        <Col>

          <Card>
            <Card.Header><h3>TestPage-Easy</h3></Card.Header>
            <Card.Body>
              <TestComponentEasy />

              <Button onClick={handleClick_init} size={'sm'} variant={'outline-primary'}>Init</Button>
              <Button onClick={handleClick_toggle} size={'sm'} variant={'outline-primary'} className={'ms-3'}>Toggle visor</Button>

              <Container>
                <Row>
                  <Col>
                    <Plot ref={refPlotly}
                          data={dataPredictionList}
                          useResizeHandler={true}
                          style={{ width: '100%', height: '100' }}
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