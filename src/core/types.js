import * as _dfd from 'danfojs'
import _I_MODEL_TABULAR_CLASSIFICATION from '@/pages/playground/0_TabularClassification/models/_model'
import _I_MODEL_LINEAR_REGRESSION from '@/pages/playground/1_LinearRegression/models/_model'
import _I_MODEL_OBJECT_DETECTION from '@/pages/playground/2_ObjectDetection/models/_model'
import _I_MODEL_IMAGE_CLASSIFICATION from '@/pages/playground/3_ImageClassification/models/_model'

/**
 * Extracts the resolved type of a promise-returning function.
 * 
 * @template T - A function type that returns a Promise.
 * @typedef {T extends (...args: any) => Promise<infer R> ? R : any} AsyncReturnType
 */

/**
 * @typedef {Object} DataframePlotConfig_t
 * @property {ConfigLayoutPlots_t} LAYOUT
 * @property {ConfigTimeSeriesPlots_t} TIME_SERIES_PLOTS
 * @property {Array<string>} COLUMNS
 */

/**
 * @typedef {_dfd.DataFrame} DataFrame_t
 * @typedef {_dfd.Series} Series_t
 * @typedef {_dfd.MinMaxScaler} MinMaxScaler_t
 * @typedef {_dfd.StandardScaler} StandardScaler_t
 * @typedef {_dfd.LabelEncoder} LabelEncoder_t
 */

/**
 * @typedef {_I_MODEL_LINEAR_REGRESSION} I_MODEL_LINEAR_REGRESSION_t
 * @typedef {_I_MODEL_TABULAR_CLASSIFICATION} I_MODEL_TABULAR_CLASSIFICATION_t
 * @typedef {_I_MODEL_OBJECT_DETECTION} I_MODEL_OBJECT_DETECTION_t
 * @typedef {_I_MODEL_IMAGE_CLASSIFICATION} I_MODEL_IMAGE_CLASSIFICATION_t
 */



/**
 * @typedef {Object} File_t
 * @property {string} title
 * @property {string} url
 */

/**
 * @typedef {Object} ErrorTensorShape_match_groups_t
 * @property {string} shape
 * @property {string} size
 * @property {string} tensor_shape_0
 * @property {string} tensor_shape_1
 * @property {string} target_shape
 * @property {string} target_tensor_shape_0
 * @property {string} target_tensor_shape_1
 */

/**
 * @typedef {Object} ConfigTimeSeriesPlots_t
 * @property {{config: index}} config
 */

/**
 * @typedef {Object} TimeSeriesPlotsValidConfigResponse_t
 * @property {boolean} isValidConfig_TimeSeries
 * @property {{columns: Array<string>}} config_TimeSeries
 * @property {{column, drop: boolean}} index
 */

/**
 * @typedef {'int32'|'float32'|'string'|'boolean'} ColumnType_t
 */

/**
 * @typedef {Object} DataFrameColumnType_t
 * @property {string} column_name
 * @property {ColumnType_t} column_type
 */

/**
 * @typedef {Object} DataFrameColumnTypeEnable_t
 * @property {string} column_name
 * @property {ColumnType_t} column_type
 * @property {boolean} column_enable
 */

/**
 * @typedef {'one-hot-encoder'|'label-encoder'|'int32'|'float32'|'string'|'replace_<match>_NaN'|'replace_?_NaN'|'drop_?'|'drop'|'dropNa'|'ignored'} ColumnTransform_t
 */

/**
 * @typedef DataFrameColumnTransform_t
 * @property {string} column_name
 * @property {ColumnTransform_t} column_transform
 * @property {string} [match] - optional property
 */

/**
 * @typedef DataFrameColumnTransformEnable_t
 * @property {string} column_name
 * @property {ColumnTransform_t} column_transform
 * @property {boolean} column_enable
 * @property {string} [match] - optional property
 */

/**
 *
 * @typedef DataframePlotConfig_t
 * @property {string} PLOT_ENABLE
 * @property {string[]} LIST_OF_AVAILABLE_PLOTS
 * @property {{y_axis: string, x_axis: string, title: string}} LAYOUT,
 * @property {string[]} COLUMNS
 *
 * @property {any} BAR_CHARTS
 * @property {any} BOX_PLOTS
 * @property {any} HISTOGRAMS
 * @property {any} LINE_CHARTS
 * @property {{config: {labels: string}}} PIE_CHARTS
 * @property {any} SCATTER_PLOTS
 * @property {{config: {index: string}}} TIME_SERIES_PLOTS
 * @property {any} VIOLIN_PLOTS
 * @property {{config: {x: string, y: string}}} _DEFAULT_
 */

/**
 * @typedef CustomPreprocessDataset_t
 * @property {string} column_name
 * @property {string} column_transform
 */

/**
 * @typedef {Object} ConfigLayoutPlots_t
 * @property {string} title
 * @property {string} x_axis
 * @property {string} y_axis
 */

/**
 * @typedef {Object} DataFrameColumnTypeTransform_t
 * @property {'drop'|'ignore'|'int32'|'float32'|'label-encoder'} type
 * @property {string} name
 * @property {Array<{value: string, text: string}>} options
 */

/**
 * @typedef {Object} EncoderObject_t
 * @property {'label-encoder' | 'one-hot-encoder'} type
 * @property {_dfd.LabelEncoder | _dfd.OneHotEncoder} encoder
 */

/**
 * @typedef {Object.<string, EncoderObject_t>} EncoderMap_t
 */

/**
 * @typedef {Object} DataProcessed_t
 * @property {boolean} missing_values
 * @property {string} column_name_target
 * @property {string[]} classes
 * @property {EncoderMap_t} encoders
 * @property {Array<DataFrameColumnTypeTransform_t>} attributes
 * @property {MinMaxScaler_t|StandardScaler_t} scaler
 * @property {DataFrame_t} X
 * @property {DataFrame_t|Series_t} y
 */

/**
 * @typedef {Object} DatasetProcessed_t
 * @property {boolean} is_dataset_processed
 * @property {boolean} is_dataset_upload
 * @property {string} path
 * @property {string} info
 * @property {string} container_info
 * @property {string} csv
 * @property {Array<DataFrameColumnTransform_t>} dataset_transforms
 * @property {DataFrame_t} dataframe_original
 * @property {DataFrame_t} dataframe_processed
 * @property {DataProcessed_t} [data_processed] - Data processed 
 */
