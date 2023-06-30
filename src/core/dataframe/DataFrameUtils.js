import * as dfd from "danfojs"

/**
 * @typedef {Object} ConfigTimeSeriesPlots_t
 * @property {string} title
 * @property {string} x_axis
 * @property {string} y_axis
 */

/**
 * @typedef {Object} DataframePlotConfig_t
 * @property {ConfigTimeSeriesPlots_t} TIME_SERIES_PLOTS
 * @property {Array<string>} COLUMNS
 */

/**
 * @typedef {Object} TimeSeriesPlotsValidConfigResponse_t
 * @property {boolean} isValidConfig
 * @property {Object} config
 * @property {Object} layout
 */

/**
 * @typedef {Object} TimeSeriesPlotsValidConfigResponse_t
 * @property {boolean} isValidConfig
 * @property {Object} config
 * @property {Object} layout
 * @property {Object} index
 */

/**
 *
 * @param {dfd.DataFrame} dataframe
 * @param {DataframePlotConfig_t} dataframePlotConfig
 * @param {Array<string>} columnsToShow
 *
 * @return {TimeSeriesPlotsValidConfigResponse_t}
 */
export function timeSeriesPlotsValidConfig(dataframe, dataframePlotConfig, columnsToShow) {
  const layout = {
    title: dataframePlotConfig.TIME_SERIES_PLOTS.title,
    xaxis: { title: dataframePlotConfig.TIME_SERIES_PLOTS.x_axis, },
    yaxis: { title: dataframePlotConfig.TIME_SERIES_PLOTS.y_axis, },
  }
  const config = { columns: columnsToShow }
  const index = { column: dataframePlotConfig.TIME_SERIES_PLOTS.index, drop: true }

  const notContainIndexInColumnsToShow = !dataframePlotConfig.COLUMNS.includes(dataframePlotConfig.TIME_SERIES_PLOTS.index)
  const containsIndexInDataframe = dataframe.columns.includes(dataframePlotConfig.TIME_SERIES_PLOTS.index);

  const isValidConfig = notContainIndexInColumnsToShow && containsIndexInDataframe
  return { isValidConfig, config, layout, index }
}