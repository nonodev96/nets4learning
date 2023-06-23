import React, { useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { Form, Button, Row, Col, Container, Card } from 'react-bootstrap'
import * as alertHelper from "../../utils/alertHelper"
import { useTranslation } from "react-i18next";
import {
  // Tabular
  // MODEL_CAR,
  // Regresión linear
  MODEL_SALARY,
  MODEL_AUTO_MPG,
  MODEL_BOSTON_HOUSING,
  MODEL_BREAST_CANCER,
  MODEL_STUDENT_PERFORMANCE,
  MODEL_WINE
} from "../../DATA_MODEL";

export default function MenuSelectModel(_props) {
  const { id } = useParams()
  const [model_key, setModelKey] = useState("select-model")
  const history = useHistory()
  const { t } = useTranslation()

  const handleSubmit = async ($event) => {
    $event.preventDefault()
    if (model_key === "select-model") {
      await alertHelper.alertWarning(t("alert.menu.need-select-model"))
    } else {
      history.push('/playground/' + id + '/' + 0 + '/' + model_key)
    }
  }

  const PrintHTML_OPTIONS = (_id) => {
    switch (_id) {
      case '0': {
        // tabular-classification
        return <>
          <option value={1}>{t("datasets-models.0-tabular-classification.list-models.0-option-1")}</option>
          <option value={2}>{t("datasets-models.0-tabular-classification.list-models.0-option-2")}</option>
          <option value={3}>{t("datasets-models.0-tabular-classification.list-models.0-option-3")}</option>
        </>
      }
      case '1': {
        // linear-regression
        return <>
          <option value={MODEL_SALARY.KEY}>
            {t("datasets-models.1-linear-regression.list-models.0-option-1")}
          </option>
          <option value={MODEL_AUTO_MPG.KEY}>
            {t("datasets-models.1-linear-regression.list-models.0-option-2")}
          </option>
          <option value={MODEL_BOSTON_HOUSING.KEY}>
            {t("datasets-models.1-linear-regression.list-models.0-option-3")}
          </option>
          <option value={MODEL_BREAST_CANCER.KEY}>
            {t("datasets-models.1-linear-regression.list-models.0-option-4")}
          </option>
          <option value={MODEL_STUDENT_PERFORMANCE.KEY}>
            {t("datasets-models.1-linear-regression.list-models.0-option-5")}
          </option>
          <option value={MODEL_WINE.KEY}>
            {t("datasets-models.1-linear-regression.list-models.0-option-6")}
          </option>
        </>
      }
      case '2': {
        // object-detection
        return <>
          <option value={1}>{t("datasets-models.2-object-detection.list-models.2-option-1")}</option>
          <option value={2}>{t("datasets-models.2-object-detection.list-models.2-option-2")}</option>
          <option value={3}>{t("datasets-models.2-object-detection.list-models.2-option-3")}</option>
          <option value={4}>{t("datasets-models.2-object-detection.list-models.2-option-4")}</option>
        </>
      }
      case '3': {
        // Clasificación imágenes
        return <>
          <option value={1}>{t("datasets-models.3-image-classifier.list-models.3-option-1")}</option>
          <option value={2}>{t("datasets-models.3-image-classifier.list-models.3-option-2")}</option>
          {/*<option value={3}>{t("models.3-option-3")}</option>*/}
        </>
      }
      default: {
        console.error("Opción no disponible")
      }
    }
  }

  console.debug("render MenuSelectModel")
  return (
    <>
      <Form onSubmit={($event) => handleSubmit($event)}>

        <Container id={"MenuSelectModel"}>
          <Row className="mt-3 mb-3">
            <Col>
              <Card>
                <Card.Header><h3>{t("modality." + id)}</h3></Card.Header>
                <Card.Body>
                  <Card.Text>
                    {t("pages.menu-selection-model.form-description-1")}
                  </Card.Text>
                  {/*<Card.Text>*/}
                  {/*  {t("pages.menu-selection-model.form-description-2")}*/}
                  {/*</Card.Text>*/}
                  <Form.Group controlId="FormModel">
                    <Form.Label>{t("pages.menu-selection-model.form-label")}</Form.Label>
                    <Form.Select aria-label={t("pages.menu-selection-model.form-label")}
                                 defaultValue={"select-model"}
                                 onChange={(e) => setModelKey(e.target.value)}>
                      <option value={"select-model"} disabled>{t("pages.menu-selection-model.form-option-_-1")}</option>

                      {PrintHTML_OPTIONS(id)}

                    </Form.Select>
                  </Form.Group>

                  <Button className="mt-3"
                          type={"submit"}>
                    {t("pages.menu-selection-model.form-submit")}
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
