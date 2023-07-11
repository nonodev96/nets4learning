import I_DATASETS_LINEAR_REGRESSION from './_model'
import * as dfd from 'danfojs'

import { CONFIG_DANFOJS_FRAME } from '@/CONSTANTS_DanfoJS'

import { DataFrameTransform } from '@core/dataframe/DataFrameUtils'

export default class DATASET_4_BREAST_CANCER extends I_DATASETS_LINEAR_REGRESSION {

  static KEY = 'BREAST_CANCER'
  URL = 'https://archive-beta.ics.uci.edu/dataset/16/breast+cancer+wisconsin+prognostic'
  i18n_TITLE = 'datasets-models.1-linear-regression.breast-cancer.title'
  _KEY = 'BREAST_CANCER'

  DESCRIPTION () {
    return <>

    </>
  }

  async DATASETS () {
    const dataset_path = process.env.REACT_APP_PATH + '/datasets/linear-regression/breast-cancer/'
    const path_dataset_1 = dataset_path + 'breast-cancer-wisconsin.csv'
    const path_dataset_2 = dataset_path + 'wdbc.csv'
    const path_dataset_3 = dataset_path + 'wpbc.csv'

    const dataframe_original_1 = await dfd.readCSV(path_dataset_1, CONFIG_DANFOJS_FRAME)
    dataframe_original_1.replace('?', NaN, { columns: ['Bare Nuclei'], inplace: true })
    dataframe_original_1.dropNa({ axis: 1, inplace: true })

    let dataframe_processed_1 = await dfd.readCSV(path_dataset_1)
    const dataset_transforms_1 = [
      { column_name: 'Bare Nuclei', column_transform: 'dropNa' },
      { column_name: 'Bare Nuclei', column_transform: 'replace_?_NaN' },
      { column_name: 'Bare Nuclei', column_transform: 'fill_NaN_median' }
    ]
    dataframe_processed_1 = DataFrameTransform(dataframe_processed_1, dataset_transforms_1)

    const dataframe_original_2 = await dfd.readCSV(path_dataset_2)
    const dataframe_processed_2 = await dfd.readCSV(path_dataset_2)

    const dataframe_original_3 = await dfd.readCSV(path_dataset_3)
    const dataframe_processed_3 = await dfd.readCSV(path_dataset_3)

    return {
      datasets: [{
        is_dataset_upload    : false,
        path               : dataset_path,
        info               : 'breast-cancer-wisconsin.names',
        csv                : 'breast-cancer-wisconsin.csv',
        dataframe_original : dataframe_original_1,
        dataframe_processed: dataframe_processed_1,
        dataset_transforms : dataset_transforms_1,
        isDatasetProcessed : true,
      }, {
        is_dataset_upload    : false,
        path               : dataset_path,
        info               : 'wdbc.names',
        csv                : 'wdbc.csv',
        dataframe_original : dataframe_original_2,
        dataframe_processed: dataframe_processed_2,
        dataset_transforms : [],
        isDatasetProcessed : true,
      }, {
        is_dataset_upload    : false,
        path               : dataset_path,
        info               : 'wpbc.names',
        csv                : 'wpbc.csv',
        dataframe_original : dataframe_original_3,
        dataframe_processed: dataframe_processed_3,
        dataset_transforms : [],
        isDatasetProcessed : true,
      }]
    }
  }

  ATTRIBUTE_INFORMATION () {
    return <></>
  }

  JOYRIDE () {
    return super.JOYRIDE()
  }
}