import React, { useContext, useRef, useState } from 'react'
import { Button } from 'react-bootstrap'
import { Chart } from 'react-chartjs-2'
import { faker } from '@faker-js/faker'

import { CHARTJS_CONFIG_DEFAULT } from '@/CONSTANTS_ChartsJs'
import LinearRegressionContext from '@context/LinearRegressionContext'
import { generateColor } from '@utils/utils'

export default function LinearRegressionPrediction () {

  const { dataPrediction } = useContext(LinearRegressionContext)

  const refChartJS = useRef()
  const labels = Array(100).fill('').map(() => {
    return faker.date.month()
  })

  const generate = () => {
    const color_dataset = generateColor()
    const r = labels.map(() => faker.number.int({ min: -90, max: 90 }))
    const r2 = r.map((r) => faker.number.int({ min: r - 10, max: r + 10 }))
    return [{
      type           : 'line',
      label          : 'Prediction',
      borderColor    : color_dataset.borderColor,
      backgroundColor: color_dataset.backgroundColor,
      data           : r,
    }, {
      type                : 'scatter',
      label               : 'Data',
      borderColor         : color_dataset.borderColor,
      backgroundColor     : color_dataset.backgroundColor,
      pointBorderColor    : color_dataset.pointBorderColor,
      pointBackgroundColor: color_dataset.pointBackgroundColor,
      data                : r2,
    }]
  }

  const [data, setData] = useState({
    labels  : labels,
    datasets: [...generate()],
  })

  const updateDataPrediction = () => {
    console.log(dataPrediction)

    // model.
    setData({
      labels  : labels,
      datasets: [...generate()],
    })
  }

  console.debug('render LinearRegressionPrediction')
  return <>
    <Button variant={'outline-primary'} onClick={updateDataPrediction}>Update</Button>

    <Chart type="bar" ref={refChartJS} data={data} options={CHARTJS_CONFIG_DEFAULT.LINEAR_REGRESSION_PREDICTION} />
  </>
}
