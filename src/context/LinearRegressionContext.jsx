import { createContext, useState } from "react";
import * as dfd from "danfojs";
import * as tfjs from "@tensorflow/tfjs";
import { useTranslation } from "react-i18next";
import { I_DATASETS_LINEAR_REGRESSION } from "../pages/playground/1_LinearRegression/datasets";

const LinearRegressionContext = createContext({});

export function LinearRegressionProvider({ children }) {

  const { t } = useTranslation()

  const [accordionActive, setAccordionActive] = useState([])
  // @formatter:off
  const DEFAULT_LAYERS = [
    { units: 3,  activation: "relu" },
    { units: 7,  activation: "relu" },
    { units: 10, activation: "relu" },
    { units: 3,  activation: "relu" },
  ]
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
  // @formatter:on
  /**
   * @typedef {Object} CustomPreprocessDataset_t
   * @property {string} column_name
   * @property {string} column_transform
   *
   * @typedef {Object} CustomDatasetInfo_t
   * @property {string} csv
   * @property {string} info
   * @property {string} path
   * @property {dfd.DataFrame} dataframe_original
   * @property {dfd.DataFrame} dataframe_processed
   * @property {boolean} isDatasetProcessed
   * @property {Array<CustomPreprocessDataset_t>} dataframe_transforms
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
  const [i_model, setIModel] = useState(new I_DATASETS_LINEAR_REGRESSION(t, setAccordionActive))
  const [isTraining, setIsTraining] = useState(false)
  const [dataPrediction, setDataPrediction] = useState({
    labels  : [],
    datasets: []
  })

  return (
    <LinearRegressionContext.Provider value={{
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
    }}>
      {children}
    </LinearRegressionContext.Provider>
  )
}

export default LinearRegressionContext