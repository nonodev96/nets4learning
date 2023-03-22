/**
 * @typedef {Object} TYPE_MODEL_TABULAR_CLASSIFICATION
 * @property {string} KEY
 * @property {string} TITLE
 * @property {string} URL
 * @property {string} URL_MODEL
 * @property {JSX.Element} DESCRIPTION
 * @property {JSX.Element} HTML_EXAMPLE
 * @property {Array} [TABLE_HEADER]

 * @property {function():Promise<>} loadModel
 * @property {function(element: string, index: number, param: string):Promise|Promise<>|string|number} function_v_input

 * @property {Array} CLASSES
 * @property {number} NUM_CLASSES
 * @property {Array} [DATA_CLASSES]
 * @property {object} [DATA_OBJECT]
 * @property {Array<string>} [DATA_OBJECT_KEYS]
 * @property {Object} [DATA_DEFAULT]
 * @property {Array} [DATA_CLASSES_KEYS]

 * @property {Array<Object>} [LIST_EXAMPLES]
 * @property {Array<Object>} [FORM]
 * @property {Array} DATA
 *
 */
import { MODEL_CAR } from './MODEL_CAR'
import { MODEL_IRIS } from './MODEL_IRIS'
import { MODEL_LYMPHOGRAPHY } from './MODEL_LYMPHOGRAPHY.js'

export {
  MODEL_CAR,
  MODEL_IRIS,
  MODEL_LYMPHOGRAPHY
}