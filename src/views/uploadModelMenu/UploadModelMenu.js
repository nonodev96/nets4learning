import React, { useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { Form, Button, Row, Col, Container, Card } from 'react-bootstrap'
import N4LFooter from '../../components/footer/N4LFooter'
import N4LNavBar from '../../components/navBar/N4LNavBar'
import * as alertHelper from "../../utils/alertHelper"
import { LIST_MODEL_OPTIONS, LIST_TYPE_MODELS } from "../../DATA_MODEL";

export default function UploadModelMenu(props) {
  const { id } = useParams()
  const [ModelID, setModelID] = useState(-1)
  const history = useHistory()

  const handleChangeModel = () => {
    let aux = document.getElementById('FormModel').value
    if (aux !== undefined) setModelID(aux)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (ModelID === -1 || ModelID === 'Selecciona un Modelo') {
      await alertHelper.alertWarning('Debes de seleccionar un modelo')
    } else {
      history.push('/edit-architecture/' + id + '/' + 0 + '/' + ModelID)
    }
  }

  console.debug("render UploadModelMenu")
  return (
    <>
      <N4LNavBar/>
      <Container>
        <Row className="mt-3 mb-3">
          <Col>
            <Card>
              <Card.Header><h3>{LIST_TYPE_MODELS[id]}</h3></Card.Header>
              <Card.Body>
                <Card.Text>
                  Selecciona a continuación el modelo entrenado sobre el que se va a trabajar.
                </Card.Text>
                <Card.Text>
                  Si deseas usar uno propio, utiliza la opción del desplegable y carga los archivos en la siguiente
                  vista.
                </Card.Text>
                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="FormModel">
                    <Form.Label>Selecciona un Modelo</Form.Label>
                    <Form.Select aria-label="Default select example"
                                 onChange={handleChangeModel}>
                      <option>Selecciona un Modelo</option>
                      {LIST_MODEL_OPTIONS[id].map((item, index) => {
                        if (index === 0) return <option key={index} value={id} disabled>{item}</option>
                        if (id === '0' && index === 3) return <option key={index} value={index} disabled>{item}</option>
                        return <option key={index} value={index}>{item}</option>
                      })}
                    </Form.Select>
                  </Form.Group>

                  <Button className="mt-3"
                          type={"submit"}>
                    Continuar
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <N4LFooter/>
    </>
  )
}
