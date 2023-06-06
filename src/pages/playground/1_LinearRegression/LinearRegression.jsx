import { Accordion, Button, Card, Col, Container, Form, Row } from 'react-bootstrap'
import React, { useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import Joyride from 'react-joyride';
import I_MODEL_LINEAR_REGRESSION from "./models/_model";
import { MODEL_AUTO_MPG, MODEL_BREAST_CANCER, MODEL_DIABETES, MODEL_STUDENT_PERFORMANCE, MODEL_WINE } from "./models";
import LinearRegressionManual from "./LinearRegressionManual";
import LinearRegressionDatasetUpload from "./LinearRegressionDatasetUpload";
import { MODEL_UPLOAD } from "../../../DATA_MODEL";
import LinearRegressionEditorLayers from "./LinearRegressionEditorLayer";
import LinearRegressionEditorTrainer from "./LinearRegressionEditorTrainer";
import * as dfd from "danfojs"
import * as tfjs from "@tensorflow/tfjs"
import LinearRegressionDataset from "./LinearRegressionDataset";
import DebugJSON from "../../../components/debug/DebugJSON";
import N4LLayerDesign from "../../../components/neural-network/N4LLayerDesign";
import LinearRegressionPrediction from "./LinearRegressionPrediction";
import LinearRegressionTableModels from "./LinearRegressionTableModels";

const DEFAULT_LAYERS = [
  { units: 3, activation: "relu" },
  { units: 7, activation: "relu" },
  { units: 10, activation: "relu" },
  { units: 3, activation: "relu" },
]

// TODO
export default function LinearRegression(props) {
  const { dataset } = props

  // i18n
  const prefix = "pages.playground.generator."
  const { t } = useTranslation()

  const [i_model, setIModel] = useState(new I_MODEL_LINEAR_REGRESSION(t))
  const [data_prediction, setDataPrediction] = useState({
    labels  : [],
    datasets: []
  })

  const DEFAULT_CUSTOM_MODEL = {
    path_datasets      : "",
    list_datasets      : [""],
    dataframe_original : new dfd.DataFrame(),
    dataframe_processed: new dfd.DataFrame(),
    list_layers        : DEFAULT_LAYERS,
    model              : new tfjs.sequential(),
    params_training    : {
      learning_rate  : 0.01,
      n_of_epochs    : 20,
      test_size      : 0.1,
      id_optimizer   : "rmsprop",
      id_loss        : "meanSquaredError",
      list_id_metrics: ["meanSquaredError", "meanAbsoluteError"]
    },
  }

  /**
   * @typedef {Object} CustomParamsLayerModel_t
   * @property {number} units
   * @property {string} activation
   *
   * @typedef {Object} CustomParamsTrainModel_t
   * @property {number} learning_rate
   * @property {number} n_of_epochs
   * @property {number} test_size
   * @property {string} id_optimizer
   * @property {string} id_loss
   * @property {Array<string>} list_id_metrics
   *
   * @typedef {Object} CustomModel_t
   * @property {dataframe} dataframe_original
   * @property {dataframe} dataframe_processed
   * @property {Array<CustomParamsLayerModel_t>} list_layers
   * @property {CustomParamsTrainModel_t} params_training
   * @property {tfjs.sequential} model
   */
  const [tmpModel, setTmpModel] = useState(/** @type CustomModel_t */DEFAULT_CUSTOM_MODEL)
  const [listModels, setListModels] = useState(/** @type Array<CustomModel_t> */[])

  const handleSubmit_ProcessDataFrame = async (event) => {
    event.preventDefault()
  }

  useEffect(() => {
    const init = async () => {
      switch (dataset) {
        case MODEL_UPLOAD: {
          // TODO
          break
        }
        case MODEL_AUTO_MPG.KEY: {
          setIModel(new MODEL_AUTO_MPG(t))
          const path_datasets = process.env.REACT_APP_PATH + "/datasets/linear-regression/auto-mpg/";
          const dataframe = await dfd.readCSV(path_datasets + "auto-mpg.csv")
          setTmpModel((old) => ({
            ...old,
            dataframe_original: dataframe,
            path_datasets     : path_datasets,
            list_datasets     : ["auto-mpg.csv"]
          }))
          break
        }
        case MODEL_BREAST_CANCER.KEY: {
          // TODO
          // hay que pasar los .data a .csv
          setIModel(new MODEL_BREAST_CANCER(t))
          const path_datasets = process.env.REACT_APP_PATH + "/datasets/linear-regression/breast-cancer/";
          const dataframe = await dfd.readCSV(path_datasets + "breast-cancer-wisconsin.csv")
          setTmpModel((old) => ({
            ...old,
            dataframe_original: dataframe,
            path_datasets     : path_datasets,
            list_datasets     : ["breast-cancer-wisconsin.csv", "wdbc.csv", "wpbc.csv"]
          }))
          break
        }
        case MODEL_DIABETES.KEY: {
          setIModel(new MODEL_DIABETES(t))
          const path_datasets = process.env.REACT_APP_PATH + "/datasets/linear-regression/diabetes/"
          const dataframe = await dfd.readCSV(path_datasets + "diabetes.csv")
          setTmpModel((old) => ({
            ...old,
            dataframe_original: dataframe,
            path_datasets     : path_datasets,
            list_datasets     : ["diabetes.csv"]
          }))
          break
        }
        case MODEL_STUDENT_PERFORMANCE.KEY: {
          setIModel(new MODEL_STUDENT_PERFORMANCE(t))
          const path_datasets = process.env.REACT_APP_PATH + "/datasets/linear-regression/student-performance/"
          const dataframe = await dfd.readCSV(path_datasets + "student-mat.csv")
          setTmpModel((old) => ({
            ...old,
            dataframe_original: dataframe,
            path_datasets     : path_datasets,
            list_datasets     : ["student-mat.csv", "student-por.csv"]
          }))
          break
        }
        case MODEL_WINE.KEY: {
          setIModel(new MODEL_WINE(t))
          const path_datasets = process.env.REACT_APP_PATH + "/datasets/linear-regression/wine-quality/"
          const dataframe = await dfd.readCSV(path_datasets + "wine-quality-red.csv")
          setTmpModel((old) => ({
            ...old,
            dataframe_original: dataframe,
            path_datasets     : path_datasets,
            list_datasets     : ["wine-quality-red.csv", "wine-quality-white.csv"]
          }))
          break
        }
        default: {
          console.error("Error, option not valid")
          break
        }
      }
    }
    init().then(() => undefined)
  }, [dataset])

  return (
    <>


      <Container className={"mt-3"}>

        <Row className={"mt-3 text-center"}>
          <Col className={"my-step-1"}><h1>hello world</h1></Col>
          <Col className={"my-step-2"}><h1>hello world</h1></Col>
          <Col className={"my-step-3"}><h1>hello world</h1></Col>
        </Row>

        <hr />

        <Row>
          <Col>

            <Accordion defaultActiveKey={[]}>
              <Accordion.Item eventKey={"manual"}>
                <Accordion.Header><h3><Trans i18nKey={"pages.playground.1-linear-regression.generator.manual.title"} /></h3></Accordion.Header>
                <Accordion.Body>
                  <LinearRegressionManual i_model={i_model} />
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey={"dataset_info"}>
                <Accordion.Header>
                  <h3>
                    <Trans i18nKey={dataset !== "UPLOAD" ? i_model.i18n_TITLE : "dataset.upload-dataset"} />
                  </h3>
                </Accordion.Header>
                <Accordion.Body id={"info_model"}>
                  <LinearRegressionDatasetUpload dataset={dataset}
                                                 i_model={i_model}
                                                 tmpModel={tmpModel}
                                                 setTmpModel={setTmpModel}
                  />
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>

          </Col>
        </Row>

        <hr />

        <Row>
          <Col><LinearRegressionDataset tmpModel={tmpModel} setTmpModel={setTmpModel} /></Col>
        </Row>

        <hr />

        <Row>
          <Col><N4LLayerDesign layers={tmpModel.list_layers} /></Col>
        </Row>

        <Row className={"mt-3"}>
          <Col><LinearRegressionEditorLayers tmpModel={tmpModel} setTmpModel={setTmpModel} /></Col>
          <Col><LinearRegressionEditorTrainer tmpModel={tmpModel} setTmpModel={setTmpModel} /></Col>
        </Row>

        <hr />

        <Row className={"mt-3"}>
          <Col>
            <Card>
              <Card.Header className={"d-flex align-items-center"}>
                <h3>Lista modelos generados</h3>
                <div className={"ms-3"}>
                  <Form.Group controlId={"DATA"}>
                    <Button variant={"outline-primary"} size={"sm"}
                            onClick={() => {
                              setListModels([...listModels, tmpModel])
                            }}>Push</Button>
                  </Form.Group>
                </div>
              </Card.Header>
              <Card.Body>
                <LinearRegressionTableModels listModels={listModels} />
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <hr />

        <Row className={"mt-3"}>
          <Col>
            <Card>
              <Card.Header>
                <h3>Linear Regression Prediction</h3>
              </Card.Header>
              <Card.Body>
                <LinearRegressionPrediction data={data_prediction} />
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
                <DebugJSON obj={tmpModel.list_layers} />
                <DebugJSON obj={tmpModel.params_training} />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  )
}