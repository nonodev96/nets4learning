import * as dfd from 'danfojs'

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
 * @typedef {Object} DataframePlotConfig_t
 * @property {ConfigLayoutPlots_t} LAYOUT
 * @property {ConfigTimeSeriesPlots_t} TIME_SERIES_PLOTS
 * @property {Array<string>} COLUMNS
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

/**
 *
 * @param {dfd.DataFrame} dataframe
 * @param {DataframePlotConfig_t} dataframePlotConfig
 * @param {Array<string>} columnsToShow
 *
 * @return {TimeSeriesPlotsValidConfigResponse_t}
 */
export function timeSeriesPlotsValidConfig (dataframe, dataframePlotConfig, columnsToShow) {
  const notContainIndexInColumnsToShow = !dataframePlotConfig.COLUMNS.includes(dataframePlotConfig.TIME_SERIES_PLOTS.config.index)
  const containsIndexInDataframe = dataframe.columns.includes(dataframePlotConfig.TIME_SERIES_PLOTS.config.index)
  const isValidConfig_TimeSeries = notContainIndexInColumnsToShow && containsIndexInDataframe

  const config_TimeSeries = { columns: columnsToShow }

  const index = { column: dataframePlotConfig.TIME_SERIES_PLOTS.config.index, drop: true }

  return { isValidConfig_TimeSeries, config_TimeSeries, index }
}

export function pieChartsValidConfig (dataframe, dataframePlotConfig, columnsToShow) {
  const isValidConfig_PieCharts = true
  const config_PieCharts = { labels: dataframePlotConfig.PIE_CHARTS.config.labels }
  return { isValidConfig_PieCharts, config_PieCharts }
}

export function lineChartsValidConfig (dataframe, dataframePlotConfig, columnsToShow) {
  const config_LineCharts = {
    columns: columnsToShow
  }

  const isValidConfig_LineCharts = true
  return { isValidConfig_LineCharts, config_LineCharts }
}

export function TransformArrayToSeriesTensor (series) {
  return new dfd.Series(series).tensor
}

/**
 * @param {dfd.DataFrame} dataframe
 * @param {Array<{column_name, column_transform}>} dataframe_transforms
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
      case 'dropNa': {
        dataframe.dropNa({ columns: [column_name], inplace: true })
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