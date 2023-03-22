import React, { useState } from 'react'
import { Form, Button, Row, Col, Container, Card } from 'react-bootstrap'
import { useParams, useHistory } from 'react-router-dom'
import N4LNavbar from '../../components/header/N4LNavbar'
import N4LFooter from '../../components/footer/N4LFooter'
import DragAndDrop from "../../components/dragAndDrop/DragAndDrop";
import * as alertHelper from '../../utils/alertHelper'
import { LIST_TYPE_MODALITY } from "../../DATA_MODEL";
import { useTranslation } from "react-i18next";

export default function MenuSelectDataset(props) {
  const { id } = useParams()
  const [dataset_id, setDatasetId] = useState(-1)
  const [isUploadedArchitecture, setIsUploadedArchitecture] = useState(false)
  const history = useHistory()
  const { t } = useTranslation()

  const handleSubmit = async () => {
    if (dataset_id === -1) {
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
          <option value={1}>{t("datasets.0-option-1")}</option>
          <option value={2}>{t("datasets.0-option-2")}</option>
          <option value={3}>{t("datasets.0-option-3")}</option>
        </>
      }
      case '1': {
        // Regresión lineal
        return <>
        </>
      }
      case '2': {
        // Identificación  no debe entrar aquí
        return <>
          <option value={1}>{t("models.2-option-1")}</option>
          <option value={2}>{t("models.2-option-2")}</option>
          <option value={3}>{t("models.2-option-3")}</option>
          <option value={4}>{t("models.2-option-4")}</option>
        </>
      }
      case '3': {
        // Clasificación imágenes no debe entrar aquí
        return <>
          <option value={1}>{t("models.2-option-1")}</option>
          <option value={2}>{t("models.2-option-2")}</option>
          <option value={3}>{t("models.2-option-3")}</option>
          <option value={4}>{t("models.2-option-4")}</option>
        </>
      }
      default: {
        console.error("Opción no disponible")
      }
    }
  }

  console.debug("render MenuSelectDataset")
  return (
    <>
      <N4LNavbar />

      <Container id={"MenuSelectDataset"}>
        <Row className="mt-3 mb-3">
          <Col>
            <Card>
              <Card.Header><h3>{LIST_TYPE_MODALITY[id]}</h3></Card.Header>
              <Card.Body>
                <Card.Text>
                  {t("pages.menu-selection-dataset.form-description-1")}
                </Card.Text>
                <Form>
                  <Form.Group className="mb-3" controlId="FormDataSet">
                    <Form.Label>{t("pages.menu-selection-dataset.form-label")}</Form.Label>
                    <Form.Select aria-label={t("pages.menu-selection-dataset.form-label")}
                                 defaultValue={-1}
                                 onChange={(e) => setDatasetId(parseInt(e.target.value))}>
                      <option value={-1} disabled>{t("pages.menu-selection-dataset.form-option-_-1")}</option>
                      {PrintHTML_OPTIONS(id)}
                    </Form.Select>
                  </Form.Group>

                  {dataset_id === 0 &&
                    <>
                      <Card.Text>
                        Ahora si lo deseas puedes cargar tu propia arquitectura, en caso contrario pulsa en continuar y
                        se cargará una arquitectura por defecto de ejemplo.
                      </Card.Text>
                      <Card.Text>Carga tu propia arquitectura en formato .json</Card.Text>
                      <DragAndDrop name={"doc"}
                                   id={"UploadArchitectureMenu"}
                                   accept={{ 'application/json': ['.json'] }}
                                   text={t("drag-and-drop.json")}
                                   labelFiles={t("drag-and-drop.label-files-one")}
                                   function_DropAccepted={handleChange_ArchitectureUpload} />
                    </>
                  }


                  <Button onClick={() => handleSubmit()}>
                    {t("pages.menu-selection-dataset.form-submit")}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <N4LFooter />
    </>
  )
}
