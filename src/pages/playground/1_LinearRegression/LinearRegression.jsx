import { Accordion, Button, Card, Col, Container, Form, Row } from 'react-bootstrap'
import React, { lazy, useContext, useEffect, useState } from "react"
import { Trans, useTranslation } from "react-i18next"
import N4LLayerDesign from "../../../components/neural-network/N4LLayerDesign"
import DebugJSON from "../../../components/debug/DebugJSON"

import { UPLOAD } from "../../../DATA_MODEL"
import {
  I_DATASETS_LINEAR_REGRESSION,
  DATASET_1_SALARY,
  DATASET_2_AUTO_MPG,
  DATASET_3_BOSTON_HOUSING,
  DATASET_4_BREAST_CANCER,
  DATASET_5_STUDENT_PERFORMANCE,
  DATASET_6_WINE
} from "./datasets"
import LinearRegressionContext from "../../../context/LinearRegressionContext";

// Manual and datasets
const LinearRegressionManual = lazy(() => import( "./LinearRegressionManual"))
const LinearRegressionDataset = lazy(() => import( "./LinearRegressionDataset"))
const LinearRegressionDatasetShow = lazy(() => import( "./LinearRegressionDatasetShow"))
const LinearRegressionDatasetPlot = lazy(() => import( "./LinearRegressionDatasetPlot"))
// Editors
const LinearRegressionEditorLayers = lazy(() => import( "./LinearRegressionEditorLayer"))
const LinearRegressionEditorTrainer = lazy(() => import( "./LinearRegressionEditorTrainer"))
const LinearRegressionVisor = lazy(() => import( "./LinearRegressionVisor"))
// Models
const LinearRegressionTableModels = lazy(() => import( "./LinearRegressionTableModels"))
const LinearRegressionPrediction = lazy(() => import(  "./LinearRegressionPrediction"))


