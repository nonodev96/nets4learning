import React, { useContext } from "react";
import DataFramePlot from "../../../components/dataframe/DataFramePlot";
import LinearRegressionContext from "../../../context/LinearRegressionContext";

export default function LinearRegressionDatasetPlot() {

  const prefix = "pages.playground.generator.dataset."
  const { datasetLocal } = useContext(LinearRegressionContext)

  return <>
    <DataFramePlot dataframe={datasetLocal.dataframe_processed} />
  </>
}