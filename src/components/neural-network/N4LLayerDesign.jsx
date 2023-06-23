import { Card, Form } from "react-bootstrap";
import { NEURAL_NETWORK_MODES, NeuralNetwork } from "./NeuralNetwork";
import React, { useState } from "react";
import { Trans, useTranslation } from "react-i18next";

export default function N4LLayerDesign({ layers }) {

  const { t } = useTranslation()
  const prefix = "pages.playground.generator."

  const [mode, setMode] = useState(NEURAL_NETWORK_MODES.COMPACT)

  const handleChange_mode = (e) => {
    setMode(e.target.value)
  }

  return <>
    <Card>
      <Card.Header className={"d-flex align-items-center justify-content-between"}>
        <h3><Trans i18nKey={prefix + "layer-design"} /></h3>
        <div className={"ms-3"}>
          <Form.Group controlId={"mode"}>
            <Form.Select aria-label={t(prefix + "neural_network_modes.title")}
                         size={"sm"}
                         defaultValue={NEURAL_NETWORK_MODES.COMPACT}
                         onChange={(e) => handleChange_mode(e)}>
              <option value={NEURAL_NETWORK_MODES.COMPACT}>{t(prefix + "neural_network_modes.compact")}</option>
              <option value={NEURAL_NETWORK_MODES.EXTEND}>{t(prefix + "neural_network_modes.extend")}</option>
            </Form.Select>
          </Form.Group>
        </div>
      </Card.Header>
      <Card.Body id={"LinearRegressionLayerDesign"}>
        <NeuralNetwork layers={layers} id_parent={"vis-network"} mode={mode} />
      </Card.Body>
    </Card>
  </>
}