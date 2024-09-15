import React from 'react'
import * as dfd from 'danfojs'
import I_MODEL_LINEAR_REGRESSION from './_model'
import { Trans } from 'react-i18next'

export default class MODEL_5_STUDENT_PERFORMANCE extends I_MODEL_LINEAR_REGRESSION {

  static KEY = 'STUDENT_PERFORMANCE'
  static URL = 'https://archive.ics.uci.edu/dataset/320/student+performance'

  URL = 'https://archive.ics.uci.edu/dataset/320/student+performance'
  i18n_TITLE = 'datasets-models.1-linear-regression.student-performance.title'
  _KEY = 'STUDENT_PERFORMANCE'

  DESCRIPTION () {
    const prefix = 'datasets-models.1-linear-regression.student-performance.description.'
    return <>
      <p><Trans i18nKey={prefix + 'text.0'} /></p>
      <p><Trans i18nKey={prefix + 'text.1'} /></p>
      <p><Trans i18nKey={prefix + 'text.2'} /></p>
      <p><Trans i18nKey={prefix + 'text.3'} /></p>
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
@misc{misc_student_performance_320,
  author       = {Cortez,Paulo},
  title        = {{Student Performance}},
  year         = {2014},
  howpublished = {UCI Machine Learning Repository},
  note         = {{DOI}: https://doi.org/10.24432/C5TG7T}
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
    const datasets_path = process.env.REACT_APP_PATH + '/datasets/01-linear-regression/student-performance/'
    const path_dataset_1 = datasets_path + 'student-mat.csv'
    const path_dataset_2 = datasets_path + 'student-por.csv'

    const [dataset_promise_info_1, dataset_promise_info_2] = await Promise.all([
      fetch(path_dataset_1),
      fetch(path_dataset_2),
    ])
    
    const [dataset_container_info_1, dataset_container_info_2] = await Promise.all([
      dataset_promise_info_1.text(),
      dataset_promise_info_2.text(),
    ])
    
    const dataframe_original_1 = await dfd.readCSV(datasets_path + 'student-mat.csv')
    const dataframe_processed_1 = await dfd.readCSV(datasets_path + 'student-mat.csv')
    const dataframe_original_2 = await dfd.readCSV(datasets_path + 'student-por.csv')
    const dataframe_processed_2 = await dfd.readCSV(datasets_path + 'student-por.csv')


    return [
      {
        is_dataset_upload   : false,
        is_dataset_processed: true,
        path                : datasets_path,
        info                : 'student.txt',
        csv                 : 'student-mat.csv',
        container_info      : dataset_container_info_1,
        dataframe_original  : dataframe_original_1,
        dataframe_processed : dataframe_processed_1,
        dataset_transforms  : [],
      }, 
      {
        is_dataset_upload   : false,
        is_dataset_processed: true,
        path                : datasets_path,
        info                : 'student.txt',
        csv                 : 'student-por.csv',
        container_info      : dataset_container_info_2,
        dataframe_original  : dataframe_original_2,
        dataframe_processed : dataframe_processed_2,
        dataset_transforms  : [],
      }
    ]
  }

  // TODO
  async MODELS (dataset) {
    const path = process.env.REACT_APP_PATH + '/models/01-linear-regression/student-performance'
    const models = {
      'student-mat.csv': [
        { model_path: path + '/0/lr-model-0.json', column_name_X: '', column_name_Y: '' },
      ],
      'student-por.csv': []
    }
    return models[dataset]
  }

  DEFAULT_LAYERS () {
    return [
      { is_disabled: false, units: 64, activation: 'relu'   },
      { is_disabled: false, units: 64, activation: 'relu'   },
      { is_disabled: false, units: 64, activation: 'relu'   },
      { is_disabled: true,  units: 1,  activation: 'linear' }
    ]
  }

  ATTRIBUTE_INFORMATION () {
    return <>

    </>
  }

  JOYRIDE () {
    return super.JOYRIDE()
  }
}
