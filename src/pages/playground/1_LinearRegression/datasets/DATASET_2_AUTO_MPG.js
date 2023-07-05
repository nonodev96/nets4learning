import * as tfjs from '@tensorflow/tfjs'
import * as dfd from 'danfojs'
import { Trans } from 'react-i18next'
import I_DATASETS_LINEAR_REGRESSION from './_model'

export default class DATASET_2_AUTO_MPG extends I_DATASETS_LINEAR_REGRESSION {

  static KEY = 'AUTO_MPG'
  static URL = 'https://archive.ics.uci.edu/ml/datasets/auto+mpg'
  i18n_TITLE = 'datasets-models.1-linear-regression.auto-mpg.title'
  _KEY = 'AUTO_MPG'

  async DATASETS () {
    const datasets_path = process.env.REACT_APP_PATH + '/datasets/linear-regression/auto-mpg/'
    const path_dataset_1 = datasets_path + 'auto-mpg.csv'
    const dataframe_original_1 = await dfd.readCSV(path_dataset_1)
    const dataframe_processed_1 = await dfd.readCSV(path_dataset_1)
    return {
      datasets     : [{
        path               : path_dataset_1,
        info               : 'auto-mpg.names',
        csv                : 'auto-mpg.csv',
        dataframe_original : dataframe_original_1,
        dataframe_processed: dataframe_processed_1,
        dataset_transforms : [],
        isDatasetProcessed : true
      }],
      datasets_path: datasets_path
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

  DESCRIPTION () {
    const prefix = 'datasets-models.1-linear-regression.auto-mpg.description.'
    return <>
      <p><Trans i18nKey={prefix + 'text-1'} /></p>
      <p><Trans i18nKey={prefix + 'text-2'} /></p>
      <p>
        <Trans i18nKey={prefix + 'text-link'}
               components={{
                 link1: <a href={'https://archive.ics.uci.edu/ml/datasets/auto+mpg'} target={'_blank'} rel="noreferrer">link</a>,
               }} />
      </p>
      <details>
        <summary><Trans i18nKey={prefix + 'details-1.title'} /></summary>
        <ol>
          <li><Trans i18nKey={prefix + 'details-1.list.1'} /></li>
          <li><Trans i18nKey={prefix + 'details-1.list.2'} /></li>
          <li><Trans i18nKey={prefix + 'details-1.list.3'} /></li>
          <li><Trans i18nKey={prefix + 'details-1.list.4'} /></li>
          <li><Trans i18nKey={prefix + 'details-1.list.5'} /></li>
          <li><Trans i18nKey={prefix + 'details-1.list.6'} /></li>
          <li><Trans i18nKey={prefix + 'details-1.list.7'} /></li>
          <li><Trans i18nKey={prefix + 'details-1.list.8'} /></li>
          <li><Trans i18nKey={prefix + 'details-1.list.9'} /></li>
        </ol>
      </details>
      <details>
        <summary><Trans i18nKey={prefix + 'details-2.title'} /></summary>
        <ol>
          <li><Trans i18nKey={prefix + 'details-2.list.1'} /></li>
          <li><Trans i18nKey={prefix + 'details-2.list.2'} /></li>
          <li><Trans i18nKey={prefix + 'details-2.list.3'} /></li>
          <li><Trans i18nKey={prefix + 'details-2.list.4'} /></li>
          <li><Trans i18nKey={prefix + 'details-2.list.5'} /></li>
          <li><Trans i18nKey={prefix + 'details-2.list.6'} /></li>
          <li><Trans i18nKey={prefix + 'details-2.list.7'} /></li>
          <li><Trans i18nKey={prefix + 'details-2.list.8'} /></li>
          <li><Trans i18nKey={prefix + 'details-2.list.9'} /></li>
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

  ATTRIBUTE_INFORMATION () {
    return <>

    </>
  }

  JOYRIDE () {
    return super.JOYRIDE()
  }
}