import { Card, Col, Form, Row } from "react-bootstrap"
import React, { useContext, useEffect, useState } from "react"
import * as dfd from "danfojs"
import { Trans } from "react-i18next"
import N4LTablePagination from "../../../components/table/N4LTablePagination"
import N4LSummary from "../../../components/summary/N4LSummary"
import { TABLE_PLOT_STYLE_CONFIG } from "../../../ConfigDanfoJS";
import LinearRegressionContext from "../../../context/LinearRegressionContext";

export default function LinearRegressionDatasetShow() {

  const { tmpModel } = useContext(LinearRegressionContext)

  // i18n
  const prefix = "pages.playground.generator.dataset."
  const [dataset, setDataset] = useState({
    dataframe_original : new dfd.DataFrame(),
    dataframe_processed: new dfd.DataFrame(),
    container_info     : "",
    attributes         : []
  })

  useEffect(() => {
    const init = async () => {
      if (tmpModel.datasets.length > 0) {
        const dataframe_original = tmpModel.datasets[0].dataframe_original
        const dataframe_processed = tmpModel.datasets[0].dataframe_processed
        const promise_info = await fetch(tmpModel.datasets_path + tmpModel.datasets[0].info)
        const container_info = await promise_info.text()
        dataframe_original.describe().T.plot("dataframe_original_plot").table({ config: TABLE_PLOT_STYLE_CONFIG })
        dataframe_processed.describe().T.plot("dataframe_processed_plot").table({ config: TABLE_PLOT_STYLE_CONFIG })

        setDataset({
          dataframe_original : dataframe_original,
          dataframe_processed: dataframe_processed,
          container_info     : container_info,
          attributes         : []
        })
      }
    }
    init().then(() => undefined)
  }, [tmpModel.datasets, setDataset])

  const handleChange_dataset = async (e) => {
    const { info, index } = JSON.parse(e.target.value)
    const dataframe_original = tmpModel.datasets[index].dataframe_original
    const dataframe_processed = tmpModel.datasets[index].dataframe_processed
    const promise_info = await fetch(tmpModel.datasets_path + info)
    const container_info = await promise_info.text()

    dataframe_original.describe().T.plot("dataframe_original_plot").table({ config: TABLE_PLOT_STYLE_CONFIG })
    dataframe_processed.describe().T.plot("dataframe_processed_plot").table({ config: TABLE_PLOT_STYLE_CONFIG })

    setDataset(() => ({
      dataframe_original : dataframe_original,
      dataframe_processed: dataframe_processed,
      container_info     : container_info,
      attributes         : []
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
                return <option key={"option_" + index} value={(JSON.stringify({ index, info }))}>{csv}</option>
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
            <N4LSummary title={<Trans i18nKey={prefix + "details.description-original"} />} info={<div id={"dataframe_original_plot"}></div>} />
            <N4LSummary title={<Trans i18nKey={prefix + "details.description-processed"} />} info={<div id={"dataframe_processed_plot"}></div>} />
            <N4LSummary title={<Trans i18nKey={prefix + "details.data"} />} info={dataset.container_info} />
          </Col>
        </Row>

      </Card.Body>
    </Card>
  </>
}