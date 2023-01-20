import React from 'react'
import { useParams } from 'react-router'
import { Col, Container, Row } from "react-bootstrap";

import N4LFooter from '../../footer/N4LFooter'
import N4LNavBar from '../../navBar/N4LNavBar'
import './EdtiArchitecture.css'

import ClassicClassification from '../editor/classicClassification/ClassicClassification'
import CustomDataSetClassicClassification from '../editor/classicClassification/CustomDataSetClassicClassification'
import ModelReviewClassicClassification from '../editor/classicClassification/ModelReviewClassicClassification'

import MnistImageClassification from '../editor/mnistImageClassification/MnistImageClassification'
import ModelReviewClassicImageClassification
  from '../editor/mnistImageClassification/ModelReviewClassicImageClassification'

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

  const Print_HTML_Editor = () => {
    // console.trace()
    // console.log({ tipo })
    switch (id.toString()) {
      case '0':
        if (tipo === '0') {
          return <ModelReviewClassicClassification dataSet={ejemplo}/>
        } else {
          return <CustomDataSetClassicClassification dataSet={ejemplo}/>
        }
      case '1':
        if (tipo === '0') {
          return <ObjectDetection/>
        } else {
          return <ObjectDetection/>
        }
      case '2':
        if (tipo === '0') {
          return <ModelReviewObjectDetection dataSet={ejemplo}/>
        } else {
          return <ObjectDetection dataSet={ejemplo}/>
        }
      case '3':
        if (tipo === '0') {
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
      <N4LNavBar/>
      <main className={"mb-3"} data-title={"EditArchitecture"}>
        <Container>
          <Row className={"mt-2"}>
            <Col xl={12}>
              <h1>{modelsType[id]}</h1>
            </Col>
          </Row>
        </Container>

        {/**/}
        {Print_HTML_Editor()}
      </main>
      <N4LFooter/>
    </>
  )
}

export default EditArchitecture
