import React, { useEffect, useId, useState } from "react"
import { Button, Card, Col, Container, Form, Modal, Row } from "react-bootstrap"
import { Trans } from "react-i18next"
import DebugJSON from "../debug/DebugJSON"
import { timeSeriesPlotsValidConfig } from "../../core/dataframe/DataFrameUtils";

const E_PLOTS = {
  TIME_SERIES_PLOTS: "TimeSeries Plots // TODO",
  VIOLIN_PLOTS     : "Violin Plots",
  BOX_PLOTS        : "Box Plots",
  PIE_CHARTS       : "Pie Charts // TODO",
  HISTOGRAMS       : "Histograms",
  SCATTER_PLOTS    : "Scatter Plots // TODO",
  BAR_CHARTS       : "Bar Charts",
  LINE_CHARTS      : "Line Charts"
}
const LIST_PLOTS = Object.entries(E_PLOTS).map(([_key, value]) => value)

export default function DataFramePlot({ dataframe }) {
  const [plot, setPlot] = useState("Violin Plots")
  const [show, setShow] = useState(false)
  const [showOptions, setShowOptions] = useState(false)


  const DEFAULT_DATAFRAME_PLOT_CONFIG = {
    COLUMNS          : [],
    TIME_SERIES_PLOTS: { enable: false, title: "", x_axis: "", y_axis: "", index: "" },
    VIOLIN_PLOTS     : { enable: false },
    BOX_PLOTS        : { enable: false },
    PIE_CHARTS       : { enable: false },
    HISTOGRAMS       : { enable: false },
    SCATTER_PLOTS    : { enable: false },
    BAR_CHARTS       : { enable: false },
    LINE_CHARTS      : { enable: false },
  }
  const [dataframePlotConfig, setDataframePlotConfig] = useState(DEFAULT_DATAFRAME_PLOT_CONFIG)
  const dataframe_plot_id = useId()

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)
  const handleCloseOptions = () => setShowOptions(false)
  const handleShowOptions = () => setShowOptions(true)

  const handleChangeCheckbox_Column = (e) => {
    const columnName = e.target.value
    const checked = e.target.checked

    const copyColumns = JSON.parse(JSON.stringify(dataframePlotConfig.COLUMNS))
    if (checked) {
      if (!copyColumns.includes(columnName)) {
        copyColumns.push(columnName)
      }
    } else {
      const columnIndex = copyColumns.indexOf(columnName)
      if (columnIndex !== -1) {
        copyColumns.splice(columnIndex, 1)
      }
    }
    dataframePlotConfig.COLUMNS = copyColumns
    setDataframePlotConfig({ ...dataframePlotConfig })
  }

  const update_interfaz = () => {
    try {
      if (dataframePlotConfig.COLUMNS !== []) {
        const columnsToShow = dataframePlotConfig.COLUMNS.filter(elemento => dataframe.columns.includes(elemento))
        const sub_df = dataframe.loc({ columns: columnsToShow })
        switch (plot) {
          case E_PLOTS.TIME_SERIES_PLOTS:
            // TODO
            const { isValidConfig, config, layout, index } = timeSeriesPlotsValidConfig(dataframe, dataframePlotConfig, columnsToShow)
            if (isValidConfig) {
              const sub_sub_df = dataframe.setIndex(index);
              sub_sub_df.plot(dataframe_plot_id).line({ config, layout })
            } else {
              console.log("Configuración no valida", { index })
            }
            break
          case E_PLOTS.VIOLIN_PLOTS:
            sub_df.plot(dataframe_plot_id).violin()
            break
          case E_PLOTS.BOX_PLOTS:
            sub_df.plot(dataframe_plot_id).box()
            break
          case E_PLOTS.PIE_CHARTS:
            // TODO
            // sub_df.plot(dataframe_plot_id).pie({ config: { labels: dataframe.columns[0] } })
            break
          case E_PLOTS.HISTOGRAMS:
            sub_df.plot(dataframe_plot_id).hist()
            break
          case E_PLOTS.SCATTER_PLOTS:
            // TODO
            sub_df.plot(dataframe_plot_id).scatter()
            break
          case E_PLOTS.BAR_CHARTS:
            sub_df.plot(dataframe_plot_id).bar()
            break
          case E_PLOTS.LINE_CHARTS:
            sub_df.plot(dataframe_plot_id).line()
            break
        }
      }
    } catch (e) {
      console.log({ e })
    }
  }
  const update_config = () => {
    if (dataframePlotConfig.COLUMNS !== []) {
      switch (plot) {
        case E_PLOTS.TIME_SERIES_PLOTS:
          // TODO
          setDataframePlotConfig({
            ...DEFAULT_DATAFRAME_PLOT_CONFIG,
            TIME_SERIES_PLOTS: {
              ...dataframePlotConfig.TIME_SERIES_PLOTS,
              enable: true,
              index : (columnsValidForIndex().length > 0) ? columnsValidForIndex()[0] : ""
            }
          })
          break
        case E_PLOTS.VIOLIN_PLOTS:
          setDataframePlotConfig({ ...DEFAULT_DATAFRAME_PLOT_CONFIG })
          break
        case E_PLOTS.BOX_PLOTS:
          setDataframePlotConfig({ ...DEFAULT_DATAFRAME_PLOT_CONFIG })
          break
        case E_PLOTS.PIE_CHARTS:
          // TODO
          setDataframePlotConfig({
            ...DEFAULT_DATAFRAME_PLOT_CONFIG,
            PIE_CHARTS: { enable: true }
          })
          break
        case E_PLOTS.HISTOGRAMS:
          setDataframePlotConfig({ ...DEFAULT_DATAFRAME_PLOT_CONFIG })
          break
        case E_PLOTS.SCATTER_PLOTS:
          // TODO
          setDataframePlotConfig({ ...DEFAULT_DATAFRAME_PLOT_CONFIG })
          break
        case E_PLOTS.BAR_CHARTS:
          setDataframePlotConfig({ ...DEFAULT_DATAFRAME_PLOT_CONFIG })
          break
        case E_PLOTS.LINE_CHARTS:
          setDataframePlotConfig({ ...DEFAULT_DATAFRAME_PLOT_CONFIG })
          break
      }
    }
  }

  useEffect(() => {
    if (dataframe.columns.length > 0) {
      // dataframePlotConfig.COLUMNS = []
      // setDataframePlotConfig(dataframePlotConfig)
    }
  }, [])

  useEffect(() => {
    console.log("useEffect [dataframe, plot]")
    update_config()
  }, [dataframe, plot])

  useEffect(() => {
    console.log("useEffect [dataframePlotConfig]")
    update_interfaz()
  }, [dataframePlotConfig])

  const description_plot = () => {
    switch (plot) {
      case E_PLOTS.TIME_SERIES_PLOTS:
        return <><Trans i18nKey={"dataframe-plot.time_series_plots.description"} /></>
      case E_PLOTS.VIOLIN_PLOTS:
        return <><Trans i18nKey={"dataframe-plot.violin_plots.description"} /></>
      case E_PLOTS.BOX_PLOTS:
        return <><Trans i18nKey={"dataframe-plot.box_plots.description"} /></>
      case E_PLOTS.PIE_CHARTS:
        return <><Trans i18nKey={"dataframe-plot.pie_charts.description"} /></>
      case E_PLOTS.HISTOGRAMS:
        return <><Trans i18nKey={"dataframe-plot.histograms.description"} /></>
      case E_PLOTS.SCATTER_PLOTS:
        return <><Trans i18nKey={"dataframe-plot.scatter_plots.description"} /></>
      case E_PLOTS.BAR_CHARTS:
        return <><Trans i18nKey={"dataframe-plot.bar_charts.description"} /></>
      case E_PLOTS.LINE_CHARTS:
        return <><Trans i18nKey={"dataframe-plot.line_charts.description"} /></>
    }
  }

  const handleChange_Plot = (e) => {
    setPlot(e.target.value)
  }

  const handleSubmit_Config = (e) => {
    e.preventDefault()
    console.log({ e })
  }

  const handleChange_PlotConfig_TimeSeries = (e, key) => {
    if (key === "index") {
      const copyColumns = JSON.parse(JSON.stringify(dataframePlotConfig.COLUMNS))
      const columnIndex = copyColumns.indexOf(e.target.valueOf())
      if (columnIndex !== -1) {
        copyColumns.splice(columnIndex, 1)
      }
      dataframePlotConfig.COLUMNS = copyColumns
    }
    setDataframePlotConfig({
      ...dataframePlotConfig,
      TIME_SERIES_PLOTS: {
        ...dataframePlotConfig.TIME_SERIES_PLOTS,
        [key]: e.target.value
      }
    })
  }
  const columnsValidForIndex = () => {
    return dataframe.columns.filter((column) => {
      return dataframe[column].unique().shape[0] === dataframe.shape[0];
    })
  }
  const isDataFrameValidForIndex = () => {
    return columnsValidForIndex().length > 0
  }


  return <>
    <Card>
      <Card.Header className={"d-flex align-items-center justify-content-between"}>
        <h3><Trans i18nKey={"DataFrame Plot"} /></h3>
        <div className={"d-flex"}>
          <Form.Group controlId={"plot"}>
            <Form.Select aria-label={"plot"}
                         size={"sm"}
                         value={plot}
                         onChange={(e) => handleChange_Plot(e)}>
              {LIST_PLOTS.map((plot, index) => {
                return <option key={"option_" + index} value={plot}>{plot}</option>
              })}
            </Form.Select>
          </Form.Group>
          <Button variant="outline-primary" size={"sm"} className={"ms-3"} onClick={handleShowOptions}>
            <Trans i18nKey={"plot.options"} />
          </Button>
          <Button variant="outline-primary" size={"sm"} className={"ms-3"} onClick={handleShow}>
            <Trans i18nKey={"plot.description"} />
          </Button>
        </div>
      </Card.Header>
      <Card.Body>
        <Container>
          <Row>
            <Col xs={12} sm={12} md={12} lg={8} xl={8} xxl={9}>
              <div id={dataframe_plot_id}></div>
            </Col>
            <Col xs={12} sm={12} md={12} lg={4} xl={4} xxl={3}>
              <div className={"mb-3 overflow-y-scroll"} style={{ maxHeight: "25em" }}>
                <ol>
                  {dataframe.columns.map((value, index) => {
                    return <li key={index}>
                      <div className="form-check">
                        <input type={"checkbox"}
                               id={`dataframe-checkbox-${value}`}
                               className="form-check-input"
                               onChange={handleChangeCheckbox_Column}
                               checked={dataframePlotConfig.COLUMNS.includes(value)}
                               value={value}
                        />
                        <label htmlFor={`dataframe-checkbox-${value}`}
                               className="form-check-label">
                          {value}
                        </label>
                      </div>
                    </li>
                  })}
                </ol>
              </div>
            </Col>
          </Row>
        </Container>
      </Card.Body>
      <Card.Footer>
        <DebugJSON obj={dataframePlotConfig} />
      </Card.Footer>
    </Card>


    <Modal show={show} onHide={handleClose} size={"xl"} fullscreen={"md-down"}>
      <Modal.Header closeButton>
        <Modal.Title><Trans i18nKey={"dataframe-plot.description"} /></Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {description_plot()}
      </Modal.Body>
    </Modal>

    <Modal show={showOptions} onHide={handleCloseOptions} size={"xl"} fullscreen={"md-down"}>
      <Form onSubmit={handleSubmit_Config}>
        <Modal.Header closeButton>
          <Modal.Title><Trans i18nKey={"dataframe-plot.options"} /> {plot}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {dataframePlotConfig.TIME_SERIES_PLOTS.enable &&
            <Container>
              <Row>
                <Col xl={12}>
                  {!isDataFrameValidForIndex() &&
                    <p className="text-warning"><Trans i18nKey={"Este dataframe no permite una visualización adecuada al no cumplir la condición de una característica con valores únicos"} /></p>
                  }
                </Col>
                <Col xl={12}>
                  <Form.Group controlId={"dataframe-plot.time_series_plots.title"}>
                    <Form.Label><Trans i18nKey={"Title"} /></Form.Label>
                    <Form.Control type="text"
                                  placeholder="Title"
                                  onChange={(e) => handleChange_PlotConfig_TimeSeries(e, "title")}
                                  defaultValue={dataframePlotConfig.TIME_SERIES_PLOTS.title} />
                  </Form.Group>
                </Col>
                <Col xl={6}>
                  <Form.Group controlId={"dataframe-plot.time_series_plots.x-axis"} className={"mt-3"}>
                    <Form.Label><Trans i18nKey={"xAxis"} /></Form.Label>
                    <Form.Select onChange={(e) => handleChange_PlotConfig_TimeSeries(e, "x_axis")}
                                 value={dataframePlotConfig.TIME_SERIES_PLOTS.x_axis}
                                 aria-label="Default select example">
                      {dataframe.columns.map((value, index) => {
                        return <option key={index} value={value}>{value}</option>
                      })}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col xl={6}>
                  <Form.Group controlId={"dataframe-plot.time_series_plots.y-axis"} className={"mt-3"}>
                    <Form.Label><Trans i18nKey={"yAxis"} /></Form.Label>
                    <Form.Select onChange={(e) => handleChange_PlotConfig_TimeSeries(e, "y_axis")}
                                 value={dataframePlotConfig.TIME_SERIES_PLOTS.y_axis}
                                 aria-label="Default select example">
                      {dataframe.columns.map((value, index) => {
                        return <option key={index} value={value}>{value}</option>
                      })}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col xl={12}>
                  <Form.Group controlId={"dataframe-plot.time_series_plots.index"} className={"mt-3"}>
                    <Form.Label><Trans i18nKey={"Index"} /></Form.Label>
                    <Form.Select onChange={(e) => handleChange_PlotConfig_TimeSeries(e, "index")}
                                 value={dataframePlotConfig.TIME_SERIES_PLOTS.index}
                                 aria-label="Default select example">
                      {columnsValidForIndex().map((value, index) => {
                        return <option key={index} value={value}>{value}</option>
                      })}
                    </Form.Select>
                    <Form.Text className="text-muted">
                      <Trans i18nKey={"El indice seleccionado debe contener una serie única y no debe seleccionar el índice junto a las columnas a mostrar"} />
                    </Form.Text>
                  </Form.Group>
                </Col>
              </Row>
            </Container>
          }
          {dataframePlotConfig.PIE_CHARTS.enable &&
            <>
              <Form.Group controlId={"dataframe-plot-index"}>
                <Form.Label>Index</Form.Label>
                <Form.Control type="number" placeholder="index" />
              </Form.Group>
            </>
          }

        </Modal.Body>
      </Form>
    </Modal>
  </>
}