import { Card, Col, Form, Row } from "react-bootstrap"
import React, { useContext, useEffect, useState } from "react"
import * as dfd from "danfojs"
import { Trans } from "react-i18next"
import N4LTablePagination from "../../../components/table/N4LTablePagination"
import N4LSummary from "../../../components/summary/N4LSummary"
import DataFramePlot from "../../../components/dataframe/DataFramePlot"

import LinearRegressionContext from "../../../context/LinearRegressionContext"
import { TABLE_PLOT_STYLE_CONFIG } from "../../../ConfigDanfoJS"


export default function LinearRegressionDatasetShow() {

  const { tmpModel, datasetLocal, setDatasetLocal } = useContext(LinearRegressionContext)

  // i18n
  const prefix = "pages.playground.generator.dataset."
  const [indexDatasetSelected, setIndexDatasetSelected] = useState(0)



  /**
   *
   * @param {CustomDataset_t} _dataset
   * @return {Promise<void>}
   */
  const updateDataFrameLocal = async (_dataset) => {
    const dataframe_original = _dataset.dataframe_original
    const dataframe_processed = _dataset.dataframe_processed
    const promise_info = await fetch(tmpModel.datasets_path + _dataset.info)
    const container_info = await promise_info.text()

    dataframe_original.describe().T.plot("dataframe_original_plot").table({ config: TABLE_PLOT_STYLE_CONFIG })
    dataframe_processed.describe().T.plot("dataframe_processed_plot").table({ config: TABLE_PLOT_STYLE_CONFIG })

    setDatasetLocal({
      dataframe_original : dataframe_original,
      dataframe_processed: dataframe_processed,
      container_info     : container_info,
      attributes         : []
    })
  }

  useEffect(() => {
    const init = async () => {
      if (tmpModel.datasets.length > 0) {
        await updateDataFrameLocal(tmpModel.datasets[indexDatasetSelected])
      }
    }
    init().then(() => undefined)
  }, [tmpModel, indexDatasetSelected])

  const handleChange_dataset = async (e) => {
    const { index } = JSON.parse(e.target.value)
    setIndexDatasetSelected(index)
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
              {tmpModel.datasets.map(({ csv, info }, index) => {
                return <option key={"option_" + index} value={(JSON.stringify({ index, info }))}>{csv}</option>
              })}
            </Form.Select>
          </Form.Group>
        </div>
      </Card.Header>
      <Card.Body>
        {datasetLocal.dataframe_original &&
          <N4LTablePagination data_head={datasetLocal.dataframe_original.columns}
                              data_body={datasetLocal.dataframe_original.values}
                              rows_per_page={10} />
        }

        <Row>
          <Col>
            <N4LSummary title={<Trans i18nKey={prefix + "details.info"} />} info={datasetLocal.container_info} />
            <N4LSummary title={<Trans i18nKey={prefix + "details.description-original"} />} info={<div id={"dataframe_original_plot"}></div>} />
            <N4LSummary title={<Trans i18nKey={prefix + "details.description-processed"} />} info={<div id={"dataframe_processed_plot"}></div>} />
          </Col>
        </Row>

        {/*<N4LSummary title={<Trans i18nKey={prefix + "details.histogram-processed"} />} info={<DataFrameHistogram dataframe={datasetLocal.dataframe_processed} />} />*/}
        {/*<N4LSummary title={<Trans i18nKey={prefix + "details.violin-processed"} />} info={<DataFrameViolin dataframe={datasetLocal.dataframe_processed} />} />*/}
        {/*<N4LSummary title={<Trans i18nKey={prefix + "details.box-processed"} />} info={<DataFrameBox dataframe={datasetLocal.dataframe_processed} />} />*/}

      </Card.Body>
    </Card>
  </>
}