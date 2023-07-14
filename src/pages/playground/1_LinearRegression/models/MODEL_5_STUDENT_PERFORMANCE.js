import * as dfd from 'danfojs'
import I_MODEL_LINEAR_REGRESSION from './_model'

export default class MODEL_5_STUDENT_PERFORMANCE extends I_MODEL_LINEAR_REGRESSION {

  static KEY = 'STUDENT_PERFORMANCE'
  _KEY = 'STUDENT_PERFORMANCE'
  i18n_TITLE = 'datasets-models.1-linear-regression.student-performance.title'
  URL = 'https://archive.ics.uci.edu/dataset/320/student+performance'

  async DATASETS () {
    const datasets_path = process.env.REACT_APP_PATH + '/datasets/linear-regression/student-performance/'
    const dataframe_original_1 = await dfd.readCSV(datasets_path + 'student-mat.csv')
    const dataframe_processed_1 = await dfd.readCSV(datasets_path + 'student-mat.csv')
    const dataframe_original_2 = await dfd.readCSV(datasets_path + 'student-por.csv')
    const dataframe_processed_2 = await dfd.readCSV(datasets_path + 'student-por.csv')
    return {
      datasets: [{
        is_dataset_upload   : false,
        path                : datasets_path,
        info                : 'student.txt',
        csv                 : 'student-mat.csv',
        dataframe_original  : dataframe_original_1,
        dataframe_processed : dataframe_processed_1,
        dataset_transforms  : [],
        is_dataset_processed: true,
      }, {
        is_dataset_upload   : false,
        path                : datasets_path,
        info                : 'student.txt',
        csv                 : 'student-por.csv',
        dataframe_original  : dataframe_original_2,
        dataframe_processed : dataframe_processed_2,
        dataset_transforms  : [],
        is_dataset_processed: true,
      }]
    }
  }

  DESCRIPTION () {
    return <></>
  }

  ATTRIBUTE_INFORMATION () {
    return <>

    </>
  }

  JOYRIDE () {
    return super.JOYRIDE()
  }
}