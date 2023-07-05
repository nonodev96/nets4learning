import { Modal } from "react-bootstrap";
import { Trans } from "react-i18next";
import React, { useContext } from "react";
import DataFramePlotContext from "../_context/DataFramePlotContext";
import TimeSeries from "./description/TimeSeries";
import Violin from "./description/Violin";
import Pie from "./description/Pie";
import Box from "./description/Box";
import Histograms from "./description/Histograms";
import Scatter from "./description/Scatter";
import Bar from "./description/Bar";
import Line from "./description/Line";

export default function DataFramePlotDescription() {
  const {
    dataframePlotConfig,

    showDescription,
    setShowDescription,

    E_PLOTS
  } = useContext(DataFramePlotContext)


  const description_plot = () => {
    switch (dataframePlotConfig.PLOT_ENABLE) {
      case E_PLOTS.TIME_SERIES_PLOTS:
        return <><TimeSeries /></>
      case E_PLOTS.VIOLIN_PLOTS:
        return <><Violin /><Trans i18nKey={"dataframe-plot.violin_plots.description"} /></>
      case E_PLOTS.BOX_PLOTS:
        return <><Box /><Trans i18nKey={"dataframe-plot.box_plots.description"} /></>
      case E_PLOTS.PIE_CHARTS:
        return <><Pie /><Trans i18nKey={"dataframe-plot.pie_charts.description"} /></>
      case E_PLOTS.HISTOGRAMS:
        return <><Histograms /><Trans i18nKey={"dataframe-plot.histograms.description"} /></>
      case E_PLOTS.SCATTER_PLOTS:
        return <><Scatter /><Trans i18nKey={"dataframe-plot.scatter_plots.description"} /></>
      case E_PLOTS.BAR_CHARTS:
        return <><Bar /><Trans i18nKey={"dataframe-plot.bar_charts.description"} /></>
      case E_PLOTS.LINE_CHARTS:
        return <><Line /><Trans i18nKey={"dataframe-plot.line_charts.description"} /></>

      default: {
        console.error("Error, option not valid")
        break
      }
    }
  }

  return <>
    <Modal show={showDescription} onHide={() => setShowDescription(false)} size={"xl"} fullscreen={"md-down"}>
      <Modal.Header closeButton>
        <Modal.Title><Trans i18nKey={"dataframe-plot.description"} /></Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {description_plot()}
      </Modal.Body>
    </Modal>
  </>
}