import React from 'react'
import * as dfd from 'danfojs'
import { Trans } from 'react-i18next'

import * as _Type from '@core/types'
import * as DataFrameUtils from '@core/dataframe/DataFrameUtils'
import I_MODEL_LINEAR_REGRESSION from './_model'

export default class MODEL_4_BREAST_CANCER extends I_MODEL_LINEAR_REGRESSION {

  static KEY = 'BREAST_CANCER'
  static URL = 'https://archive.ics.uci.edu/dataset/16/breast+cancer+wisconsin+prognostic'
  static URL_2 = 'https://archive.ics.uci.edu/dataset/16/breast+cancer+wisconsin+prognostic'
  static URL_3 = 'https://archive.ics.uci.edu/dataset/17/breast+cancer+wisconsin+diagnostic'

  URL = 'https://archive.ics.uci.edu/dataset/16/breast+cancer+wisconsin+prognostic'
  URL_2 = 'https://archive.ics.uci.edu/dataset/16/breast+cancer+wisconsin+prognostic'
  URL_3 = 'https://archive.ics.uci.edu/dataset/17/breast+cancer+wisconsin+diagnostic'
  URL_IMAGE = 'https://www.cs.wisc.edu/~street/images/'

  i18n_TITLE = 'datasets-models.1-linear-regression.breast-cancer.title'
  _KEY = 'BREAST_CANCER'

