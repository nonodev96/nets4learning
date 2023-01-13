import React, { useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import Footer from '../../footer/Footer'
import NavBar from '../../navBar/NavBar'
import { modelsType } from '../initialMenu/InitialMenu'
import * as alertHelper from "../../../utils/alertHelper"


export const ModelList = [
  [
    'SUBIR MODELO PROPIO',
    'CLASIFICACIÓN DE COCHES',
    'IRIS-DATA - CLASIFICACIÓN DE PLANTA IRIS'
  ],
  [],
  [
    'SUBIR MODELO PROPIO',
    'GEOMETRÍA FACIAL',
    "FACE MESH",
    "DETECTOR DE ARTICULACIONES"
  ],
  [
    'SUBIR MODELO PROPIO',
    'MNIST - CLASIFICACIÓN DE NÚMEROS',
    'CLASIFICADOR DE IMÁGENES - MOBILENET',
    'CLASIFICADOR DE IMÁGENES - RESNET V2'
  ],
]

export default function UploadModelMenu(props) {
  const { id } = useParams()
  const [Model, setModel] = useState(-1)
  const [CustomModelJson, setCustomModelJson] = useState(false)
  const [CustomModelBin, setCustomModelBin] = useState(-1)
  const [a, seta] = useState()
  const [b, setb] = useState()
  const history = useHistory()

  const handleChangeModel = () => {
    let aux = document.getElementById('FormModel').value
    if (aux !== undefined) setModel(aux)
  }

  const handleSubmmit = async () => {
    // const jsonUpload = document.getElementById('json-upload')
    // const weightsUpload = document.getElementById('weights-upload')

    // localStorage.setItem('json', jsonUpload)
    // localStorage.setItem('bin', weightsUpload)
    // console.log(localStorage.getItem("json").files[0])
    // console.log('Vamos a ejecutar')
    // const model = await tf.loadLayersModel(
    //    tf.io.browserFiles([localStorage.getItem("json").files[0], localStorage.getItem("bin").files[0]]));
    //   console.log('Vamos a ejecutar')
    // const model = await tf.loadLayersModel(tf.io.browserFiles([a[0], b[0]]))

    if (
      (Model === -1 || Model === 'Selecciona un Modelo')
      // CustomModelJson === false &&
      // CustomModelBin === false
    ) {
      await alertHelper.alertWarning('Debes de seleccionar un modelo')
    } else {
      if (Model === -1 || Model === 'Selecciona un Modelo') {
        history.push(process.env.REACT_APP_DOMAIN + '/edit-architecture/' + id + '/' + 0 + '/' + -1)
      } else {
        history.push(process.env.REACT_APP_DOMAIN + '/edit-architecture/' + id + '/' + 0 + '/' + Model)
      }
    }
  }

  return (
    <>
      <NavBar/>
      <Form>
        <div className="container">
          <h1>{modelsType[id]}</h1>
          <div className="header-model-editor">
            <p>
              Selecciona a continuación el Modelo Pre-entrenado sobre el que se va a trabajar.
              Si deseas usar uno propio, utiliza la opción del desplegable y carga los archivos en la siguiente vista.
            </p>
          </div>
          {/* {numberClass.start()} */}
        </div>
        <div className="container">
          <Row>
            <Col>
              <Form.Group className="mb-3" controlId="FormModel">
                <Form.Label>Selecciona un Modelo</Form.Label>
                <Form.Select aria-label="Default select example"
                             onChange={handleChangeModel}>
                  <option>Selecciona un Modelo</option>
                  {ModelList[id].map((item, id) => {
                    return (<option key={id} value={id}>{item}</option>)
                  })}
                </Form.Select>
              </Form.Group>
            </Col>
            {/* <Col>
              <div className="header-model-editor">
                <p>
                  Carga tu propio Modelo. Ten en cuenta que tienes que subir
                  primero el archivo .json y despues el fichero .bin{' '}
                </p>
                <input
                  id="json-upload"
                  style={{ marginLeft: '1rem' }}
                  type="file"
                  name="json"
                  accept=".json"
                  // onChange={handleChangeModelJsonUpload}
                ></input>


              </div>
            </Col> */}
          </Row>
        </div>

        <div className="container">
          <Button className="btn-custom-description"
                  onClick={() => handleSubmmit()}>
            Continuar
          </Button>
        </div>
      </Form>
      <Footer/>
    </>
  )
}
