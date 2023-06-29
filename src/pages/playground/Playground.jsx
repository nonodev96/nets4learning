import "./Playground.css";
import React from "react";
import { useParams } from "react-router";
import { Col, Container, Row } from "react-bootstrap";

import NotFoundPage from "../notFound/NotFoundPage";

import TabularClassification from "./0_TabularClassification/TabularClassification";
import TabularClassificationModelReview from "./0_TabularClassification/ModelReviewTabularClassification";

import LinearRegression from "./1_LinearRegression/LinearRegression";
import ModelReviewLinearRegression from "./1_LinearRegression/ModelReviewLinearRegression";

import ObjectDetectionModelReview from "./2_ObjectDetection/ObjectDetectionModelReview";

import ImageClassification from "./3_ImageClassification/ImageClassification";
import ImageClassificationModelReview from "./3_ImageClassification/ImageClassificationModelReview";


import { useTranslation } from "react-i18next";
import { LinearRegressionProvider } from "../../context/LinearRegressionContext";

export default function Playground() {
  const { id, option, example } = useParams();
  const { t } = useTranslation();
  const Print_HTML_Model_View = () => {
    switch (id.toString()) {
      case "0": {
        if (option === "0") {
          return <TabularClassificationModelReview dataset={example} />;
        } else {
          return <TabularClassification dataset={example} />;
        }
      }
      case "1": {
        if (option === "0") {
          return <ModelReviewLinearRegression dataset={example} />
        } else {
          return <LinearRegressionProvider><LinearRegression dataset_id={example} /></LinearRegressionProvider>
        }
      }
      case "2": {
        return <ObjectDetectionModelReview dataset={example} />;
      }
      case "3": {
        if (option === "0") {
          return <ImageClassificationModelReview dataset={example} />;
        } else {
          return <ImageClassification dataset={example} />;
        }
      }
      default:
        return <NotFoundPage />;
    }
  };

  return (
    <>
      <main className={"mb-3"} data-title={"EditArchitecture"}>
        <Container>
          <Row className={"mt-2"}>
            <Col xl={12}>
              <h1>{t("modality." + id)}</h1>
            </Col>
          </Row>
        </Container>

        {/**/}
        {Print_HTML_Model_View()}
      </main>
    </>
  );
}

