import React from 'react'
import { createContext, useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import * as tfjs from '@tensorflow/tfjs'
import * as _dfd from 'danfojs'

import { I_MODEL_LINEAR_REGRESSION } from '@/pages/playground/1_LinearRegression/models'
import * as _Types from '@core/types'

/**
 * @typedef CustomLinearRegressionContext_t
 *
 * @property {ReturnType<typeof useRef<_Types.CustomModel_t>>} modelRef
 *
 * @property {{data: _Types.DatasetProcessed_t[], index: number}} datasets
 * @property {React.Dispatch<React.SetStateAction<{data: _Types.DatasetProcessed_t[], index: number}>>} setDatasets
 *
 * @property {_Types.CustomParams_t} params
 * @property {React.Dispatch<React.SetStateAction<_Types.CustomParams_t>>} setParams
 *
 * @property {{data: _Types.CustomModelGenerated_t[], index: number}} listModels
 * @property {React.Dispatch<React.SetStateAction<{data: _Types.CustomModelGenerated_t[], index: number}>>} setListModels
 * 
 * @property {boolean} isTraining
 * @property {React.Dispatch<React.SetStateAction<boolean>>} setIsTraining
 *
 * @property {string[]} accordionActive
 * @property {React.Dispatch<React.SetStateAction<string[]>>} setAccordionActive
 *
 * @property {I_MODEL_LINEAR_REGRESSION} iModelInstance
 * @property {React.Dispatch<React.SetStateAction<I_MODEL_LINEAR_REGRESSION>>} setIModelInstance
 *
 */

/**@type {any} */
const C_ANY = {}

/**
 * @type {ReturnType<typeof createContext<CustomLinearRegressionContext_t>>}
 */
const LinearRegressionContext = createContext(C_ANY)

export function LinearRegressionProvider ({ children }) {

  const { t } = useTranslation()

  /** @type {_Types.DatasetProcessed_t[]} */
  const DEFAULT_DATASETS = []
  /** @type {_Types.CustomParams_t} */
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
  /** @type {_Types.CustomModel_t} */
  const DEFAULT_MODEL = {
    model: new tfjs.Sequential(),
  }
  
  /**
   * @type {ReturnType<typeof useState<{data: _Types.DatasetProcessed_t[], index: number}>>}
   */
  const [datasets, setDatasets] = useState({
    data : DEFAULT_DATASETS, 
    index: -1
  })
  /**
   * @type {ReturnType<typeof useRef<_Types.CustomModel_t>>}
   */
  const modelRef = useRef(DEFAULT_MODEL)
  /**
   * @type {ReturnType<typeof useState<_Types.CustomParams_t>>}
   */
  const [params, setParams] = useState(DEFAULT_PARAMS)
  /**
   * @type {ReturnType<typeof useState<{data: _Types.CustomModelGenerated_t[], index: number}>>}
   */
  const [listModels, setListModels] = useState({data: [], index: -1})

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
      modelRef,

      datasets,
      setDatasets,

      params,
      setParams,

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
