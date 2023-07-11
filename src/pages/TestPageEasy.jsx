import {  useState } from 'react'
import { Button, Card, Col, Container, Row } from 'react-bootstrap'
import * as tfvis from '@tensorflow/tfjs-vis'
import Plot from 'react-plotly.js'

import TestComponentEasy from '@components/TestComponentEasy'
import * as LinearRegressionModelController from '@core/LinearRegressionModelController'

export default function TestPageEasy () {

  const [dataOriginal, setDataOriginal] = useState({ x: [], y: [] })
  const [dataPredicted, setDataPredicted] = useState({ x: [], y: [] })

  const handleClick_init = async () => {
    const { original, predicted } = await LinearRegressionModelController.run()
    console.log({ original, predicted })
    const original_x = original.map((v) => v.x)
    const original_y = original.map((v) => v.y)
    const predicted_x = predicted.map((v) => v.x)
    const predicted_y = predicted.map((v) => v.y)
    setDataOriginal({
      x: original_x,
      y: original_y,
    })
    setDataPredicted({
      x: predicted_x,
      y: predicted_y,
    })
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
                    <Plot
                      data={[
                        {
                          name  : 'Original',
                          x     : dataOriginal.x,
                          y     : dataOriginal.y,
                          type  : 'scatter',
                          mode  : 'markers',
                          marker: { color: 'blue' },
                        },
                        {
                          name  : 'Predicted',
                          x     : dataPredicted.x,
                          y     : dataPredicted.y,
                          type  : 'scatter',
                          mode  : 'lines+markers',
                          marker: { color: 'red' },
                        },
                      ]}
                      layout={{ title: 'A Fancy Plot' }}
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