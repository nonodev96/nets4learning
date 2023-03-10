import React, { useState } from 'react'
import { Form, Button, Row, Col, Container, Card } from 'react-bootstrap'
import { useParams, useHistory } from 'react-router-dom'
import N4LFooter from '../../components/footer/N4LFooter'
import N4LNavBar from '../../components/navBar/N4LNavBar'
import DragAndDrop from "../../components/dragAndDrop/DragAndDrop";
import * as alertHelper from '../../utils/alertHelper'
import { LIST_MODEL_OPTIONS, LIST_TYPE_MODELS } from "../../DATA_MODEL";

export default function UploadArchitectureMenu(props) {
  const { id } = useParams()
  const [DataSet, setDataSet] = useState(-1)
  const [isUploadedArchitecture, setIsUploadedArchitecture] = useState(false)
  const history = useHistory()

  const handleChange_DataSet = () => {
    let aux = document.getElementById('FormDataSet').value
    if (aux !== undefined) setDataSet(aux)
  }

  const handleSubmit = async () => {
    if (DataSet === -1 || DataSet === 'Selecciona un conjunto de datos') {
      await alertHelper.alertWarning('Debes de seleccionar un conjunto de datos')
    } else {
      if (!isUploadedArchitecture) {
        localStorage.setItem('custom-architecture', '{}')
      }
      history.push('/edit-architecture/' + id + '/' + 1 + '/' + DataSet)
    }
  }

  const handleChange_ArchitectureUpload = async (files) => {
    try {
      let reader = new FileReader()
      reader.readAsText(files[0])
      reader.onload = (e) => {
        localStorage.setItem('custom-architecture', e.target.result.toString())
        setIsUploadedArchitecture(true)
      }
      reader.onloadend = async () => {
        await alertHelper.alertSuccess('Fichero cargado con éxito')
      }
    } catch (error) {
      await alertHelper.alertError(error)
    }
  }

  return (
    <>
      <N4LNavBar/>

      <Container id={"UploadArchitectureMenu"}>
        <Row className="mt-3 mb-3">
          <Col>
            <Card>
              <Card.Header><h3>{LIST_TYPE_MODELS[id]}</h3></Card.Header>
              <Card.Body>
                <Card.Text>
                  Selecciona a continuación el conjunto de datos sobre se va a trabajar o carga tu propio conjunto de
                  datos.
                </Card.Text>
                <Form>
                  <Form.Group className="mb-3" controlId="FormDataSet">
                    <Form.Label>Selecciona un conjunto de datos</Form.Label>
                    <Form.Select aria-label="Selecciona un conjunto de datos"
                                 onChange={handleChange_DataSet}>
                      <option>Selecciona un conjunto de datos</option>
                      {LIST_MODEL_OPTIONS[id].map((item, id) => {
                        if (id === 0) return (<option key={id} value={id} disabled>{item}</option>)
                        return (<option key={id} value={id}>{item}</option>)
                      })}
                    </Form.Select>
                  </Form.Group>

                  {DataSet === '0' &&
                    <>
                      <Card.Text>
                        Ahora si lo deseas puedes cargar tu propia arquitectura, en caso contrario pulsa en continuar y
                        se cargará una arquitectura por defecto de ejemplo.
                      </Card.Text>
                      <Card.Text>Carga tu propia arquitectura en formato .json</Card.Text>
                      <DragAndDrop name={"doc"}
                                   id={"UploadArchitectureMenu"}
                                   accept={{ 'application/json': ['.json'] }}
                                   text={"Añada el fichero JSON"}
                                   function_DropAccepted={handleChange_ArchitectureUpload}/>
                    </>
                  }


                  <Button onClick={() => handleSubmit()}>
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
