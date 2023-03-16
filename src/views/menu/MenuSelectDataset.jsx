import React, { useState } from 'react'
import { Form, Button, Row, Col, Container, Card } from 'react-bootstrap'
import { useParams, useHistory } from 'react-router-dom'
import N4LNavbar from '../../components/header/N4LNavbar'
import N4LFooter from '../../components/footer/N4LFooter'
import DragAndDrop from "../../components/dragAndDrop/DragAndDrop";
import * as alertHelper from '../../utils/alertHelper'
import { LIST_MODEL_OPTIONS, LIST_TYPE_MODELS } from "../../DATA_MODEL";

export default function MenuSelectDataset(props) {
  const { id } = useParams()
  const [dataset_id, setDatasetId] = useState(-1)
  const [isUploadedArchitecture, setIsUploadedArchitecture] = useState(false)
  const history = useHistory()

  const handleSubmit = async () => {
    if (dataset_id === -1 || dataset_id === 'Selecciona un conjunto de datos') {
      await alertHelper.alertWarning('Debes de seleccionar un conjunto de datos')
    } else {
      if (!isUploadedArchitecture) {
        localStorage.setItem('custom-architecture', '{}')
      }
      history.push('/playground/' + id + '/' + 1 + '/' + dataset_id)
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

  const PrintHTML_OPTIONS = (_id) => {
    switch (_id) {
      case '0': {
        // Clasificación
        return <>
          <option value={1}>{LIST_MODEL_OPTIONS[0][1]}</option>
          <option value={2}>{LIST_MODEL_OPTIONS[0][2]}</option>
          <option value={3}>{LIST_MODEL_OPTIONS[0][3]}</option>
        </>
      }
      case '1': {
        // Regresión lineal
        return <>
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

  return (
    <>
      <N4LNavbar/>

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
                                 defaultValue={-1}
                                 onChange={(e) => setDatasetId(e.target.value)}>
                      <option value={-1} disabled>Selecciona un conjunto de datos</option>
                      {PrintHTML_OPTIONS(id)}
                    </Form.Select>
                  </Form.Group>

                  {dataset_id === '0' &&
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
