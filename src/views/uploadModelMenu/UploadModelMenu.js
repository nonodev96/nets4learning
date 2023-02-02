import React, { useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { Form, Button, Row, Col, Container, Card } from 'react-bootstrap'
import N4LFooter from '../../components/footer/N4LFooter'
import N4LNavBar from '../../components/navBar/N4LNavBar'
import * as alertHelper from "../../utils/alertHelper"
import { LIST_MODEL_OPTIONS, LIST_TYPE_MODELS } from "../../DATA_MODEL";

export default function UploadModelMenu(props) {
  const { id } = useParams()
  const [Model, setModel] = useState(-1)
  const history = useHistory()

  const handleChangeModel = () => {
    let aux = document.getElementById('FormModel').value
    if (aux !== undefined) setModel(aux)
  }

  const handleSubmit = async () => {
    if (Model === -1 || Model === 'Selecciona un Modelo') {
      await alertHelper.alertWarning('Debes de seleccionar un modelo')
    } else {
      if (Model === -1 || Model === 'Selecciona un Modelo') {
        history.push('/edit-architecture/' + id + '/' + 0 + '/' + -1)
      } else {
        history.push('/edit-architecture/' + id + '/' + 0 + '/' + Model)
      }
    }
  }

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
                  Selecciona a continuación el Modelo Pre-entrenado sobre el que se va a trabajar.
                </Card.Text>
                <Card.Text>
                  Si deseas usar uno propio, utiliza la opción del desplegable y carga los archivos en la siguiente
                  vista.
                </Card.Text>
                <Form>
                  <Form.Group controlId="FormModel">
                    <Form.Label>Selecciona un Modelo</Form.Label>
                    <Form.Select aria-label="Default select example"
                                 onChange={handleChangeModel}>
                      <option>Selecciona un Modelo</option>
                      {LIST_MODEL_OPTIONS[id].map((item, id) => {
                        return (<option key={id} value={id}>{item}</option>)
                      })}
                    </Form.Select>
                  </Form.Group>

                  <Button className="mt-3" onClick={() => handleSubmit()}>
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
