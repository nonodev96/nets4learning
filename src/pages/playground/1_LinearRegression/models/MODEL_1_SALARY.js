import React from 'react'
import { Trans } from 'react-i18next'
import * as tfjs from '@tensorflow/tfjs'
import * as dfd from 'danfojs'

import I_MODEL_LINEAR_REGRESSION from './_model'
import { DataFrameTransform } from '@core/dataframe/DataFrameUtils'

export default class MODEL_1_SALARY extends I_MODEL_LINEAR_REGRESSION {

  static KEY = 'SALARY'
  static URL = 'https://www.kaggle.com/code/snehapatil01/linear-regression-on-salary-dataset/notebook'

  URL = 'https://www.kaggle.com/code/snehapatil01/linear-regression-on-salary-dataset/notebook'
  i18n_TITLE = 'datasets-models.1-linear-regression.salary.title'
  _KEY = 'SALARY'

  DESCRIPTION () {
    const prefix = 'datasets-models.1-linear-regression.salary.description.'
    return <>
      <p><Trans i18nKey={prefix + 'text.0'} /></p>
      <p><Trans i18nKey={prefix + 'text.1'} /></p>
      <p>
        <Trans i18nKey={prefix + 'link'}
               components={{
                 link1: <a href={this.URL} target={'_blank'} rel="noreferrer" className={'text-info'}>link</a>,
               }} />
      </p>
      <details>
        <summary><Trans i18nKey={prefix + 'details-1-input.title'} /></summary>
        <ol>
          <li><Trans i18nKey={prefix + 'details-1-input.list.0'} /></li>
          <li><Trans i18nKey={prefix + 'details-1-input.list.1'} /></li>
        </ol>
      </details>
      <details>
        <summary><Trans i18nKey={prefix + 'details-2-output.title'} /></summary>
        <ol>
          <li><Trans i18nKey={prefix + 'details-2-output.list.0'} /></li>
        </ol>
      </details>
      <details>
        <summary><Trans i18nKey={prefix + 'details-3-references.title'} /></summary>
        <ol>
          <li>
            <a href="https://www.kaggle.com/code/snehapatil01/linear-regression-on-salary-dataset/notebook"
               target="_blank"
               rel="noreferrer">
              <Trans i18nKey={prefix + 'details-3-references.list.0'} />
            </a>
          </li>
        </ol>
      </details>
    </>
  }

  async DATASETS () {
    const dataset_path = process.env.REACT_APP_PATH + '/datasets/01-linear-regression/salary/'
    const dataset_info = 'salary.names'
    const dataset_csv = 'salary.csv'

    const dataset_promise_info = await fetch(dataset_path + dataset_info)
    const dataset_container_info = await dataset_promise_info.text()
    
    const dataframe_original_1 = await dfd.readCSV(dataset_path + dataset_csv)
    const dataframe_transforms = []
    const dataframe_processed_1 = DataFrameTransform(await dfd.readCSV(dataset_path + dataset_csv), dataframe_transforms)
    // dataframe_processed_1.print()
    
    const column_name_target = 'Salary'
    const dataframe_X = dataframe_processed_1.drop({ columns: [column_name_target] })
    const dataframe_y = dataframe_original_1[column_name_target]

    const scaler = new dfd.MinMaxScaler()
    scaler.fit(dataframe_X)
    const X = scaler.transform(dataframe_X)
    const y = dataframe_y

    return [{
      is_dataset_upload   : false,
      is_dataset_processed: true,
      path                : dataset_path,
      info                : dataset_info,
      csv                 : dataset_csv,
      container_info      : dataset_container_info,
      dataframe_original  : dataframe_original_1,
      dataframe_processed : dataframe_processed_1,
      dataframe_transforms: dataframe_transforms,
      data_processed      : {
        scaler            : scaler,
        X                 : X,
        y                 : y,
        missing_values    : false,
        column_name_target: column_name_target,
      }
    }]
  }

  async MODELS (_dataset) {
    const path = process.env.REACT_APP_PATH + '/models/01-linear-regression/salary'
    return [
      { model_path: path + '/0/lr-model-0.json', column_name_X: 'YearsExperience', column_name_Y: 'Salary' },
    ]
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
    model.add(tfjs.layers.dense({ units: 1,  activation: 'relu' }))
    return model
  }

  DEFAULT_LAYERS () {
    return [
      { is_disabled: false, units: 64, activation: 'relu'   },
      { is_disabled: false, units: 64, activation: 'relu'   },
      { is_disabled: true,  units: 1,  activation: 'linear' }
    ]
  }

  ATTRIBUTE_INFORMATION () {
    return <></>
  }

  JOYRIDE () {
    return super.JOYRIDE()
  }
}