// TODO
export default function LinearRegression(props) {
  const { dataset_id } = props

  // i18n
  const prefix = "pages.playground.generator."
  const { t } = useTranslation()

  const {
    tmpModel,
    setTmpModel,
    listModels,
    setListModels,
    isTraining,
    setIsTraining,
    accordionActive,
    setAccordionActive,
    i_model,
    setIModel,
    dataPrediction,
    setDataPrediction
  } = useContext(LinearRegressionContext)

  const handleSubmit_ProcessDataFrame = async (event) => {
    event.preventDefault()
  }

  const handleSubmit_TrainModel = async (event) => {
    event.preventDefault()
    setIsTraining(true)
    console.log("handleSubmit_TrainModel")
  }

  useEffect(() => {
    const init = async () => {
      if (dataset_id === UPLOAD) {

      } else {
        let info_dataset;
        switch (dataset_id) {
          case DATASET_1_SALARY.KEY: {
            info_dataset = new DATASET_1_SALARY(t, setAccordionActive)
            break
          }
          case DATASET_2_AUTO_MPG.KEY: {
            info_dataset = new DATASET_2_AUTO_MPG(t, setAccordionActive)
            break
          }
          case DATASET_3_BOSTON_HOUSING.KEY: {
            info_dataset = new DATASET_3_BOSTON_HOUSING(t, setAccordionActive)
            break
          }
          case DATASET_4_BREAST_CANCER.KEY: {
            info_dataset = new DATASET_4_BREAST_CANCER(t, setAccordionActive)
            break
          }
          case DATASET_5_STUDENT_PERFORMANCE.KEY: {
            info_dataset = new DATASET_5_STUDENT_PERFORMANCE(t, setAccordionActive)
            break
          }
          case DATASET_6_WINE.KEY: {
            info_dataset = new DATASET_6_WINE(t, setAccordionActive)
            break
          }
          default: {
            console.error("Error, option not valid")
            break
          }
        }
        const { datasets, datasets_path } = await info_dataset.DATASETS()
        setIModel(info_dataset)
        setTmpModel((old) => ({
          ...old, datasets: datasets, datasets_path: datasets_path,
        }))
      }
    }
    init().then(() => undefined)
  }, [dataset_id, t])

  const accordionToggle = (value) => {
    const copy = JSON.parse(JSON.stringify(accordionActive))
    let index = copy.indexOf(value);
    if (index === -1) {
      copy.push(value);
    } else {
      copy.splice(index, 1);
    }
    setAccordionActive(copy)
  }


  return (
    <>
      <Container className={"mt-3"}>
        <Row>
          <Col>

            <Accordion defaultActiveKey={[]} activeKey={accordionActive}>
              <Accordion.Item className={"joyride-step-1-manual"}
                              eventKey={"manual"}>
                <Accordion.Header onClick={() => accordionToggle("manual")}>
                  <h3><Trans i18nKey={"pages.playground.1-linear-regression.generator.manual.title"} /></h3>
                </Accordion.Header>
                <Accordion.Body>
                  <LinearRegressionManual i_model={i_model} />
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item className={"joyride-step-2-dataset-info"}
                              eventKey={"dataset_info"}>
                <Accordion.Header onClick={() => accordionToggle("dataset_info")}>
                  <h3><Trans i18nKey={dataset_id !== UPLOAD ? i_model.i18n_TITLE : "dataset.upload-dataset"} /></h3>
                </Accordion.Header>
                <Accordion.Body id={"info_model"}>

                  <LinearRegressionDataset dataset_id={dataset_id} />

                </Accordion.Body>
              </Accordion.Item>
            </Accordion>

          </Col>
        </Row>

        <hr />

        <Row className={"joyride-step-3-dataset"}>
          <Col>
            <LinearRegressionDatasetShow />
          </Col>
        </Row>

        <hr />

        <Row className={"joyride-step-3-dataset"}>
          <Col>
            <LinearRegressionDatasetPlot />
          </Col>
        </Row>

        <hr />

        <Row>
          <Col className={"joyride-step-4-layer"}>
            <N4LLayerDesign layers={tmpModel.list_layers} />
          </Col>
        </Row>

        <Form onSubmit={handleSubmit_TrainModel}>

          <Row className={"mt-3"}>
            <Col className={"mb-3 joyride-step-5-editor-layers"}>
              <LinearRegressionEditorLayers />
              <hr />
              <LinearRegressionVisor />
            </Col>
            <Col className={"joyride-step-6-editor-trainer"}>
              <LinearRegressionEditorTrainer />
            </Col>
          </Row>

          <Row className={"mt-3"}>
            <Col xl={12}>
              <div className="d-grid gap-2">
                <Button type={"submit"}
                        disabled={isTraining || !tmpModel.isDatasetProcessed}
                        size={"lg"}
                        variant="primary">
                  <Trans i18nKey={prefix + "models.button-submit"} />
                </Button>
              </div>
            </Col>
          </Row>

        </Form>

        <hr />

        <Row className={"mt-3"}>
          <Col className={"joyride-step-7-list-of-models"}>
            <Card>
              <Card.Header className={"d-flex align-items-center"}>
                <h3>{prefix + "list-models-generated"}</h3>
              </Card.Header>
              <Card.Body>
                <LinearRegressionTableModels />
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <hr />

        <Row className={"mt-3"}>
          <Col className={"joyride-step-8-predict-visualization"}>
            <Card>
              <Card.Header>
                <h3>{t("pages.playground.1-linear-regression.prediction")}</h3>
              </Card.Header>
              <Card.Body>
                <LinearRegressionPrediction />
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className={"mt-3"}>
          <Col>
            <Card>
              <Card.Header>
                <h3>Debug</h3>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col><DebugJSON obj={tmpModel.params_training} /></Col>
                  <Col><DebugJSON obj={tmpModel.params_training} /></Col>
                  <Col><DebugJSON obj={accordionActive} /></Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <hr />

        <Row className={"mt-3 text-center"}>
          <Col className={"my-step-1"}><h1>hello world</h1></Col>
          <Col className={"my-step-2"}><h1>hello world</h1></Col>
          <Col className={"my-step-3"}><h1>hello world</h1></Col>
        </Row>

      </Container>
    </>
  )
}