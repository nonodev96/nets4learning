import React, { useContext, useRef, useState } from 'react'

import { Chart } from 'react-chartjs-2'

import { faker } from '@faker-js/faker'
import { Button } from 'react-bootstrap'
import LinearRegressionContext from '@context/LinearRegressionContext'

export default function LinearRegressionPrediction () {

  const DEFAULT_OPTIONS = {
    elements: {
      point: {
        pointStyle : 'circle',
        borderWidth: 2,
        radius     : 3,
        hoverRadius: 8
      }
    }
  }

  const { dataPrediction } = useContext(LinearRegressionContext)

  const refChartJS = useRef()
  const labels = Array(100).fill('').map(() => {
    return faker.date.month()
  })

  const getRandomInt = (max) => {
    return Math.floor(Math.random() * max)
  }
  const generateColor = () => {
    const r = getRandomInt(255)
    const g = getRandomInt(255)
    const b = getRandomInt(255)
    return {
      borderColor         : `rgba(${r}, ${g}, ${b})`,
      backgroundColor     : `rgba(${Math.ceil(r * 0.95)}, ${Math.ceil(g * 0.95)}, ${Math.ceil(b * 0.95)})`,
      pointBorderColor    : `rgba(${r}, ${g}, ${b})`,
      pointBackgroundColor: `rgba(0, 0, 0, 0)`,
    }
  }

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

  console.log('render LinearRegressionPrediction')
  return <>
    <Button variant={'outline-primary'} onClick={updateDataPrediction}>Update</Button>

    <Chart type="bar" ref={refChartJS} data={data} options={DEFAULT_OPTIONS} />
  </>
}