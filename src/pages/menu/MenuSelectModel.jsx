import React, { useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { Form, Button, Row, Col, Container, Card } from 'react-bootstrap'
import N4LNavbar from '../../components/header/N4LNavbar'
import N4LFooter from '../../components/footer/N4LFooter'
import * as alertHelper from "../../utils/alertHelper"
import { LIST_MODEL_OPTIONS, LIST_TYPE_MODALITY } from "../../DATA_MODEL";

export default function MenuSelectModel(props) {
  const { id } = useParams()
  const [ModelID, setModelID] = useState(-1)
  const history = useHistory()

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (ModelID === -1 || ModelID === 'Selecciona un Modelo') {
      await alertHelper.alertWarning('Debes de seleccionar un modelo')
    } else {
      history.push('/playground/' + id + '/' + 0 + '/' + ModelID)
    }
  }

  const PrintHTML_OPTIONS = (_id) => {
    switch (_id) {
      case '0': {
        // Clasificación
        return <>
          <option value={1}>{LIST_MODEL_OPTIONS[0][1]}</option>
          <option value={2}>{LIST_MODEL_OPTIONS[0][2]}</option>
          {/*<option value={3} disabled>{LIST_MODEL_OPTIONS[0][3]}</option>*/}
        </>
      }
      case '2': {
        // Identificación
        return <>
          <option value={1}>{LIST_MODEL_OPTIONS[2][1]}</option>
          <option value={2}>{LIST_MODEL_OPTIONS[2][2]}</option>
          <option value={3}>{LIST_MODEL_OPTIONS[2][3]}</option>
          <option value={4}>{LIST_MODEL_OPTIONS[2][4]}</option>
        </>
      }
      case '3': {
        // Clasificación imágenes
        return <>
          <option value={1}>{LIST_MODEL_OPTIONS[3][1]}</option>
          <option value={2}>{LIST_MODEL_OPTIONS[3][2]}</option>
        </>
      }
      default: {
        console.error("Opción no disponible")
      }
    }
  }

  console.debug("render UploadModelMenu")
  return (
    <>
      <N4LNavbar />

      <Container>
        <Row className="mt-3 mb-3">
          <Col>
            <Card>
              <Card.Header><h3>{LIST_TYPE_MODALITY[id]}</h3></Card.Header>
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
                    <Form.Select aria-label="Selecciona un modelo"
                                 defaultValue={-1}
                                 onChange={(e) => setModelID(e.target.value)}>
                      <option value={-1} disabled>Selecciona un modelo</option>

                      {PrintHTML_OPTIONS(id)}

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
