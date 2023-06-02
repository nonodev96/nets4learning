import { Accordion, Button, Card, Form } from "react-bootstrap";
import { Trans, useTranslation } from "react-i18next";
import { TYPE_ACTIVATION } from "../../../core/nn-utils/ArchitectureTypesHelper";
import React from "react";

export default function LinearRegressionEditorLayer({ tmpModel, setTmpModel }) {

  const { t } = useTranslation()

  const handlerClick_AddLayer_Start = () => {
    const nuevoArray = [{ units: 1, activation: "sigmoid" }, ...tmpModel.layers]
    setTmpModel({ ...tmpModel, layers: nuevoArray })
  }

  const handlerClick_AddLayer_End = () => {
    const nuevoArray = [...tmpModel.layers, { units: 1, activation: "softmax" }]
    setTmpModel({ ...tmpModel, layers: nuevoArray })
  }

  const handlerClick_RemoveLayer = (index) => {
    tmpModel.layers.splice(index, 1)
    const nuevoArray = tmpModel.layers
    setTmpModel({ ...tmpModel, layers: nuevoArray })
  }

  const handleChange_Layer = (index, value) => {
    tmpModel.layers[index] = value
    const nuevoArray = tmpModel.layers
    setTmpModel({ ...tmpModel, layers: nuevoArray })
  }

  return <>
    <Card>
      <Card.Header className={"d-flex align-items-center justify-content-between"}>
        <h3><Trans i18nKey={"editor-layers.title"} /></h3>
        <div className={"d-flex"}>
          <Button onClick={() => handlerClick_AddLayer_Start()}
                  size={"sm"}
                  variant="outline-primary">
            <Trans i18nKey={"editor-layers.add-layer-start"} />
          </Button>
          <Button onClick={() => handlerClick_AddLayer_End()}
                  size={"sm"}
                  variant="outline-primary"
                  className={"ms-3"}>
            <Trans i18nKey={"editor-layers.add-layer-end"} />
          </Button>
        </div>
      </Card.Header>
      <Card.Body>

        <Accordion defaultValue={""} defaultActiveKey={""}>
          {tmpModel.layers.map((item, index) => {
            return <Accordion.Item eventKey={index.toString()} key={index}>
              <Accordion.Header><Trans i18nKey={"layer-id"} values={{ index: index + 1 }} /></Accordion.Header>
              <Accordion.Body>
                <div className="d-grid gap-2">
                  <Button onClick={() => handlerClick_RemoveLayer(index)}
                          variant={"outline-danger"}>
                    <Trans i18nKey={"editor-layers.delete-layer"} values={{ index: index + 1 }} />
                  </Button>
                </div>
                {/* UNITS */}
                <Form.Group className="mt-3"
                            controlId={"formUnitsLayer" + index}>
                  <Form.Label>
                    <Trans i18nKey={"editor-layers.units"} />
                  </Form.Label>
                  <Form.Control type="number"
                                min={1} max={200}
                                placeholder={t("editor-layers.units-placeholder")}
                                value={item.units}
                                onChange={(e) => handleChange_Layer(index, {
                                  units     : parseInt(e.target.value),
                                  activation: item.activation,
                                })} />
                </Form.Group>
                {/* ACTIVATION FUNCTION */}
                <Form.Group className="m3-3"
                            controlId={"formActivationLayer" + index}>
                  <Form.Label>
                    <Trans i18nKey={"editor-layers.activation-function-select"} />
                  </Form.Label>
                  <Form.Select aria-label={"Default select example: " + item.activation}
                               value={item.activation}
                               onChange={(e) => handleChange_Layer(index, {
                                 units     : item.units,
                                 activation: e.target.value,
                               })}>
                    {TYPE_ACTIVATION.map(({ key, label }, index) => {
                      return (<option key={index} value={key}>{label}</option>);
                    })}
                  </Form.Select>
                  <Form.Text className="text-muted">
                    <Trans i18nKey={"editor-layers.activation-function-info"} />
                  </Form.Text>
                </Form.Group>
              </Accordion.Body>
            </Accordion.Item>
          })}
        </Accordion>

      </Card.Body>
    </Card>
  </>
}