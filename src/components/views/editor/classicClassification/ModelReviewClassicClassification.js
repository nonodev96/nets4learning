import React, { useState, useEffect } from 'react'
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap'
import * as tf from '@tensorflow/tfjs'
import { dataSetDescription, getHTML_DataSetDescription, } from '../../uploadArcitectureMenu/UploadArchitectureMenu'
import { IRIS_CLASSES, CAR_CLASSES, CAR_DATA_CLASSES } from '../../../../modelos/Clasificador'
import { ModelList } from '../../uploadModelMenu/UploadModelMenu'
import * as alertHelper from '../../../../utils/alertHelper'
import DragAndDrop from "../../../dragAndDrop/DragAndDrop";
import { getNameDatasetByID_ClassicClassification, MODEL_CAR, MODEL_IRIS, MODEL_UPLOAD } from "../../../../ModelList";
import { CONSOLE_LOG_h1, CONSOLE_LOG_h3 } from "../../../../Constantes";
import * as Icons from "react-bootstrap-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotate, faSpinner } from '@fortawesome/free-solid-svg-icons'

export default function ModelReviewClassicClassification(props) {
  const { dataSet } = props

  // Parte 1: Definimos (cargamos) el modelo
  const [Model, setModel] = useState()
  // Parte 2: Introducimos el vector a probar
  const [textToCheck, setTextToCheck] = useState()
  // Parte 3: Comprobamos con la lógica del modelo si funciona
  const [isButtonDisabled, setIsButtonDisabled] = useState(false)

  const handleChangeTestInput = () => {
    setTextToCheck(document.getElementById(`formTestInput`).value)
  }

  useEffect(() => {
    async function loadModel_CAR() {
      console.log('%cCargando modelo coches', CONSOLE_LOG_h3)
      const model = await tf.loadLayersModel(
        "http://localhost:3000/nets4learning/models/carClassification/mymodelCar.json"
      )
      model.summary()
      setModel(model)
      await alertHelper.alertSuccess("Modelo cargado con éxito")
    }

    async function loadModel_IRIS() {
      console.log('%cCargando modelo petalos', CONSOLE_LOG_h3)
      const model = await tf.loadLayersModel(
        "http://localhost:3000/nets4learning/models/irisClassification/mymodelIris.json"
      )
      model.summary()
      setModel(model)
      await alertHelper.alertSuccess("Modelo cargado con éxito")
    }

    const init = async () => {
      console.log({ dataSet })
      // dataset to CONST
      switch (getNameDatasetByID_ClassicClassification(dataSet)) {
        case MODEL_CAR:
          await loadModel_CAR()
          break;
        case MODEL_IRIS:
          await loadModel_IRIS()
          break;
      }
    }
    init()
      .catch(console.error)
  }, [])

  const handleVectorTest = async () => {
    console.log("handleVectorTest")
    setIsButtonDisabled(true)
    // Ejemplo modelo del coche
    // vhigh;vhigh;2;2;big;med
    if (textToCheck === undefined || textToCheck.length < 1) {
      await alertHelper.alertWarning('Introduce unos valores a probar')
      setIsButtonDisabled(false)
      return;
    }

    switch (getNameDatasetByID_ClassicClassification(dataSet)) {
      case MODEL_UPLOAD: {
        try {
          let input = [[], [1, textToCheck.split(';').length]]
          const json = document.getElementById('json-upload')
          const b = document.getElementById('weights-upload')
          const model = await tf.loadLayersModel(
            tf.io.browserFiles([json.files[0], b.files[0]]),
          )
          let i = 0
          textToCheck.split(';').forEach((element) => {
            input[0].push(i)
            i++
          })
          const tensor = tf.tensor2d(input[0], input[1])
          const predictionWithArgMax = model
            .predict(tensor)
            .argMax(-1)
            .dataSync()
          await alertHelper.alertInfo('La solución es el tipo: ' + predictionWithArgMax, predictionWithArgMax)
        } catch (error) {
          console.error(error)
          await alertHelper.alertError(error)
        }
        break;
      }
      case MODEL_CAR: {
        // FIXME
        try {
          console.log({ textToCheck })
          let array = textToCheck.split(';')
          let input = [[], [1, array.length]]
          let i = 0
          array.forEach((element) => {
            input[0].push(CAR_DATA_CLASSES[i].findIndex((element) => element === array[i]))
            i++
          })
          const tensor = tf.tensor2d(input[0], input[1])
          const prediction = Model.predict(tensor)
          const predictionWithArgMax = Model.predict(tensor)
            .argMax(-1)
            .dataSync()
          await alertHelper.alertInfo(
            `Este es el resultado: ${CAR_CLASSES[predictionWithArgMax]}.${prediction}`,
            CAR_CLASSES[predictionWithArgMax],
          )
        } catch (error) {
          console.error(error)
          await alertHelper.alertError("Error al evaluar el modelo. Revisa que los datos introducidos son correctos")
        }
        break;
      }
      case MODEL_IRIS: {
        try {
          let input = [[], [1, textToCheck.split(';').length]]
          textToCheck.split(';').forEach((element) => {
            input[0].push(parseFloat(element))
          })
          const tensor = tf.tensor2d(input[0], input[1])
          Model.summary()
          const prediction = Model.predict(tensor)
          const predictionWithArgMax = Model.predict(tensor)
            .argMax(-1)
            .dataSync()
          await alertHelper.alertInfo(
            `Este es el resultado: ${IRIS_CLASSES[predictionWithArgMax]}. ${prediction}`,
            IRIS_CLASSES[predictionWithArgMax],
          )
        } catch (error) {
          console.error(error)
          await alertHelper.alertError("Error al evaluar el modelo. Revisa que los datos introducidos son correctos")
        }
        break;
      }
    }

    setIsButtonDisabled(false)
  }

  const isValidDataSet = (dataset) => {
    return ['0', '1', '2'].some(v => v === dataset)
  }

  const getInfoDataSet = (dataSet) => {
    switch (getNameDatasetByID_ClassicClassification(dataSet)) {
      case MODEL_UPLOAD:
        return <>
          Introduce separado por punto y coma los valores. <br/>
          <b>(parámetro-1; parámetro-2; parámetro-3; ... ;parámetro-n).</b>
        </>
      case MODEL_CAR:
        return <>
          Introduce separado por punto y coma los siguientes valores correspondientes a el coche que se va a evaluar:
          <br/>
          <b>(buying; maint; doors; persons; lug_boot; safety).</b>
        </>
      case MODEL_IRIS:
        return <>
          Introduce separado por punto y coma los siguientes valores correspondientes a la planta que se va a evaluar:
          <br/>
          <b>(longitud sépalo;anchura sépalo;longitud petalo;anchura petalo).</b>
        </>
      default:
        return <>DEFAULT</>
    }
  }

  return (
    <>
      <Container id={"ModelReviewClassicClassification"}>
        <Row className={"mt-3"}>
          <Col>
            <Card>
              <Card.Body>
                <Card.Title>{ModelList[0][dataSet]}</Card.Title>
                <Card.Subtitle className="mb-3 text-muted">Carga tu propio Modelo.</Card.Subtitle>
                {dataSet === '0' ? (
                  <>
                    <Card.Text>
                      Ten en cuenta que tienes que subir primero el archivo .json y después el fichero .bin
                    </Card.Text>
                    <Row>
                      <Col xs={6} sm={6} md={6} lg={6} xl={6} xxl={6}>
                        <DragAndDrop name={"json"}
                                     id={"json-upload"}
                                     accept={{ 'application/json': ['.json'] }}
                                     text={"Añada el fichero JSON"}
                                     labelFiles={"Fichero:"}/>
                      </Col>
                      <Col xs={6} sm={6} md={6} lg={6} xl={6} xxl={6}>
                        <DragAndDrop name={"bin"}
                                     id={"weights-upload"}
                                     accept={{ 'application/octet-stream': ['.bin'] }}
                                     text={"Añada el fichero binario"}
                                     labelFiles={"Fichero:"}/>
                      </Col>
                    </Row>
                  </>
                ) : (
                  <> {getHTML_DataSetDescription(0, dataSet)}</>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {
          (isValidDataSet(dataSet)) &&
          <Row className={"mt-3"}>
            <Col>
              <Card>
                <Card.Body>
                  {getInfoDataSet(dataSet)}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        }

        <Row className={"mt-3"}>
          <Col>
            <Card>
              <Card.Body>
                <Card.Title>Resultado</Card.Title>
                {/* VECTOR TEST */}
                <Form.Group className="mb-3" controlId={'formTestInput'}>
                  <Form.Label>Introduce el vector a probar</Form.Label>
                  <Form.Control placeholder="Introduce el vector a probar"
                                onChange={handleChangeTestInput}/>
                </Form.Group>


                {/* SUBMIT BUTTON */}
                <div className="d-grid gap-2">
                  <Button type="button"
                          onClick={handleVectorTest}
                          disabled={isButtonDisabled}
                          size={"lg"}
                          variant="primary">
                    {isButtonDisabled ? (
                      <>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        <span className="visually-hidden">Cargando...</span>
                      </>
                    ) : (
                      <>Comprobar resultado</>
                    )}
                  </Button>
                </div>
              </Card.Body>

              {/*{isButtonDisabled &&*/}
              {/*  <div className="card-overlay">*/}
              {/*    <h3>Debes cargar el modelo</h3>*/}
              {/*    <FontAwesomeIcon icon={faRotate} spin={true} size={"2x"}/>*/}
              {/*  </div>*/}
              {/*}*/}
            </Card>

          </Col>
        </Row>
      </Container>
    </>
  )
}
