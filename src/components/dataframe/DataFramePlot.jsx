import React, { useCallback, useContext, useEffect, useId } from "react"
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap"
import { Trans } from "react-i18next"
import DebugJSON from "../debug/DebugJSON"
import { lineChartsValidConfig, timeSeriesPlotsValidConfig } from "../../core/dataframe/DataFrameUtils"
import DataFramePlotDescription from "./DataFramePlotDescription"
import DataFramePlotConfiguration from "./DataFramePlotConfiguration"
import DataFramePlotContext from "../_context/DataFramePlotContext"

export default function DataFramePlot({ dataframe }) {

  const {
    dataframePlotConfig, setDataframePlotConfig, setShowOptions, setShowDescription, dataFrameLocal, setDataFrameLocal, E_PLOTS, LIST_PLOTS
  } = useContext(DataFramePlotContext)

  const dataframe_plot_id = useId()

  const init = useCallback(() => {
    const _columnsValidForIndex = (_dataframe) => {
      return _dataframe.columns.filter((column) => {
        return _dataframe[column].unique().shape[0] === _dataframe.shape[0];
      })
    }

    const _isDataFrameValidForIndex = (_dataframe) => {
      return _columnsValidForIndex(_dataframe).length > 0
    }

    setDataframePlotConfig((prevState) => {
      const _prevState = Object.assign({}, prevState)
      if (_isDataFrameValidForIndex(dataFrameLocal)) {
        _prevState.TIME_SERIES_PLOTS.config.index = _columnsValidForIndex(dataFrameLocal)[0]
      }
      _prevState.COLUMNS = dataFrameLocal.columns
      return _prevState
    })
  }, [dataFrameLocal, setDataframePlotConfig])

  const update_interfaz = useCallback(() => {
    try {
      const layout = {
        title: dataframePlotConfig.LAYOUT.title,
        xaxis: { title: dataframePlotConfig.LAYOUT.x_axis, },
        yaxis: { title: dataframePlotConfig.LAYOUT.y_axis, },
      }
      if (dataframePlotConfig.COLUMNS !== []) {
        const columnsToShow = dataframePlotConfig.COLUMNS.filter(elemento => dataFrameLocal.columns.includes(elemento))
        const sub_df = dataFrameLocal.loc({ columns: columnsToShow })
        switch (dataframePlotConfig.PLOT_ENABLE) {
          case E_PLOTS.TIME_SERIES_PLOTS:
            // TODO
            const { isValidConfig_TimeSeries, config_TimeSeries, index } = timeSeriesPlotsValidConfig(dataFrameLocal, dataframePlotConfig, columnsToShow)
            if (isValidConfig_TimeSeries) {
              const sub_sub_df = sub_df.setIndex(index)
              sub_sub_df.plot(dataframe_plot_id).line({
                config: {
                  ...dataframePlotConfig._DEFAULT_.config,
                  ...config_TimeSeries
                },
                layout: layout
              })
            } else {
              console.log("Configuración no valida E_PLOTS.TIME_SERIES_PLOTS", { index })
            }
            break
          case E_PLOTS.VIOLIN_PLOTS:
            sub_df.plot(dataframe_plot_id).violin({
              config: {
                ...dataframePlotConfig._DEFAULT_.config,
              },
              layout
            })
            break
          case E_PLOTS.BOX_PLOTS:
            sub_df.plot(dataframe_plot_id).box({
              config: {
                ...dataframePlotConfig._DEFAULT_.config,

              },
              layout
            })
            break
          case E_PLOTS.PIE_CHARTS:
            // TODO
            sub_df.plot(dataframe_plot_id).pie({
              config: {
                ...dataframePlotConfig._DEFAULT_.config,
              },
              layout
            })
            break
          case E_PLOTS.HISTOGRAMS:
            sub_df.plot(dataframe_plot_id).hist({
              config: {
                ...dataframePlotConfig._DEFAULT_.config,
              },
              layout
            })
            break
          case E_PLOTS.SCATTER_PLOTS:
            // TODO
            sub_df.plot(dataframe_plot_id).scatter({
              config: {
                ...dataframePlotConfig._DEFAULT_.config,
              },
              layout
            })
            break
          case E_PLOTS.BAR_CHARTS:
            sub_df.plot(dataframe_plot_id).bar({
              config: {
                ...dataframePlotConfig._DEFAULT_.config,
              },
              layout
            })
            break
          case E_PLOTS.LINE_CHARTS:
            // TODO
            const { isValidConfig_LineCharts, config_LineCharts } = lineChartsValidConfig(dataFrameLocal, dataframePlotConfig, columnsToShow)
            if (isValidConfig_LineCharts) {
              sub_df.plot(dataframe_plot_id).line({
                config: {
                  ...dataframePlotConfig._DEFAULT_.config,
                  ...config_LineCharts
                },
                layout: layout
              })
            } else {
              console.log("Configuración no valida E_PLOTS.LINE_CHARTS", { config_LineCharts })
            }
            break
          default: {
            console.error("Error, option not valid")
            break
          }
        }
      }
    } catch (e) {
      console.log({ e })
    }
  }, [dataframePlotConfig, E_PLOTS, dataframe_plot_id, dataFrameLocal])

  useEffect(() => {
    console.debug("useEffect[init]")
    setDataFrameLocal(dataframe)
  }, [setDataFrameLocal, dataframe]);

  useEffect(() => {
    console.debug("useEffect[init dataFrameLocal]")
    init()
  }, [init])

  useEffect(() => {
    console.debug("useEffect[update_interfaz]")
    update_interfaz()
  }, [update_interfaz])

  const handleChange_Plot = (e) => {
    setDataframePlotConfig({ ...dataframePlotConfig, PLOT_ENABLE: e.target.value })
  }

  console.log("render DataFramePlot")
  return <>
    <Card>
      <Card.Header className={"d-flex align-items-center justify-content-between"}>
        <h3><Trans i18nKey={"DataFrame Plot"} /></h3>
        <div className={"d-flex"}>
          <Form.Group controlId={"plot"}>
            <Form.Select aria-label={"plot"}
                         size={"sm"}
                         value={dataframePlotConfig.PLOT_ENABLE}
                         onChange={(e) => handleChange_Plot(e)}>
              {LIST_PLOTS.map((plot, index) => {
                return <option key={"option_" + index} value={plot}>{plot}</option>
              })}
            </Form.Select>
          </Form.Group>
          <Button variant="outline-primary" size={"sm"} className={"ms-3"} onClick={() => setShowOptions(true)}>
            <Trans i18nKey={"plot.options"} />
          </Button>
          <Button variant="outline-primary" size={"sm"} className={"ms-3"} onClick={() => setShowDescription(true)}>
            <Trans i18nKey={"plot.description"} />
          </Button>
        </div>
      </Card.Header>
      <Card.Body>
        <Container>
          <Row>
            <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
              <div id={dataframe_plot_id}></div>
            </Col>
          </Row>
        </Container>
      </Card.Body>

      <Card.Footer>
        <DebugJSON obj={dataframePlotConfig} />
      </Card.Footer>
    </Card>


    <DataFramePlotDescription />
    <DataFramePlotConfiguration />
  </>
}