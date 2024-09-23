import * as dfd from 'danfojs'
import { E_PLOTS, LIST_PLOTS } from '@components/_context/CONSTANTS'
import { VERBOSE } from '@/CONSTANTS'
import * as _Types from '@core/types'

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
    if (_dataFrameLocal.columns.includes(column)) return _dataFrameLocal[column].unique().shape[0] === _dataFrameLocal.shape[0]
    return false
  })
}

/**
 * 
 * @param {dfd.DataFrame} _dataFrameLocal 
 * @param {Array<string>} _columns 
 * @returns {string[]}
 */
export function columnsScatterValidForIndex (_dataFrameLocal, _columns) {
  return _columns.filter((column) => {
    if (_dataFrameLocal.columns.includes(column)) return true
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
 *
 * @param {dfd.DataFrame} dataframe
 * @param {_Types.DataframePlotConfig_t} dataframePlotConfig
 *
 * @return {_Types.TimeSeriesPlotsValidConfigResponse_t}
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
 *
 * @param {dfd.DataFrame} dataframe
 * @param {Array<_Types.DataFrameColumnTransform_t>} dataframe_transforms
 * @return {_Types.EncoderMap_t}
 */
export function DataFrameEncoder (dataframe, dataframe_transforms) {
  /** @type {_Types.EncoderMap_t} */
  const encoder_map = {}
  console.log({dataframe, dataframe_transforms})
  for (const { column_name, column_transform } of dataframe_transforms) {
    switch (column_transform) {
      case 'label-encoder': {
        const encoder = new dfd.LabelEncoder()
        const serie = dataframe[column_name]
        encoder.fit(serie)
        encoder_map[column_name] = {
          type   : 'label-encoder',
          encoder: encoder,
        }
        break
      }
      case 'one-hot-encoder': {
        const encoder = new dfd.OneHotEncoder()
        const serie = dataframe[column_name]
        encoder.fit(serie)
        encoder_map[column_name] = {
          type   : 'label-encoder',
          encoder: encoder,
        }
        break
      }
      default: {
        console.warn('Error, option not valid', { column_transform, column_name })
        break
      }
    }
  }
  return encoder_map
}

/**
 *
 * @param {_Types.EncoderMap_t}         encoders_map
 * @param {Object.<string, any>} values_map
 * @param {string[]}             column_name_list
 * @returns {number[]}
 */
export function DataFrameApplyEncoders (encoders_map, values_map, column_name_list) {
  const new_values = []
  for (const column_name of column_name_list) {
    const prev_value = values_map[column_name]
    if (column_name in encoders_map) {
      const new_value = encoders_map[column_name].encoder.transform([prev_value])[0]
      new_values.push(new_value)
    } else {
      new_values.push(prev_value)
    }
  }
  return new_values
}

/**
 *
 * @param {_Types.EncoderMap_t} encoders_map
 * @param {Array<string|number>} input_data
 * @param {string[]} column_name_list
 * @return {number[]}
 */
export function DataFrameApplyEncodersVector (encoders_map, input_data, column_name_list) {
  const new_input_vector = []
  for (const [column_index, column_name] of column_name_list.entries()) {
    const prev_value = input_data[column_index]
    if (column_name in encoders_map) {
      const new_value = encoders_map[column_name].encoder.transform([prev_value])[0]
      new_input_vector.push(new_value)
    } else {
      new_input_vector.push(prev_value)
    }
  }
  return new_input_vector
}

/**
 * @param {dfd.DataFrame} dataframe
 * @param {Array<_Types.DataFrameColumnTransform_t>} dataframe_transforms
 * @return {dfd.DataFrame}
 */
export function DataFrameTransform (dataframe, dataframe_transforms) {
  const dataframe_transform = dataframe.copy()
  for (const { column_name, column_transform, match } of dataframe_transforms) {
    switch (column_transform) {
      case 'one-hot-encoder': {
        const oneHotEncoder = new dfd.OneHotEncoder()
        const encoder = oneHotEncoder.fit(dataframe_transform[column_name])
        const new_serie = encoder.transform(dataframe_transform[column_name].values)
        dataframe_transform.addColumn(column_name, new_serie, { inplace: true })
        break
      }
      case 'label-encoder': {
        const labelEncoder = new dfd.LabelEncoder()
        const encoder = labelEncoder.fit(dataframe_transform[column_name])
        const new_serie = encoder.transform(dataframe_transform[column_name].values)
        dataframe_transform.addColumn(column_name, new_serie, { inplace: true })
        dataframe_transform.asType(column_name, 'int32', { inplace: true })
        break
      }
      case 'int32': {
        break
      }
      case 'float32': {
        break
      }
      case 'string': {
        break
      }
      case 'drop_?': {
        console.debug('TODO')
        break
      }
      case 'replace_?_NaN': {
        if (VERBOSE) console.debug(`replace_${column_name}_?_NaN`, { _dataframe: dataframe_transform, column_name, c: dataframe_transform[column_name] })
        const new_serie = dataframe_transform[column_name].apply((val) => {
          if (val === '?') {
            if (VERBOSE) console.debug('FOUND')
            return NaN
          }
          return val
        })
        dataframe_transform.addColumn(column_name, new_serie, { inplace: true })
        break
      }
      case 'replace_<match>_NaN': {
        if (VERBOSE) console.debug(`replace_${column_name}_${match}_NaN`, { _dataframe: dataframe_transform, column_name, c: dataframe_transform[column_name] })
        const new_serie = dataframe_transform[column_name].apply((val) => {
          if (val === match) {
            return Number.NaN
          }
          return val
        })
        dataframe_transform.addColumn(column_name, new_serie, { inplace: true })
        break
      }
      case 'drop': {
        dataframe_transform.drop({ columns: [column_name], inplace: true })
        break
      }
      case 'dropNa': {
        dataframe_transform.dropNa({ axis: 1, inplace: true })
        break
      }
      default: {
        console.warn('Error, option not valid', { column_transform, column_name })
      }
    }
  }
  return dataframe_transform
}

/**
 *
 * @param {dfd.DataFrame} dataframe
 * @return {dfd.DataFrame}
 */
export function DataFrameDeepCopy (dataframe) {
  const dataframe_deep_copy_JSON = dfd.toJSON(dataframe, { format: 'row' })
  return new dfd.DataFrame(dataframe_deep_copy_JSON)
}

/**
 * @param {dfd.DataFrame} dataframe
 * @return {Array<Array<string|number|boolean>>}
 */
export function DataFrameIterRows (dataframe) {
  // @ts-ignore
  return dataframe.$data
}



/**
 * @param {dfd.DataFrame} dataframe
 * @param {_Types.DataFrameColumnTransform_t[]} dataframe_transforms
 * @return {{dataframe_processed: dfd.DataFrame, encoder_map: _Types.EncoderMap_t}}
 */
export function DataFrameTransformAndEncoder (dataframe, dataframe_transforms) {
  const dataframe_processed = dataframe.copy()
  /**
   * @type {_Types.EncoderMap_t}
   */
  const encoder_map = {}
  for (const { column_name, column_transform, match } of dataframe_transforms) {
    switch (column_transform) {
      case 'one-hot-encoder': {
        const oneHotEncoder = new dfd.OneHotEncoder()
        const encoder = oneHotEncoder.fit(dataframe_processed[column_name])
        const new_serie = encoder.transform(dataframe_processed[column_name].values)
        dataframe_processed.addColumn(column_name, new_serie, { inplace: true })
        encoder_map[column_name] = {
          type   : 'one-hot-encoder',
          encoder: encoder,
        }
        break
      }
      case 'label-encoder': {
        const labelEncoder = new dfd.LabelEncoder()
        const encoder = labelEncoder.fit(dataframe_processed[column_name])
        const new_serie = encoder.transform(dataframe_processed[column_name].values)
        dataframe_processed.addColumn(column_name, new_serie, { inplace: true })
        dataframe_processed.asType(column_name, 'int32', { inplace: true })
        encoder_map[column_name] = {
          type   : 'label-encoder',
          encoder: encoder,
        }
        break
      }
      case 'int32': {
        break
      }
      case 'float32': {
        break
      }
      case 'string': {
        break
      }
      case 'drop_?': {
        console.debug('TODO')
        break
      }
      case 'replace_?_NaN': {
        if (VERBOSE) console.debug(`replace_${column_name}_?_NaN`, { _dataframe: dataframe_processed, column_name, c: dataframe_processed[column_name] })
        const new_serie = dataframe_processed[column_name].apply((val) => {
          if (val === '?') {
            if (VERBOSE) console.debug('FOUND')
            return NaN
          }
          return val
        })
        dataframe_processed.addColumn(column_name, new_serie, { inplace: true })
        break
      }
      case 'replace_<match>_NaN': {
        if (VERBOSE) console.debug(`replace_${column_name}_${match}_NaN`, { _dataframe: dataframe_processed, column_name, c: dataframe_processed[column_name] })
        const new_serie = dataframe_processed[column_name].apply((val) => {
          if (val === match) {
            return Number.NaN
          }
          return val
        })
        dataframe_processed.addColumn(column_name, new_serie, { inplace: true })
        break
      }
      case 'drop': {
        dataframe_processed.drop({ columns: [column_name], inplace: true })
        break
      }
      case 'dropNa': {
        dataframe_processed.dropNa({ axis: 1, inplace: true })
        break
      }
      default: {
        console.warn('Error, option not valid', { column_transform, column_name })
      }
    }
  }
  return { dataframe_processed: dataframe_processed, encoder_map: encoder_map }
}

/**
 * 
 * @param {dfd.DataFrame} dataframe 
 * @param {number} row 
 * @param {number|string} column_name 
 * @param {number|string} value 
 * @returns 
 */
export function DataFrameInstanceSetCellValue(dataframe, row, column_name, value) {
  const oldValuesRows = dataframe.loc({rows: [row]}).values[0]
  
  const columnIndex = dataframe.columns.indexOf(column_name)

  const newValuesRows = Array.from(oldValuesRows)
  newValuesRows[columnIndex] = (value)

  const df_void = new dfd.DataFrame([], { columns: dataframe.columns, dtypes: dataframe.dtypes })
  let new_df = df_void.append(newValuesRows, [0])

  return new_df
}