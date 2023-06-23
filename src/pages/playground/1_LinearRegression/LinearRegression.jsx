import { Accordion, Button, Card, Col, Container, Form, Row } from 'react-bootstrap'
import React, { useEffect, useState } from "react"
import { Trans, useTranslation } from "react-i18next"
import * as dfd from "danfojs"
import * as tfjs from "@tensorflow/tfjs"
import N4LLayerDesign from "../../../components/neural-network/N4LLayerDesign"
import DebugJSON from "../../../components/debug/DebugJSON"
// Manual and datasets
import LinearRegressionManual from "./LinearRegressionManual"
import LinearRegressionDataset from "./LinearRegressionDataset"
import LinearRegressionDatasetShowOrUpload from "./LinearRegressionDatasetShowOrUpload"
// Editors
import LinearRegressionEditorLayers from "./LinearRegressionEditorLayer"
import LinearRegressionEditorTrainer from "./LinearRegressionEditorTrainer"
import LinearRegressionVisor from "./LinearRegressionVisor"
// Models
import LinearRegressionTableModels from "./LinearRegressionTableModels"
import LinearRegressionPrediction from "./LinearRegressionPrediction"

import {
  I_MODEL_LINEAR_REGRESSION,
  MODEL_SALARY,
  MODEL_AUTO_MPG,
  MODEL_BREAST_CANCER,
  MODEL_BOSTON_HOUSING,
  MODEL_STUDENT_PERFORMANCE,
  MODEL_WINE,
} from "./models"
import { MODEL_UPLOAD } from "../../../DATA_MODEL"

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

  //
  const DEFAULT_DATASETS = {
    path               : "",
    info               : "",
    csv                : "",
    dataframe_original : new dfd.DataFrame(),
    dataframe_processed: new dfd.DataFrame(),
    isDatasetProcessed : false,
    dataset_transforms : [],
  }
  const DEFAULT_CUSTOM_MODEL = {
    datasets       : [],
    list_layers    : DEFAULT_LAYERS,
    model          : new tfjs.sequential(),
    params_training: {
      learning_rate  : 0.01,
      n_of_epochs    : 20,
      test_size      : 0.1,
      id_optimizer   : "rmsprop",
      id_loss        : "meanSquaredError",
      list_id_metrics: ["meanSquaredError", "meanAbsoluteError"]
    },
    params_visor   : []
  }

  /**
   * @typedef {Object} CustomPreprocessDataset_t
   * @property {string} column_name
   * @property {string} column_transform
   *
   * @typedef {Object} CustomDatasetInfo_t
   * @property {string} csv
   * @property {string} info
   * @property {string} path
   * @property {dataframe} dataframe_original
   * @property {dataframe} dataframe_processed
   * @property {boolean} isDatasetProcessed
   * @property {Array<CustomPreprocessDataset_t>} dataset_transforms
   *
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
   * @property {Array<CustomDatasetInfo_t>} datasets
   * @property {Array<CustomParamsLayerModel_t>} list_layers
   * @property {CustomParamsTrainModel_t} params_training
   * @property {tfjs.sequential} model
   */
  const [tmpModel, setTmpModel] = useState(/** @type CustomModel_t */DEFAULT_CUSTOM_MODEL)
  const [listModels, setListModels] = useState(/** @type Array<CustomModel_t> */[])
  const [isTraining, setIsTraining] = useState(false)

  const handleSubmit_ProcessDataFrame = async (event) => {
    event.preventDefault()
  }

  async function LOAD_SALARY() {
    setIModel(new MODEL_AUTO_MPG(t))
    const path_datasets = process.env.REACT_APP_PATH + "/datasets/linear-regression/salary/"
    const path_dataset_1 = path_datasets + "salary.csv"
    const dataframe_original_1 = await dfd.readCSV(path_dataset_1)
    const dataframe_processed_1 = await dfd.readCSV(path_dataset_1)
    setTmpModel((old) => ({
      ...old,
      datasets     : [{
        path               : path_dataset_1,
        info               : "salary.names",
        csv                : "salary.csv",
        dataframe_original : dataframe_original_1,
        dataframe_processed: dataframe_processed_1,
        dataset_transforms : [],
        isDatasetProcessed : true,
      }],
      path_datasets: path_datasets,
    }))
  }

  async function LOAD_AUTO_MPG() {
    setIModel(new MODEL_AUTO_MPG(t))
    const path_datasets = process.env.REACT_APP_PATH + "/datasets/linear-regression/auto-mpg/"
    const path_dataset_1 = path_datasets + "auto-mpg.csv"
    const dataframe_original_1 = await dfd.readCSV(path_dataset_1)
    const dataframe_processed_1 = await dfd.readCSV(path_dataset_1)
    setTmpModel((old) => ({
      ...old,
      datasets     : [{
        path               : path_dataset_1,
        info               : "auto-mpg.names",
        csv                : "auto-mpg.csv",
        dataframe_original : dataframe_original_1,
        dataframe_processed: dataframe_processed_1,
        dataset_transforms : [],
        isDatasetProcessed : true
      }],
      path_datasets: path_datasets,
    }))
  }

  async function LOAD_BOSTON_HOUSING() {
    setIModel(new MODEL_BOSTON_HOUSING(t))
    const path_datasets = process.env.REACT_APP_PATH + "/datasets/linear-regression/boston-housing/"
    const path_dataset = process.env.REACT_APP_PATH + "/datasets/linear-regression/boston-housing/housing.csv"
    const dataframe_original = await dfd.readCSV(path_dataset)
    const dataframe_processed = await dfd.readCSV(path_dataset)
    setTmpModel((old) => ({
      ...old,
      datasets     : [{
        path               : path_dataset,
        csv                : "housing.csv",
        info               : "housing.names",
        dataframe_original : dataframe_original,
        dataframe_processed: dataframe_processed,
        dataset_transforms : [],
        isDatasetProcessed : true,
      }],
      path_datasets: path_datasets,
    }))
  }

  async function LOAD_BREAST_CANCER() {
    // TODO
    // hay que pasar los .data a .csv
    setIModel(new MODEL_BREAST_CANCER(t))
    const path_datasets = process.env.REACT_APP_PATH + "/datasets/linear-regression/breast-cancer/"
    const path_dataset_1 = path_datasets + "breast-cancer-wisconsin.csv"
    const path_dataset_2 = path_datasets + "wdbc.csv"
    const path_dataset_3 = path_datasets + "wpbc.csv"
    const dataframe_original_1 = await dfd.readCSV(path_dataset_1)
    const dataframe_processed_1 = await dfd.readCSV(path_dataset_1)
    const dataframe_original_2 = await dfd.readCSV(path_dataset_2)
    const dataframe_processed_2 = await dfd.readCSV(path_dataset_2)
    const dataframe_original_3 = await dfd.readCSV(path_dataset_3)
    const dataframe_processed_3 = await dfd.readCSV(path_dataset_3)
    dataframe_original_1.print()

    setTmpModel((old) => ({
      ...old,
      datasets     : [{
        path               : path_dataset_2,
        info               : "wdbc.names",
        csv                : "wdbc.csv",
        dataframe_original : dataframe_original_2,
        dataframe_processed: dataframe_processed_2,
        dataset_transforms : [],
        isDatasetProcessed : true,
      }, {
        path               : path_dataset_3,
        info               : "wpbc.names",
        csv                : "wpbc.csv",
        dataframe_original : dataframe_original_3,
        dataframe_processed: dataframe_processed_3,
        dataset_transforms : [],
        isDatasetProcessed : true,
      }, {
        path               : path_dataset_1,
        info               : "breast-cancer-wisconsin.names",
        csv                : "breast-cancer-wisconsin.csv",
        dataframe_original : dataframe_original_1,
        dataframe_processed: dataframe_processed_1,
        dataset_transforms : [{ column_name: "Bare Nuclei", column_transform: "replace_?_NAN" }, { column_name: "Bare Nuclei", column_transform: "fill_NAN_MEDIAN" }],
        isDatasetProcessed : true,
      },],
      path_datasets: path_datasets,
    }))
  }

  async function LOAD_STUDENT_PERFORMANCE() {
    setIModel(new MODEL_STUDENT_PERFORMANCE(t))
    const path_datasets = process.env.REACT_APP_PATH + "/datasets/linear-regression/student-performance/"
    const path_dataset_1 = path_datasets + "student-mat.csv"
    const path_dataset_2 = path_datasets + "student-por.csv"
    const dataframe_original_1 = await dfd.readCSV(path_dataset_1)
    const dataframe_processed_1 = await dfd.readCSV(path_dataset_1)
    const dataframe_original_2 = await dfd.readCSV(path_dataset_2)
    const dataframe_processed_2 = await dfd.readCSV(path_dataset_2)
    setTmpModel((old) => ({
      ...old,
      datasets     : [{
        path               : path_dataset_1,
        info               : "student.txt",
        csv                : "student-mat.csv",
        dataframe_original : dataframe_original_1,
        dataframe_processed: dataframe_processed_1,
        dataset_transforms : [],
        isDatasetProcessed : true,
      }, {
        path               : path_dataset_2,
        dataframe_original : dataframe_original_2,
        dataframe_processed: dataframe_processed_2,
        dataset_transforms : [],
        isDatasetProcessed : true,
        csv                : "student-por.csv",
        info               : "student.txt"
      }],
      path_datasets: path_datasets,
    }))
  }

  async function LOAD_MODEL_WINE() {
    setIModel(new MODEL_WINE(t))
    const path_datasets = process.env.REACT_APP_PATH + "/datasets/linear-regression/wine-quality/"
    const path_dataset_1 = path_datasets + "wine-quality-red.csv"
    const path_dataset_2 = path_datasets + "wine-quality-white.csv"
    const dataframe_original = await dfd.readCSV(path_dataset_1)
    const dataframe_processed = await dfd.readCSV(path_dataset_1)
    const dataframe_original_2 = await dfd.readCSV(path_dataset_2)
    const dataframe_processed_2 = await dfd.readCSV(path_dataset_2)
    setTmpModel((old) => ({
      ...old,
      datasets     : [{
        path               : path_datasets,
        info               : "wine-quality.names",
        csv                : "wine-quality-red.csv",
        dataframe_original : dataframe_original,
        dataframe_processed: dataframe_processed,
        dataset_transforms : [],
        isDatasetProcessed : true,
      }, {
        path               : path_datasets,
        csv                : "wine-quality-white.csv",
        info               : "wine-quality.names",
        dataframe_original : dataframe_original_2,
        dataframe_processed: dataframe_processed_2,
        dataset_transforms : [],
        isDatasetProcessed : true,
      }],
      path_datasets: path_datasets,
    }))
  }

  useEffect(() => {
    const init = async () => {
      switch (dataset) {
        case MODEL_UPLOAD: {
          // TODO
          break
        }
        case MODEL_SALARY.KEY: {
          await LOAD_SALARY()
          break
        }
        case MODEL_AUTO_MPG.KEY: {
          await LOAD_AUTO_MPG()
          break
        }
        case MODEL_BOSTON_HOUSING.KEY: {
          await LOAD_BOSTON_HOUSING()
          break
        }
        case MODEL_BREAST_CANCER.KEY: {
          await LOAD_BREAST_CANCER()
          break
        }
        case MODEL_STUDENT_PERFORMANCE.KEY: {
          await LOAD_STUDENT_PERFORMANCE()
          break
        }
        case MODEL_WINE.KEY: {
          await LOAD_MODEL_WINE()
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

  const train = () => {
    setIsTraining(true)
  }

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
                  <LinearRegressionDatasetShowOrUpload dataset={dataset}
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

        <Form>

          <Row className={"mt-3"}>
            <Col className={"mb-3"}>
              <LinearRegressionEditorLayers tmpModel={tmpModel} setTmpModel={setTmpModel} />
              <hr />
              <LinearRegressionVisor tmpModel={tmpModel} setTmpModel={setTmpModel} />
            </Col>
            <Col>
              <LinearRegressionEditorTrainer tmpModel={tmpModel} setTmpModel={setTmpModel} />
            </Col>
          </Row>

          <Row className={"mt-3"}>
            <Col xl={12}>
              <div className="d-grid gap-2">
                <Button onClick={train}
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
          <Col>
            <Card>
              <Card.Header className={"d-flex align-items-center"}>
                <h3>Lista modelos generados</h3>
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
                <LinearRegressionPrediction data={data_prediction} setDataPrediction={setDataPrediction} />
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
                  <Col><DebugJSON obj={tmpModel.params_visor} /></Col>
                </Row>
                <Row>
                  {/*<Col><DebugJSON obj={tmpModel} /></Col>*/}
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  )
}