import { Card, Col, Form, Row } from "react-bootstrap"
import React, { useEffect, useState } from "react"
import * as dfd from "danfojs"
import { Trans } from "react-i18next"
import N4LTablePagination from "../../../components/table/N4LTablePagination"
import N4LSummary from "../../../components/summary/N4LSummary"
import { DataFrameTransform } from "./DataFrameTransform";

export default function LinearRegressionDataset({ tmpModel, setTmpModel }) {
  // i18n
  const prefix = "pages.playground.generator.dataset."
  const [dataset, setDataset] = useState({
    dataframe_original: new dfd.DataFrame(),
    info              : "",
    attributes        : []
  })

  useEffect(() => {
    const init = async () => {
      if (tmpModel.datasets.length > 0) {
        console.log(tmpModel.datasets.length)
        const dataframe_original = await dfd.readCSV(tmpModel.path_datasets + tmpModel.datasets[0].csv)
        const promise_info = await fetch(tmpModel.path_datasets + tmpModel.datasets[0].info)
        const info = await promise_info.text()
        dataframe_original.describe().T.plot("original_dataframe_plot").table()

        setDataset({
          dataframe_original: dataframe_original,
          info              : info,
          attributes        : []
        })
      }
    }
    init().then(() => undefined)
  }, [tmpModel.datasets, setDataset])

  const handleChange_dataset = async (e) => {
    const json_dataset = JSON.parse(e.target.value)
    console.log(json_dataset)
    const dataframe_original = await dfd.readCSV(tmpModel.path_datasets + json_dataset.csv)
    const promise_info = await fetch(tmpModel.path_datasets + json_dataset.info)
    const info = await promise_info.text()

    const dataframe_to_show = DataFrameTransform(dataframe_original, tmpModel.dataset_transforms)
    dataframe_to_show.describe().T.plot("original_dataframe_plot").table()

    setDataset((oldDatasets) => ({
      ...oldDatasets,
      dataframe_original: dataframe_original,
      info              : info
    }))
  }

  return <>
    <Card>
      <Card.Header className={"d-flex align-items-center justify-content-between"}>
        <h3><Trans i18nKey={prefix + "title"} /></h3>
        <div className={"ms-3"}>
          <Form.Group controlId={"dataset"}>
            <Form.Select aria-label={"dataset"}
                         size={"sm"}
                         onChange={(e) => handleChange_dataset(e)}>
              {tmpModel.datasets.map(({ csv, info, tr }, index) => {
                return <option key={"option_" + index} value={(JSON.stringify({ csv, info }))}>{csv}</option>
              })}
            </Form.Select>
          </Form.Group>
        </div>
      </Card.Header>
      <Card.Body>
        {dataset.dataframe_original &&
          <N4LTablePagination data_head={dataset.dataframe_original.columns}
                              data_body={dataset.dataframe_original.values}
                              rows_per_page={10} />
        }

        <Row>
          <Col>
            <N4LSummary title={<Trans i18nKey={"dataset.details.attributes"} />} info={<div id={"original_dataframe_plot"}></div>} />
            <N4LSummary title={<Trans i18nKey={"dataset.details.attributes"} />} info={<div id={"processed_dataframe_plot"}></div>} />
            <N4LSummary title={<Trans i18nKey={"dataset.details.data"} />} info={dataset.info} />
          </Col>
        </Row>

      </Card.Body>
    </Card>
  </>
}