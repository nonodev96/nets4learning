/* eslint-disable eqeqeq */
import { useState, useEffect } from 'react'
import { Button, Col, Container, Row, Card } from 'react-bootstrap'
import * as tf from '@tensorflow/tfjs'
import * as numberClass from '../../../modelos/NumberClasificatorHelper.js'
import * as datosAuxiliares from '../../../modelos/data/imageClassification/imgaClassificationHelper'
import * as alertHelper from '../../../utils/alertHelper'
import CustomCanvasDrawer from '../../../utils/customCanvasDrawer'
import {
  getHTML_DATASET_DESCRIPTION,
  getNameDatasetByID_ImageClassification, LIST_MODEL_OPTIONS,
  MODEL_IMAGE_MNIST,
  MODEL_IMAGE_MOBILENET, MODEL_IMAGE_RESNET,
  MODEL_UPLOAD
} from "../../../DATA_MODEL";


export default function ModelReviewClassicImageClassification(props) {
  const { dataSet } = props

  const [ImageUploaded, setImageUploaded] = useState()
  const [Model, setModel] = useState(null)

  async function loadModel() {
    switch (getNameDatasetByID_ImageClassification(dataSet)) {
      case MODEL_UPLOAD: {

        break
      }
      case MODEL_IMAGE_MNIST: {
        const model = await tf.loadLayersModel(
          'http://localhost:3000/models/mnistClassification/mymodel.json'
        );
        // model.summary()
        setModel(model)
        await alertHelper.alertSuccess('Modelo cargado con éxito')
        break
      }
      case MODEL_IMAGE_MOBILENET: {
        // 'https://tfhub.dev/google/tfjs-model/imagenet/resnet_v1_50/classification/1/default/1',
        const model = await tf.loadGraphModel(
          'https://tfhub.dev/google/tfjs-model/imagenet/mobilenet_v1_050_192/classification/3/default/1',
          { fromTFHub: true },
        )
        setModel(model)
        await alertHelper.alertSuccess('Modelo cargado con éxito')
        break
      }
      case MODEL_IMAGE_RESNET: {
        const model = await tf.loadGraphModel(
          'https://tfhub.dev/google/tfjs-model/imagenet/resnet_v2_50/classification/1/default/1',
          { fromTFHub: true },
        )
        setModel(model)
        await alertHelper.alertSuccess('Modelo cargado con éxito')
        break
      }
    }
  }

  useEffect(() => {
    loadModel()
      .catch(console.error)
  }, [])

  const handleVectorTest = async () => {
    if (!ImageUploaded) {
      await alertHelper.alertError('Primero debes de subir una imagen')
      return
    }
    // FIXME
    let tensor4

    switch (getNameDatasetByID_ImageClassification(dataSet)) {
      case MODEL_UPLOAD: {
        try {
          const json = document.getElementById('json-upload')
          const weights = document.getElementById('weights-upload')
          // FIXME
          const model = await tf.loadLayersModel(
            tf.io.browserFiles([json.files[0], weights.files[0]]),
          )

          // Meter el arreglo en otro arreglo porque si no tio tensorflow se enoja >:(
          // Nah básicamente Debe estar en un arreglo nuevo en el índice 0, por ser un tensor4d en forma 1, 28, 28, 1
          let resultados = model.predict(tensor4).dataSync()
          let mayorIndice = resultados.indexOf(Math.max.apply(null, resultados))
          console.log('Predicción', mayorIndice)
          // alert('¿El número es un ' + mayorIndice + '?')
          await alertHelper.alertInfo('¿El número es un : ' + mayorIndice + '?', mayorIndice)
        } catch (error) {
          await alertHelper.alertError(error)
        }
        break
      }
      case MODEL_IMAGE_MNIST: {
        const canvas = document.getElementById('originalImage')
        const smallcanvas = document.getElementById('smallcanvas')
        let ctx2 = smallcanvas.getContext('2d')
        numberClass.resample_single(canvas, 28, 28, smallcanvas)

        let imgData = ctx2.getImageData(0, 0, 28, 28)
        let arr = [] //El arreglo completo
        let arr28 = [] //Al llegar a 28 posiciones se pone en 'arr' como un nuevo índice

        for (let p = 0; p < imgData.data.length; p += 4) {
          let valor = imgData.data[p + 3] / 255
          // Agregar al arr28 y normalizar a 0-1. Aparte guarde dentro de un arreglo en el índice 0... again
          arr28.push([valor])
          if (arr28.length === 28) {
            arr.push(arr28)
            arr28 = []
          }
        }
        arr = [arr]
        tensor4 = tf.tensor4d(arr)

        // FIXME: antes estaba abajo
        if (dataSet === '1') {
          let resultados = Model.predict(tensor4).dataSync()
          let mayorIndice = resultados.indexOf(Math.max.apply(null, resultados))
          // console.log('Predicción', mayorIndice)
          // document.getElementById('demo').innerHTML = mayorIndice
          // alert('¿El número es un ' + mayorIndice + '?')
          await alertHelper.alertInfo(`¿El número es un : ${mayorIndice}?`, mayorIndice)
        }
        break
      }
      case MODEL_IMAGE_MOBILENET:
      case MODEL_IMAGE_RESNET:
        const canvas = document.getElementById('originalImage')
        const ctx1 = canvas.getContext('2d')

        const resultCanvas = document.getElementById('resultCanvas')
        const ctx2 = resultCanvas.getContext('2d')

        resultCanvas.height = 224
        resultCanvas.width = 224

        const oc = document.createElement('canvas')
        const octx = oc.getContext('2d')
        // Set the width & height to 75% of image
        oc.width = canvas.width * 0.75
        oc.height = canvas.height * 0.75
        // step 2, resize to temporary size
        octx.drawImage(canvas, 0, 0, oc.width, oc.height)

        ctx2.drawImage(oc, 0, 0, oc.width, oc.height, 0, 0, resultCanvas.width, resultCanvas.height)

        const cat = document.getElementById('originalImage')
        // let tensor =  cast(browser.fromPixels(cat),'float32')
        let tensor = tf.browser.fromPixels(cat)
        console.log(tensor)
        tensor = tensor.expandDims(0)
        // tensor = expandDims(tensor, 0,)
        console.log(await tensor.data())

        tensor = tf.image.resizeBilinear(tensor, [224, 224])
        const offset = tf.scalar(127.5)

        const normalized = tensor
          .toFloat()
          .div(tf.scalar(127))
          .sub(tf.scalar(1))

        const solution = Model.predict(normalized)

        let a = solution.as1D().argMax().dataSync()[0]
        // let b=solution.as1D().argMax().print()
        console.log(a)
        console.log(datosAuxiliares.imageNameList[a])
        // alert("El modelo predice que la imagen es: "+datosAuxiliares.imageNameList[a])
        await alertHelper.alertInfo(
          'El modelo predice que la imagen es: ' + datosAuxiliares.imageNameList[a],
          datosAuxiliares.imageNameList[a]
        )
        break
    }
  }

  const handleVectorTestImageUpload = async () => {
    const canvas = document.getElementById('bigcanvas')
    const smallcanvas = document.getElementById('smallcanvas')
    let ctx2 = smallcanvas.getContext('2d')
    numberClass.resample_single(canvas, 28, 28, smallcanvas)
    let imgData = ctx2.getImageData(0, 0, 28, 28)
    let arr = [] // El arreglo completo
    let arr28 = [] // Al llegar a 28 posiciones se pone en 'arr' como un nuevo índice
    for (let p = 0; p < imgData.data.length; p += 4) {
      let valor = imgData.data[p + 3] / 255
      arr28.push([valor]) //Agregar al arr28 y normalizar a 0-1. Aparte guarda dentro de un arreglo en el índice 0... again
      if (arr28.length === 28) {
        arr.push(arr28)
        arr28 = []
      }
    }

    arr = [arr] // Meter el arreglo en otro arreglo porque si no tio tensorflow se enoja >:(
    // Nah básicamente Debe estar en un arreglo nuevo en el índice 0, por ser un tensor4d en forma 1, 28, 28, 1
    let tensor4 = tf.tensor4d(arr)
    let resultados = Model.predict(tensor4).dataSync()
    let mayorIndice = resultados.indexOf(Math.max.apply(null, resultados))

    console.log('Predicción', mayorIndice)
    // document.getElementById('demo').innerHTML = mayorIndice

    await alertHelper.alertInfo(`¿El número es un ${mayorIndice}?`, mayorIndice)
  }

  const handleChangeFileUpload = async (e) => {
    try {
      let tgt = e.target || window.event.srcElement;
      let files = tgt.files

      let canvas = document.getElementById('originalImage')
      let ctx1 = canvas.getContext('2d')

      let imageCanvas = document.getElementById('imageCanvas')
      let ctx2 = imageCanvas.getContext('2d')

      imageCanvas.height = 500
      imageCanvas.width = 500

      function draw() {
        // Dibujamos a tam original
        canvas.width = this.width
        canvas.height = this.height
        ctx1.drawImage(this, 0, 0)

        // Convertimos tam adaptado
        const oc = document.createElement('canvas')
        oc.width = canvas.width * 0.75
        oc.height = canvas.height * 0.75
        // step 2, resize to temporary size
        const octx = oc.getContext('2d')
        octx.drawImage(canvas, 0, 0, oc.width, oc.height)

        ctx2.drawImage(oc, 0, 0, oc.width, oc.height, 0, 0, imageCanvas.width, imageCanvas.height)
        setImageUploaded(true)
      }

      function failed() {
        alertHelper.alertError('Error al cargar el fichero')
      }

      let img = new Image()
      img.onload = draw
      img.onerror = failed
      img.src = URL.createObjectURL(files[0])
    } catch (error) {
      await alertHelper.alertError('Error al carga', error)
      console.log(error)
    }
  }

  function Print_HTML_Section() {
    switch (dataSet) {
      case MODEL_UPLOAD: {
        return <>

        </>
      }
      case MODEL_IMAGE_MNIST: {
        break
      }
      case MODEL_IMAGE_RESNET: {
        break
      }
      case MODEL_IMAGE_MOBILENET: {
        break
      }
    }
  }

  return (
    <>
      <Container id={"ModelReviewClassicImageClassification"}>

        <Row className={"mt-3"}>
          <Col>
            <Card>
              <Card.Header><h3>{LIST_MODEL_OPTIONS[3][dataSet]}</h3></Card.Header>
              <Card.Body>
                {{
                  0: <>
                    <div>
                      <p>Carga tu propio Modelo.</p>
                      <p>Primero el archivo .json y después el fichero .bin</p>
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
                  </>,
                }[dataSet]}
                {dataSet !== '0' ? (
                  <>
                    {getHTML_DATASET_DESCRIPTION(3, dataSet)}
                  </>
                ) : ("")}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className={"mt-3"}>
          <Col>
            <Card>
              <Card.Header><h3>Resultado</h3></Card.Header>
              <Card.Body>
                <Row>
                  <Col>
                    <CustomCanvasDrawer submitFunction={() => handleVectorTestImageUpload}/>
                  </Col>
                </Row>
                <Row className={"mt-3"}>
                  <Col>
                    <input style={{ marginBottom: '2rem' }}
                           type="file"
                           name="doc"
                           onChange={() => handleChangeFileUpload}></input>

                    <canvas id="originalImage" style={{ display: 'none' }}></canvas>
                    <canvas id="imageCanvas"></canvas>
                    <canvas id="resultCanvas" style={{ display: 'none' }}></canvas>

                    <div className="d-grid gap-2">
                      <Button type="button"
                              onClick={() => handleVectorTest}
                              variant={"primary"}>
                        Validar
                      </Button>
                    </div>
                  </Col>
                </Row>
                <Row className={"mt-3"}>
                  <Col>
                    <canvas id="smallcanvas"
                            width="28"
                            height="28"
                            style={{ display: 'none' }}></canvas>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  )
}
