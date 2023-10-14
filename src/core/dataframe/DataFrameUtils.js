import * as dfd from 'danfojs'
import { E_PLOTS, LIST_PLOTS } from '@components/_context/Constants'

/**
 * @typedef {Object} ConfigLayoutPlots_t
 * @property {string} title
 * @property {string} x_axis
 * @property {string} y_axis
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
// E_PLOTS.LINE_CHARTS
// E_PLOTS.BAR_CHARTS
// E_PLOTS.SCATTER_PLOTS
// E_PLOTS.HISTOGRAMS
// E_PLOTS.PIE_CHARTS
// E_PLOTS.BOX_PLOTS
// E_PLOTS.VIOLIN_PLOTS
// E_PLOTS.TIME_SERIES_PLOTS

export function columnsTimeSeriesValidForIndex (_dataFrameLocal, _columns) {
  return _columns.filter((column) => {
    if (_dataFrameLocal.columns.includes(column))
      return _dataFrameLocal[column].unique().shape[0] === _dataFrameLocal.shape[0]
    return false
  })
}

export function isTimeSeriesDataFrameValidForIndex (_dataFrameLocal, _columns) {
  return columnsTimeSeriesValidForIndex(_dataFrameLocal, _columns).length > 0
}

export function listPlotsAvailable (_dataframeLocal, _columns) {
  const list_of_available_plots = []
  for (const plot_id of LIST_PLOTS) {
    let available = true
    if (E_PLOTS.TIME_SERIES_PLOTS === plot_id) {
      available = isTimeSeriesDataFrameValidForIndex(_dataframeLocal, _columns)
    }
    if (available) list_of_available_plots.push(plot_id)
  }
  return list_of_available_plots
}

/**
 * @typedef {Object} DataframePlotConfig_t
 * @property {ConfigLayoutPlots_t} LAYOUT
 * @property {ConfigTimeSeriesPlots_t} TIME_SERIES_PLOTS
 * @property {Array<string>} COLUMNS
 */

/**
 *
 * @param {dfd.DataFrame} dataframe
 * @param {DataframePlotConfig_t} dataframePlotConfig
 *
 * @return {TimeSeriesPlotsValidConfigResponse_t}
 */
export function timeSeriesPlotsValidConfig (dataframe, dataframePlotConfig) {
  // const notContainIndexInColumnsToShow = !dataframePlotConfig.COLUMNS.includes(dataframePlotConfig.TIME_SERIES_PLOTS.config.index)
  // const containsIndexInDataframe = dataframe.columns.includes(dataframePlotConfig.TIME_SERIES_PLOTS.config.index)
  // const isValidConfig_TimeSeries = notContainIndexInColumnsToShow && containsIndexInDataframe
  const isValidConfig_TimeSeries = isTimeSeriesDataFrameValidForIndex(dataframe, dataframePlotConfig.COLUMNS)

  const config_TimeSeries = { columns: dataframePlotConfig.COLUMNS }

  const index = { column: dataframePlotConfig.TIME_SERIES_PLOTS.config.index, drop: true }

  return { isValidConfig_TimeSeries, config_TimeSeries, index }
}

/**
 *
 * @param dataframe
 * @param dataframePlotConfig
 * @return {{config_ViolinPlots: {columns: string[]}, isValidConfig_ViolinPlots: boolean}}
 */
export function violinPlotsValidConfig (dataframe, dataframePlotConfig) {
  /** @type {string[]} */
  const valid_columns_to_display = (dataframePlotConfig.COLUMNS).filter((column) => (dataframe[column].dtype !== 'string'))
  const config_ViolinPlots = { columns: valid_columns_to_display }
  const isValidConfig_ViolinPlots = true

  return { isValidConfig_ViolinPlots, config_ViolinPlots }
}

export function pieChartsValidConfig (dataframe, dataframePlotConfig) {
  const isValidConfig_PieCharts = true
  const config_PieCharts = { labels: dataframePlotConfig.PIE_CHARTS.config.labels }
  return { isValidConfig_PieCharts, config_PieCharts }
}

