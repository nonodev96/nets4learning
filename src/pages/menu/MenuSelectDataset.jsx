import React, { useState } from 'react'
import { Form, Button, Row, Col, Container, Card } from 'react-bootstrap'
import { useParams, useHistory } from 'react-router-dom'
import * as alertHelper from '../../utils/alertHelper'
import { useTranslation } from "react-i18next";
import { DATASET_1_SALARY, DATASET_2_AUTO_MPG, DATASET_3_BOSTON_HOUSING, DATASET_4_BREAST_CANCER, DATASET_5_STUDENT_PERFORMANCE, DATASET_6_WINE } from "../playground/1_LinearRegression/datasets";
import { UPLOAD } from "../../DATA_MODEL";

export default function MenuSelectDataset() {
  const { id } = useParams()
  const [dataset_id, setDatasetId] = useState("select-dataset")
  const history = useHistory()
  const { t } = useTranslation()

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (dataset_id === "select-dataset") {
      await alertHelper.alertWarning(t("alert.menu.need-select-dataset"))
    } else {
      history.push('/playground/' + id + '/' + 1 + '/' + dataset_id)
    }
  }


  const PrintHTML_OPTIONS = (_id) => {
    switch (_id) {
      case '0': {
        // tabular-classification
        return <>
          <option value={0}>{t("pages.menu-selection-dataset.0-tabular-classification.csv")}</option>
          <option value={1}>{t("datasets-models.0-tabular-classification.list-datasets.0-option-1")}</option>
          <option value={2}>{t("datasets-models.0-tabular-classification.list-datasets.0-option-2")}</option>
          <option value={3}>{t("datasets-models.0-tabular-classification.list-datasets.0-option-3")}</option>
        </>
      }
      case '1': {
        // linear-regression
        return <>
          <option value={UPLOAD}>
            {t("pages.menu-selection-dataset.1-linear-regression.csv")}
          </option>
          <option value={DATASET_1_SALARY.KEY}>
            {t("datasets-models.1-linear-regression.list-datasets.1-salary")}
          </option>
          <option value={DATASET_2_AUTO_MPG.KEY}>
            {t("datasets-models.1-linear-regression.list-datasets.2-auto-mpg")}
          </option>
          <option value={DATASET_3_BOSTON_HOUSING.KEY}>
            {t("datasets-models.1-linear-regression.list-datasets.3-boston-housing")}
          </option>
          <option value={DATASET_4_BREAST_CANCER.KEY}>
            {t("datasets-models.1-linear-regression.list-datasets.4-breast-cancer")}
          </option>
          <option value={DATASET_5_STUDENT_PERFORMANCE.KEY}>
            {t("datasets-models.1-linear-regression.list-datasets.5-student-performance")}
          </option>
          <option value={DATASET_6_WINE.KEY}>
            {t("datasets-models.1-linear-regression.list-datasets.6-wine")}
          </option>
        </>
      }
      case '2': {
        // object-detection
        console.warn("TODO")
        return <>
        </>
      }
      case '3': {
        // image-classifier
        console.warn("TODO")
        return <>
          <option value={1}>{t("pages.menu-selection-dataset.1-image-classifier")}</option>
        </>
      }
      default: {
        console.error("Opción no disponible")
      }
    }
  }

  console.debug("render MenuSelectDataset")
  return (
    <>
      <Form onSubmit={($event) => handleSubmit($event)}>
        <Container id={"MenuSelectDataset"}>
          <Row className="mt-3 mb-3">
            <Col>
              <Card>
                <Card.Header><h3>{t("modality." + id)}</h3></Card.Header>
                <Card.Body>
                  <Card.Text>
                    {t("pages.menu-selection-dataset.form-description-1")}
                  </Card.Text>
                  <Form.Group className="mb-3" controlId="FormDataSet">
                    <Form.Label>{t("pages.menu-selection-dataset.form-label")}</Form.Label>
                    <Form.Select aria-label={t("pages.menu-selection-dataset.form-label")}
                                 defaultValue={"select-dataset"}
                                 onChange={(e) => setDatasetId(e.target.value)}>
                      <option value={"select-dataset"} disabled>{t("pages.menu-selection-dataset.form-option-_-1")}</option>
                      {PrintHTML_OPTIONS(id)}
                    </Form.Select>
                  </Form.Group>

                  <Button type="submit">
                    {t("pages.menu-selection-dataset.form-submit")}
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </Form>
    </>
  )
}
