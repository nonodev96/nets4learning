import React from 'react'
import { useParams } from 'react-router'
import { Col, Container, Row } from "react-bootstrap";

import N4LFooter from '../../components/footer/N4LFooter'
import N4LNavBar from '../../components/navBar/N4LNavBar'
import './EdtiArchitecture.css'

import ModelReviewTabularClassification from '../editor/0_TabularClassification/ModelReviewTabularClassification'
import CustomDatasetTabularClassification from '../editor/0_TabularClassification/CustomDatasetTabularClassification'

import ModelReviewLinearRegression from "../editor/1_LinearRegression/ModelReviewLinearRegression";
import LinearRegression from "../editor/1_LinearRegression/LinearRegression";

import ModelReviewObjectDetection from '../editor/2_ObjectDetection/ModelReviewObjectDetection'
import ObjectDetection from '../editor/2_ObjectDetection/ObjectDetection'

import ModelReviewImageClassification from '../editor/3_ImageClassification/ModelReviewImageClassification'
import ImageClassification from '../editor/3_ImageClassification/ImageClassification'


import { LIST_TYPE_MODELS } from "../../DATA_MODEL";
import NotFoundPage from "../notFound/NotFoundPage";

export default function EditArchitecture() {
  const { id, tipo, ejemplo } = useParams()

  const Print_HTML_Model_View = () => {
    switch (id.toString()) {
      case '0':
        if (tipo === '0') {
          return <ModelReviewTabularClassification dataset={ejemplo}/>
        } else {
          return <CustomDatasetTabularClassification dataset={ejemplo}/>
        }
      case '1':
        // TODO
        if (tipo === '0') {
          return <ModelReviewLinearRegression dataset={ejemplo}/>
        } else {
          return <LinearRegression dataset={ejemplo}/>
        }
      case '2':
        if (tipo === '0') {
          return <ModelReviewObjectDetection dataset={ejemplo}/>
        } else {
          return <ObjectDetection dataset={ejemplo}/>
        }
      case '3':
        // TODO
        if (tipo === '0') {
          return <ModelReviewImageClassification dataset={ejemplo}/>
        } else {
          return <ImageClassification dataset={ejemplo}/>
        }
      default:
        return <NotFoundPage/>
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

