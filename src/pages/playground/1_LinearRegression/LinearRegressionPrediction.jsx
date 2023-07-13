import React, { useContext, useRef } from 'react'
import { Button, Card } from 'react-bootstrap'
import { Trans } from 'react-i18next'
import Plot from 'react-plotly.js'

import { PLOTLY_CONFIG_DEFAULT } from '@/CONSTANTS_ChartsJs'
import LinearRegressionContext from '@context/LinearRegressionContext'
import * as LinearRegressionModelController from '@core/LinearRegressionModelController'

export default function LinearRegressionPrediction () {

  const { dataPrediction, setDataPrediction } = useContext(LinearRegressionContext)

  const refPlotJS = useRef()

  const updateDataPrediction = async () => {
    // const filename = process.env.REACT_APP_PATH + '/datasets/linear-regression/auto-mpg/auto-mpg.csv'
    // const columns = { x_name: 'horsepower', y_name: 'mpg' }
    const filename = process.env.REACT_APP_PATH + '/datasets/linear-regression/salary/salary.csv'
    const columns = { x_name: 'YearsExperience', y_name: 'Salary' }
    const { original, predicted } = await LinearRegressionModelController.run(filename, columns)
    console.log({ original, predicted })

    const original_x = original.map((v) => v.x)
    const original_y = original.map((v) => v.y)
    const predicted_x = predicted.map((v) => v.x)
    const predicted_y = predicted.map((v) => v.y)

    setDataPrediction({
      dataOriginal_label : columns.x_name,
      dataOriginal_x     : original_x,
      dataOriginal_y     : original_y,
      dataPredicted_label: columns.y_name,
      dataPredicted_x    : predicted_x,
      dataPredicted_y    : predicted_y
    })
  }

  console.debug('render LinearRegressionPrediction')
  return <>
    <Card>
      <Card.Header>
        <h3><Trans i18nKey={'pages.playground.1-linear-regression.prediction'} /></h3>
      </Card.Header>
      <Card.Body>

        <Button variant={'outline-primary'} onClick={updateDataPrediction}>Update</Button>

        <Plot ref={refPlotJS}
              data={[
                {
                  name  : 'Original',
                  x     : dataPrediction.dataOriginal_x,
                  y     : dataPrediction.dataOriginal_y,
                  type  : 'scatter',
                  mode  : 'markers',
                  marker: { color: 'blue' },
                },
                {
                  name  : 'Predicted',
                  x     : dataPrediction.dataPredicted_x,
                  y     : dataPrediction.dataPredicted_y,
                  type  : 'scatter',
                  mode  : 'lines+markers',
                  marker: { color: 'red' },
                },
              ]}
              useResizeHandler={true}
              style={PLOTLY_CONFIG_DEFAULT.STYLES}
              layout={{ title: '', ...PLOTLY_CONFIG_DEFAULT.LAYOUT }}
        />
      </Card.Body>
    </Card>
  </>
}
