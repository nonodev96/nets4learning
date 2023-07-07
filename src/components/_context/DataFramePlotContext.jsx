import { createContext, useState } from 'react'
import * as dfd from 'danfojs'
import { DEFAULT_DATAFRAME_PLOT_CONFIG } from './Constants'

const DataFramePlotContext = createContext({})

export function DataFramePlotProvider ({ children }) {

  const [dataFrameLocal, setDataFrameLocal] = useState(new dfd.DataFrame())
  const [dataframePlotConfig, setDataframePlotConfig] = useState(DEFAULT_DATAFRAME_PLOT_CONFIG)
  const [showDescription, setShowDescription] = useState(false)
  const [showOptions, setShowOptions] = useState(false)

  const columnsValidForIndex = () => {
    return dataFrameLocal.columns.filter((column) => {
      return dataFrameLocal[column].unique().shape[0] === dataFrameLocal.shape[0]
    })
  }

  const isDataFrameValidForIndex = () => {
    return columnsValidForIndex().length > 0
  }

  return (<DataFramePlotContext.Provider value={{
    dataFrameLocal, setDataFrameLocal,

    dataframePlotConfig, setDataframePlotConfig,

    showDescription, setShowDescription,

    showOptions, setShowOptions,

    columnsValidForIndex, isDataFrameValidForIndex,
  }}>
    {children}
  </DataFramePlotContext.Provider>)
}

export default DataFramePlotContext