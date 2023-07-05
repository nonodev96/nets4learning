import * as dfd from 'danfojs'
import I_DATASETS_LINEAR_REGRESSION from './_model'

export default class DATASET_WINE extends I_DATASETS_LINEAR_REGRESSION {

  static KEY = 'WINE'
  _KEY = 'WINE'
  i18n_TITLE = 'datasets-models.1-linear-regression.wine.title'
  URL = 'https://archive.ics.uci.edu/dataset/186/wine+quality'

  DESCRIPTION () {
    return <>

    </>
  }

  async DATASETS () {
    const datasets_path = process.env.REACT_APP_PATH + '/datasets/linear-regression/wine-quality/'
    const path_dataset_1 = datasets_path + 'wine-quality-red.csv'
    const path_dataset_2 = datasets_path + 'wine-quality-white.csv'
    const dataframe_original = await dfd.readCSV(path_dataset_1)
    const dataframe_processed = await dfd.readCSV(path_dataset_1)
    const dataframe_original_2 = await dfd.readCSV(path_dataset_2)
    const dataframe_processed_2 = await dfd.readCSV(path_dataset_2)
    return {
      datasets     : [{
        path               : datasets_path,
        info               : 'wine-quality.names',
        csv                : 'wine-quality-red.csv',
        dataframe_original : dataframe_original,
        dataframe_processed: dataframe_processed,
        dataset_transforms : [],
        isDatasetProcessed : true,
      }, {
        path               : datasets_path,
        csv                : 'wine-quality-white.csv',
        info               : 'wine-quality.names',
        dataframe_original : dataframe_original_2,
        dataframe_processed: dataframe_processed_2,
        dataset_transforms : [],
        isDatasetProcessed : true,
      }],
      datasets_path: ''
    }
  }

  ATTRIBUTE_INFORMATION () {
    return <>

    </>
  }

  JOYRIDE () {
    return super.JOYRIDE()
  }
}