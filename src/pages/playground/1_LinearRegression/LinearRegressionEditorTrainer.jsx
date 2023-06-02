import { Accordion, Button, Card, Form } from "react-bootstrap";
import { Trans, useTranslation } from "react-i18next";
import React from "react";

export default function LinearRegressionEditorTrainer({ tmpModel, setTmpModel }) {

  const DEFAULT_LEARNING_RATE = 10
  const { t } = useTranslation()

  const prefix = ""

  const handlerChange_LearningRate = (_learning_rate) => {
    setTmpModel((oldTmpModel) => ({
      ...oldTmpModel,
      params_training: {
        ...oldTmpModel.params_training,
        learning_rate: _learning_rate
      }
    }))
  }
  const handlerClick_AddMetric_Start = () => {

  }
  const handlerClick_AddMetric_End = () => {

  }


  return <>
    <Card>
      <Card.Header>
        <h3><Trans i18nKey={"editor-params.title"} /></h3>
      </Card.Header>
      <Card.Body>

        <Form.Group className="mb-3" controlId="formTrainRate">
          <Form.Label>
            <Trans i18nKey={prefix + "general-parameters.learning-rate"} />
          </Form.Label>
          <Form.Control type="number"
                        min={1} max={100}
                        placeholder={t("general-parameters.learning-rate-placeholder")}
                        defaultValue={DEFAULT_LEARNING_RATE}
                        onChange={(e) => handlerChange_LearningRate(parseInt(e.target.value))} />
          <Form.Text className="text-muted">
            <Trans i18nKey={prefix + "general-parameters.learning-rate-info"} />
          </Form.Text>
        </Form.Group>

        <hr />

        <div className="d-flex">
          <Button size={"sm"} variant={"outline-primary"} onClick={handlerClick_AddMetric_Start}>Add</Button>
          <Button size={"sm"} variant={"outline-primary"} className={"ms-3"} onClick={handlerClick_AddMetric_End}>Add</Button>
        </div>
        <Accordion>
          {tmpModel.params_training.id_metrics.map((item, index, array) => {
            return <Accordion.Item eventKey={index.toString()} key={index.toString()}>
              <Accordion.Header>
                Metrics
              </Accordion.Header>
              <Accordion.Body>
                {item}
              </Accordion.Body>
            </Accordion.Item>
          })}

        </Accordion>
      </Card.Body>
    </Card>
  </>
}