export function lineChartsValidConfig (dataframe, dataframePlotConfig, columnsToShow) {
  const config_LineCharts = {
    columns: columnsToShow,
  }

  const isValidConfig_LineCharts = true
  return { isValidConfig_LineCharts, config_LineCharts }
}

export function TransformArrayToSeriesTensor (series) {
  return new dfd.Series(series).tensor
}

/**
 * @typedef {Object} EncoderObject_t
 * @property {'label-encoder' | 'one-hot-encoder'} type - El tipo de codificador, puede ser .
 * @property {dfd.LabelEncoder | dfd.OneHotEncoder} encoder
 */

/**
 * @typedef {Object.<string, EncoderObject_t>} EncoderMap_t
 */
export function DataFrameEncoder (dataframe, dataframe_transforms) {
  /**
   * @type {EncoderMap_t}
   */
  const encoders = {}
  for (const { column_transform, column_name } of dataframe_transforms) {
    switch (column_transform) {
      case 'label-encoder': {
        const encoder = new dfd.LabelEncoder()
        const _serie = dataframe[column_name]
        encoder.fit(_serie)
        encoders[column_name] = {
          type   : 'label-encoder',
          encoder: encoder,
        }
        break
      }
      case 'one-hot-encoder': {
        const encoder = new dfd.OneHotEncoder()
        const _serie = dataframe[column_name]
        encoder.fit(_serie)
        encoders[column_name] = {
          type   : 'label-encoder',
          encoder: encoder,
        }
        break
      }
      default: {
        break
      }
    }
  }
  return encoders
}

/**
 *
 * @param {EncoderMap_t} EncodersMap
 * @param {Object.<string, any>} ValuesMap
 * @param {string[]} columns - Es necesario para respetar el orden
 * @returns {number[]}
 * @constructor
 */
export function DataFrameApplyEncoders (EncodersMap, ValuesMap, columns) {
  const newValues = []
  for (const column_name of columns) {
    const prevValue = ValuesMap[column_name]
    if (EncodersMap.hasOwnProperty(column_name)) {
      const newValue = EncodersMap[column_name].encoder.transform([prevValue])[0]
      newValues.push(newValue)
    } else {
      newValues.push(prevValue)
    }
  }
  return newValues
}

/**
 * @typedef DataFrameColumnTransform_t
 * @property {string} column_name
 * @property {string} column_transform
 */
/**
 * @param {dfd.DataFrame} dataframe
 * @param {Array<DataFrameColumnTransform_t>} dataframe_transforms
 *
 * @return {dfd.DataFrame}
 */
export function DataFrameTransform (dataframe, dataframe_transforms) {
  for (const { column_transform, column_name } of dataframe_transforms) {
    switch (column_transform) {
      case 'replace_?_NaN': {
        dataframe.replace('?', NaN, { columns: [column_name], inplace: true })
        break
      }
      case 'fill_NaN_median': {
        const values = dataframe[column_name].mean()
        dataframe.fillNa(values, { columns: [column_name], inplace: true })
        break
      }
      case 'label-encoder': {
        const encode = new dfd.LabelEncoder()
        const _serie = dataframe[column_name]
        encode.fit(_serie)
        for (const [oldValue, newValue] of Object.entries(encode.$labels)) {
          dataframe.replace(oldValue, newValue.toString(), { columns: [column_name], inplace: true })
        }
        dataframe.asType(column_name, 'int32', { inplace: true })
        break
      }
      case 'drop_?': {
        /** @type {number[]} */
        let index_to_drop = dataframe.query(dataframe[column_name].eq('?')).index
        dataframe.drop({ index: index_to_drop, inplace: true })
        break
      }
      case 'dropNa': {
        dataframe.dropNa({ inplace: true, axis: 1 })
        break
      }
      case 'drop': {
        dataframe.drop({ columns: [column_name], inplace: true })
        break
      }
      default: {
        console.error('Error, option not valid', column_transform)
      }
    }
  }
  return dataframe
}

/**
 * @param {dfd.DataFrame} dataframe
 *
 * @return {any[][]}
 */
export function DataFrameIterRows (dataframe) {
  return dataframe.$data
}