import React from 'react'
import * as dfd from 'danfojs'
import { Trans } from 'react-i18next'

import * as _Type from '@core/types'
import * as DataFrameUtils from '@core/dataframe/DataFrameUtils'
import I_MODEL_LINEAR_REGRESSION from './_model'

export default class MODEL_WINE extends I_MODEL_LINEAR_REGRESSION {

  static KEY = 'WINE'
  static URL = 'https://archive.ics.uci.edu/dataset/186/wine+quality'

  URL = 'https://archive.ics.uci.edu/dataset/186/wine+quality'
  i18n_TITLE = 'datasets-models.1-linear-regression.wine.title'
  _KEY = 'WINE'

  DESCRIPTION () {
    const prefix = 'datasets-models.1-linear-regression.wine.description.'
    return <>
      <p><Trans i18nKey={prefix + 'text.0'} /></p>
      <p><Trans i18nKey={prefix + 'text.1'} /></p>
      <p><Trans i18nKey={prefix + 'text.2'} /></p>
      <p>
        <Trans i18nKey={prefix + 'link'}
               components={{
                 link1: <a href={this.URL} target={'_blank'} rel="noreferrer">link</a>,
               }} />
      </p>
      <details>
        <summary><Trans i18nKey={prefix + 'details-1-input.title'} /></summary>
        <ol>
          {Object.entries(this.t(prefix + 'details-1-input.list', { returnObjects: true, defaultValue: [] }))
            .map((value, index) => {
              return <li key={index}><Trans i18nKey={prefix + 'details-1-input.list.' + index} /></li>
            })}
        </ol>
      </details>
      <details>
        <summary><Trans i18nKey={prefix + 'details-2-output.title'} /></summary>
        <ol>
          {Object.entries(this.t(prefix + 'details-2-output.list', { returnObjects: true, defaultValue: [] }))
            .map((value, index) => {
              return <li key={index}><Trans i18nKey={prefix + 'details-2-output.list.' + index} /></li>
            })}
        </ol>
      </details>
      <details>
        <summary><Trans i18nKey={prefix + 'details-3-references.title'} /></summary>
        <ol>
          <li><Trans i18nKey={prefix + 'details-3-references.list.0'}
                     components={{
                       link1: <a href={this.URL} target={'_blank'} rel={'noreferrer'}>TEXT</a>
                     }} /></li>
        </ol>
      </details>
      <details>
        <summary>BibTeX</summary>
        <pre>
{`
@misc{misc_wine_quality_186,
  author       = {Cortez,Paulo, Cerdeira,A., Almeida,F., Matos,T., and Reis,J.},
  title        = {{Wine Quality}},
  year         = {2009},
  howpublished = {UCI Machine Learning Repository},
  note         = {{DOI}: https://doi.org/10.24432/C56S3T}
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
    const path_datasets = process.env.REACT_APP_PATH + '/datasets/01-linear-regression/wine-quality/'

    const info_datasets = 'wine-quality.names'
    const red_dataset_csv  = 'wine-quality-red.csv'
    const white_dataset_csv = 'wine-quality-white.csv'

    const dataset_fetch_info = await fetch(path_datasets + info_datasets)
    const dataset_container_info = await dataset_fetch_info.text()

    const red_dataset = [
      { column_name: 'fixed_acidity',          column_role: 'Feature',      column_type: 'Continuous',  column_missing_values: false },
      { column_name: 'volatile_acidity',       column_role: 'Feature',      column_type: 'Continuous',  column_missing_values: false },
      { column_name: 'citric_acid',            column_role: 'Feature',      column_type: 'Continuous',  column_missing_values: false },
      { column_name: 'residual_sugar',         column_role: 'Feature',      column_type: 'Continuous',  column_missing_values: false },
      { column_name: 'chlorides',              column_role: 'Feature',      column_type: 'Continuous',  column_missing_values: false },
      { column_name: 'free_sulfur_dioxide',    column_role: 'Feature',      column_type: 'Continuous',  column_missing_values: false },
      { column_name: 'total_sulfur_dioxide',   column_role: 'Feature',      column_type: 'Continuous',  column_missing_values: false },
      { column_name: 'density',                column_role: 'Feature',      column_type: 'Continuous',  column_missing_values: false },
      { column_name: 'pH',                     column_role: 'Feature',      column_type: 'Continuous',  column_missing_values: false },
      { column_name: 'sulphates',              column_role: 'Feature',      column_type: 'Continuous',  column_missing_values: false },
      { column_name: 'alcohol',                column_role: 'Feature',      column_type: 'Continuous',  column_missing_values: false },
      { column_name: 'quality',                column_role: 'Target',       column_type: 'Integer',     column_missing_values: false },
      { column_name: 'color',                  column_role: 'Other',        column_type: 'Categorical', column_missing_values: false },
    ]
    const red_dataset_transforms = [
      ...red_dataset.filter(v=> v.column_type === 'Categorical').map(v => ({ ...v, column_transform: 'label-encoder' }))
    ]
    
    // #region Wine Red
    let red_dataframe_original = await dfd.readCSV(path_datasets + red_dataset_csv)
    let red_dataframe_processed = await dfd.readCSV(path_datasets + red_dataset_csv)
    const red_target = 'quality'
    const red_encoders_map = DataFrameUtils.DataFrameEncoder(red_dataframe_processed, red_dataset_transforms)
    red_dataframe_processed = DataFrameUtils.DataFrameTransform(red_dataframe_processed, red_dataset_transforms)
    const red_dataframe_X = red_dataframe_processed.copy()
    const red_dataframe_y = red_dataframe_original[red_target]
    const minMaxScaler_1 = new dfd.MinMaxScaler()
    const red_scaler = minMaxScaler_1.fit(red_dataframe_processed)
    const red_X = red_scaler.transform(red_dataframe_X)
    const red_y = red_dataframe_y
    // #endregion


    // #region Wine Red
    let white_dataframe_original = await dfd.readCSV(path_datasets + white_dataset_csv)
    let white_dataframe_processed = await dfd.readCSV(path_datasets + white_dataset_csv)
    const white_dataset_transforms = [
      // { column_name: '',               column_transform: 'replace_?_NaN' },
      // { column_name: '',               column_transform: 'dropNa' },
    ]
    const white_target = 'quality'
    const white_encoders_map = DataFrameUtils.DataFrameEncoder(white_dataframe_processed, white_dataset_transforms)
    white_dataframe_processed = DataFrameUtils.DataFrameTransform(white_dataframe_processed, white_dataset_transforms)
    const white_dataframe_X = white_dataframe_processed.copy()
    const white_dataframe_y = white_dataframe_original[white_target]
    const minMaxScaler_2 = new dfd.MinMaxScaler()
    const white_scaler = minMaxScaler_2.fit(white_dataframe_processed)
    const white_X = white_scaler.transform(white_dataframe_X)
    const white_y = white_dataframe_y
    // #endregion


    return [
      {
        is_dataset_upload   : false,
        is_dataset_processed: true,
        path                : path_datasets,
        info                : info_datasets,
        container_info      : dataset_container_info,
        csv                 : red_dataset_csv,
        dataframe_original  : red_dataframe_original,
        dataframe_processed : red_dataframe_processed,
        dataset_transforms  : red_dataset_transforms,
        data_processed      : {
          X                 : red_X,
          y                 : red_y,
          column_name_target: red_target,
          scaler            : red_scaler,
          encoders          : red_encoders_map
        },
      },
      {
        is_dataset_upload   : false,
        is_dataset_processed: true,
        path                : path_datasets,
        info                : info_datasets,
        container_info      : dataset_container_info,
        csv                 : white_dataset_csv,
        dataframe_original  : white_dataframe_original,
        dataframe_processed : white_dataframe_processed,
        dataset_transforms  : white_dataset_transforms,
        data_processed      : {
          X                 : white_X, 
          y                 : white_y, 
          scaler            : white_scaler, 
          encoders          : white_encoders_map,
          column_name_target: white_target, 
        },

      }
    ]
  } 
  
  DEFAULT_LAYERS () {
    return [
      { is_disabled: false, units: 64, activation: 'relu'   },
      { is_disabled: false, units: 64, activation: 'relu'   },
      { is_disabled: false, units: 64, activation: 'relu'   },
      { is_disabled: true,  units: 1,  activation: 'linear' }
    ]
  }

  async MODELS (dataset) {
    const path = process.env.REACT_APP_PATH + '/models/01-linear-regression/wine'
    const models = {
      'wine-quality-red.csv': [
        { model_path: path + '/0/lr-model-0.json', column_name_X: 'fixed acidity', column_name_Y: 'density' },
        { model_path: path + '/1/lr-model-1.json', column_name_X: 'fixed acidity', column_name_Y: 'pH' },
      ],
      'wine-quality-white.csv': []
    }
    return models[dataset]
  }

  ATTRIBUTE_INFORMATION () {
    return <></>
  }

  JOYRIDE () {
    return super.JOYRIDE()
  }
}
