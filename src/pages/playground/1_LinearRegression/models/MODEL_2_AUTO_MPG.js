import React from 'react'
import * as tfjs from '@tensorflow/tfjs'
import * as dfd from 'danfojs'
import { Trans } from 'react-i18next'

import I_MODEL_LINEAR_REGRESSION from './_model'
import * as _Type from '@core/types'
import * as DataFrameUtils from '@core/dataframe/DataFrameUtils'

export default class MODEL_2_AUTO_MPG extends I_MODEL_LINEAR_REGRESSION {

  static KEY = 'AUTO_MPG'
  static URL = 'https://archive.ics.uci.edu/ml/datasets/auto+mpg'

  URL = 'https://archive.ics.uci.edu/ml/datasets/auto+mpg'
  i18n_TITLE = 'datasets-models.1-linear-regression.auto-mpg.title'
  _KEY = 'AUTO_MPG'

  DESCRIPTION () {
    const prefix = 'datasets-models.1-linear-regression.auto-mpg.description.'
    return <>
      <p><Trans i18nKey={prefix + 'text.0'} /></p>
      <p><Trans i18nKey={prefix + 'text.1'} /></p>
      <p>
        <Trans i18nKey={prefix + 'link'}
               components={{
                 link1: <a href={this.URL} target={'_blank'} rel="noreferrer">link</a>,
               }} />
      </p>
      <details>
        <summary><Trans i18nKey={prefix + 'details-0.title'} /></summary>
        <ol>
          <li><Trans i18nKey={prefix + 'details-0.list.0'} /></li>
          <li><Trans i18nKey={prefix + 'details-0.list.1'} /></li>
          <li><Trans i18nKey={prefix + 'details-0.list.2'} /></li>
          <li><Trans i18nKey={prefix + 'details-0.list.3'} /></li>
          <li><Trans i18nKey={prefix + 'details-0.list.4'} /></li>
          <li><Trans i18nKey={prefix + 'details-0.list.5'} /></li>
          <li><Trans i18nKey={prefix + 'details-0.list.6'} /></li>
          <li><Trans i18nKey={prefix + 'details-0.list.7'} /></li>
          <li><Trans i18nKey={prefix + 'details-0.list.8'} /></li>
        </ol>
      </details>
      <details>
        <summary><Trans i18nKey={prefix + 'details-1.title'} /></summary>
        <ol>
          <li><Trans i18nKey={prefix + 'details-1.list.0'} /></li>
          <li><Trans i18nKey={prefix + 'details-1.list.1'} /></li>
          <li><Trans i18nKey={prefix + 'details-1.list.2'} /></li>
          <li><Trans i18nKey={prefix + 'details-1.list.3'} /></li>
          <li><Trans i18nKey={prefix + 'details-1.list.4'} /></li>
          <li><Trans i18nKey={prefix + 'details-1.list.5'} /></li>
          <li><Trans i18nKey={prefix + 'details-1.list.6'} /></li>
          <li><Trans i18nKey={prefix + 'details-1.list.7'} /></li>
          <li><Trans i18nKey={prefix + 'details-1.list.8'} /></li>
        </ol>
      </details>
      <details>
        <summary><Trans i18nKey={prefix + 'details-2.title'} /></summary>
        <ol>
          <li><Trans i18nKey={prefix + 'details-2.list.0'} /></li>
        </ol>
      </details>
      <details>
        <summary><Trans i18nKey={prefix + 'details-3.title'} /></summary>
        <ol>
          <li><Trans i18nKey={prefix + 'details-3.list.0'}
                     components={{
                       link1: <a href={this.URL} target={'_blank'} rel="noreferrer">link</a>,
                     }} /></li>
        </ol>
      </details>
      <details>
        <summary>BibTeX</summary>
        <pre>
{`
@misc{misc_auto_mpg_9,
  author       = {Quinlan,R.},
  title        = {{Auto MPG}},
  year         = {1993},
  howpublished = {UCI Machine Learning Repository},
  note         = {{DOI}: https://doi.org/10.24432/C5859H}
}
`}
        </pre>
      </details>
    </>
  }

  /**
   * 
   * @returns {Promise<_Type.DatasetProcessed_t[]>}
   */
  async DATASETS () {
    const dataset_path = process.env.REACT_APP_PATH + '/datasets/01-linear-regression/auto-mpg/'
    const dataset_csv = 'auto-mpg.csv'
    const dataset_info = 'auto-mpg.names'

    const dataset_promise_info = await fetch(dataset_path + dataset_info)
    const dataset_container_info = await dataset_promise_info.text()
    
    let dataframe_original_1 = await dfd.readCSV(dataset_path + dataset_csv)
    let dataframe_processed_1 = await dfd.readCSV(dataset_path + dataset_csv)
    
    
    const dataset_transforms = [
      {  column_transform: 'label-encoder', column_name: 'cylinders' },
      {  column_transform: 'label-encoder', column_name: 'model-year' },
      // {  column_transform: 'label-encoder', column_name: 'origin' },
    ]
    const column_name_target = 'mpg'

    const encoders_map = DataFrameUtils.DataFrameEncoder(dataframe_original_1, dataset_transforms)
    dataframe_processed_1 = DataFrameUtils.DataFrameTransform(dataframe_processed_1, dataset_transforms)

    console.log({encoders_map})
    
    const dataframe_X = dataframe_processed_1.drop({ columns: [column_name_target] })
    const dataframe_y = dataframe_original_1[column_name_target]

    const scaler = new dfd.MinMaxScaler()
    scaler.fit(dataframe_X)
    const X = scaler.transform(dataframe_X)
    const y = dataframe_y

    return [
      {
        is_dataset_upload   : false,
        is_dataset_processed: true,
        path                : dataset_path,
        csv                 : dataset_csv,
        info                : dataset_info,
        container_info      : dataset_container_info,
        dataframe_original  : dataframe_original_1,
        dataframe_processed : dataframe_processed_1,
        dataset_transforms  : dataset_transforms,
        data_processed      : {
          missing_values    : true,
          scaler            : scaler,
          encoders          : encoders_map,
          X                 : X,
          y                 : y,
          column_name_target: column_name_target,
        }
      }
    ]
  }

  async MODELS (dataset) {
    const path = process.env.REACT_APP_PATH + '/models/01-linear-regression/auto-mpg'
    const models = {
      'auto-mpg.csv': [
        { model_path: path + '/0/lr-model-0.json', column_name_X: 'horsepower', column_name_Y: 'mpg' },
      ]
    }
    return models[dataset]
  }

  LAYERS () {
    const model = tfjs.sequential()
    return model
  }

  DEFAULT_LAYERS () {
    return [
      { is_disabled: false, units: 64, activation: 'relu'   },
      { is_disabled: false, units: 64, activation: 'relu'   },
      { is_disabled: true,  units: 1,  activation: 'linear' }
    ]
  }

  COMPILE () {
    const model = tfjs.sequential()
    model.compile({
      optimizer: tfjs.train.rmsprop(0.01),
      loss     : 'meanSquaredError',
      metrics  : ['meanSquaredError', 'meanAbsoluteError']
    })
    return model
  }

  ATTRIBUTE_INFORMATION () {
    return <></>
  }

  JOYRIDE () {
    return super.JOYRIDE()
  }
}
