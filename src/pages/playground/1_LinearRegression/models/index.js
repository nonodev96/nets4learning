import I_MODEL_LINEAR_REGRESSION from './_model'
import MODEL_1_SALARY from './MODEL_1_SALARY'
import MODEL_2_AUTO_MPG from './MODEL_2_AUTO_MPG'
import MODEL_3_HOUSING_PRICES from './MODEL_3_HOUSING_PRICES'
import MODEL_4_BREAST_CANCER from './MODEL_4_BREAST_CANCER'
import MODEL_5_STUDENT_PERFORMANCE from './MODEL_5_STUDENT_PERFORMANCE'
import MODEL_6_WINE from './MODEL_6_WINE'
import * as _Types from '@/core/types'

/**
 * @type {_Types.MAP_LR_CLASSES_t}
 */
const MAP_LR_CLASSES = {
  [MODEL_1_SALARY.KEY]             : MODEL_1_SALARY,
  [MODEL_2_AUTO_MPG.KEY]           : MODEL_2_AUTO_MPG,
  [MODEL_3_HOUSING_PRICES.KEY]     : MODEL_3_HOUSING_PRICES,
  [MODEL_4_BREAST_CANCER.KEY]      : MODEL_4_BREAST_CANCER,
  [MODEL_5_STUDENT_PERFORMANCE.KEY]: MODEL_5_STUDENT_PERFORMANCE,
  [MODEL_6_WINE.KEY]               : MODEL_6_WINE,
}

export {
  MAP_LR_CLASSES,

  I_MODEL_LINEAR_REGRESSION,
  MODEL_1_SALARY,
  MODEL_2_AUTO_MPG,
  MODEL_3_HOUSING_PRICES,
  MODEL_4_BREAST_CANCER,
  MODEL_5_STUDENT_PERFORMANCE,
  MODEL_6_WINE,
}