/* eslint-disable eqeqeq */
import { React, useState, useEffect } from 'react'
import {
  loadLayersModel,
  loadGraphModel,
  tensor4d,
  io,
  browser,
  image,
  scalar,
} from '@tensorflow/tfjs'
import { Col, Row } from 'react-bootstrap'
import * as numberClass from '../../../../modelos/NumberClasificatorHelper.js'
import { dataSetDescription } from '../../uploadArcitectureMenu/UploadArchitectureMenu'
import * as datosAuxiliares from '../../../../modelos/data/imageClassification/imgaClassificationHelper'
import { ModelList } from '../../uploadModelMenu/UploadModelMenu.js'
import * as alertHelper from '../../../../utils/alertHelper'
import CustomCanvasDrawer from '../../../../utils/customCanvasDrawer'

// var cv = require('opencv.js')

export default function ModelReviewClassicImageClassification(props) {
  const { dataSet } = props
  const tf = require('@tensorflow/tfjs');
  //const tfnode = require("@tensorflow/tfjs-node");
  
  const [ImageUploaded, setImageUploaded] = useState()
  const [Model, setModel] = useState()

  useEffect(() => {
    async function getModel() {
      if (dataSet == 1) {
        //const model = await loadLayersModel(
         // '../src/modelos/data/mnistClassification/mymodel.json',
        //)
		//const handler = tfn.io.fileSystem('../src/modelos/data/mnistClassification/mymodel.json');
	
        const model = await loadLayersModel('https://'+ process.env.REACT_APP_SOURCE_MODEL_DOMAIN +'/src/modelos/data/mnistClassification/mymodel.json');
        model.summary()
        setModel(model)
        alertHelper.alertSuccess('Modelo cargado con éxito')
      }
      if (dataSet == 2) {
        const model = await loadGraphModel(
          'https://tfhub.dev/google/tfjs-model/imagenet/mobilenet_v1_050_192/classification/3/default/1',
          // 'https://tfhub.dev/google/tfjs-model/imagenet/resnet_v1_50/classification/1/default/1',

          { fromTFHub: true },
        )
        console.log(model)

        setModel(model)
        alertHelper.alertSuccess('Modelo cargado con éxito')
      }
      if (dataSet == 3) {
        const model = await loadGraphModel(
          'https://tfhub.dev/google/tfjs-model/imagenet/resnet_v2_50/classification/1/default/1',
          { fromTFHub: true },
        )
        console.log(model)
        setModel(model)
        alertHelper.alertSuccess('Modelo cargado con éxito')
      }
    }

    if (dataSet != 0) {
      getModel()
    } else {
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleVectorTest = async () => {
    if (ImageUploaded) {
      if (dataSet == 1) {
        var canvas = document.getElementById('originalImage')
        var smallcanvas = document.getElementById('smallcanvas')
        var ctx2 = smallcanvas.getContext('2d')
        numberClass.resample_single(canvas, 28, 28, smallcanvas)

        var imgData = ctx2.getImageData(0, 0, 28, 28)
        var arr = [] //El arreglo completo
        var arr28 = [] //Al llegar a 28 posiciones se pone en 'arr' como un nuevo indice

        for (var p = 0; p < imgData.data.length; p += 4) {
          var valor = imgData.data[p + 3] / 255
          arr28.push([valor]) //Agregar al arr28 y normalizar a 0-1. Aparte queda dentro de un arreglo en el indice 0... again
          if (arr28.length == 28) {
            arr.push(arr28)
            arr28 = []
          }
        }
        arr = [arr]
        var tensor4 = tensor4d(arr)
      } else if (dataSet == 2 || dataSet == 3) {
        var canvas = document.getElementById('originalImage')
        var ctx1 = canvas.getContext('2d')

        var resultCanvas = document.getElementById('resultCanvas')
        var ctx2 = resultCanvas.getContext('2d')

        resultCanvas.height = 224
        resultCanvas.width = 224

        const oc = document.createElement('canvas')
        const octx = oc.getContext('2d')
        // Set the width & height to 75% of image
        oc.width = canvas.width * 0.75
        oc.height = canvas.height * 0.75
        // step 2, resize to temporary size
        octx.drawImage(canvas, 0, 0, oc.width, oc.height)

        ctx2.drawImage(
          oc,
          0,
          0,
          oc.width,
          oc.height,
          0,
          0,
          resultCanvas.width,
          resultCanvas.height,
        )

        const cat = document.getElementById('originalImage')
        // let tensor =  cast(browser.fromPixels(cat),'float32')
        let tensor = browser.fromPixels(cat)
        console.log(tensor)
        tensor = tensor.expandDims(0)
        // tensor = expandDims(tensor, 0,)
        console.log(await tensor.data())

        tensor = image.resizeBilinear(tensor, [224, 224])
        const offset = scalar(127.5)

        const normalized = tensor.toFloat().div(scalar(127)).sub(scalar(1))
        console.log(normalized)

        const solucion = Model.predict(normalized)

        let a = solucion.as1D().argMax().dataSync()[0]
        // let b=solucion.as1D().argMax().print()
        console.log(a)
        console.log(datosAuxiliares.imageNameList[a])
        // alert("El modelo predice que la imagen es: "+datosAuxiliares.imageNameList[a])
        alertHelper.alertInfo(
          'El modelo predice que la imagen es: ' +
            datosAuxiliares.imageNameList[a],
          datosAuxiliares.imageNameList[a],
        )
      }

      if (dataSet != 0) {
        if (dataSet == 1) {
          var resultados = Model.predict(tensor4).dataSync()
          var mayorIndice = resultados.indexOf(Math.max.apply(null, resultados))
          console.log('Prediccion', mayorIndice)
          // document.getElementById('demo').innerHTML = mayorIndice
          // alert('¿El número es un ' + mayorIndice + '?')
          alertHelper.alertInfo(
            '¿El número es un : ' + mayorIndice + '?',
            mayorIndice,
          )
        }

        if (dataSet == 2) {
        }
      } else {
        try {
          const json = document.getElementById('json-upload')
          const b = document.getElementById('weights-upload')
          const model = await loadLayersModel(
            io.browserFiles([json.files[0], b.files[0]]),
          )

          //Meter el arreglo en otro arreglo por que si no tio tensorflow se enoja >:(
          //Nah basicamente Debe estar en un arreglo nuevo en el indice 0, por ser un tensor4d en forma 1, 28, 28, 1
          var resultados = model.predict(tensor4).dataSync()
          var mayorIndice = resultados.indexOf(Math.max.apply(null, resultados))
          console.log('Prediccion', mayorIndice)
          // alert('¿El número es un ' + mayorIndice + '?')
          alertHelper.alertInfo(
            '¿El número es un : ' + mayorIndice + '?',
            mayorIndice,
          )
        } catch (error) {
          alertHelper.alertError(error)
        }
      }
    } else {
      alertHelper.alertError('Primero debes de subir una imagen')

      // alert('Primero debes de subir una imagen')
    }
  }

  const handleVectorTestImageUpload = async () => {
    var canvas
    canvas = document.getElementById('bigcanvas')
    var smallcanvas = document.getElementById('smallcanvas')
    var ctx2 = smallcanvas.getContext('2d')
    numberClass.resample_single(canvas, 28, 28, smallcanvas)
    var imgData = ctx2.getImageData(0, 0, 28, 28)
    var arr = [] //El arreglo completo
    var arr28 = [] //Al llegar a 28 posiciones se pone en 'arr' como un nuevo indice
    for (var p = 0; p < imgData.data.length; p += 4) {
      var valor = imgData.data[p + 3] / 255
      arr28.push([valor]) //Agregar al arr28 y normalizar a 0-1. Aparte queda dentro de un arreglo en el indice 0... again
      if (arr28.length == 28) {
        arr.push(arr28)
        arr28 = []
      }
    }

    arr = [arr] //Meter el arreglo en otro arreglo por que si no tio tensorflow se enoja >:(
    //Nah basicamente Debe estar en un arreglo nuevo en el indice 0, por ser un tensor4d en forma 1, 28, 28, 1
    var tensor4 = tensor4d(arr)
    var resultados = Model.predict(tensor4).dataSync()
    var mayorIndice = resultados.indexOf(Math.max.apply(null, resultados))

    console.log('Prediccion', mayorIndice)
    // document.getElementById('demo').innerHTML = mayorIndice

    alertHelper.alertInfo('¿El número es un ' + mayorIndice + '?', mayorIndice)
  }

  const handleChangeFileUpload = async (e) => {
    try {
      var tgt = e.target || window.event.srcElement,
        files = tgt.files

      var canvas = document.getElementById('originalImage')
      var ctx1 = canvas.getContext('2d')

      var imageCanvas = document.getElementById('imageCanvas')
      var ctx2 = imageCanvas.getContext('2d')

      imageCanvas.height = 500
      imageCanvas.width = 500

      function draw() {
        // Dibujamos a tam original
        canvas.width = this.width
        canvas.height = this.height
        ctx1.drawImage(this, 0, 0)

        // Convertimos tam adaptado
        const oc = document.createElement('canvas')
        const octx = oc.getContext('2d')
        oc.width = canvas.width * 0.75
        oc.height = canvas.height * 0.75
        // step 2, resize to temporary size
        octx.drawImage(canvas, 0, 0, oc.width, oc.height)

        ctx2.drawImage(
          oc,
          0,
          0,
          oc.width,
          oc.height,
          0,
          0,
          imageCanvas.width,
          imageCanvas.height,
        )
        setImageUploaded(true)
      }

      function failed() {
        alertHelper.alertError('Error al cargar el fichero')
      }

      var img = new Image()
      img.onload = draw
      img.onerror = failed
      img.src = URL.createObjectURL(files[0])
    } catch (error) {
      alertHelper.alertError('Error al carg', error)
      console.log(error)
    }
  }

  return (
    <div className="container">
      <div className="container">
        <h2>{ModelList[3][dataSet]}</h2>
      </div>
      <Col className="col-specific cen">
        <div className="container-fluid container-fluid-w1900">
          {dataSet == 0 ? (
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
              ></input>
              <input
                id="weights-upload"
                style={{ marginLeft: '1rem' }}
                type="file"
                accept=".bin"
                name="bin"
              ></input>
            </div>
          ) : (
            <div className="header-model-editor">
              {dataSetDescription[3][dataSet]}
            </div>
          )}

          <div className="container xtraPane borde">
            <div className="title-pane">Resultado</div>
            {/* VECTOR TEST */}
            {/* <Form.Group className="mb-3" controlId={'formTestInput'}>
              <Form.Label>Introduce el vector a probar</Form.Label>
              <Form.Control
                placeholder="Introduce el vector a probar"
                onChange={() => handleChangeTestInput()}
              />
            </Form.Group> */}

            {dataSet != 2 && dataSet != 3 ? (
              <Row>
                <Col
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}
                >
                  <CustomCanvasDrawer
                    submitFunction={handleVectorTestImageUpload}
                  />
                </Col>
                <Col
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'column',
                    marginBottom: '2rem',
                  }}
                >
                  <input
                    style={{ marginBottom: '2rem' }}
                    type="file"
                    name="doc"
                    onChange={handleChangeFileUpload}
                  ></input>
                  <canvas
                    id="originalImage"
                    style={{ display: 'none' }}
                  ></canvas>
                  <canvas id="imageCanvas"></canvas>
                  <canvas
                    id="resultCanvas"
                    style={{ display: 'none' }}
                  ></canvas>
                  <button
                    type="button"
                    onClick={handleVectorTest}
                    className="btn-custom-canvas green"
                  >
                    Validar
                  </button>
                </Col>
                <canvas
                  id="smallcanvas"
                  width="28"
                  height="28"
                  style={{ display: 'none' }}
                ></canvas>
              </Row>
            ) : (
              <div>
                <input
                  style={{ marginBottom: '2rem' }}
                  type="file"
                  name="doc"
                  onChange={handleChangeFileUpload}
                ></input>
                <canvas id="originalImage" style={{ display: 'none' }}></canvas>
                <canvas id="imageCanvas"></canvas>
                <canvas id="resultCanvas" style={{ display: 'none' }}></canvas>
                {/* SUBMIT BUTOON */}
                <button
                  style={{ marginTop: '2rem' }}
                  className="btn-add-layer"
                  type="button"
                  onClick={handleVectorTest}
                  variant="primary"
                >
                  Ver resultado
                </button>
              </div>
            )}
          </div>
        </div>
      </Col>
    </div>
  )
}
