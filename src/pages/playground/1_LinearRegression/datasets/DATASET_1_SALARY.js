import { Trans } from 'react-i18next'
import * as tfjs from '@tensorflow/tfjs'
import * as dfd from 'danfojs'

import I_DATASETS_LINEAR_REGRESSION from './_model'
import { DataFrameTransform } from '@core/dataframe/DataFrameUtils'

export default class DATASET_1_SALARY extends I_DATASETS_LINEAR_REGRESSION {

  static KEY = 'SALARY'
  static URL = 'https://www.kaggle.com/code/snehapatil01/linear-regression-on-salary-dataset/notebook'
  i18n_TITLE = 'datasets-models.1-linear-regression.salary.title'
  _KEY = 'SALARY'

  DESCRIPTION () {
    const prefix = 'datasets-models.1-linear-regression.salary.description.'
    return <>
      <p><Trans i18nKey={prefix + 'text-1'} /></p>
      <p><Trans i18nKey={prefix + 'text-2'} /></p>
      <p>
        <Trans i18nKey={prefix + 'text-link'}
               components={{
                 link1: <a href={this.URL} target={'_blank'} rel="noreferrer">link</a>,
               }} />
      </p>
      <details>
        <summary><Trans i18nKey={prefix + 'details-1.title'} /></summary>
        <ol>
          <li><Trans i18nKey={prefix + 'details-1.list.1'} /></li>
          <li><Trans i18nKey={prefix + 'details-1.list.2'} /></li>
          <li><Trans i18nKey={prefix + 'details-1.list.3'} /></li>
        </ol>
      </details>
      <details>
        <summary><Trans i18nKey={prefix + 'details-2.title'} /></summary>
        <ol>
          <li><Trans i18nKey={prefix + 'details-2.list.1'} /></li>
          <li><Trans i18nKey={prefix + 'details-2.list.2'} /></li>
          <li><Trans i18nKey={prefix + 'details-2.list.3'} /></li>
        </ol>
      </details>
      <details>
        <summary><Trans i18nKey={prefix + 'details-3.title'} /></summary>
        <ol>
          <li><Trans i18nKey={prefix + 'details-3.list.1'} /></li>
        </ol>
      </details>
    </>
  }

  async DATASETS () {
    const dataset_path = process.env.REACT_APP_PATH + '/datasets/linear-regression/salary/'
    const dataframe_original_1 = await dfd.readCSV(dataset_path + 'salary.csv')
    const dataframe_transforms = []
    const dataframe_processed_1 = DataFrameTransform(await dfd.readCSV(dataset_path + 'salary.csv'), dataframe_transforms)

    // dataframe_processed_1.print()

    return {
      datasets: [{
        is_dataset_upload     : false,
        path                : dataset_path,
        info                : 'salary.names',
        csv                 : 'salary.csv',
        dataframe_original  : dataframe_original_1,
        dataframe_processed : dataframe_processed_1,
        dataframe_transforms: dataframe_transforms,
        isDatasetProcessed  : true,
      }]
    }
  }

  COMPILE () {
    const model = tfjs.sequential()
    model.compile({
      optimizer: tfjs.train.rmsprop(0.01),
      loss     : 'mean_squared_error',
      metrics  : ['mean_squared_error', 'mean_absolute_error']
    })
    return model
  }

  LAYERS () {
    const inputShape = 7
    const model = tfjs.sequential()
    model.add(tfjs.layers.dense({ units: 64, activation: 'relu', inputShape: [inputShape] }))
    model.add(tfjs.layers.dense({ units: 64, activation: 'relu' }))
    model.add(tfjs.layers.dense({ units: 1, activation: 'relu' }))
    return model
  }

  ATTRIBUTE_INFORMATION () {
    return <></>
  }

  JOYRIDE () {
    return super.JOYRIDE()
  }
}