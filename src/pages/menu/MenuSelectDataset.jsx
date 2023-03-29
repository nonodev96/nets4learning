import React, { useState } from 'react'
import { Form, Button, Row, Col, Container, Card } from 'react-bootstrap'
import { useParams, useHistory } from 'react-router-dom'
import N4LNavbar from '../../components/header/N4LNavbar'
import N4LFooter from '../../components/footer/N4LFooter'
import DragAndDrop from "../../components/dragAndDrop/DragAndDrop";
import * as alertHelper from '../../utils/alertHelper'
import { LIST_TYPE_MODALITY } from "../../DATA_MODEL";
import { Trans, useTranslation } from "react-i18next";

export default function MenuSelectDataset(props) {
  const { id } = useParams()
  const [dataset_id, setDatasetId] = useState(-1)
  const [isUploadedArchitecture, setIsUploadedArchitecture] = useState(false)
  const history = useHistory()
  const { t } = useTranslation()

  const handleSubmit = async () => {
    if (dataset_id === -1) {
      await alertHelper.alertWarning(t("alert.warning.need-select-dataset"))
    } else {
      if (!isUploadedArchitecture) {
        localStorage.setItem('custom-architecture', '{}')
      }
      history.push('/playground/' + id + '/' + 1 + '/' + dataset_id)
    }
  }

  // TODO
  //
  // const handleChange_ArchitectureUpload = async (files) => {
  //   try {
  //     let reader = new FileReader()
  //     reader.readAsText(files[0])
  //     reader.onload = (e) => {
  //       localStorage.setItem('custom-architecture', e.target.result.toString())
  //       setIsUploadedArchitecture(true)
  //     }
  //     reader.onloadend = async () => {
  //       await alertHelper.alertSuccess(t("alert.file-upload-success"))
  //     }
  //   } catch (error) {
  //     await alertHelper.alertError(error)
  //   }
  // }
  //
  // const handleChange_CSVUpload = async (files) => {
  //   try {
  //     let reader = new FileReader()
  //     reader.readAsText(files[0])
  //     reader.onload = (e) => {
  //       localStorage.setItem('custom-csv', e.target.result.toString())
  //       setIsUploadedArchitecture(true)
  //     }
  //     reader.onloadend = async () => {
  //       await alertHelper.alertSuccess(t("alert.file-upload-success"))
  //     }
  //   } catch (error) {
  //     await alertHelper.alertError(error)
  //   }
  // }


  const PrintHTML_OPTIONS = (_id) => {
    switch (_id) {
      case '0': {
        // tabular-classification
        return <>
          <option value={0}>{t("pages.menu-selection-dataset.0-tabular-classification.csv")}</option>
          <option value={1}>{t("datasets-models.0-tabular-classification.list-datasets.0-option-1")}</option>
          <option value={2}>{t("datasets-models.0-tabular-classification.list-datasets.0-option-2")}</option>
          <option value={3}>{t("datasets-models.0-tabular-classification.list-datasets.0-option-3")}</option>
        </>
      }
      case '1': {
        // linear-regression
        console.warn("TODO")
        return <>
        </>
      }
      case '2': {
        // object-detection
        console.warn("TODO")
        return <>
        </>
      }
      case '3': {
        // image-classifier
        console.warn("TODO")
        return <>
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
              <Card.Header><h3>{t("modality." + id)}</h3></Card.Header>
              <Card.Body>
                <Card.Text>
                  {t("pages.menu-selection-dataset.form-description-1")}
                </Card.Text>
                <Form onSubmit={() => handleSubmit()}>
                  <Form.Group className="mb-3" controlId="FormDataSet">
                    <Form.Label>{t("pages.menu-selection-dataset.form-label")}</Form.Label>
                    <Form.Select aria-label={t("pages.menu-selection-dataset.form-label")}
                                 defaultValue={-1}
                                 onChange={(e) => setDatasetId(parseInt(e.target.value))}>
                      <option value={-1} disabled>{t("pages.menu-selection-dataset.form-option-_-1")}</option>
                      {PrintHTML_OPTIONS(id)}
                    </Form.Select>
                  </Form.Group>

                  {/*{dataset_id === 0 &&*/}
                  {/*  <>*/}
                  {/*    <Card.Text>*/}
                  {/*      <Trans i18nKey={"pages.menu-selection-dataset.0-tabular-classification.csv-text"}*/}
                  {/*             components={{*/}
                  {/*               code: <code>code</code>*/}
                  {/*             }} />*/}
                  {/*    </Card.Text>*/}
                  {/*    <DragAndDrop name={"doc"}*/}
                  {/*                 id={"UploadArchitectureMenu"}*/}
                  {/*                 accept={{ 'text/csv': ['.csv'] }}*/}
                  {/*                 text={t("drag-and-drop.csv")}*/}
                  {/*                 labelFiles={t("drag-and-drop.label-files-one")}*/}
                  {/*                 function_DropAccepted={handleChange_CSVUpload} />*/}
                  {/*  </>*/}
                  {/*}*/}


                  <Button type="submit">
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
