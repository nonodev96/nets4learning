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
    </>
  }

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

  async MODELS (dataset) {
    const path = process.env.REACT_APP_PATH + '/models/linear-regression/student-performance'
    return [
      { column_name_X: 'YearsExperience', column_name_Y: 'Salary', model_path: path + '/0/lr-model-0.json' },
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