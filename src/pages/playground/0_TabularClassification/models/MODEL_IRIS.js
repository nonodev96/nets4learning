import * as tf from '@tensorflow/tfjs'
import { Trans } from 'react-i18next'
import I_MODEL_TABULAR_CLASSIFICATION from './_model'

export class MODEL_IRIS extends I_MODEL_TABULAR_CLASSIFICATION {

  static  KEY = 'IRIS'
  static URL = 'https://archive.ics.uci.edu/ml/datasets/iris'
  static URL_MODEL = '/public/models/classification/iris/my-model-iris.json'
  TITLE = 'datasets-models.0-tabular-classification.iris.title'
  i18n_TITLE = 'datasets-models.0-tabular-classification.iris.title'

  DATA_OBJECT = {
    sepal_length: 5.1,
    sepal_width : 3.5,
    petal_length: 1.4,
    petal_width : 0.2
  }
  DATA_DEFAULT = {
    sepal_length: 5.1,
    sepal_width : 3.5,
    petal_length: 1.4,
    petal_width : 0.2
  }
  DATA_OBJECT_KEYS = ['sepal_length', 'sepal_width', 'petal_length', 'petal_width']
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

  async DEFAULT_LAYERS () {
    return [
      { units: 10, activation: 'sigmoid' },
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

  async LOAD_GRAPH_MODEL (onProgress) {
    return await tf.loadLayersModel(process.env.REACT_APP_PATH + '/models/00-tabular-classification/iris/my-model-iris.json', {
      onProgress: onProgress
    })
  }

  function_v_input = async function (element, _index, _param = '') {
    return parseFloat(element)
  }
  DATA = [
    [5.1, 3.5, 1.4, 0.2, 0],
    [4.9, 3.0, 1.4, 0.2, 0],
    [4.7, 3.2, 1.3, 0.2, 0],
    [4.6, 3.1, 1.5, 0.2, 0],
    [5.0, 3.6, 1.4, 0.2, 0],
    [5.4, 3.9, 1.7, 0.4, 0],
    [4.6, 3.4, 1.4, 0.3, 0],
    [5.0, 3.4, 1.5, 0.2, 0],
    [4.4, 2.9, 1.4, 0.2, 0],
    [4.9, 3.1, 1.5, 0.1, 0],
    [5.4, 3.7, 1.5, 0.2, 0],
    [4.8, 3.4, 1.6, 0.2, 0],
    [4.8, 3.0, 1.4, 0.1, 0],
    [4.3, 3.0, 1.1, 0.1, 0],
    [5.8, 4.0, 1.2, 0.2, 0],
    [5.7, 4.4, 1.5, 0.4, 0],
    [5.4, 3.9, 1.3, 0.4, 0],
    [5.1, 3.5, 1.4, 0.3, 0],
    [5.7, 3.8, 1.7, 0.3, 0],
    [5.1, 3.8, 1.5, 0.3, 0],
    [5.4, 3.4, 1.7, 0.2, 0],
    [5.1, 3.7, 1.5, 0.4, 0],
    [4.6, 3.6, 1.0, 0.2, 0],
    [5.1, 3.3, 1.7, 0.5, 0],
    [4.8, 3.4, 1.9, 0.2, 0],
    [5.0, 3.0, 1.6, 0.2, 0],
    [5.0, 3.4, 1.6, 0.4, 0],
    [5.2, 3.5, 1.5, 0.2, 0],
    [5.2, 3.4, 1.4, 0.2, 0],
    [4.7, 3.2, 1.6, 0.2, 0],
    [4.8, 3.1, 1.6, 0.2, 0],
    [5.4, 3.4, 1.5, 0.4, 0],
    [5.2, 4.1, 1.5, 0.1, 0],
    [5.5, 4.2, 1.4, 0.2, 0],
    [4.9, 3.1, 1.5, 0.1, 0],
    [5.0, 3.2, 1.2, 0.2, 0],
    [5.5, 3.5, 1.3, 0.2, 0],
    [4.9, 3.1, 1.5, 0.1, 0],
    [4.4, 3.0, 1.3, 0.2, 0],
    [5.1, 3.4, 1.5, 0.2, 0],
    [5.0, 3.5, 1.3, 0.3, 0],
    [4.5, 2.3, 1.3, 0.3, 0],
    [4.4, 3.2, 1.3, 0.2, 0],
    [5.0, 3.5, 1.6, 0.6, 0],
    [5.1, 3.8, 1.9, 0.4, 0],
    [4.8, 3.0, 1.4, 0.3, 0],
    [5.1, 3.8, 1.6, 0.2, 0],
    [4.6, 3.2, 1.4, 0.2, 0],
    [5.3, 3.7, 1.5, 0.2, 0],
    [5.0, 3.3, 1.4, 0.2, 0],
    [7.0, 3.2, 4.7, 1.4, 1],
    [6.4, 3.2, 4.5, 1.5, 1],
    [6.9, 3.1, 4.9, 1.5, 1],
    [5.5, 2.3, 4.0, 1.3, 1],
    [6.5, 2.8, 4.6, 1.5, 1],
    [5.7, 2.8, 4.5, 1.3, 1],
    [6.3, 3.3, 4.7, 1.6, 1],
    [4.9, 2.4, 3.3, 1.0, 1],
    [6.6, 2.9, 4.6, 1.3, 1],
    [5.2, 2.7, 3.9, 1.4, 1],
    [5.0, 2.0, 3.5, 1.0, 1],
    [5.9, 3.0, 4.2, 1.5, 1],
    [6.0, 2.2, 4.0, 1.0, 1],
    [6.1, 2.9, 4.7, 1.4, 1],
    [5.6, 2.9, 3.6, 1.3, 1],
    [6.7, 3.1, 4.4, 1.4, 1],
    [5.6, 3.0, 4.5, 1.5, 1],
    [5.8, 2.7, 4.1, 1.0, 1],
    [6.2, 2.2, 4.5, 1.5, 1],
    [5.6, 2.5, 3.9, 1.1, 1],
    [5.9, 3.2, 4.8, 1.8, 1],
    [6.1, 2.8, 4.0, 1.3, 1],
    [6.3, 2.5, 4.9, 1.5, 1],
    [6.1, 2.8, 4.7, 1.2, 1],
    [6.4, 2.9, 4.3, 1.3, 1],
    [6.6, 3.0, 4.4, 1.4, 1],
    [6.8, 2.8, 4.8, 1.4, 1],
    [6.7, 3.0, 5.0, 1.7, 1],
    [6.0, 2.9, 4.5, 1.5, 1],
    [5.7, 2.6, 3.5, 1.0, 1],
    [5.5, 2.4, 3.8, 1.1, 1],
    [5.5, 2.4, 3.7, 1.0, 1],
    [5.8, 2.7, 3.9, 1.2, 1],
    [6.0, 2.7, 5.1, 1.6, 1],
    [5.4, 3.0, 4.5, 1.5, 1],
    [6.0, 3.4, 4.5, 1.6, 1],
    [6.7, 3.1, 4.7, 1.5, 1],
    [6.3, 2.3, 4.4, 1.3, 1],
    [5.6, 3.0, 4.1, 1.3, 1],
    [5.5, 2.5, 4.0, 1.3, 1],
    [5.5, 2.6, 4.4, 1.2, 1],
    [6.1, 3.0, 4.6, 1.4, 1],
    [5.8, 2.6, 4.0, 1.2, 1],
    [5.0, 2.3, 3.3, 1.0, 1],
    [5.6, 2.7, 4.2, 1.3, 1],
    [5.7, 3.0, 4.2, 1.2, 1],
    [5.7, 2.9, 4.2, 1.3, 1],
    [6.2, 2.9, 4.3, 1.3, 1],
    [5.1, 2.5, 3.0, 1.1, 1],
    [5.7, 2.8, 4.1, 1.3, 1],
    [6.3, 3.3, 6.0, 2.5, 2],
    [5.8, 2.7, 5.1, 1.9, 2],
    [7.1, 3.0, 5.9, 2.1, 2],
    [6.3, 2.9, 5.6, 1.8, 2],
    [6.5, 3.0, 5.8, 2.2, 2],
    [7.6, 3.0, 6.6, 2.1, 2],
    [4.9, 2.5, 4.5, 1.7, 2],
    [7.3, 2.9, 6.3, 1.8, 2],
    [6.7, 2.5, 5.8, 1.8, 2],
    [7.2, 3.6, 6.1, 2.5, 2],
    [6.5, 3.2, 5.1, 2.0, 2],
    [6.4, 2.7, 5.3, 1.9, 2],
    [6.8, 3.0, 5.5, 2.1, 2],
    [5.7, 2.5, 5.0, 2.0, 2],
    [5.8, 2.8, 5.1, 2.4, 2],
    [6.4, 3.2, 5.3, 2.3, 2],
    [6.5, 3.0, 5.5, 1.8, 2],
    [7.7, 3.8, 6.7, 2.2, 2],
    [7.7, 2.6, 6.9, 2.3, 2],
    [6.0, 2.2, 5.0, 1.5, 2],
    [6.9, 3.2, 5.7, 2.3, 2],
    [5.6, 2.8, 4.9, 2.0, 2],
    [7.7, 2.8, 6.7, 2.0, 2],
    [6.3, 2.7, 4.9, 1.8, 2],
    [6.7, 3.3, 5.7, 2.1, 2],
    [7.2, 3.2, 6.0, 1.8, 2],
    [6.2, 2.8, 4.8, 1.8, 2],
    [6.1, 3.0, 4.9, 1.8, 2],
    [6.4, 2.8, 5.6, 2.1, 2],
    [7.2, 3.0, 5.8, 1.6, 2],
    [7.4, 2.8, 6.1, 1.9, 2],
    [7.9, 3.8, 6.4, 2.0, 2],
    [6.4, 2.8, 5.6, 2.2, 2],
    [6.3, 2.8, 5.1, 1.5, 2],
    [6.1, 2.6, 5.6, 1.4, 2],
    [7.7, 3.0, 6.1, 2.3, 2],
    [6.3, 3.4, 5.6, 2.4, 2],
    [6.4, 3.1, 5.5, 1.8, 2],
    [6.0, 3.0, 4.8, 1.8, 2],
    [6.9, 3.1, 5.4, 2.1, 2],
    [6.7, 3.1, 5.6, 2.4, 2],
    [6.9, 3.1, 5.1, 2.3, 2],
    [5.8, 2.7, 5.1, 1.9, 2],
    [6.8, 3.2, 5.9, 2.3, 2],
    [6.7, 3.3, 5.7, 2.5, 2],
    [6.7, 3.0, 5.2, 2.3, 2],
    [6.3, 2.5, 5.0, 1.9, 2],
    [6.5, 3.0, 5.2, 2.0, 2],
    [6.2, 3.4, 5.4, 2.3, 2],
    [5.9, 3.0, 5.1, 1.8, 2],
  ]
}