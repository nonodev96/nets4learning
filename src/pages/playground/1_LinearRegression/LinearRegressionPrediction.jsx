import React, { useRef, useState } from 'react'
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController,
} from 'chart.js'
import { Chart } from 'react-chartjs-2'
import { faker } from "@faker-js/faker"
import { Button } from "react-bootstrap";

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController
)
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

export default function LinearRegressionPrediction({ data_prediction, setDataPrediction }) {

  const refChartJS = useRef()
  const labels = Array(100).fill("").map(() => {
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
    datasets: [...generate(), ...generate(), ...generate(), ...generate(), ...generate()],
  })


  const updateDataPrediction = () => {
    console.log(data_prediction)

    // model.
    setDataPrediction(...data)
  }


  return <>
    <Button variant={"outline-primary"} onClick={updateDataPrediction}>Update</Button>

    <Chart type='bar' ref={refChartJS} data={data} options={DEFAULT_OPTIONS} />
  </>
}
