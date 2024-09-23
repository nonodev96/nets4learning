import React from 'react'
import { Trans } from 'react-i18next'
import * as tfjs from '@tensorflow/tfjs'
import * as dfd from 'danfojs'

import * as _Types from '@core/types'
import * as DataFrameUtils from '@core/dataframe/DataFrameUtils'
import I_MODEL_LINEAR_REGRESSION from './_model'
import { F_FILTER_Categorical, F_MAP_LabelEncoder } from '@/core/nn-utils/utils'

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

  /**
   * 
   * @returns {Promise<_Types.DatasetProcessed_t[]>}
   */
  async DATASETS () {
    const path_datasets = process.env.REACT_APP_PATH + '/datasets/01-linear-regression/salary/'
    const salary_info = 'salary.names'
    const salary_csv = 'salary.csv'

    const dataset_promise_info = await fetch(path_datasets + salary_info)
    const salary_container_info = await dataset_promise_info.text()
    /** @type {_Types.Dataset_t} */
    const salary_dataset = [
      { column_name: 'YearsExperience',  column_role: 'Feature', column_type: 'Continuous', column_missing_values: false },
      { column_name: 'Salary',           column_role: 'Target',  column_type: 'Continuous', column_missing_values: false },
    ]
    const salary_dataset_transforms = [
      ...salary_dataset.filter(F_FILTER_Categorical).map(F_MAP_LabelEncoder),
      // { column_name: 'Salary', column_type: 'drop' }
    ]
    let salary_dataframe_original = await dfd.readCSV(path_datasets + salary_csv)
    let salary_dataframe_processed = await dfd.readCSV(path_datasets + salary_csv)
    const salary_dataframe_encoder = DataFrameUtils.DataFrameTransformAndEncoder(salary_dataframe_processed, salary_dataset_transforms)
    const salary_encoders_map = salary_dataframe_encoder.encoder_map
    salary_dataframe_processed = salary_dataframe_encoder.dataframe_processed
    const salary_target = 'Salary'
    const salary_dataframe_X = salary_dataframe_processed.drop({ columns: [salary_target] }).copy()
    const salary_dataframe_y = salary_dataframe_original[salary_target]
    const minMaxScaler = new dfd.MinMaxScaler()
    const salary_scaler = minMaxScaler.fit(salary_dataframe_X)
    const salary_X = salary_scaler.transform(salary_dataframe_X)
    const salary_y = salary_dataframe_y

    return [
      {
        is_dataset_upload   : false,
        is_dataset_processed: true,
        path                : path_datasets,
        info                : salary_info,
        csv                 : salary_csv,
        container_info      : salary_container_info,
        dataframe_original  : salary_dataframe_original,
        dataframe_processed : salary_dataframe_processed,
        dataset_transforms  : salary_dataset_transforms,
        data_processed      : {
          dataframe_X       : salary_dataframe_X,
          dataframe_y       : salary_dataframe_y,
          X                 : salary_X,
          y                 : salary_y,
          scaler            : salary_scaler,
          encoders          : salary_encoders_map,
          column_name_target: salary_target,
        }
      }
    ]
  }

  /**
   * 
   * @param {string} dataset 
   * @returns 
   */
  async MODELS (dataset) {
    const path = process.env.REACT_APP_PATH + '/models/01-linear-regression/salary'
    const models = {
      'salary.csv': [
        { 
          model_path: path + '/0/lr-model-0.json', 
          X         : ['YearsExperience'], 
          y         : 'Salary'
        },
      ]
    }
    return models[dataset]
  }

  COMPILE () {
    const model = new tfjs.Sequential()
    model.compile({
      optimizer: tfjs.train.rmsprop(0.01),
      loss     : 'meanSquaredError',
      metrics  : ['meanSquaredError', 'meanAbsoluteError']
    })
    return model
  }

  DEFAULT_LAYERS (_dataset) {
    return [
      { is_disabled: false, units: 10, activation: 'sigmoid' },
      { is_disabled: false, units: 20, activation: 'relu'    },
      { is_disabled: true,  units: 1,  activation: 'linear'  }
    ]
  }

  ATTRIBUTE_INFORMATION () {
    return <></>
  }
}
