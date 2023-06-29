import React, { useContext } from "react"
import { useTranslation } from "react-i18next"
import { Card } from "react-bootstrap"
import LinearRegressionContext from "../../../context/LinearRegressionContext";

// TODO
export default function LinearRegressionDatasetForm() {
  const prefix = "pages.playground.generator."
  const { t } = useTranslation()
  const {dataset, i_model} = useContext(LinearRegressionContext)

  return <>
    <Card>
      <Card.Header>
        <h3>TODO</h3>
      </Card.Header>
      <Card.Body>

      </Card.Body>
    </Card>
  </>
}