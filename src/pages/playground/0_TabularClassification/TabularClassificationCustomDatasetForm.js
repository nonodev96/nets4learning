import React, { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { Trans, useTranslation } from "react-i18next";
import * as dfd from "danfojs"
import { Parser } from "./dataset/Parser";

const headerStyle = {
  align: "center",
  line : { width: 1, color: 'black' },
  fill : { color: "grey" },
  font : { family: "Arial", size: 12, color: "white" }
};
const cellStyle = {
  align: "center",
  line : { color: "black", width: 1 },
  font : { family: "Arial", size: 11, color: ["black"] }
};

export default function TabularClassificationCustomDatasetForm(props) {
  const { dataframe, setDataframe } = props
  const list = dataframe.columns.map((c, i) => ({ column_name: c, column_dtype: dataframe.dtypes[i] }))
  const [listCtypesProcessed, setListCtypesProcessed] = useState(list)

  const { t } = useTranslation()

  const options = [
    { value: "int32", text: "int32" },
    { value: "float32", text: "float32" },
    { value: "string", text: "string" },
    { value: "categorical", text: "categorical" },
    { value: "ignored", text: "ignored" },
  ]

  useEffect(() => {
    dataframe.plot("plot_original").table({
      config: {
        tableHeaderStyle: headerStyle,
        tableCellStyle  : cellStyle,
      },
      layout: {
        title: "Table displaying the Titanic dataset",
      },
    })
  }, [])

  const handleSubmit_dataframe = (event) => {
    event.preventDefault()

    const newDataframe = Parser.transfrom(dataframe, listCtypesProcessed)
    newDataframe.plot("plot_processed").table({
      config: {
        tableHeaderStyle: headerStyle,
        tableCellStyle  : cellStyle,
      },
      layout: {
        title: "Table displaying the Titanic dataset",
      },
    })
  }

  const handleChange_cType = (e, column_name) => {
    setListCtypesProcessed([
      ...listCtypesProcessed.map((old_column) => {
        return (old_column.column_name === column_name) ?
          { ...old_column, column_dtype: e.target.value } :
          { ...old_column }
      })
    ])

  }

  const Print_HTML_FORM_DataFrame = () => {
    return listCtypesProcessed.map(({ column_name, column_dtype }, index) => {
        return <Col xxl={2} key={index}>
          <Form.Group controlId={"FormControl_" + column_name} className={"mt-2"}>
            <Form.Label><b>{column_name}</b></Form.Label>
            <Form.Select aria-label="Selecciona una opción"
                         size={"sm"}
                         defaultValue={column_dtype}
                         onChange={(e) => handleChange_cType(e, column_name)}>
              {options.map((option_value, option_index) => {
                return <option key={column_name + "_option_" + option_index}
                               value={option_value.value}>
                  {option_value.text}
                </option>
              })}
            </Form.Select>
            <Form.Text className="text-muted">Parámetro: {column_dtype}</Form.Text>
          </Form.Group>
        </Col>
      }
    )
  }

  console.debug("TabularClassificationCustomDatasetForm")
  return <>
    <Form onSubmit={handleSubmit_dataframe}>

      <Row>
        <Col xxl={12}>
          <details>
            <summary className={"n4l-summary"}>Original</summary>
            <div id={"plot_original"}></div>
          </details>
        </Col>
        <Col xxl={12}>
          <details>
            <summary className={"n4l-summary"}>Formulario</summary>
            <Row>
              {Print_HTML_FORM_DataFrame()}
            </Row>
          </details>
        </Col>
        <Col xxl={12}>
          <details>
            <summary className={"n4l-summary"}>Processed</summary>
            <div id={"plot_processed"}></div>
          </details>
        </Col>
      </Row>

      <Button type="submit" className={"mt-3"}>
        <Trans i18nKey={"pages.playground.0-tabular-classification.generator.form-dataframe-submit"} />
      </Button>
    </Form>
  </>
}