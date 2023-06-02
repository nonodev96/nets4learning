import { Card, Col, Form, Row } from "react-bootstrap";
import React from "react";
import * as dfd from "danfojs";
import { Trans } from "react-i18next";
import N4LTablePagination from "../../../components/table/N4LTablePagination";
import N4LDatasetAttributes from "../../../components/dataset-details/N4LDatasetAttributes";
import N4LDatasetClasses from "../../../components/dataset-details/N4LDatasetClasses";

export default function LinearRegressionDataset({ tmpModel, setTmpModel }) {

  const handleChange_dataset = async (e) => {
    const name_dataset = e.target.value
    const new_dataframe = await dfd.readCSV(tmpModel.path_datasets + name_dataset)
    setTmpModel((oldTmpModel) => ({ ...oldTmpModel, dataframe_original: new_dataframe }))
    console.log("handleChange_dataset", {tmpModel}, name_dataset)
  }

  return <>
    <Card>
      <Card.Header className={"d-flex align-items-center"}>
        <h3><Trans i18nKey={"Linear Regression Dataset"}/></h3>
        <div className={"ms-3"}>
          <Form.Group controlId={"dataset"}>
            <Form.Select aria-label={"dataset"}
                         size={"sm"}
                         onChange={(e) => handleChange_dataset(e)}>
              {tmpModel.list_datasets.map((dataset, index) => {
                return <option key={"option_" + index} value={dataset.toString()}>{dataset}</option>;
              })}
            </Form.Select>
          </Form.Group>
        </div>
      </Card.Header>
      <Card.Body>

        <N4LTablePagination data_head={tmpModel.dataframe_original.columns}
                            data_body={tmpModel.dataframe_original.values}
                            rows_per_page={10} />

        <Row>
          <Col>
            <N4LDatasetAttributes element={<>info</>} />
            <N4LDatasetClasses element={<>info</>} />
          </Col>
        </Row>

      </Card.Body>
    </Card>
  </>
}