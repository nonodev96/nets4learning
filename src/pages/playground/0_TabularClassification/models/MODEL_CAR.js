import * as tf from '@tensorflow/tfjs'
import { Trans } from 'react-i18next'
import * as dfd from 'danfojs'
import I_MODEL_TABULAR_CLASSIFICATION from './_model'
import * as DataFrameUtils from '@core/dataframe/DataFrameUtils'

export class MODEL_CAR extends I_MODEL_TABULAR_CLASSIFICATION {

  static KEY = 'CAR'
  static URL = 'https://archive.ics.uci.edu/ml/datasets/Car+Evaluation'
  static URL_MODEL = '/public/models/classification/car/my-model-car.json'
  TITLE = 'datasets-models.0-tabular-classification.car.title'
  i18n_TITLE = 'datasets-models.0-tabular-classification.car.title'

  TABLE_HEADER = [
    '00-tc.car.buying',
    '00-tc.car.maint',
    '00-tc.car.doors',
    '00-tc.car.persons',
    '00-tc.car.lug_boot',
    '00-tc.car.safety',
  ]
  CLASSES = [
    '00-tc.car.unacc',
    '00-tc.car.acc',
    '00-tc.car.good',
    '00-tc.car.vgood',
  ]
  NUM_CLASSES = 4
  // @formatter:off
  DATA_CLASSES     = [
    ["vhigh", "high", "med", "low"   ],
    ["vhigh", "high", "med", "low"   ],
    ["2",     "3",    "4",   "5more" ],
    ["2",     "4",    "more"         ],
    ["small", "med",  "big"          ],
    ["low",   "med",  "high"         ]
  ]
  DATA_OBJECT      = {
    buying  : ["vhigh", "high", "med", "low"   ],
    maint   : ["vhigh", "high", "med", "low"   ],
    doors   : ["2",     "3",    "4",   "5more" ],
    persons : ["2",     "4",    "more"         ],
    lug_boot: ["small", "med",  "big"          ],
    safety  : ["low",   "med",  "high"         ]
  }
  DATA_OBJECT_KEYS = [ "buying", "maint", "doors", "persons", "lug_boot", "safety" ]
  DATA_DEFAULT = {
    buying  : "vhigh",
    maint   : "vhigh",
    doors   : "2",
    persons : "2",
    lug_boot: "small",
    safety  : "low",
  }
  DATA_CLASSES_KEYS = [
    "Precio de compra",
    "Precio del mantenimiento",
    "Número de puertas",
    "Capacidad de personas",
    "Tamaño del maletero",
    "Seguridad estimada"
  ]
  LIST_EXAMPLES_RESULTS = [
    "unacc",
    "acc",
    "good",
    "vgood"
  ]
  LIST_EXAMPLES = [
    { buying: "vhigh", maint: "vhigh", doors: "2",     persons: "2",    lug_boot: "small", safety: "low" },
    { buying: "low",   maint: "vhigh", doors: "4",     persons: "2",    lug_boot: "small", safety: "low" },
    { buying: "med",   maint: "low",   doors: "5more", persons: "more", lug_boot: "med",   safety: "med" },
    { buying: "low",   maint: "low",   doors: "5more", persons: "more", lug_boot: "big",   safety: "high" }
  ]
  FORM = [
    { type: "label-encoder", name: "buying",   options: [{ value: "vhigh", text: "vhigh" }, { value: "high", text: "high" }, { value: "med",  text: "med"  }, { value: "low",   text: "low"   },] },
    { type: "label-encoder", name: "maint",    options: [{ value: "vhigh", text: "vhigh" }, { value: "high", text: "high" }, { value: "med",  text: "med"  }, { value: "low",   text: "low"   },] },
    { type: "label-encoder", name: "doors",    options: [{ value: "2",     text: "2"     }, { value: "3",    text: "3"    }, { value: "4",    text: "4"    }, { value: "5more", text: "5more" },] },
    { type: "label-encoder", name: "persons",  options: [{ value: "2",     text: "2"     }, { value: "4",    text: "4"    }, { value: "more", text: "more" },] },
    { type: "label-encoder", name: "lug_boot", options: [{ value: "small", text: "small" }, { value: "med", text: "med"   }, { value: "big",  text: "big"  },] },
    { type: "label-encoder", name: "safety",   options: [{ value: "low",   text: "low"   }, { value: "med", text: "med"   }, { value: "high", text: "high" },] },
  ]
  // @formatter:on

