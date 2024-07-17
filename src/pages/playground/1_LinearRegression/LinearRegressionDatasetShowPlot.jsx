import React, { useContext } from 'react'

import { VERBOSE } from '@/CONSTANTS'
import LinearRegressionContext from '@context/LinearRegressionContext'
import { DataFramePlotProvider } from '@components/_context/DataFramePlotContext'
import DataFramePlot from '@components/dataframe/DataFramePlot'

export default function LinearRegressionDatasetShowPlot() {

  const { datasetLocal } = useContext(LinearRegressionContext)

  if (VERBOSE) console.debug('render LinearRegressionDatasetShowPlot')
  return <>
    <DataFramePlotProvider>
      <DataFramePlot
        is_dataset_processed={datasetLocal.is_dataset_processed}
        dataframe={datasetLocal.dataframe_processed}
      />
    </DataFramePlotProvider>
  </>
}