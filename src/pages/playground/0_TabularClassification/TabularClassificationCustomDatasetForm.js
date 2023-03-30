import React, { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { Trans, useTranslation } from "react-i18next";
import { Parser } from "./dataset/Parser";
import * as dfd from "danfojs"

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

/**
 *
 * @param {{
 *   dataframeOriginal    : dfd.DataFrame,
 *   dataframeProcessed   : dfd.DataFrame,
 *   setDataframeProcessed: Function,
 *   setCustomDataSet_JSON: any
 * }} props
 * @return {JSX.Element}
 * @constructor
 */
export default function TabularClassificationCustomDatasetForm(props) {
  const {
    dataframeOriginal,
    dataframeProcessed,
    setDataframeProcessed,
    setCustomDataSet_JSON
  } = props

  const [listColumnTypeProcessed, setListColumnTypeProcessed] = useState([])
  const [listClasses, setListClasses] = useState([])

  const { t } = useTranslation()
  const prefix = "form-dataframe."

  const options = [
    { value: "int32", i18n: "int32" },
    { value: "float32", i18n: "float32" },
    { value: "string", i18n: "string" },
    { value: "ignored", i18n: "ignored" },
  ]

  useEffect(() => {
    console.log("ayuda dataframeOriginal")
    if (dataframeOriginal === null) return;
    const list = dataframeOriginal.columns.map((column_name, i) => {
      return {
        column_name: column_name,
        column_type: dataframeOriginal.dtypes[i]
      }
    })
    setListColumnTypeProcessed(list)
    dataframeOriginal.plot("plot_original").table({
      config: {
        tableHeaderStyle: headerStyle,
        tableCellStyle  : cellStyle,
      },
      layout: {
        title: "Table displaying the Titanic dataset",
      },
    })
  }, [dataframeOriginal])

  useEffect(() => {
    console.log("ayuda dataframeProcessed")
    if (dataframeProcessed === null) return;
    dataframeProcessed.plot("plot_processed").table({
      config: {
        tableHeaderStyle: headerStyle,
        tableCellStyle  : cellStyle,
      },
      layout: {
        title: t("Table displaying the dataset processed"),
      },
    })
  }, [dataframeProcessed])

  const handleSubmit_dataframe = (event) => {
    event.preventDefault()

    const {
      dataframe,
      attributes,
      classes,
      data
    } = Parser.transform(dataframeOriginal, listColumnTypeProcessed)

    console.log({ dataframe, attributes, classes, data })
    setDataframeProcessed(dataframe)
    setCustomDataSet_JSON({
      missing_values   : false,
      missing_value_key: "",
      attributes       : attributes,
      classes          : classes,
      data             : data,
    })
  }

  const handleChange_cType = (e, column_name) => {
    setListColumnTypeProcessed([
      ...listColumnTypeProcessed.map((old_column) => {
        return (old_column.column_name === column_name) ?
          { ...old_column, column_type: e.target.value } :
          { ...old_column }
      })
    ])

  }

  const Print_HTML_FORM_DataFrame = () => {
    return listColumnTypeProcessed.map(({ column_name, column_type }, index) => {
        return <Col xxl={2} key={index}>
          <Form.Group controlId={"FormControl_" + column_name} className={"mt-2"}>
            <Form.Label><b>{column_name}</b></Form.Label>
            <Form.Select aria-label="Selecciona una opción"
                         size={"sm"}
                         defaultValue={column_type}
                         onChange={(e) => handleChange_cType(e, column_name)}>
              {options.map((option_value, option_index) => {
                return <option key={column_name + "_option_" + option_index}
                               value={option_value.value}>
                  {t(prefix + option_value.i18n)}
                </option>
              })}
            </Form.Select>
            <Form.Text className="text-muted">Parámetro: {column_type}</Form.Text>
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
            <ol>
              {listClasses.map((value, index) => <li key={index}>{value}</li>)}
            </ol>
          </details>
        </Col>
      </Row>

      <Button type="submit" className={"mt-3"}>
        <Trans i18nKey={prefix + "submit"} />
      </Button>
    </Form>
  </>
}