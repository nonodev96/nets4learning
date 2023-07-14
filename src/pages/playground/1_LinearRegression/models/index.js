import I_MODEL_LINEAR_REGRESSION from './_model'
import MODEL_1_SALARY from './MODEL_1_SALARY'
import MODEL_2_AUTO_MPG from './MODEL_2_AUTO_MPG'
import MODEL_3_BOSTON_HOUSING from './MODEL_3_BOSTON_HOUSING'
import MODEL_4_BREAST_CANCER from './MODEL_4_BREAST_CANCER'
import MODEL_5_STUDENT_PERFORMANCE from './MODEL_5_STUDENT_PERFORMANCE'
import MODEL_6_WINE from './MODEL_6_WINE'

const MAP_LR_MODEL = {
  [MODEL_1_SALARY.KEY]             : MODEL_1_SALARY,
  [MODEL_2_AUTO_MPG.KEY]           : MODEL_2_AUTO_MPG,
  [MODEL_3_BOSTON_HOUSING.KEY]     : MODEL_3_BOSTON_HOUSING,
  [MODEL_4_BREAST_CANCER.KEY]      : MODEL_4_BREAST_CANCER,
  [MODEL_5_STUDENT_PERFORMANCE.KEY]: MODEL_5_STUDENT_PERFORMANCE,
  [MODEL_6_WINE.KEY]               : MODEL_6_WINE,
}

export {
  MAP_LR_MODEL,

  I_MODEL_LINEAR_REGRESSION,
  MODEL_1_SALARY,
  MODEL_2_AUTO_MPG,
  MODEL_3_BOSTON_HOUSING,
  MODEL_4_BREAST_CANCER,
  MODEL_5_STUDENT_PERFORMANCE,
  MODEL_6_WINE,
}