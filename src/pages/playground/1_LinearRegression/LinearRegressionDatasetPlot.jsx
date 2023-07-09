import React, { useContext, useEffect } from 'react'

import DataFramePlot from '@components/dataframe/DataFramePlot'

import LinearRegressionContext from '@context/LinearRegressionContext'
import { DataFramePlotProvider } from '@components/_context/DataFramePlotContext'

export default function LinearRegressionDatasetPlot () {

  const { datasetLocal } = useContext(LinearRegressionContext)

  useEffect(() => {
    // console.debug("useEffect[datasetLocal]")
  }, [datasetLocal])

  console.debug('render LinearRegressionDatasetPlot')
  return <>
    <DataFramePlotProvider>
      <DataFramePlot dataframe={datasetLocal.dataframe_processed} />
    </DataFramePlotProvider>
  </>
}