  DESCRIPTION () {
    const prefix = 'datasets-models.0-tabular-classification.car.description.'
    return <>
      <p><Trans i18nKey={prefix + 'text-1'} /></p>
      <p>
        <Trans i18nKey={prefix + 'text-2'}
               components={{
                 link1: <a href={'https://archive.ics.uci.edu/ml/datasets/Car+Evaluation'} target={'_blank'} rel="noreferrer">link</a>,
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
        </ol>
      </details>
      <details>
        <summary><Trans i18nKey={prefix + 'details-2.title'} /></summary>
        <p><Trans i18nKey={prefix + 'details-2.text-1'} /></p>
        <ol>
          <li><Trans i18nKey={prefix + 'details-2.list.1'} /></li>
          <li><Trans i18nKey={prefix + 'details-2.list.2'} /></li>
          <li><Trans i18nKey={prefix + 'details-2.list.3'} /></li>
          <li><Trans i18nKey={prefix + 'details-2.list.4'} /></li>
          <li><Trans i18nKey={prefix + 'details-2.list.5'} /></li>
        </ol>
      </details>
      <details>
        <summary><Trans i18nKey={prefix + 'details-3.title'} /></summary>
        <p><Trans i18nKey={prefix + 'details-3.text-1'} /></p>
        <ol>
          <li><Trans i18nKey={prefix + 'details-3.list.1'} /></li>
          <li><Trans i18nKey={prefix + 'details-3.list.2'} /></li>
          <li><Trans i18nKey={prefix + 'details-3.list.3'} /></li>
          <li><Trans i18nKey={prefix + 'details-3.list.4'} /></li>
        </ol>
      </details>
      <details>
        <summary><Trans i18nKey={prefix + 'details-4.title'} /></summary>
        <ol>
          <li>
            <a href="https://archive.ics.uci.edu/ml/datasets/Car+Evaluation" target="_blank" rel="noreferrer">
              <Trans i18nKey={prefix + 'details-4.list.1'} />
            </a>
          </li>
        </ol>
      </details>
      <details>
        <summary>BibTeX</summary>
        <pre>
{`
@misc{misc_car_evaluation_19,
  author       = {Bohanec,Marko},
  title        = {{Car Evaluation}},
  year         = {1997},
  howpublished = {UCI Machine Learning Repository},
  note         = {{DOI}: https://doi.org/10.24432/C5JP48}
}
`}
        </pre>
      </details>
    </>
  }

  HTML_EXAMPLE () {
    const prefix = 'datasets-models.0-tabular-classification.car.html-example.'
    return <>
      <p>
        <Trans i18nKey={prefix + 'text'} /><br />
        <b><Trans i18nKey={prefix + 'items'} /></b>
      </p>
    </>
  }

  async DATASETS () {
    const dataset_path = process.env.REACT_APP_PATH + '/models/00-tabular-classification/car/'
    const dataframe_original_1 = await dfd.readCSV(dataset_path + 'car.csv')
    let dataframe_processed_1 = await dfd.readCSV(dataset_path + 'car.csv')
    const dataset_transforms_1 = [
      //Buying,Maint,Doors,Persons,Lug boot,Safety,Result
      { column_name: 'Buying', column_transform: 'label-encoder' },
      { column_name: 'Maint', column_transform: 'label-encoder' },
      { column_name: 'Doors', column_transform: 'label-encoder' },
      { column_name: 'Persons', column_transform: 'label-encoder' },
      { column_name: 'Lug boot', column_transform: 'label-encoder' },
      { column_name: 'Safety', column_transform: 'label-encoder' },
      { column_name: 'Result', column_transform: 'label-encoder' },
    ]
    const encoders = DataFrameUtils.DataFrameEncoder(dataframe_original_1, dataset_transforms_1)
    dataframe_processed_1 = DataFrameUtils.DataFrameTransform(dataframe_processed_1, dataset_transforms_1)

    const data_processed = DataFrameUtils.DataFrameIterRows(dataframe_processed_1)
    const data_original = DataFrameUtils.DataFrameIterRows(dataframe_original_1)

    return [{
      missing_values   : false,
      missing_value_key: '',
      data_original    : data_original,
      data_processed   : data_processed,
      classes          : ['unacc', 'acc', 'good', 'vgood'],
      encoders         : encoders,
      attributes       : [
        // @formatter:off
        { "type": "label-encoder", "index_column": 0, "name": "Buying",   "options": [{ "value": "vhigh", "text": "vhigh" }, { "value": "high", "text": "high" }, { "value": "med",  "text": "med"  }, { "value": "low",   "text": "low"   } ] },
        { "type": "label-encoder", "index_column": 1, "name": "Maint",    "options": [{ "value": "vhigh", "text": "vhigh" }, { "value": "high", "text": "high" }, { "value": "med",  "text": "med"  }, { "value": "low",   "text": "low"   } ] },
        { "type": "label-encoder", "index_column": 2, "name": "Doors",    "options": [{ "value": "2",     "text": "2"     }, { "value": "3",    "text": "3"    }, { "value": "4",    "text": "4"    }, { "value": "5more", "text": "5more" } ] },
        { "type": "label-encoder", "index_column": 3, "name": "Persons",  "options": [{ "value": "2",     "text": "2"     }, { "value": "4",    "text": "4"    }, { "value": "more", "text": "more" } ] },
        { "type": "label-encoder", "index_column": 4, "name": "Lug_boot", "options": [{ "value": "small", "text": "small" }, { "value": "med", "text": "med"   }, { "value": "big",  "text": "big"  } ] },
        { "type": "label-encoder", "index_column": 5, "name": "Safety",   "options": [{ "value": "low",   "text": "low"   }, { "value": "med", "text": "med"   }, { "value": "high", "text": "high" } ] }
        // @formatter:on
      ],

      is_dataset_upload   : false,
      path                : dataset_path,
      info                : 'car.names',
      csv                 : 'car.csv',
      dataframe_original  : dataframe_original_1,
      dataframe_processed : dataframe_processed_1,
      dataset_transforms  : dataset_transforms_1,
      is_dataset_processed: true
    }]
  }

  DEFAULT_LAYERS () {
    return [
      { units: 10, activation: 'sigmoid' },
      { units: 4, activation: 'softmax' },
    ]
  }

  async LOAD_GRAPH_MODEL (onProgress) {
    return await tf.loadLayersModel(process.env.REACT_APP_PATH + '/models/00-tabular-classification/car/my-model-car.json', {
      onProgress: onProgress
    })
  }

  async function_v_input (element, index, param = '') {
    return this.DATA_CLASSES[index].findIndex((data_class) => data_class === element)
  }
}