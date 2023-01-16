import { useState, useEffect } from 'react'
import { Button, Col, Form } from 'react-bootstrap'
import * as tf from '@tensorflow/tfjs'
import { dataSetDescription, } from '../../uploadArcitectureMenu/UploadArchitectureMenu'
import { IRIS_CLASSES, CAR_CLASSES, CAR_DATA_CLASSES } from '../../../../modelos/Clasificador'
import { ModelList } from '../../uploadModelMenu/UploadModelMenu'
import * as alertHelper from '../../../../utils/alertHelper'

export default function ModelReviewClassicClassification(props) {
  const { dataSet } = props

  const [String, setString] = useState()
  const [Model, setModel] = useState()

  const handleChangeTestInput = () => {
    setString(document.getElementById(`formTestInput`).value)
  }

  useEffect(() => {
    // async function getModel() {
    //   const model = await doIris(0.01, false)
    //   setModel(model)
    // }

    async function getModel1() {
      const model = await tf.loadLayersModel(
        'https://' + process.env.REACT_APP_SOURCE_MODEL_DOMAIN + '/src/modelos/data/carClassification/mymodelCar.json',
      )
      model.summary()
      setModel(model)
      alertHelper.alertSuccess("Modelo cargado con éxito")
    }

    async function getModel2() {
      var modelo = null
      modelo = await tf.loadLayersModel(
        "https://" + process.env.REACT_APP_SOURCE_MODEL_DOMAIN + "/src/modelos/data/irisClassification/mymodelIris.json",
      )
      modelo.summary()
      setModel(modelo)
      await alertHelper.alertSuccess("Modelo cargado con éxito")
    }

    if (dataSet === 2) {
      getModel2()
    } else if (dataSet === 1) {
      getModel1()
    } else {
    }
  }, [])

  const handleVectorTest = async () => {
    // vhigh;vhigh;2;2;big;med;
    if (String === undefined || String.length < 1) {
      await alertHelper.alertWarning('Introduce unos valores a probar')
    } else {
      if (dataSet === 2) {
        try {
          let input = [[], [1, String.split(';').length]]

          String.split(';').forEach((element) => {
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
          await alertHelper.alertError("Error al evaluar el modelo. Revisa que los datos introducidos son correctos")
        }
      } else if (dataSet === 1) {
        try {
          let array = String.split(';')
          let input = [[], [1, array.length]]
          let i = 0
          array.forEach((element) => {
            input[0].push(
              CAR_DATA_CLASSES[i].findIndex((element) => element === array[i]),
            )
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
          await alertHelper.alertError("Error al evaluar el modelo. Revisa que los datos introducidos son correctos")
        }
      } else {
        try {
          let input = [[], [1, String.split(';').length]]
          const json = document.getElementById('json-upload')
          const b = document.getElementById('weights-upload')
          const model = await tf.loadLayersModel(
            tf.io.browserFiles([json.files[0], b.files[0]]),
          )

          let i = 0
          String.split(';').forEach((element) => {
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
          await alertHelper.alertError(error)
        }
      }
    }
  }

  return (
    <>
      <div className="container" id={"ModelReviewClassicClassification"}>
        <div className="container">
          <h2>{ModelList[0][dataSet]}</h2>
        </div>
        <Col className="col-specific cen">
          <div className="container-fluid container-fluid-w1900">
            {dataSet === 0 ? (
              <div className="header-model-editor">
                <p>
                  Carga tu propio Modelo. Ten en cuenta que tienes que subir
                  primero el archivo .json y después el fichero .bin
                </p>
                <input id="json-upload"
                       style={{ marginLeft: '1rem' }}
                       type="file"
                       name="json"
                       accept=".json"></input>
                <input id="weights-upload"
                       style={{ marginLeft: '1rem' }}
                       type="file"
                       accept=".bin"
                       name="bin"></input>
              </div>
            ) : (
              <div className="header-model-editor">
                {dataSetDescription[0][dataSet]}
              </div>
            )}

            <div className="header-model-editor mt-3">
              {dataSet === 1 ? (
                <p>
                  Introduce separado por punto y coma los siguientes valores
                  correspondientes a el coche que se va a evaluar:{' '}
                  <b>(buying; maint; doors; persons; lug_boot; safety).</b>
                </p>
              ) : dataSet === 2 ? (
                <p>
                  Introduce separado por punto y coma los siguientes valores
                  correspondientes a la planta que se va a evaluar:{' '}
                  <b>(longitud sépalo;anchura sépalo;longitud petalo;anchura petalo).</b>
                </p>
              ) : dataSet === 0 ? (
                <p>
                  Introduce separado por punto y coma los valores{' '}
                  <b>(buying; maint; doors; persons; lug_boot; safety).</b>
                </p>
              ) : (
                ''
              )}
            </div>
            <div className="container pane borde">
              <div className="title-pane">Resultado</div>
              {/* VECTOR TEST */}
              <Form.Group className="mb-3" controlId={'formTestInput'}>
                <Form.Label>Introduce el vector a probar</Form.Label>
                <Form.Control
                  placeholder="Introduce el vector a probar"
                  onChange={() => handleChangeTestInput()}
                />
              </Form.Group>

              {/* SUBMIT BUTTON */}
              <Button className="btn-add-layer"
                      type="button"
                      onClick={handleVectorTest}
                      variant="primary">
                Ver resultado
              </Button>
            </div>
          </div>
        </Col>
      </div>
    </>
  )
}