  DESCRIPTION () {
    const prefix = 'datasets-models.1-linear-regression.breast-cancer.description.'
    return <>
      <p><Trans i18nKey={prefix + 'text.0'} /></p>
      <p><Trans i18nKey={prefix + 'text.1'} /></p>
      <p>
        <Trans 
          i18nKey={prefix + 'text.2'}
          components={{
            link1: <a href={this.URL_IMAGE} target={'_blank'} rel="noreferrer">link</a>,
          }} 
          />
      </p>
      <p><Trans i18nKey={prefix + 'text.3'} /></p>
      <p>
        <Trans 
          i18nKey={prefix + 'link'}
          components={{
            link1: <a href={this.URL} target={'_blank'} rel="noreferrer">link</a>,
          }} 
          />
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
          <li>
            <Trans 
              i18nKey={prefix + 'details-3-references.list.0'}
              components={{
                link1: <a href={this.URL} target={'_blank'} rel={'noreferrer'}>TEXT</a>
              }} 
            />
          </li>
          <li>
            <Trans
              i18nKey={prefix + 'details-3-references.list.1'}
              components={{
                link1: <a href={this.URL_2} target={'_blank'} rel={'noreferrer'}>TEXT</a>
              }} 
              />
          </li>
        </ol>
      </details>
      <details>
        <summary>BibTeX</summary>
        <pre>
{`
@misc{misc_breast_cancer_wisconsin_(prognostic)_16,
  author       = {Wolberg,William, Street,W., and Mangasarian,Olvi},
  title        = {{Breast Cancer Wisconsin (Prognostic)}},
  year         = {1995},
  howpublished = {UCI Machine Learning Repository},
  note         = {{DOI}: https://doi.org/10.24432/C5GK50}
}
`}
          {`
@misc{misc_breast_cancer_wisconsin_(diagnostic)_17,
  author       = {Wolberg,William, Mangasarian,Olvi, Street,Nick, and Street,W.},
  title        = {{Breast Cancer Wisconsin (Diagnostic)}},
  year         = {1995},
  howpublished = {UCI Machine Learning Repository},
  note         = {{DOI}: https://doi.org/10.24432/C5DW2B}
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
    const path_dataset = process.env.REACT_APP_PATH + '/datasets/01-linear-regression/breast-cancer/'
    const bcw_dataset_info = 'breast-cancer-wisconsin.names'
    const bcw_dataset_csv = 'breast-cancer-wisconsin.csv'
    const wdbc_dataset_info = 'wdbc.names'
    const wdbc_dataset_csv = 'wdbc.csv'
    const wpbc_dataset_info = 'wpbc.names'
    const wpbc_dataset_csv = 'wpbc.csv'

    const [bcw_dataset_promise_info, wdbc_dataset_promise_info, wpbc_dataset_promise_info] = await Promise.all([
      fetch(path_dataset + bcw_dataset_info),
      fetch(path_dataset + wdbc_dataset_info),
      fetch(path_dataset + wpbc_dataset_info),
    ])
    const [bcw_container_info, wdbc_container_info, wpbc_container_info] = await Promise.all([
      bcw_dataset_promise_info.text(),
      wdbc_dataset_promise_info.text(),
      wpbc_dataset_promise_info.text(),
    ])
    
    // --------------------
    // #region Dataset Breast cancer wisconsin (Original)
    let bcw_dataframe_original = await dfd.readCSV(path_dataset + bcw_dataset_csv)
    let bcw_dataframe_processed = await dfd.readCSV(path_dataset + bcw_dataset_csv)
    const bcw_dataset_encoder = [
      // { column_transform: 'label-encoder', column_name: '' },
    ]
    const _bcw_dataset = [
      // { column_transform: '', column_name: 'Sample_code_number',           column_role: 'ID',       column_type: 'Categorical', missing_values: false, column_missing_value_key: null },
      // { column_transform: '', column_name: 'Clump_thickness',              column_role: 'Feature',  column_type: 'Integer',     missing_values: false, column_missing_value_key: null },
      // { column_transform: '', column_name: 'Uniformity_of_cell_size',      column_role: 'Feature',  column_type: 'Integer',     missing_values: false, column_missing_value_key: null },
      // { column_transform: '', column_name: 'Uniformity_of_cell_shape',     column_role: 'Feature',  column_type: 'Integer',     missing_values: false, column_missing_value_key: null },
      // { column_transform: '', column_name: 'Marginal_adhesion',            column_role: 'Feature',  column_type: 'Integer',     missing_values: false, column_missing_value_key: null },
      // { column_transform: '', column_name: 'Single_epithelial_cell_size',  column_role: 'Feature',  column_type: 'Integer',     missing_values: false, column_missing_value_key: null },
      // { column_transform: '', column_name: 'Bare_nuclei',                  column_role: 'Feature',  column_type: 'Integer',     missing_values: true,  column_missing_value_key: '?'  },
      // { column_transform: '', column_name: 'Bland_chromatin',              column_role: 'Feature',  column_type: 'Integer',     missing_values: false, column_missing_value_key: null },
      // { column_transform: '', column_name: 'Normal_nucleoli',              column_role: 'Feature',  column_type: 'Integer',     missing_values: false, column_missing_value_key: null },
      // { column_transform: '', column_name: 'Mitoses',                      column_role: 'Feature',  column_type: 'Integer',     missing_values: false, column_missing_value_key: null },
      // { column_transform: '', column_name: 'Class',                        column_role: 'Target',   column_type: 'Binary',      missing_values: false, column_missing_value_key: null },
    ]
    const bcw_dataset_transforms = [
      { column_name: 'Bare_Nuclei', column_transform: 'replace_?_NaN' },
      { column_name: 'Bare_Nuclei', column_transform: 'dropNa' },
    ]
    const bcw_target = 'Class'
    const bcw_encoders_map = DataFrameUtils.DataFrameEncoder(bcw_dataframe_processed, bcw_dataset_encoder)
    bcw_dataframe_processed = DataFrameUtils.DataFrameTransform(bcw_dataframe_processed, bcw_dataset_transforms)
    const bcw_dataframe_X = bcw_dataframe_processed.copy()
    const bcw_dataframe_y = bcw_dataframe_original[bcw_target]
    const minMaxScaler_1 = new dfd.MinMaxScaler()
    const bcw_scaler = minMaxScaler_1.fit(bcw_dataframe_processed)
    const bcw_X = bcw_scaler.transform(bcw_dataframe_X)
    const bcw_y = bcw_dataframe_y
    // #endregion
    
    
    // --------------------
    // #region Breast Cancer Wisconsin (Diagnostic)
    let wdbc_dataframe_original = await dfd.readCSV(path_dataset + wdbc_dataset_csv)
    let wdbc_dataframe_processed = await dfd.readCSV(path_dataset + wdbc_dataset_csv)
    const wdbc_dataset_encoder = [
    ]
    const wdbc_dataset_transforms = [
      // { column_transform: '', column_name: 'ID',                  column_type: 'Categorical', column_role: 'ID',      column_missing_values: false, column_missing_value_key: null },
      // { column_transform: '', column_name: 'Diagnosis',           column_type: 'Categorical', column_role: 'Target',  column_missing_values: false, column_missing_value_key: null },
      // { column_transform: '', column_name: 'radius1',             column_type: 'Continuous',  column_role: 'Feature', column_missing_values: false, column_missing_value_key: null },
      // { column_transform: '', column_name: 'texture1',            column_type: 'Continuous',  column_role: 'Feature', column_missing_values: false, column_missing_value_key: null },
      // { column_transform: '', column_name: 'perimeter1',          column_type: 'Continuous',  column_role: 'Feature', column_missing_values: false, column_missing_value_key: null },
      // { column_transform: '', column_name: 'area1',               column_type: 'Continuous',  column_role: 'Feature', column_missing_values: false, column_missing_value_key: null },
      // { column_transform: '', column_name: 'smoothness1',         column_type: 'Continuous',  column_role: 'Feature', column_missing_values: false, column_missing_value_key: null },
      // { column_transform: '', column_name: 'compactness1',        column_type: 'Continuous',  column_role: 'Feature', column_missing_values: false, column_missing_value_key: null },
      // { column_transform: '', column_name: 'concavity1',          column_type: 'Continuous',  column_role: 'Feature', column_missing_values: false, column_missing_value_key: null },
      // { column_transform: '', column_name: 'concave_points1',     column_type: 'Continuous',  column_role: 'Feature', column_missing_values: false, column_missing_value_key: null },
      // { column_transform: '', column_name: 'symmetry1',           column_type: 'Continuous',  column_role: 'Feature', column_missing_values: false, column_missing_value_key: null },
      // { column_transform: '', column_name: 'fractal_dimension1',  column_type: 'Continuous',  column_role: 'Feature', column_missing_values: false, column_missing_value_key: null },
      // { column_transform: '', column_name: 'radius2',             column_type: 'Continuous',  column_role: 'Feature', column_missing_values: false, column_missing_value_key: null },
      // { column_transform: '', column_name: 'texture2',            column_type: 'Continuous',  column_role: 'Feature', column_missing_values: false, column_missing_value_key: null },
      // { column_transform: '', column_name: 'perimeter2',          column_type: 'Continuous',  column_role: 'Feature', column_missing_values: false, column_missing_value_key: null },
      // { column_transform: '', column_name: 'area2',               column_type: 'Continuous',  column_role: 'Feature', column_missing_values: false, column_missing_value_key: null },
      // { column_transform: '', column_name: 'smoothness2',         column_type: 'Continuous',  column_role: 'Feature', column_missing_values: false, column_missing_value_key: null },
      // { column_transform: '', column_name: 'compactness2',        column_type: 'Continuous',  column_role: 'Feature', column_missing_values: false, column_missing_value_key: null },
      // { column_transform: '', column_name: 'concavity2',          column_type: 'Continuous',  column_role: 'Feature', column_missing_values: false, column_missing_value_key: null },
      // { column_transform: '', column_name: 'concave_points2',     column_type: 'Continuous',  column_role: 'Feature', column_missing_values: false, column_missing_value_key: null },
      // { column_transform: '', column_name: 'symmetry2',           column_type: 'Continuous',  column_role: 'Feature', column_missing_values: false, column_missing_value_key: null },
      // { column_transform: '', column_name: 'fractal_dimension2',  column_type: 'Continuous',  column_role: 'Feature', column_missing_values: false, column_missing_value_key: null },
      // { column_transform: '', column_name: 'radius3',             column_type: 'Continuous',  column_role: 'Feature', column_missing_values: false, column_missing_value_key: null },
      // { column_transform: '', column_name: 'texture3',            column_type: 'Continuous',  column_role: 'Feature', column_missing_values: false, column_missing_value_key: null },
      // { column_transform: '', column_name: 'perimeter3',          column_type: 'Continuous',  column_role: 'Feature', column_missing_values: false, column_missing_value_key: null },
      // { column_transform: '', column_name: 'area3',               column_type: 'Continuous',  column_role: 'Feature', column_missing_values: false, column_missing_value_key: null },
      // { column_transform: '', column_name: 'smoothness3',         column_type: 'Continuous',  column_role: 'Feature', column_missing_values: false, column_missing_value_key: null },
      // { column_transform: '', column_name: 'compactness3',        column_type: 'Continuous',  column_role: 'Feature', column_missing_values: false, column_missing_value_key: null },
      // { column_transform: '', column_name: 'concavity3',          column_type: 'Continuous',  column_role: 'Feature', column_missing_values: false, column_missing_value_key: null },
      // { column_transform: '', column_name: 'concave_points3',     column_type: 'Continuous',  column_role: 'Feature', column_missing_values: false, column_missing_value_key: null },
      // { column_transform: '', column_name: 'symmetry3',           column_type: 'Continuous',  column_role: 'Feature', column_missing_values: false, column_missing_value_key: null },
      // { column_transform: '', column_name: 'fractal_dimension3',  column_type: 'Continuous',  column_role: 'Feature', column_missing_values: false, column_missing_value_key: null },
    ]
    const wdbc_target = ''
    
    const wdbc_encoders_map = DataFrameUtils.DataFrameEncoder(wdbc_dataframe_processed, wdbc_dataset_encoder)
    wdbc_dataframe_processed = DataFrameUtils.DataFrameTransform(wdbc_dataframe_processed, wdbc_dataset_transforms)
    
    const wdbc_dataframe_X = wdbc_dataframe_processed.copy()
    const wdbc_dataframe_y = wdbc_dataframe_original[wdbc_target]
    
    const minMaxScaler_2 = new dfd.MinMaxScaler()
    const wdbc_scaler = minMaxScaler_2.fit(wdbc_dataframe_processed)
    const wdbc_X = wdbc_scaler.transform(wdbc_dataframe_X)
    const wdbc_y = wdbc_dataframe_y
    // #endregion

    // --------------------
    // #region Breast Cancer Wisconsin (Prognostic)
    let wpbc_dataframe_original = await dfd.readCSV(path_dataset + wpbc_dataset_csv)
    let wpbc_dataframe_processed = await dfd.readCSV(path_dataset + wpbc_dataset_csv)
    const wpbc_dataset_encoder = [

    ]
    const wpbc_dataset_transforms = [
      // { column_transform: '', column_name: 'ID',                   column_role: 'ID',             column_type: 'Integer',        column_missing_values: false },
      // { column_transform: '', column_name: 'Time',                 column_role: 'Feature',        column_type: 'Integer',        column_missing_values: false },
      // { column_transform: '', column_name: 'radius1',              column_role: 'Feature',        column_type: 'Continuous',     column_missing_values: false },
      // { column_transform: '', column_name: 'texture1',             column_role: 'Feature',        column_type: 'Continuous',     column_missing_values: false },
      // { column_transform: '', column_name: 'perimeter1',           column_role: 'Feature',        column_type: 'Continuous',     column_missing_values: false },
      // { column_transform: '', column_name: 'area1',                column_role: 'Feature',        column_type: 'Continuous',     column_missing_values: false },
      // { column_transform: '', column_name: 'smoothness1',          column_role: 'Feature',        column_type: 'Continuous',     column_missing_values: false },
      // { column_transform: '', column_name: 'compactness1',         column_role: 'Feature',        column_type: 'Continuous',     column_missing_values: false },
      // { column_transform: '', column_name: 'concavity1',           column_role: 'Feature',        column_type: 'Continuous',     column_missing_values: false },
      // { column_transform: '', column_name: 'concave_points1',      column_role: 'Feature',        column_type: 'Continuous',     column_missing_values: false },
      // { column_transform: '', column_name: 'symmetry1',            column_role: 'Feature',        column_type: 'Continuous',     column_missing_values: false },
      // { column_transform: '', column_name: 'fractal_dimension1',   column_role: 'Feature',        column_type: 'Continuous',     column_missing_values: false },
      // { column_transform: '', column_name: 'radius2',              column_role: 'Feature',        column_type: 'Continuous',     column_missing_values: false },
      // { column_transform: '', column_name: 'texture2',             column_role: 'Feature',        column_type: 'Continuous',     column_missing_values: false },
      // { column_transform: '', column_name: 'perimeter2',           column_role: 'Feature',        column_type: 'Continuous',     column_missing_values: false },
      // { column_transform: '', column_name: 'area2',                column_role: 'Feature',        column_type: 'Continuous',     column_missing_values: false },
      // { column_transform: '', column_name: 'smoothness2',          column_role: 'Feature',        column_type: 'Continuous',     column_missing_values: false },
      // { column_transform: '', column_name: 'compactness2',         column_role: 'Feature',        column_type: 'Continuous',     column_missing_values: false },
      // { column_transform: '', column_name: 'concavity2',           column_role: 'Feature',        column_type: 'Continuous',     column_missing_values: false },
      // { column_transform: '', column_name: 'concave_points2',      column_role: 'Feature',        column_type: 'Continuous',     column_missing_values: false },
      // { column_transform: '', column_name: 'symmetry2',            column_role: 'Feature',        column_type: 'Continuous',     column_missing_values: false },
      // { column_transform: '', column_name: 'fractal_dimension2',   column_role: 'Feature',        column_type: 'Continuous',     column_missing_values: false },
      // { column_transform: '', column_name: 'radius3',              column_role: 'Feature',        column_type: 'Continuous',     column_missing_values: false },
      // { column_transform: '', column_name: 'texture3',             column_role: 'Feature',        column_type: 'Continuous',     column_missing_values: false },
      // { column_transform: '', column_name: 'perimeter3',           column_role: 'Feature',        column_type: 'Continuous',     column_missing_values: false },
      // { column_transform: '', column_name: 'area3',                column_role: 'Feature',        column_type: 'Integer',        column_missing_values: false },
      // { column_transform: '', column_name: 'smoothness3',          column_role: 'Feature',        column_type: 'Continuous',     column_missing_values: false },
      // { column_transform: '', column_name: 'compactness3',         column_role: 'Feature',        column_type: 'Continuous',     column_missing_values: false },
      // { column_transform: '', column_name: 'concavity3',           column_role: 'Feature',        column_type: 'Continuous',     column_missing_values: false },
      // { column_transform: '', column_name: 'concave_points3',      column_role: 'Feature',        column_type: 'Continuous',     column_missing_values: false },
      // { column_transform: '', column_name: 'symmetry3',            column_role: 'Feature',        column_type: 'Continuous',     column_missing_values: false },
      // { column_transform: '', column_name: 'fractal_dimension3',   column_role: 'Feature',        column_type: 'Continuous',     column_missing_values: false },
      // { column_transform: '', column_name: 'tumor_size',           column_role: 'Feature',        column_type: 'Continuous',     column_missing_values: false },
      // { column_transform: '', column_name: 'lymph_node_status',    column_role: 'Feature',        column_type: 'Integer',        column_missing_values: true  },
      // { column_transform: '', column_name: 'Outcome',              column_role: 'Target',         column_type: 'Categorical',    column_missing_values: false },
    ]
    const wpbc_target = ''

    const wpbc_encoders_map = DataFrameUtils.DataFrameEncoder(wpbc_dataframe_processed, wpbc_dataset_encoder)
    wpbc_dataframe_processed = DataFrameUtils.DataFrameTransform(wpbc_dataframe_processed, wpbc_dataset_transforms)
    
    const wpbc_dataframe_X = wpbc_dataframe_processed.copy()
    const wpbc_dataframe_y = wpbc_dataframe_original[wpbc_target]
    
    const minMaxScaler_3 = new dfd.MinMaxScaler()
    const wpbc_scaler = minMaxScaler_3.fit(wpbc_dataframe_X)
    const wpbc_X = wpbc_scaler.transform(wpbc_dataframe_X)
    const wpbc_y = wpbc_dataframe_y
    // #endregion


    return [
      {
        // Original
        is_dataset_upload   : false,
        is_dataset_processed: true,
        path                : path_dataset,
        info                : bcw_dataset_info,
        csv                 : bcw_dataset_csv,
        container_info      : bcw_container_info,
        dataframe_original  : bcw_dataframe_original,
        dataframe_processed : bcw_dataframe_processed,
        dataset_transforms  : bcw_dataset_transforms,
        data_processed      : {
          X                 : bcw_X,
          y                 : bcw_y,
          scaler            : bcw_scaler,
          encoders          : bcw_encoders_map,
          column_name_target: bcw_target,
        }
      },
      {
        // Pronostico
        is_dataset_upload   : false,
        is_dataset_processed: true,
        path                : path_dataset,
        csv                 : wdbc_dataset_csv,
        info                : wdbc_dataset_info,
        container_info      : wdbc_container_info,
        dataframe_original  : wdbc_dataframe_original,
        dataframe_processed : wdbc_dataframe_processed,
        dataset_transforms  : wdbc_dataset_transforms,
        data_processed      : {
          X                 : wdbc_X,
          y                 : wdbc_y,
          scaler            : wdbc_scaler,
          encoders          : wdbc_encoders_map,
          column_name_target: wdbc_target,
        }
      },
      {
        // Diagnostico
        is_dataset_upload   : false,
        is_dataset_processed: true,
        path                : path_dataset,
        info                : wpbc_dataset_info,
        csv                 : wpbc_dataset_csv,
        container_info      : wpbc_container_info,
        dataframe_original  : wpbc_dataframe_original,
        dataframe_processed : wpbc_dataframe_processed,
        dataset_transforms  : wpbc_dataset_transforms,
        data_processed      : {
          X                 : wpbc_X,
          y                 : wpbc_y,
          scaler            : wpbc_scaler,
          encoders          : wpbc_encoders_map,
          column_name_target: wpbc_target,
        }
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
    const path = process.env.REACT_APP_PATH + '/models/01-linear-regression/breast-cancer'
    const models = {
      'breast-cancer-wisconsin.csv': [],
      'wpbc.csv'                   : [],
      'wdbc.csv'                   : [
        { model_path: path + '/0/lr-model-0.json', column_name_X: 'area_mean', column_name_Y: 'perimeter_mean' }
      ],
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
