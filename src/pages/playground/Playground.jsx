import './Playground.css'
import React from 'react'
import { useParams } from 'react-router'
import { Col, Container, Row } from "react-bootstrap";

import N4LNavbar from '../../components/header/N4LNavbar'
import N4LFooter from '../../components/footer/N4LFooter'


import TabularClassificationModelReview from './/0_TabularClassification/TabularClassificationModelReview'
import TabularClassificationCustomDataset from './/0_TabularClassification/TabularClassificationCustomDataset'
import LinearRegressionModelReview from ".//1_LinearRegression/ModelReviewLinearRegression";
import LinearRegression from ".//1_LinearRegression/LinearRegression";
import ObjectDetectionModelReview from './/2_ObjectDetection/ModelReviewObjectDetection'
import ObjectDetection from './/2_ObjectDetection/ObjectDetection'
import ImageClassificationModelReview from './/3_ImageClassification/ModelReviewImageClassification'
import ImageClassification from './/3_ImageClassification/ImageClassification'
import NotFoundPage from "../notFound/NotFoundPage";

import { LIST_TYPE_MODELS } from "../../DATA_MODEL";

export default function Playground() {
  const { id, option, example } = useParams()

  const Print_HTML_Model_View = () => {
    switch (id.toString()) {
      case '0':
        if (option === '0') {
          return <TabularClassificationModelReview dataset={example}/>
        } else {
          return <TabularClassificationCustomDataset dataset={example}/>
        }
      case '1':
        // TODO
        if (option === '0') {
          return <LinearRegressionModelReview dataset={example}/>
        } else {
          return <LinearRegression dataset={example}/>
        }
      case '2':
        if (option === '0') {
          return <ObjectDetectionModelReview dataset={example}/>
        } else {
          return <ObjectDetection dataset={example}/>
        }
      case '3':
        // TODO
        if (option === '0') {
          return <ImageClassificationModelReview dataset={example}/>
        } else {
          return <ImageClassification dataset={example}/>
        }
      default:
        return <NotFoundPage/>
    }
  }

  return (
    <>
      <N4LNavbar/>

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

