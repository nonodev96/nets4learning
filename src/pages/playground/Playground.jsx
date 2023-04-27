import "./Playground.css";
import React from "react";
import { useParams } from "react-router";
import { Col, Container, Row } from "react-bootstrap";

import N4LNavbar from "../../components/header/N4LNavbar";
import N4LFooter from "../../components/footer/N4LFooter";

import NotFoundPage from "../notFound/NotFoundPage";

import TabularClassificationModelReview from "./0_TabularClassification/TabularClassificationModelReview";
import TabularClassificationCustomDataset from "./0_TabularClassification/TabularClassificationCustomDataset";

import ObjectDetectionModelReview from "./2_ObjectDetection/ObjectDetectionModelReview";

import ImageClassificationModelReview from "./3_ImageClassification/ImageClassificationModelReview";
import ImageClassification from "./3_ImageClassification/ImageClassification";

import { useTranslation } from "react-i18next";

export default function Playground() {
  const { id, option, example } = useParams();
  const { t } = useTranslation();
  const Print_HTML_Model_View = () => {
    switch (id.toString()) {
      case "0": {
        if (option === "0") {
          return <TabularClassificationModelReview dataset={example} />;
        } else {
          return <TabularClassificationCustomDataset dataset={example} />;
        }
      }
      case "1": {
        // TODO
        // return <LinearRegression dataset={example}/>
        break;
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
      <N4LNavbar />

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

      <N4LFooter />
    </>
  );
}

