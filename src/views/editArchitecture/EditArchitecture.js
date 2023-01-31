import React from 'react'
import {useParams} from 'react-router'
import {Col, Container, Row} from "react-bootstrap";

import N4LFooter from '../../components/footer/N4LFooter'
import N4LNavBar from '../../components/navBar/N4LNavBar'
import './EdtiArchitecture.css'

import ClassicClassification from '../editor/classicClassification/ClassicClassification'
import CustomDataSetClassicClassification from '../editor/classicClassification/CustomDataSetClassicClassification'
import ModelReviewClassicClassification from '../editor/classicClassification/ModelReviewClassicClassification'

import MnistImageClassification from '../editor/mnistImageClassification/MnistImageClassification'
import ModelReviewClassicImageClassification
  from '../editor/mnistImageClassification/ModelReviewClassicImageClassification'

import ObjectDetection from '../editor/objectDetection/ObjectDetection'
import ModelReviewObjectDetection from '../editor/objectDetection/ModelReviewObjectDetection'
import {LIST_TYPE_MODELS} from "../../DATA_MODEL";

function EditArchitecture() {
  const {id, tipo, ejemplo} = useParams()

  const Print_HTML_Model_View = () => {
    switch (id.toString()) {
      case '0':
        if (tipo === '0') {
          return <ModelReviewClassicClassification dataSet={ejemplo}/>
        } else {
          return <CustomDataSetClassicClassification dataSet={ejemplo}/>
        }
      case '1':
        return <ObjectDetection/>
      case '2':
        if (tipo === '0') {
          return <ModelReviewObjectDetection dataSet={ejemplo}/>
        } else {
          return <ObjectDetection dataSet={ejemplo}/>
        }
      case '3':
        // TODO
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
              <h1>{LIST_TYPE_MODELS[id]}</h1>
            </Col>
          </Row>
        </Container>

        {/**/}
        {Print_HTML_Model_View()}
      </main>
      <N4LFooter/>
    </>
  )
}

export default EditArchitecture
