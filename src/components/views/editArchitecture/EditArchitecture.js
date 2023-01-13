import React from 'react'
import { useParams } from 'react-router'
import Footer from '../../footer/Footer'
import NavBar from '../../navBar/NavBar'
import './EdtiArchitecture.css'
import ClassicClassification from '../editor/classicClassification/ClassicClassification'
import MnistImageClassification from '../editor/mnistImageClassification/MnistImageClasification'
import CustomDataSetClassification from '../editor/classicClassification/CustomDataSetClassicClassifcation'
import ModelReviewClassicClassification from '../editor/classicClassification/ModelReviewClassicClassifcation'
import ModelReviewClassicImageClassification from '../editor/mnistImageClassification/ModelReviewClassicImageClassification'
import ObjectDetection from '../editor/objectDetection/ObjectDetection'
import ModelReviewObjectDetection from '../editor/objectDetection/ModelReviewObjectDetection'

function EditArchitecture() {
  const { id, tipo, ejemplo } = useParams()
  const modelsType = [
    'Clasificación clásica',
    'Regresión lineal',
    'Identificación de objetos',
    'Clasificador de imágenes',
  ]

  const selectedEditor = () => {
    switch (id.toString()) {
      case '0':
        if (tipo === 0) {
          return <ModelReviewClassicClassification dataSet={ejemplo}/>
        } else {
          return <CustomDataSetClassification dataSet={ejemplo}/>
        }
      case '1':
        if (tipo === 0) {
          return <ObjectDetection/>
        } else {
          return <ObjectDetection/>
        }
      case '2':
        if (tipo === 0) {
          return <ModelReviewObjectDetection dataSet={ejemplo}/>
        } else {
          return <ObjectDetection dataSet={ejemplo}/>
        }
      case '3':
        if (tipo === 0) {
          return <ModelReviewClassicImageClassification dataSet={ejemplo}/>
        } else {
          return <MnistImageClassification dataSet={ejemplo}/>
        }
      default:
        return <ClassicClassification dataSet={ejemplo}/>
    }
  }

  return (
    <>
      <NavBar/>
      <div className="container">
        <h1 className="titulos mt-2">{modelsType[id]}</h1>
      </div>
      {selectedEditor()}
      <Footer/>
    </>
  )
}

export default EditArchitecture
