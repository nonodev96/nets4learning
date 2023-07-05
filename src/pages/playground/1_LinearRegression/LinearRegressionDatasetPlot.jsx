import React, { useContext, useEffect } from 'react'
import LinearRegressionContext from '../../../context/LinearRegressionContext'
import DataFramePlot from '../../../components/dataframe/DataFramePlot'
import { DataFramePlotProvider } from '../../../components/_context/DataFramePlotContext'

export default function LinearRegressionDatasetPlot () {

  const { datasetLocal } = useContext(LinearRegressionContext)

  useEffect(() => {
    // console.debug("useEffect[datasetLocal]")
  }, [datasetLocal])

  console.log('render LinearRegressionDatasetPlot')
  return <>
    <DataFramePlotProvider>
      <DataFramePlot dataframe={datasetLocal.dataframe_processed} />
    </DataFramePlotProvider>
  </>
}