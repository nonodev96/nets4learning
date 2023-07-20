import { createContext, useState } from 'react'
import * as tfjs from '@tensorflow/tfjs'
import { DataFrame } from 'danfojs'
import { useTranslation } from 'react-i18next'
import { I_MODEL_LINEAR_REGRESSION } from '../pages/playground/1_LinearRegression/models'
import { Sequential } from '@tensorflow/tfjs'

/**
 * @typedef  CustomLinearRegressionContext_t
 *
 * @property {CustomModel_t} tmpModel
 * @property {React.Dispatch<React.SetStateAction<CustomModel_t>>} setTmpModel
 */
const LinearRegressionDataContext = createContext(
  /**@type {CustomLinearRegressionContext_t}*/
  {}
)

export function LinearRegressionDataProvider ({ children }) {

  // @formatter:off
  const DEFAULT_LAYERS = [
    { units: 10,  activation: "relu" },
    { units: 20, activation: "relu" },
    { units: 20, activation: "relu" },
    { units: 20, activation: "relu" },
    { units: 20, activation: "sigmoid" },
  ]

  /**
   * @type CustomModel_t
   */
  const DEFAULT_CUSTOM_MODEL = {
    datasets            : [],
    list_layers         : DEFAULT_LAYERS,
    model               : new Sequential(),
    original            : [],
    predicted           : [],
    params_visor        : [],
    params_training     : {
      learning_rate  : 1,  // 1%  [0-100]
      n_of_epochs    : 20,
      test_size      : 10, // 10% [0-100]
      id_optimizer   : 'train-adam',
      id_loss        : 'losses-meanSquaredError',
      list_id_metrics: ['metrics-meanSquaredError', 'metrics-meanAbsoluteError']
    },
    feature_selector    : {
      X_features: new Set(),
      X_feature : '',
      y_target  : '',
    }
  }
  // @formatter:on

  const [tmpModel, setTmpModel] = useState(/** @type CustomModel_t */ DEFAULT_CUSTOM_MODEL)

  return (
    <LinearRegressionDataContext.Provider value={{
      tmpModel,
      setTmpModel,
    }}>
      {children}
    </LinearRegressionDataContext.Provider>
  )
}

export default LinearRegressionDataContext