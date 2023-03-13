import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import React, { useEffect, useState } from "react";

export default function DynamicFormDataset(props) {
  const {
    dataset_JSON,
    stringToPredict = "",
    setStringToPredict,
    handleChange_TestInput,
    handleClick_TestVector
  } = props

  useEffect(() => {
    const defaultString = dataset_JSON.data[0].slice(0, -1).join(";")
    setStringToPredict(defaultString)
  }, [])

  const handleChange_Float = (e, index_column) => {
    const text_split = stringToPredict.split(";")
    text_split[index_column] = parseFloat(e.target.value)
    setStringToPredict(text_split.join(";"))

    console.log(text_split.join(";"), parseFloat(e.target.value))
  }

  const handleChange_Number = (e, index_column) => {
    const text_split = stringToPredict.split(";")
    text_split[index_column] = parseInt(e.target.value)
    setStringToPredict(text_split.join(";"))

    console.log(text_split.join(";"), parseInt(e.target.value))
  }

  const handleChange_Select = (e, index_column) => {
    const text_split = stringToPredict.split(";")
    text_split[index_column] = (e.target.value)
    setStringToPredict(text_split.join(";"))

    console.log(text_split.join(";"), e.target.value)
  }

  const handleChange_ROW = (e) => {
    let row_index = parseInt(e.target.value)
    setStringToPredict(dataset_JSON.data[row_index].slice(0, -1).join(";"))

    dataset_JSON.attributes.forEach((att) => {
      document.getElementById("FormControl_" + att.index_column).value =
        dataset_JSON.data[row_index][att?.index_column]
    })
  }

  console.debug("Render DynamicFormDataset")
  return <>
    <Container>
      <Row className={"mt-3"}>
        <Col xl={12}>
          <Card>
            <Card.Header className={"d-flex align-items-center"}>
              <h3>Predicción</h3>
              <div className={"ms-3"}>
                <Form.Group controlId={"DATOS"}>
                  {/*<Form.Label>Carga una fila del dataset</Form.Label>*/}
                  <Form.Select aria-label="Selecciona una opción"
                               size={"sm"}
                               onChange={(e) => handleChange_ROW(e)}>
                    {dataset_JSON.data.map((row, index) => {
                      return <option key={"option_" + index} value={index}>{index} - {row.slice(-1)}</option>
                    })}
                  </Form.Select>
                </Form.Group>
              </div>
            </Card.Header>
            <Card.Body>
              <Card.Text>
                Introduce separado por punto y coma los siguientes valores correspondientes al conjunto de datos:
                <br/>
                <b>({dataset_JSON.attributes.map(att => att.name).join(", ")}).</b>
              </Card.Text>

              <Form onSubmit={(event) => event.preventDefault()}>

                <Row>
                  {dataset_JSON.attributes.map((attribute, index, array) => {
                    // VALUES:
                    // { name: "type1", type: "number" },
                    // { name: "type2", type: "float"  },
                    // { name: "type3", type: "select", options: [{value: "", text: ""] },

                    switch (attribute.type) {
                      case "number": {
                        return <Col key={"form" + index} className={"mb-3"}
                                    xs={6} sm={6} md={4} lg={4} xl={4} xxl={3}>
                          <Form.Group controlId={"FormControl_" + attribute.index_column}>
                            <Form.Label><b>{attribute.name}</b></Form.Label>
                            <Form.Control type="number"
                                          size={"sm"}
                                          placeholder={"Introduce el entero"}
                                          min={0}
                                          step={1}
                                          defaultValue={parseInt(dataset_JSON.data[0][attribute?.index_column])}
                                          onChange={(e) => handleChange_Number(e, attribute?.index_column)}/>
                            <Form.Text className="text-muted">Parámetro entero: {attribute.name}</Form.Text>
                          </Form.Group>
                        </Col>
                      }
                      case "float": {
                        return <Col key={"form" + index} className={"mb-3"}
                                    xs={6} sm={6} md={4} lg={4} xl={4} xxl={3}>
                          <Form.Group controlId={"FormControl_" + attribute.index_column}>
                            <Form.Label><b>{attribute.name}</b></Form.Label>
                            <Form.Control type="number"
                                          size={"sm"}
                                          placeholder={"Introduce el decimal"}
                                          min={0}
                                          step={0.1}
                                          defaultValue={parseFloat(dataset_JSON.data[0][attribute?.index_column])}
                                          onChange={(e) => handleChange_Float(e, attribute?.index_column)}/>
                            <Form.Text className="text-muted">Parámetro decimal: {attribute.name}</Form.Text>
                          </Form.Group>
                        </Col>
                      }
                      case "select": {
                        return <Col key={"form" + index} className={"mb-3"}
                                    xs={6} sm={6} md={4} lg={4} xl={4} xxl={3}>
                          <Form.Group controlId={"FormControl_" + attribute.index_column}>
                            <Form.Label><b>{attribute.name}</b></Form.Label>
                            <Form.Select aria-label="Selecciona una opción"
                                         size={"sm"}
                                         defaultValue={dataset_JSON.data[0][attribute?.index_column]}
                                         onChange={(e) => handleChange_Select(e, attribute?.index_column)}>
                              {attribute.options.map((option_value, option_index) => {
                                return <option key={attribute.name + "_option_" + option_index}
                                               value={option_value.value}>
                                  {option_value.text}
                                </option>
                              })}
                            </Form.Select>
                            <Form.Text className="text-muted">Parámetro decimal: {attribute.name}</Form.Text>
                          </Form.Group>
                        </Col>
                      }
                      default:
                        console.error("Error, opción no permitida")
                        return <></>
                    }
                  })}
                </Row>

                <Form.Group className="mb-3" controlId={'formTestInput'}>
                  <Form.Label>Vector a probar</Form.Label>
                  <Form.Control placeholder="Introduce el vector a probar"
                                disabled={true}
                                value={stringToPredict}
                                onChange={handleChange_TestInput}/>
                </Form.Group>

                {/* SUBMIT BUTTON */}
                <div className="d-grid gap-2">
                  <Button type="button"
                          onClick={handleClick_TestVector}
                          size={"lg"}
                          variant="primary">
                    Predecir
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  </>
}