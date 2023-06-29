import React, { useEffect, useId, useState } from "react"
import { Col, Dropdown, Form, Row } from "react-bootstrap"

const LIST_PLOTS = [
  "Timeseries Plots",
  "Violin Plots",
  "Box Plots",
  "Pie Charts",
  "Histograms",
  "Scatter Plots",
  "Bar Charts",
  "Line Charts"
]
export default function DataFramePlot({ dataframe }) {
  const [columns, setColumns] = useState([])
  const [plot, setPlot] = useState("Violin Plots")
  const dataframe_plot_id = useId()

  const handleChangeCheckbox_Column = (e) => {
    const columnName = e.target.value
    const checked = e.target.checked

    const copyColumns = JSON.parse(JSON.stringify(columns))
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
    setColumns(copyColumns)
  }

  useEffect(() => {
    if (dataframe.columns.length > 0) setColumns([])
  }, [])

  useEffect(() => {
    if (columns !== []) {
      const columnsToShow = columns.filter(elemento => dataframe.columns.includes(elemento))
      const sub_df = dataframe.loc({ columns: columnsToShow })
      switch (plot) {
        case "Timeseries Plots":
          // TODO
          // sub_df.plot(dataframe_plot_id).violin()
          break
        case "Violin Plots":
          sub_df.plot(dataframe_plot_id).violin()
          break
        case "Box Plots":
          sub_df.plot(dataframe_plot_id).box()
          break
        case "Pie Charts":
          // TODO
          // sub_df.plot(dataframe_plot_id).pie({ config: { labels: "Sample code number" } })
          break
        case "Histograms":
          sub_df.plot(dataframe_plot_id).hist()
          break
        case "Scatter Plots":
          // TODO
          sub_df.plot(dataframe_plot_id).scatter()
          break
        case "Bar Charts":
          sub_df.plot(dataframe_plot_id).bar()
          break
        case "Line Charts":
          sub_df.plot(dataframe_plot_id).line()
          break
      }
    }
  }, [dataframe, columns, plot])


  const handleChange_Plot = (e) => {
    setPlot(e.target.value)
  }

  return <>
    <Row className={"mt-3 mb-3"}>
      <Col>
        <Form.Group controlId={"plot"}>
          <Form.Select aria-label={"plot"}
                       size={"lg"}
                       value={plot}
                       onChange={(e) => handleChange_Plot(e)}>
            {LIST_PLOTS.map((plot, index) => {
              return <option key={"option_" + index} value={plot}>{plot}</option>
            })}
          </Form.Select>
        </Form.Group>
      </Col>
    </Row>
    <Row>
      <Col lg={9}>
        <div id={dataframe_plot_id}></div>
      </Col>
      <Col lg={3}>
        <ol>
          {dataframe.columns.map((value, index) => {
            return <li key={index}>
              <div className="form-check">
                <input type={"checkbox"}
                       id={`dataframe-checkbox-${value}`}
                       className="form-check-input"
                       onChange={handleChangeCheckbox_Column}
                       checked={columns.includes(value)}
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

      </Col>
    </Row>
  </>
}