import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";

export default function DataFramePlotHistogram({ dataframe }) {
  const [column, setColumn] = useState("")
  const handleChange_Column = (e) => {
    setColumn(e.target.value)
  }

  useEffect(() => {
    if (dataframe.columns.length > 0) setColumn(dataframe.columns[0])
  }, [])

  useEffect(() => {
    if (column !== "" && dataframe[column]) {
      dataframe[column].plot("dataframe_histogram_plot").hist()
    }
  }, [column, dataframe])


  return <>
    <Form.Group controlId={"dataframe-column"} className={"mt-3 mb-3"}>
      <Form.Select aria-label={"dataframe-column"}
                   size={"sm"}
                   onChange={(e) => handleChange_Column(e)}>
        {dataframe.columns.map((value, index) => {
          return <option key={index} value={value}>{value}</option>
        })}
      </Form.Select>
    </Form.Group>

    <div id={"dataframe_histogram_plot"}></div>
  </>
}