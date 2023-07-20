import { createContext, useState } from 'react'
import * as tfjs from '@tensorflow/tfjs'
import { DataFrame } from 'danfojs'
import { useTranslation } from 'react-i18next'
import { I_MODEL_LINEAR_REGRESSION } from '../pages/playground/1_LinearRegression/models'
import { Sequential } from '@tensorflow/tfjs'

/**
 * @typedef CustomPreprocessDataset_t
 * @property {string} column_name
 * @property {string} column_transform
 */

/**
 * @typedef CustomDataset_t
 * @property {boolean} is_dataset_upload
 * @property {boolean} is_dataset_processed
 * @property {string} csv
 * @property {string} info
 * @property {string} path
 * @property {DataFrame} dataframe_original
 * @property {DataFrame} dataframe_processed
 * @property {Array<CustomPreprocessDataset_t>} dataframe_transforms
 */

/**
 * @typedef CustomParamsLayerModel_t
 * @property {number} units
 * @property {string} activation
 */

/**
 * @typedef CustomFeatureSelector_t
 * @property {Set<string>} X_features
 * @property {string} X_feature
 * @property {string} y_target
 */

/**
 * @typedef CustomParamsTrainModel_t
 * @property {number} learning_rate
 * @property {number} n_of_epochs
 * @property {number} test_size
 * @property {string} id_optimizer
 * @property {string} id_loss
 * @property {Array<string>} list_id_metrics
 */

/**
 * @typedef {{x: *, y: *}} Point_t
 */

/**
 * @typedef CustomModel_t
 * @property {Array<CustomDataset_t>} datasets
 * @property {Array<CustomParamsLayerModel_t>} list_layers
 * @property {Sequential} model
 * @property {Point_t[]} original
 * @property {Point_t[]} predicted
 * @property {Array<string>} params_visor
 * @property {CustomParamsTrainModel_t} params_training
 * @property {CustomFeatureSelector_t} feature_selector
 */

/**
 * @typedef CustomPredict_t
 * @property {string} dataOriginal_label
 * @property {Point_t[]} dataOriginal_x
 * @property {Point_t[]} dataOriginal_y
 * @property {string} dataPredicted_label
 * @property {Point_t[]} dataPredicted_x
 * @property {Point_t[]} dataPredicted_y
 */

/**
 * @typedef CustomDatasetLocal_t
 * @property {boolean} is_dataset_upload
 * @property {boolean} is_dataset_processed
 * @property {DataFrame} dataframe_original
 * @property {DataFrame} dataframe_processed
 * @property {string} container_info
 */

/**
 * @typedef  CustomLinearRegressionContext_t
 *
 * @property {Array<CustomModel_t>} listModels
 * @property {React.Dispatch<React.SetStateAction<Array<CustomModel_t>>>} setListModels
 *
 * @property {boolean} isTraining
 * @property {React.Dispatch<React.SetStateAction<boolean>>} setIsTraining
 *
 * @property {Array<string>} accordionActive
 * @property {React.Dispatch<React.SetStateAction<Array<string>>>} setAccordionActive
 *
 * @property {Array<string>} accordionActive
 * @property {React.Dispatch<React.SetStateAction<Array<string>>>} setAccordionActive
 *
 * @property {I_MODEL_LINEAR_REGRESSION} i_model
 * @property {React.Dispatch<React.SetStateAction<I_MODEL_LINEAR_REGRESSION>>} setIModel
 *
 * @property {Object} dataPrediction
 * @property {React.Dispatch<React.SetStateAction<Object>>} setDataPrediction
 *
 * @property {CustomDatasetLocal_t} datasetLocal
 * @property {React.Dispatch<React.SetStateAction<CustomDatasetLocal_t>>} setDatasetLocal
 *
 */
const LinearRegressionContext = createContext(
  /**@type {CustomLinearRegressionContext_t}*/
  {}
)

export function LinearRegressionProvider ({ children }) {

  const { t } = useTranslation()

  // @formatter:off
  /**
   * @type CustomDatasetLocal_t
   */
  const DEFAULT_DATASET_LOCAL = {
    is_dataset_upload   : false,
    is_dataset_processed: true,
    dataframe_original  : new DataFrame(),
    dataframe_processed : new DataFrame(),
    container_info      : '',
  }

  // @formatter:on

  const [accordionActive, setAccordionActive] = useState([])
  const [i_model, setIModel] = useState(new I_MODEL_LINEAR_REGRESSION(t, setAccordionActive))
  const [listModels, setListModels] = useState(/** @type Array<CustomModel_t> */[])
  const [isTraining, setIsTraining] = useState(false)
  const [datasetLocal, setDatasetLocal] = useState(/** @type CustomDatasetLocal_t */ DEFAULT_DATASET_LOCAL)

  return (
    <LinearRegressionContext.Provider value={{
      listModels,
      setListModels,

      isTraining,
      setIsTraining,

      accordionActive,
      setAccordionActive,

      i_model,
      setIModel,

      datasetLocal,
      setDatasetLocal,
    }}>
      {children}
    </LinearRegressionContext.Provider>
  )
}

export default LinearRegressionContext