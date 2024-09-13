import React from 'react'
import { createContext, useState } from 'react'
import { Sequential } from '@tensorflow/tfjs'
import * as _dfd from 'danfojs'
import { useTranslation } from 'react-i18next'
import { I_MODEL_LINEAR_REGRESSION } from '../pages/playground/1_LinearRegression/models'

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
 * @property {_dfd.DataFrame} dataframe_original
 * @property {_dfd.DataFrame} dataframe_processed
 * @property {Array<CustomPreprocessDataset_t>} dataframe_transforms
 */

/**
 * @typedef CustomParamsLayerModel_t
 * @property {number} units
 * @property {string} activation
 * @property {boolean} is_disabled
 */

/**
 * @typedef CustomParamsFeaturesSelector_t
 * @property {Set<string>} X_features
 * @property {string} X_feature
 * @property {string} Y_target
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
 * @property {Sequential} model
 * @property {Point_t[]} original
 * @property {Point_t[]} predicted
 * @property {Point_t[]} predictedLinear
 */

/**
 * @typedef CustomDatasets_t
 * @property {Array<CustomDataset_t>} datasets
 */

/**
 * @typedef CustomParams_t
 * @property {Array<CustomParamsLayerModel_t>} params_layers
 * @property {CustomParamsFeaturesSelector_t} params_features
 * @property {CustomParamsTrainModel_t} params_training
 * @property {Array<string>} params_visor
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
 * @property {_dfd.DataFrame} dataframe_original
 * @property {_dfd.DataFrame} dataframe_processed
 * @property {string} container_info
 */

/**
 * @typedef {CustomModel_t & CustomParams_t & {dataframe: _dfd.DataFrame}} CustomModelGenerated_t
 */

/**
 * @typedef  CustomLinearRegressionContext_t
 *
 * @property {{data: CustomDataset_t[], index: number}} datasets
 * @property {React.Dispatch<React.SetStateAction<{data: CustomDataset_t[], index: number}>>} setDatasets
 *
 * @property {number} indexDatasetSelected
 * @property {React.Dispatch<React.SetStateAction<number>>} setIndexDatasetSelected
 *
 * @property {CustomParams_t} params
 * @property {React.Dispatch<React.SetStateAction<CustomParams_t>>} setParams
 *
 * @property {CustomModel_t} tmpModel
 * @property {React.Dispatch<React.SetStateAction<CustomModel_t>>} setTmpModel
 *
 * @property {Array<CustomModelGenerated_t>} listModels
 * @property {React.Dispatch<React.SetStateAction<Array<CustomModelGenerated_t>>>} setListModels
 *
 * @property {boolean} isTraining
 * @property {React.Dispatch<React.SetStateAction<boolean>>} setIsTraining
 *
 * @property {Array<string>} accordionActive
 * @property {React.Dispatch<React.SetStateAction<Array<string>>>} setAccordionActive
 *
 * @property {I_MODEL_LINEAR_REGRESSION} iModelInstance
 * @property {React.Dispatch<React.SetStateAction<I_MODEL_LINEAR_REGRESSION>>} setIModelInstance
 *
 * @//property {CustomDatasetLocal_t} datasetLocal
 * @//property {React.Dispatch<React.SetStateAction<CustomDatasetLocal_t>>} setDatasetLocal
 *
 */

/**
 * @type {ReturnType<typeof createContext<CustomLinearRegressionContext_t>>}
 */
const LinearRegressionContext = createContext({})

export function LinearRegressionProvider ({ children }) {

  const { t } = useTranslation()

  // @formatter:off
  // /**
  //  * @type {CustomDatasetLocal_t}
  //  */
  // const DEFAULT_DATASET_LOCAL = {
  //   is_dataset_upload   : false,
  //   is_dataset_processed: false,
  //   dataframe_original  : new DataFrame(),
  //   dataframe_processed : new DataFrame(),
  //   container_info      : '',
  // }

  // @formatter:off
  /** @type {CustomDataset_t[]} */
  const DEFAULT_DATASETS = []
  /** @type {CustomParams_t} */
  const DEFAULT_PARAMS = {
    params_training: {
      learning_rate  : 1,  // 1%  [0-100]
      n_of_epochs    : 20,
      test_size      : 10, // 10% [0-100]
      id_optimizer   : 'train-adam',
      id_loss        : 'losses-meanSquaredError',
      list_id_metrics: ['metrics-meanSquaredError', 'metrics-meanAbsoluteError']
    },
    params_layers: [
      { is_disabled: false, units: 10, activation: 'relu' },
      { is_disabled: false, units: 20, activation: 'relu' },
      { is_disabled: false, units: 20, activation: 'relu' },
      { is_disabled: false, units: 20, activation: 'relu' },
      { is_disabled: false, units: 20, activation: 'sigmoid' },
      { is_disabled: true,  units: 1,  activation: 'linear' },
    ],
    params_visor   : [],
    params_features: {
      X_features: new Set(),
      X_feature : '',
      Y_target  : '',
    }
  }
  /** @type {CustomModel_t} */
  const DEFAULT_MODEL = {
    model          : new Sequential(),
    original       : [],
    predicted      : [],
    predictedLinear: []
  }
  // @formatter:on
  
  /**
   * @type {ReturnType<typeof useState<Array<CustomDataset_t>>>}
   */
  const [datasets, setDatasets] = useState({
    data : DEFAULT_DATASETS, 
    index: -1
  })
  // /**
  //  * @type {ReturnType<typeof useState<number>>}
  //  */
  // const [indexDatasetSelected, setIndexDatasetSelected] = useState(-1)
  // /**
  //  * @type {ReturnType<typeof useState<CustomDatasetLocal_t>>}
  //  */
  // const [datasetLocal, setDatasetLocal] = useState(DEFAULT_DATASET_LOCAL)
  /**
   * @type {ReturnType<typeof useState<CustomParams_t>>}
   */
  const [params, setParams] = useState(DEFAULT_PARAMS)
  /**
   * @type {ReturnType<typeof useState<CustomModel_t>>}
   */
  const [tmpModel, setTmpModel] = useState(DEFAULT_MODEL)
  /**
   * @type {ReturnType<typeof useState<Array<CustomModelGenerated_t>>>}
   */
  const [listModels, setListModels] = useState([])
  /**
   * @type {ReturnType<typeof useState<boolean>>}
   */
  const [isTraining, setIsTraining] = useState(false)
  /**
   * @type {ReturnType<typeof useState<Array<string>>>}
   */
  const [accordionActive, setAccordionActive] = useState(['dataset_info'])
  /**
   * @type {ReturnType<typeof useState<I_MODEL_LINEAR_REGRESSION>>}
   */
  const [iModelInstance, setIModelInstance] = useState(new I_MODEL_LINEAR_REGRESSION(t, setAccordionActive))

  return (
    <LinearRegressionContext.Provider value={{
      datasets,
      setDatasets,

      // indexDatasetSelected, 
      // setIndexDatasetSelected,

      // datasetLocal,
      // setDatasetLocal,

      params,
      setParams,

      tmpModel,
      setTmpModel,

      listModels,
      setListModels,

      isTraining,
      setIsTraining,

      accordionActive,
      setAccordionActive,

      iModelInstance,
      setIModelInstance,
    }}>
      {children}
    </LinearRegressionContext.Provider>
  )
}

export default LinearRegressionContext
