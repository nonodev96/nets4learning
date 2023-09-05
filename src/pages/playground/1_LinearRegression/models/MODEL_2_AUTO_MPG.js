import * as tfjs from '@tensorflow/tfjs'
import * as dfd from 'danfojs'
import { Trans } from 'react-i18next'
import I_MODEL_LINEAR_REGRESSION from './_model'

export default class MODEL_2_AUTO_MPG extends I_MODEL_LINEAR_REGRESSION {

  static KEY = 'AUTO_MPG'
  static URL = 'https://archive.ics.uci.edu/ml/datasets/auto+mpg'
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
                 link1: <a href={'https://archive.ics.uci.edu/ml/datasets/auto+mpg'} target={'_blank'} rel="noreferrer">link</a>,
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
    </>
  }

  async DATASETS () {
    const dataset_path = process.env.REACT_APP_PATH + '/datasets/linear-regression/auto-mpg/'
    const dataframe_original_1 = await dfd.readCSV(dataset_path + 'auto-mpg.csv')
    const dataframe_processed_1 = await dfd.readCSV(dataset_path + 'auto-mpg.csv')
    return {
      datasets: [{
        is_dataset_upload   : false,
        path                : dataset_path,
        info                : 'auto-mpg.names',
        csv                 : 'auto-mpg.csv',
        dataframe_original  : dataframe_original_1,
        dataframe_processed : dataframe_processed_1,
        dataset_transforms  : [],
        is_dataset_processed: true
      }]
    }
  }

  LAYERS () {
    return tfjs.sequential()
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

  ATTRIBUTE_INFORMATION () {
    return <></>
  }

  JOYRIDE () {
    return super.JOYRIDE()
  }
}