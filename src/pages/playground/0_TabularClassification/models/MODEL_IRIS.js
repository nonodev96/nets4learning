import { Trans } from 'react-i18next'
import * as tf from '@tensorflow/tfjs'
import * as dfd from 'danfojs'
import * as DataFrameUtils from '@core/dataframe/DataFrameUtils'
import I_MODEL_TABULAR_CLASSIFICATION from './_model'

export default class MODEL_IRIS extends I_MODEL_TABULAR_CLASSIFICATION {

  static KEY = 'IRIS'
  static URL = 'https://archive.ics.uci.edu/ml/datasets/iris'
  static URL_MODEL = '/public/models/classification/iris/my-model-iris.json'
  TITLE = 'datasets-models.0-tabular-classification.iris.title'
  i18n_TITLE = 'datasets-models.0-tabular-classification.iris.title'

  // region ATTR
  DATA_DEFAULT_KEYS = ['sepal_length', 'sepal_width', 'petal_length', 'petal_width']
  DATA_DEFAULT = {
    sepal_length: 5.1,
    sepal_width : 3.5,
    petal_length: 1.4,
    petal_width : 0.2
  }
  FORM = [
    { type: 'float32', name: 'sepal_length' },
    { type: 'float32', name: 'sepal_width' },
    { type: 'float32', name: 'petal_length' },
    { type: 'float32', name: 'petal_width' },
  ]
  LIST_EXAMPLES = [
    { sepal_length: 5.1, sepal_width: 3.5, petal_length: 1.4, petal_width: 0.2 },
    { sepal_length: 6.1, sepal_width: 3.0, petal_length: 4.6, petal_width: 1.4 },
    { sepal_length: 5.8, sepal_width: 2.7, petal_length: 5.1, petal_width: 1.9 },
  ]
  LIST_EXAMPLES_RESULTS = [
    '0 Iris-setosa',
    '1 Iris-versicolor',
    '2 Iris-virginica',
  ]

  CLASSES = [
    '00-tc.iris.Iris-setosa',
    '00-tc.iris.Iris-versicolor',
    '00-tc.iris.Iris-virginica',
  ]
  TABLE_HEADER = [
    '00-tc.iris.sepal_length',
    '00-tc.iris.sepal_width',
    '00-tc.iris.petal_length',
    '00-tc.iris.petal_width',
    '00-tc.iris.class'
  ]

  // endregion

  DESCRIPTION () {
    const prefix = 'datasets-models.0-tabular-classification.iris.description.'
    return <>
      <p>
        <Trans i18nKey={prefix + 'text-1'} />
      </p>
      <details>
        <summary><Trans i18nKey={prefix + 'details-1.title'} /></summary>
        <ol>
          <li><Trans i18nKey={prefix + 'details-1.list.1'} /></li>
          <li><Trans i18nKey={prefix + 'details-1.list.2'} /></li>
          <li><Trans i18nKey={prefix + 'details-1.list.3'} /></li>
          <li><Trans i18nKey={prefix + 'details-1.list.4'} /></li>
        </ol>
      </details>
      <details>
        <summary><Trans i18nKey={prefix + 'details-2.title'} /></summary>
        <ol>
          <li><Trans i18nKey={prefix + 'details-2.list.1'} /></li>
          <li><Trans i18nKey={prefix + 'details-2.list.2'} /></li>
          <li><Trans i18nKey={prefix + 'details-2.list.3'} /></li>
        </ol>
      </details>
      <details>
        <summary><Trans i18nKey={prefix + 'details-3.title'} /></summary>
        <ol>
          <li>
            <a href="https://archive.ics.uci.edu/ml/datasets/Iris" target="_blank" rel="noreferrer">
              <Trans i18nKey={prefix + 'details-3.list.1'} />
            </a>
          </li>
        </ol>
      </details>
      <details>
        <summary>BibTeX</summary>
        <pre>
{`
@misc{misc_iris_53,
  author       = {Fisher,R. A.},
  title        = {{Iris}},
  year         = {1988},
  howpublished = {UCI Machine Learning Repository},
  note         = {{DOI}: https://doi.org/10.24432/C56C76}
}
`}
        </pre>
      </details>
    </>
  }

  async DATASETS () {
    const dataset_path = process.env.REACT_APP_PATH + '/models/00-tabular-classification/iris/'
    const dataframe_original_1 = await dfd.readCSV(dataset_path + 'iris.csv')
    let dataframe_processed_1 = await dfd.readCSV(dataset_path + 'iris.csv')
    const dataset_transforms_1 = [

      { column_transform: 'label-encoder', column_name: 'class' },
    ]
    const encoders_map = DataFrameUtils.DataFrameEncoder(dataframe_original_1, dataset_transforms_1)
    dataframe_processed_1 = DataFrameUtils.DataFrameTransform(dataframe_processed_1, dataset_transforms_1)
    const scaler = new dfd.MinMaxScaler()

    return [{
      missing_values   : false,
      missing_value_key: '',
      encoders         : encoders_map,
      scaler           : scaler,
      classes          : ['1', '2', '3'],
      attributes       : [
        // @formatter:off
        { type: 'float32', name: 'sepal_length' },
        { type: 'float32', name: 'sepal_width' },
        { type: 'float32', name: 'petal_length' },
        { type: 'float32', name: 'petal_width' },
        // @formatter:on
      ],

      is_dataset_upload   : false,
      is_dataset_processed: true,
      path                : dataset_path,
      info                : 'iris.names',
      csv                 : 'iris.csv',
      dataframe_original  : dataframe_original_1,
      dataset_transforms  : dataset_transforms_1,
      dataframe_processed : dataframe_processed_1,
    }]
  }

  async LOAD_GRAPH_MODEL (callbacks) {
    return await tf.loadGraphModel(process.env.REACT_APP_PATH + '/models/00-tabular-classification/iris/my-model-iris.json', {
      onProgress: callbacks.onProgress
    })
  }

  async LOAD_LAYERS_MODEL (callbacks) {
    return tf.loadLayersModel(process.env.REACT_APP_PATH + '/models/00-tabular-classification/iris/my-model-iris.json', {
      onProgress: callbacks.onProgress
    })
  }

  DEFAULT_LAYERS () {
    return [
      { units: 10, activation: 'relu' },
      { units: 10, activation: 'relu' },
      { units: 3, activation: 'softmax' },
    ]
  }

  HTML_EXAMPLE () {
    const prefix = 'datasets-models.0-tabular-classification.iris.html-example.'
    return <>
      <p>
        <Trans i18nKey={prefix + 'text'} /><br />
        <b><Trans i18nKey={prefix + 'items'} /></b>
      </p>
    </>
  }
}
