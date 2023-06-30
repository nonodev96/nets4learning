import { createContext, useState } from "react"
import * as dfd from "danfojs"
import * as tfjs from "@tensorflow/tfjs"
import { useTranslation } from "react-i18next"
import { I_DATASETS_LINEAR_REGRESSION } from "../pages/playground/1_LinearRegression/datasets"

/**
 * @typedef {Object} CustomPreprocessDataset_t
 * @property {string} column_name
 * @property {string} column_transform
 */

/**
 * @typedef {Object} CustomDataset_t
 * @property {string} csv
 * @property {string} info
 * @property {string} path
 * @property {dfd.DataFrame} dataframe_original
 * @property {dfd.DataFrame} dataframe_processed
 * @property {boolean} isDatasetProcessed
 * @property {Array<CustomPreprocessDataset_t>} dataframe_transforms
 */

/**
 * @typedef {Object} CustomParamsLayerModel_t
 * @property {number} units
 * @property {string} activation
 */

/**
 * @typedef {Object} CustomParamsTrainModel_t
 * @property {number} learning_rate
 * @property {number} n_of_epochs
 * @property {number} test_size
 * @property {string} id_optimizer
 * @property {string} id_loss
 * @property {Array<string>} list_id_metrics
 */

/**
 * @typedef {Object} CustomModel_t
 * @property {Array<CustomDataset_t>} datasets
 * @property {Array<CustomParamsLayerModel_t>} list_layers
 * @property {CustomParamsTrainModel_t} params_training
 * @property {tfjs.sequential} model
 */

/**
 * @typedef {Object} CustomDatasetLocal_t
 * @property {dfd.DataFrame} dataframe_original
 * @property {dfd.DataFrame} dataframe_processed
 * @property {string} container_info
 * @property {Array<string>} attributes
 */

/**
 * @typedef {Object} CustomLinearRegressionContext_t
 *
 * @property {CustomModel_t} tmpModel
 * @property {Function} setTmpModel
 *
 * @property {Array<CustomModel_t>} listModels
 * @property {Function} setListModels
 *
 * @property {boolean} isTraining
 * @property {Function} setIsTraining
 *
 * @property {Array<string>} accordionActive
 * @property {Function} setAccordionActive
 *
 * @property {Array<string>} accordionActive
 * @property {Function} setAccordionActive
 *
 * @property {I_DATASETS_LINEAR_REGRESSION} i_model
 * @property {Function} setIModel
 *
 * @property {Object} dataPrediction
 * @property {Function} setDataPrediction
 *
 * @property {CustomDatasetLocal_t} datasetLocal
 * @property {Function} setDatasetLocal
 *
 */
const LinearRegressionContext = createContext(
  /**@type {CustomLinearRegressionContext_t}*/
  {}
)

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

  const [tmpModel, setTmpModel] = useState(/** @type CustomModel_t */DEFAULT_CUSTOM_MODEL)
  const [listModels, setListModels] = useState(/** @type Array<CustomModel_t> */[])
  const [i_model, setIModel] = useState(new I_DATASETS_LINEAR_REGRESSION(t, setAccordionActive))
  const [isTraining, setIsTraining] = useState(false)
  const [dataPrediction, setDataPrediction] = useState({
    labels  : [],
    datasets: []
  })

  const [datasetLocal, setDatasetLocal] = useState(/** @type CustomDatasetLocal_t */{
    dataframe_original : new dfd.DataFrame(),
    dataframe_processed: new dfd.DataFrame(),
    container_info     : "",
    attributes         : []
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
      setDataPrediction,
      datasetLocal,
      setDatasetLocal
    }}>
      {children}
    </LinearRegressionContext.Provider>
  )
}

export default LinearRegressionContext