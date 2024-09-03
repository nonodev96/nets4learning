import React, { useContext } from 'react'

import { VERBOSE } from '@/CONSTANTS'
import LinearRegressionContext from '@context/LinearRegressionContext'
import { DataFramePlotProvider } from '@components/_context/DataFramePlotContext'
import DataFramePlot from '@components/dataframe/DataFramePlot'

export default function LinearRegressionDatasetShowPlot() {

  const { 
    datasets, 
  } = useContext(LinearRegressionContext)

  if (VERBOSE) console.debug('render LinearRegressionDatasetShowPlot')
  return <>
    <DataFramePlotProvider>
      <DataFramePlot
        is_dataset_processed={datasets.data[datasets.index].is_dataset_processed}
        dataframe={datasets.data[datasets.index].dataframe_processed}
      />
    </DataFramePlotProvider>
  </>
}