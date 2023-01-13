import { React, useState, useEffect } from 'react'
import * as tf from '@tensorflow/tfjs'
import { Col, Row, CloseButton } from 'react-bootstrap'
import { Form } from 'react-bootstrap'
import {
  createClassicClassification,
  createClassicClassificationCustomDataSet,
} from '../../../../modelos/ArchitectureHelper'
import './ClassicClassification.css'
import * as clasificador from '../../../../modelos/Clasificador'
import * as cochesDataset from '../../../../modelos/data/coches.json'
import { dataSetList, dataSetDescription } from '../../uploadArcitectureMenu/UploadArchitectureMenu'
import GraphicRed from '../../../../utils/graphicRed/GraphicRed.js'
import * as alertHelper from '../../../../utils/alertHelper'

export default function CustomDataSetClassification(props) {
  const { dataSet } = props

  //TODO: DEPENDIENDO DEL TIPO QUE SEA SE PRE CARGAN UNOS AJUSTES U OTROS
  const [nLayer, setNLayer] = useState()
  const [Layer, setLayer] = useState([])
  const NumberEpochs = 50
  const learningValue = 1
  const [Optimizer, setOptimizer] = useState('Adam')
  const [LossValue, setLossValue] = useState('CategoricalCrossentropy')
  const [MetricsValue, setMetricsValue] = useState('Accuracy')
  const [Model, setModel] = useState()
  const [string, setstring] = useState()
  const [NoEpochs, setNoEpochs] = useState(50)
  const [CustomDataSet, setCustomDataSet] = useState()
  const [DataSetClasses, setDataSetClasses] = useState([])
  const [UploadedArchitecture, setUploadedArchitecture] = useState(false)
  const [ActiveLayer, setActiveLayer] = useState()
  const [TargetSetClasses, setTargetSetClasses] = useState([])

  useEffect(() => {
    const uploadedArchitecture = localStorage.getItem('custom-architecture')
    if (uploadedArchitecture !== 'nothing') {
      setUploadedArchitecture(true)
      const uploadedJson = JSON.parse(uploadedArchitecture)
      const auxLayer = uploadedJson.modelTopology.config.layers
      let array = []
      for (let i = 0; i < auxLayer.length; i++) {
        array.push({
          units: auxLayer[i].config.units,
          activation: auxLayer[i].config.activation,
        })
      }
      setLayer(array)
      setNLayer(array.length)
      console.log('ahora hay algo', array)
      console.log([
        { units: 10, activation: 'Sigmoid' },
        { units: 3, activation: 'Softmax' },
      ])
    } else {
      setLayer([
        { units: 10, activation: 'Sigmoid' },
        { units: 3, activation: 'Softmax' },
      ])
      setNLayer(2)
      if (dataSet === 1) {
        setstring('vhigh;vhigh;2;2;big;med')
      } else {
        setstring('0.1;4.3;2.1;0.2')
      }
    }
    setActiveLayer(0)

  }, [])

  const OPTIMIZER_TYPE = [
    'Sgd',
    'Momentum',
    'Adagrag',
    'Adadelta',
    'Adam',
    'Adamax',
    'Rmsprop',
  ]

  const LOSS_TYPE = [
    'AbsoluteDifference',
    'ComputeWeightedLoss',
    'CosineDistance',
    'HingeLoss',
    'HuberLoss',
    'LogLoss',
    'MeanSquaredError',
    'SigmoidCrossEntropy',
    'SoftmaxCrossEntropy',
    'CategoricalCrossentropy',
  ]

  const METRICS_TYPE = [
    'BinaryAccuracy',
    'BinaryCrossentropy',
    'CategoricalAccuracy',
    'CategoricalCrossentropy',
    'CosineProximity',
    'MeanAbsoluteError',
    'MeanAbsolutePercentageErr',
    'MeanSquaredError',
    'Precision',
    'Recall',
    'SparseCategoricalAccuracy',
    'Accuracy',
  ]

  const ACTIVATION_TYPE = ['Sigmoid', 'Softmax']

  const handleClickPlay = async (event) => {
    event.preventDefault()
    console.log(dataSet, 'Este es el dataset')
    if (dataSet === 1) {
      console.log('hora')
      let aux = cochesDataset
      console.log(aux.datos[0])
      const [
        model,
        TARGET_SET_CLASSES,
        DATA_SET_CLASSES,
      ] = await createClassicClassificationCustomDataSet(
        parseInt(document.getElementById('formTrainRate').value) / 100,
        0.1,
        parseInt(NoEpochs),
        document.getElementById('FormOptimizer').value,
        Layer,
        LossValue,
        MetricsValue,
        aux,
      )
      setDataSetClasses(DATA_SET_CLASSES)
      setTargetSetClasses(TARGET_SET_CLASSES)
      setModel(model)
      await alertHelper.alertSuccess('Modelo entrenado con éxito')
    } else if (dataSet === 2) {
      console.log('hola es el dataset2')
      // await doIris(0.1)
      const model = await createClassicClassification(
        parseInt(document.getElementById('formTrainRate').value) / 100,
        0.1,
        parseInt(NoEpochs),
        document.getElementById('FormOptimizer').value,
        Layer,
        LossValue,
        MetricsValue,
      )
      setDataSetClasses([0, 1, 2, 3])
      setTargetSetClasses(clasificador.IRIS_CLASSES)
      setModel(model)
      await alertHelper.alertSuccess('Modelo entrenado con éxito')
    } else if (dataSet === 0) {
      if (CustomDataSet !== undefined) {
        const [
          model,
          TARGET_SET_CLASSES,
          DATA_SET_CLASSES,
        ] = await createClassicClassificationCustomDataSet(
          parseInt(document.getElementById('formTrainRate').value) / 100,
          0.1,
          parseInt(NoEpochs),
          document.getElementById('FormOptimizer').value,
          Layer,
          LossValue,
          MetricsValue,
          CustomDataSet,
        )
        setDataSetClasses(DATA_SET_CLASSES)
        setTargetSetClasses(TARGET_SET_CLASSES)
        setModel(model)
        await alertHelper.alertSuccess('Modelo entrenado con éxito')
      } else {
        await alertHelper.alertError('Primero debes de cargar la arquitectura')
      }
    }
    // console.log('Comenzamos a crear el modelo')
    // try {
    //   console.log('Estas sion las metricas', Layer)
    //   const model = await createClassicClassificationCustomDataSet(
    //     parseInt(document.getElementById('formTrainRate').value) / 100,
    //     0.1,
    //     parseInt(NoEpochs),
    //     document.getElementById('FormOptimizer').value,
    //     Layer,
    //     LossValue,
    //     MetricsValue,
    //     CustomDataSet
    //   )
    //   console.log('Modelo creado y entrenado')
    //   console.log(model)
    //   setModel(model)
    //   // const input = tf.tensor2d([0.1, 4.3, 2.1, 0.2], [1, 4])
    //   // const prediction = model.predict(input)
    //   // const predictionWithArgMax = model.predict(input).argMax(-1).dataSync()
    //   // console.log('Probamos el modelo con [0.1, 4.3, 2.1, 0.2], [1, 4]')

    //   // console.log('La solucion es:', predictionWithArgMax)

    //   // document.getElementById('demo').innerHTML =
    //   //   prediction + 'tipo: ' + getIrisDataType(predictionWithArgMax)
    //   // alert('Tipo: ' + getIrisDataType(predictionWithArgMax))
    // } catch (error) {
    //   console.log(error)
    // }
  }

  const handleVectorTest = async () => {
    // vhigh;vhigh;2;2;big;med;
    let input = [[], [1, string.split(';').length]]
    if (dataSet === 0) {
      if (CustomDataSet === undefined) {
        await alertHelper.alertError('Primero debes de cargar un dataSet')
        return
      }
    }
    if (Model === undefined) {
      await alertHelper.alertError('Primero debes de entrenar el modelo')
      return
    }
    if (dataSet === 2) {
      string.split(';').forEach((element) => {
        input[0].push(parseFloat(element))
      })
      console.log(input)
    } else {
      console.log(DataSetClasses)
      let i = 0
      string.split(';').forEach((element) => {
        if (isNaN(parseFloat(element))) {
          input[0].push(DataSetClasses[i].get(element))
        } else {
          input[0].push(DataSetClasses[i].get(parseFloat(element)))
        }
        i++
      })
    }

    const tensor = tf.tensor2d(input[0], input[1])
    const prediction = Model.predict(tensor)
    const predictionWithArgMax = Model.predict(tensor).argMax(-1).dataSync()

    console.log('La solucion es:', predictionWithArgMax)
    await alertHelper.alertInfo('Tipo: ' + TargetSetClasses[predictionWithArgMax],
      TargetSetClasses[predictionWithArgMax],
    )
    try {

      // document.getElementById('demo').innerHTML =
      // prediction + 'tipo: ' + TargetSetClasses[predictionWithArgMax]
      console.log(TargetSetClasses)
    } catch (error) {
      console.log(error)
    }
  }

  const handlerAddLayer = async () => {
    let array = Layer
    if (array.length < 6) {

      array.push({ units: 0, activation: 0 })
      setLayer(array)
      setNLayer(nLayer + 1)
    } else {
      await alertHelper.alertWarning("No se pueden añadir más capas")
    }
  }

  const handlerRemoveLayer = (idLayer) => {
    let array = Layer
    let array2 = []
    let i
    for (i = 0; i < idLayer; i++) {
      array2.push(array[i])
    }
    for (i = idLayer + 1; i < array.length; i++) {
      document.getElementById(
        `formUnitsLayer${i - 1}`,
      ).value = document.getElementById(`formUnitsLayer${i}`).value
      document.getElementById(
        `formActivationLayer${i - 1}`,
      ).value = document.getElementById(`formActivationLayer${i}`).value
      array2.push(array[i])
    }
    setLayer(array2)
    setNLayer(nLayer - 1)
  }

  const handleChangeUnits = (index) => {
    let array = Layer
    array[index].units = parseInt(
      document.getElementById(`formUnitsLayer${index}`).value,
    )
    setLayer(array)
  }

  const handleChangeTestInput = () => {
    console.log(document.getElementById(`formTestInput`).value)
    setstring(document.getElementById(`formTestInput`).value)
  }

  const handleChangeActivation = (index) => {
    let array = Layer
    array[index].activation = document.getElementById(
      `formActivationLayer${index}`,
    ).value
    setLayer(array)
  }

  const handleChangeNoEpochs = () => {
    let aux = document.getElementById('formNumberOfEpochs').value
    setNoEpochs(aux)
  }

  const handleChangeLoss = () => {
    let aux = document.getElementById('FormLoss').value
    if (aux !== undefined) {
      setLossValue(aux)
    } else {
    }
  }

  const handleChangeOptimization = () => {
    let aux = document.getElementById('FormOptimizer').value
    console.log(aux)
    if (aux !== undefined) {
      setOptimizer(aux)
    }
  }

  const handleChangeMetrics = () => {
    let aux = document.getElementById('FormMetrics').key
    if (aux !== undefined) {
      setMetricsValue(aux)
    }
  }

  const handleDownloadModel = () => {
    Model.save('downloads://mymodel')
  }

  function download(filename, textInput) {
    const element = document.createElement('a')
    element.setAttribute(
      'href',
      'data:text/plain;charset=utf-8, ' + encodeURIComponent(textInput),
    )
    element.setAttribute('download', filename)
    document.body.appendChild(element)
    element.click()
  }

  const downloadFile = () => {
    const url = 'plantilla.json'
    download(
      url,
      `{
        "datos": [
          ["dato1", "dato2", "dato3", "dato4", "dato5","resulaado1"],
          ["dato11", "dato12", "dato13", "dato14", "dato15","resultado2"],
          ["dato21", "dato22", "dato23", "dato24", "dato25","resultado3"],
          ["dato31", "dato32", "dato33", "dato34", "dato35","resultado4"],
          ["dato41", "dato42", "dato43", "dato44", "dato45","resultado5"],
          ["dato51", "dato52", "dato53", "dato54", "dato55","resultado6"]
        ]
      }`,
    )
  }

  const handleChangeFileUpload = (e) => {
    let files = e.target.files
    let reader = new FileReader()
    reader.readAsText(files[0])
    try {
      let object
      reader.onload = (e) => {
        // console.warn(e.target.result);
        object = JSON.parse(e.target.result)
        console.log('Este es el objeto', object)
        setCustomDataSet(object)
      }
    } catch (error) {
      console.warn(error)
    }
  }

  return (
    <>
      <Form onSubmit={handleClickPlay}>
        <div className="container">
          <div className="header-model-editor">
            {setUploadedArchitecture ? (
              <p>
                A continuación se ha pre cargado la arquitectura del fichero
                importado en la vista anterior. Modifica los parámetros a tu
                gusto para jugar con la red y descubrir diferentes
                comportamientos de la misma.
              </p>
            ) : (
              <p>
                A continuación se ha pre cargado una arquitectura. Modifica los
                parámetros a tu gusto para jugar con la red y descubrir
                diferentes comportamientos de la misma.
              </p>
            )}
          </div>
          {/* {numberClass.start()} */}
        </div>
        <div className="container">
          <h2>{dataSetList[0][dataSet]}</h2>
        </div>

        <div className="container">
          {dataSet === 0 ? (
            <div className="header-model-editor">
              <p>
                Carga tu propio dataSet con la siguiente <a href="" onClick={downloadFile} id="dwn-btn">estructura</a>
                pulsando este botón.
              </p>
              <input style={{ marginLeft: '1rem' }}
                     type="file"
                     name="doc"
                     onChange={handleChangeFileUpload}></input>
            </div>
          ) : (
            <div className="header-model-editor">
              {dataSetDescription[0][dataSet]}
            </div>
          )}

          {/* {numberClass.start()} */}
          <div className="header-model-editor">
            <p>Ahora vamos a ver la interfaz de edición de arquitectura. </p>
            <ul>
              <li>
                <b>A la izquierda </b><br/>
                se pueden ver las capas de neuronas, puedes agregar tantas como desees pulsando el botón "Añadir capa".
              </li>

              <li>
                Puedes modificar dos parámetros:
                <ul>
                  <li><b>Unidades de la capa:</b> cuantas unidades deseas que tenga esa capa</li>
                  <li><b>Función de activación:</b> función de activación para esa capa</li>
                </ul>
              </li>

              <li>
                <b>A la derecha </b><br/>
                Se pueden ver parámetros generales necesarios para la creación del modelo. <br/>
                Estos parámetros son:
              </li>
              <ul>
                <li>
                  <b>Tasa de entrenamiento:</b><br/>
                  Valor entre 0 y 100 el cual indica a la red qué cantidad de datos debe usar para el entrenamiento y
                  reglas para el test
                </li>
                <li>
                  <b>Nº de iteraciones:</b>
                  cantidad de ciclos que va a realizar la red (a mayor número, más tiempo tarda en entrenar)
                </li>
                <li>
                  <b>Optimizador:</b><br/>
                  Es una función que como su propio nombre indica se usa para optimizar los modelos.
                  Esto es frecuentemente usado para evitar estancarse en un máximo local.
                </li>
                <li>
                  <b>Función de pérdida:</b><br/>
                  Es un método para evaluar qué tan bien un algoritmo específico modela los datos otorgados
                </li>
                <li>
                  <b>Métrica:</b><br/>
                  Es evaluación para valorar el rendimiento de un modelo de aprendizaje automático
                </li>
              </ul>
              <br/>

              <li>
                <b>Crear y entrenar modelo.</b><br/>
                Una vez se han rellenado todos los campos anteriores podemos crear el modelo pulsando el botón.
              </li>

              <li>
                <b>Exportar modelo.</b><br/>
                Si hemos creado el modelo correctamente nos aparece este botón que nos permite exportar el modelo y
                guardarlo localmente.
              </li>

              <li>
                <b>Resultado.</b><br/>
                Un formulario que nos permite predecir el valor de salida a partir de los valores de entrada que
                introducimos, para ver la salida solamente hay que pulsar "Ver resultado".
              </li>

            </ul>
          </div>
        </div>

        {/* BLOCK 1 */}
        <div className="container">
          <GraphicRed layer={Layer} setActiveLayer={setActiveLayer} tipo={0}/>
          <Row>
            {/* SPECIFIC PARAMETERS */}
            <Col xl className="col-specific">
              <div className="container-fluid container-fluid-w1900">
                {Layer.map((item, index) => {
                  return (
                    <div key={index}>
                      <div className="container pane borde">
                        <div className="title-pane">
                          Capa {index + 1}
                          {/* <div className="spacer"></div> */}
                          <CloseButton
                            onClick={() => handlerRemoveLayer(index)}
                          />
                        </div>
                        {/* UNITS */}
                        <Form.Group className="mb-3"
                                    controlId={'formUnitsLayer' + index}>
                          <Form.Label>Unidades de la capa</Form.Label>
                          <Form.Control type="number"
                                        placeholder="Introduce el número de unidades de la capa"
                                        defaultValue={item.units}
                                        onChange={() => handleChangeUnits(index)}/>
                        </Form.Group>
                        {/* ACTIVATION FUNCTION */}
                        <Form.Group className="mb-3"
                                    controlId={'formActivationLayer' + index}>
                          <Form.Label>Selecciona la función de activación</Form.Label>
                          <Form.Select aria-label="Default select example"
                                       defaultValue={item.activation}
                                       onChange={() => handleChangeActivation(index)}>
                            <option>Selecciona la función de activación</option>
                            {ACTIVATION_TYPE.map((itemAct, indexAct) => {
                              return (<option key={indexAct} value={itemAct}>{itemAct}</option>)
                            })}
                          </Form.Select>
                          <Form.Text className="text-muted">
                            Será el optimizador que se usará para activar la función
                          </Form.Text>
                        </Form.Group>
                      </div>
                    </div>
                  )
                })}

                {/* ADD LAYER */}
                <button className="btn-add-layer"
                        type="button"
                        onClick={() => handlerAddLayer()}
                        variant="primary">
                  Añadir capa
                </button>
              </div>
            </Col>

            {/* GENERAL PARAMETERS */}
            <Col xl className="col-general">
              <div className="container borde general-settings">
                {/* LEARNING RATE */}
                <Form.Group className="mb-3" controlId="formTrainRate">
                  <Form.Label>Tasa de entrenamiento</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Introduce la tasa de entrenamiento"
                    defaultValue={learningValue}
                  />
                  <Form.Text className="text-muted">
                    Recuerda que debe ser un valor entre 0 y 100 (es un porcentaje)
                  </Form.Text>
                </Form.Group>

                {/* Nº OT ITERATIONS */}
                <Form.Group className="mb-3" controlId="formNumberOfEpochs">
                  <Form.Label>Nº de iteraciones</Form.Label>
                  <Form.Control type="number"
                                placeholder="Introduce el número de iteraciones"
                                defaultValue={NumberEpochs}
                                onChange={handleChangeNoEpochs}/>
                  <Form.Text className="text-muted">
                    *Mientras más alto sea, mas tardará en ejecutarse el entrenamiento
                  </Form.Text>
                </Form.Group>

                {/* OPTIMIZATION FUNCTION */}
                <Form.Group className="mb-3" controlId="FormOptimizer">
                  <Form.Label>Selecciona el optimizador</Form.Label>
                  <Form.Select aria-label="Default select example"
                               defaultValue={Optimizer}
                               onChange={handleChangeOptimization}>
                    <option>Selecciona el optimizador</option>
                    {OPTIMIZER_TYPE.map((item, id) => {
                      return (<option key={id} value={item}>{item}</option>)
                    })}
                  </Form.Select>
                  <Form.Text className="text-muted">
                    Será el optimizador que se usará para activar la función
                  </Form.Text>
                </Form.Group>
                {/* LOSS FUNCTION */}
                <Form.Group className="mb-3" controlId="FormLoss">
                  <Form.Label>Selecciona la función de pérdida</Form.Label>
                  <Form.Select aria-label="Default select example"
                               defaultValue={LossValue}
                               onChange={handleChangeLoss}>
                    <option>Selecciona la función de pérdida</option>
                    {LOSS_TYPE.map((item, id) => {
                      return (<option key={id} value={item}>{item}</option>)
                    })}
                  </Form.Select>
                  <Form.Text className="text-muted">
                    Será la función que se usará.
                  </Form.Text>
                </Form.Group>

                {/* METRICS FUNCTION */}
                <Form.Group className="mb-3" controlId="FormMetrics">
                  <Form.Label>Selecciona la métrica</Form.Label>
                  <Form.Select aria-label="Default select example"
                               defaultValue={MetricsValue}
                               onChange={handleChangeMetrics}>
                    <option>Selecciona la métrica</option>
                    {METRICS_TYPE.map((item, id) => {
                      return (<option key={id} value={item}>{item}</option>)
                    })}
                  </Form.Select>
                  <Form.Text className="text-muted">
                    Será el optimizador que se usará para activar la función
                  </Form.Text>
                </Form.Group>
              </div>
            </Col>
          </Row>

          {/* BLOCK  BUTTON */}
          <div className="col-specific cen">
            <button className="btn-add-layer mg-top "
                    type="submit"
                    variant="primary">
              Crear y entrenar modelo
            </button>
          </div>

          {/* SALIDA */}
          <div id="salida"></div>

          {Model === undefined ? ('') : (
            <button className="btn-add-layer"
                    type="button"
                    onClick={handleDownloadModel}
                    variant="primary">
              Exportar modelo
            </button>
          )}

          <div className="header-model-editor mg-top">
            <p>Para <b>ocultar y mostrar</b> el panel lateral pulsa la tecla <b>ñ</b>.</p>
          </div>
        </div>

        {/* BLOCK 2 */}
        <div className="container">
          <div className="header-model-editor mg-top">
            {dataSet === 1 ? (
              <p>
                Introduce separado por comas los siguientes valores
                correspondientes a el coche que se va a evaluar:{' '}
                <b>(buying, maint, doors, persons, lug_boot, safety).</b>
              </p>
            ) : dataSet === 2 ? (
              <p>
                Introduce separado por comas los siguientes valores
                correspondientes a la planta que se va a evaluar:{' '}
                <b>(longitud sépalo,anchura sépalo,longitud petalo,anchura petalo).</b>
              </p>
            ) : dataSet === 0 ? (
              <p>
                Introduce separado por comas los valores{' '}
                <b>(buying, maint, doors, persons, lug_boot, safety).</b>
              </p>
            ) : (
              ''
            )}
          </div>

          <Col className="col-specific cen">
            <div className="container-fluid container-fluid-w1900">
              <div className="container pane borde">
                <div className="title-pane">Resultado</div>
                {/* VECTOR TEST */}
                <Form.Group className="mb-3" controlId={'formTestInput'}>
                  <Form.Label>Introduce el vector a probar</Form.Label>
                  <Form.Control placeholder="Introduce el vector a probar"
                                defaultValue={dataSet === 1 ? 'vhigh;vhigh;2;2;big;med' : dataSet === 2 ? '0.1;4.3;2.1;0.2' : ''}
                                onChange={() => handleChangeTestInput()}/>
                </Form.Group>

                {/* SUBMIT BUTTON */}
                <button className="btn-add-layer"
                        type="button"
                        onClick={handleVectorTest}
                        variant="primary">
                  Ver resultado
                </button>
              </div>
            </div>
          </Col>
        </div>

        {/* BLOCK 3 */}
        {/* <div className="resultados">
          <Row>
            <Col>
              <div
                id="demo"
                className="borde console"
                width="100%"
                height="100%"
              >
                Aquí se muestran los resultados
              </div>
            </Col>
          </Row>
        </div> */}
      </Form>
    </>
  )
}
