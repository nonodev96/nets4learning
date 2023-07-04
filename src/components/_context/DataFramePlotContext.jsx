import { createContext, useState } from "react";
import * as dfd from "danfojs"

const DataFramePlotContext = createContext({})

export function DataFramePlotProvider({ children }) {

  // @formatter:off
  const E_PLOTS = {
    // TODO
    TIME_SERIES_PLOTS: "TimeSeries Plots",
    VIOLIN_PLOTS     : "Violin Plots",
    BOX_PLOTS        : "Box Plots",
    PIE_CHARTS       : "Pie Charts // TODO",
    HISTOGRAMS       : "Histograms",
    SCATTER_PLOTS    : "Scatter Plots // TODO",
    BAR_CHARTS       : "Bar Charts",
    LINE_CHARTS      : "Line Charts // TODO"
  }
  const LIST_PLOTS = Object.entries(E_PLOTS).map(([_key, value]) => value)

  const DEFAULT_PLOT = E_PLOTS.BOX_PLOTS
  const DEFAULT_DATAFRAME_PLOT_CONFIG = {
    PLOT_ENABLE      : DEFAULT_PLOT,
    LAYOUT           : { title: "", x_axis: "", y_axis: "" },
    COLUMNS          : [],

    TIME_SERIES_PLOTS: { config: { index: "" } },
    VIOLIN_PLOTS     : {},
    BOX_PLOTS        : {},
    PIE_CHARTS       : {},
    HISTOGRAMS       : {},
    SCATTER_PLOTS    : {},
    BAR_CHARTS       : {},
    LINE_CHARTS      : {},
    _DEFAULT_        : { config: { x: "", y: "" } }
  }
  // @formatter:on

  const [dataframePlotConfig, setDataframePlotConfig] = useState(DEFAULT_DATAFRAME_PLOT_CONFIG)
  const [showDescription, setShowDescription] = useState(false)
  const [showOptions, setShowOptions] = useState(false)
  const [dataFrameLocal, setDataFrameLocal] = useState(new dfd.DataFrame())

  const columnsValidForIndex = () => {
    return dataFrameLocal.columns.filter((column) => {
      return dataFrameLocal[column].unique().shape[0] === dataFrameLocal.shape[0];
    })
  }

  const isDataFrameValidForIndex = () => {
    return columnsValidForIndex().length > 0
  }

  return (
    <DataFramePlotContext.Provider value={{
      dataframePlotConfig,
      setDataframePlotConfig,

      showDescription,
      setShowDescription,

      showOptions,
      setShowOptions,

      dataFrameLocal,
      setDataFrameLocal,

      E_PLOTS,
      LIST_PLOTS,
      DEFAULT_DATAFRAME_PLOT_CONFIG,

      columnsValidForIndex,
      isDataFrameValidForIndex,
    }}>
      {children}
    </DataFramePlotContext.Provider>
  )
}

export default DataFramePlotContext