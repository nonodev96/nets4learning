import React from 'react'
import * as tfjs from '@tensorflow/tfjs'
import * as dfd from 'danfojs'
import { Trans } from 'react-i18next'
import I_MODEL_LINEAR_REGRESSION from './_model'

export default class MODEL_3_HOUSING_PRICES extends I_MODEL_LINEAR_REGRESSION {

  static KEY = 'HOUSING_PRICES'
  static URL = 'https://www.kaggle.com/datasets/fedesoriano/california-housing-prices-data-extra-features'

  URL_CALIFORNIA = 'https://www.kaggle.com/datasets/fedesoriano/california-housing-prices-data-extra-features'

  URL_BOSTON = 'https://www.cs.toronto.edu/~delve/data/boston/bostonDetail.html'
  URL_BOSTON_MEDIUM = 'https://medium.com/@docintangible/racist-data-destruction-113e3eff54a8'


  i18n_TITLE = 'datasets-models.1-linear-regression.housing-prices.title'
  _KEY = 'HOUSING_PRICES'

  DESCRIPTION () {
    const prefix = 'datasets-models.1-linear-regression.housing-prices.description.'
    return <>
      <p><Trans i18nKey={prefix + 'text.0'} /></p>
      <p><Trans i18nKey={prefix + 'text.1'} /></p>
      <p>
        <Trans i18nKey={prefix + 'link'}
               components={{
                 link1: <a href={this.URL_CALIFORNIA} target={'_blank'} rel="noreferrer">link</a>,
               }} />
      </p>
      <details>
        <summary><Trans i18nKey={prefix + 'details-input.title'} /></summary>
        <ol>
          {Object.entries(this.t(prefix + 'details-input.california.list', { returnObjects: true, defaultValue: [] }))
            .map((value, index) => {
              return <li key={index}><Trans i18nKey={prefix + 'details-input.california.list.' + index} /></li>
            })}        
        </ol>
      </details>
      <details>
        <summary><Trans i18nKey={prefix + 'details-output.title'} /></summary>
        <ol>
          {Object.entries(this.t(prefix + 'details-output.california.list', { returnObjects: true, defaultValue: [] }))
            .map((value, index) => {
              return <li key={index}><Trans i18nKey={prefix + 'details-output.california.list.' + index} /></li>
            })}
        </ol>
      </details>
      <details>
        <summary><Trans i18nKey={prefix + 'details-references.title'} /></summary>
        <ol>
          <li>
            <Trans i18nKey={prefix + 'details-references.california.list.0'}
                   components={{
                     link1: <a href={this.URL_CALIFORNIA} target={'_blank'} rel="noreferrer">link</a>,
                   }} />
          </li>

        </ol>
      </details>
      
      <hr />

      <details>
        <summary><Trans i18nKey={prefix + 'details-input.title'} /></summary>
        <ol>
          {Object.entries(this.t(prefix + 'details-input.boston.list', { returnObjects: true, defaultValue: [] }))
            .map((value, index) => {
              return <li key={index}><Trans i18nKey={prefix + 'details-input.boston.list.' + index} /></li>
            })}        
        </ol>
      </details>
      <details>
        <summary><Trans i18nKey={prefix + 'details-output.title'} /></summary>
        <ol>
          {Object.entries(this.t(prefix + 'details-output.boston.list', { returnObjects: true, defaultValue: [] }))
            .map((value, index) => {
              return <li key={index}><Trans i18nKey={prefix + 'details-output.boston.list.' + index} /></li>
            })}
        </ol>
      </details>
      <details>
        <summary><Trans i18nKey={prefix + 'details-references.title'} /></summary>
        <ol>
          <li>
            <Trans i18nKey={prefix + 'details-references.boston.list.0'}
                   components={{
                     link1: <a href={this.URL_CALIFORNIA} target={'_blank'} rel="noreferrer">link</a>,
                   }} />
          </li>

        </ol>
      </details>

    </>
  }

  async DATASETS () {
    const datasets_path = process.env.REACT_APP_PATH + '/datasets/01-linear-regression/housing-prices/'

    const dataset_california_info = 'california-housing.names'
    const dataset_california_csv = 'california-housing.csv'
    const dataset_california_promise_info = await fetch(datasets_path + dataset_california_info)
    const dataset_california_container_info = await dataset_california_promise_info.text()
    const dataframe_california_original = await dfd.readCSV(datasets_path + dataset_california_csv)
    const dataframe_california_processed = await dfd.readCSV(datasets_path + dataset_california_csv)

    const dataset_boston_info = 'boston-housing.names'
    const dataset_boston_csv = 'boston-housing.csv'
    const dataset_boston_promise_info = await fetch(datasets_path + dataset_boston_info)
    const dataset_boston_container_info = await dataset_boston_promise_info.text()
    const dataframe_boston_original = await dfd.readCSV(datasets_path + dataset_boston_csv)
    const dataframe_boston_processed = await dfd.readCSV(datasets_path + dataset_boston_csv)

    return [
      {
        is_dataset_upload   : false,
        is_dataset_processed: true,
        path                : datasets_path,
        csv                 : dataset_california_csv,
        info                : dataset_california_info,
        container_info      : dataset_california_container_info,
        dataframe_original  : dataframe_california_original,
        dataframe_processed : dataframe_california_processed,
        dataset_transforms  : [],
      },
      {
        is_dataset_upload   : false,
        is_dataset_processed: true,
        path                : datasets_path,
        csv                 : dataset_boston_csv,
        info                : dataset_boston_info,
        container_info      : dataset_boston_container_info,
        dataframe_original  : dataframe_boston_original,
        dataframe_processed : dataframe_boston_processed,
        dataset_transforms  : [],
      }
    ]
  }

  async MODELS (dataset) {
    const path = process.env.REACT_APP_PATH + '/models/01-linear-regression/boston-housing'
    const models = {
      'california-housing.csv': [],
      'boston-housing.csv'    : [
        { model_path: path + '/0/lr-model-0.json', column_name_X: 'LSTAT', column_name_Y: 'MEDV',  },
        { model_path: path + '/1/lr-model-1.json', column_name_X: 'RM',    column_name_Y: 'MEDV' },
      ]
    }
    return models[dataset]
  }

  LAYERS () {
    const inputShape = 7
    const model = tfjs.sequential()
    model.add(tfjs.layers.dense({ units: 64, activation: 'relu', inputShape: [inputShape] }))
    model.add(tfjs.layers.dense({ units: 64, activation: 'relu' }))
    model.add(tfjs.layers.dense({ units: 64, activation: 'relu' }))
    model.add(tfjs.layers.dense({ units: 64, activation: 'relu' }))
    model.add(tfjs.layers.dense({ units: 1,  activation: 'relu' }))
    return model
  }

  DEFAULT_LAYERS () {
    return [
      { is_disabled: false, units: 64, activation: 'relu'   },
      { is_disabled: false, units: 64, activation: 'relu'   },
      { is_disabled: false, units: 64, activation: 'relu'   },
      { is_disabled: false, units: 64, activation: 'relu'   },
      { is_disabled: false, units: 64, activation: 'relu'   },
      { is_disabled: true,  units: 1,  activation: 'linear' }
    ]
  }

  COMPILE () {
    // https://towardsdatascience.com/linear-regression-on-boston-housing-dataset-f409b7e4a155
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
