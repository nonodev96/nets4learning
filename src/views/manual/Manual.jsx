import { Accordion, Button, Card, Col, Container, Row } from "react-bootstrap";
import React from "react";
import { FILE_TEMPLATE, FILE_TEMPLATE_IRIS, FILE_TEMPLATE_LYMPHATCS, FILE_TOPOLOGY } from "../../constants/files_examples";
import N4LNavBar from "../../components/header/N4LNavbar";
import N4LFooter from "../../components/footer/N4LFooter";

export default function Manual(props) {


  const _download = (filename, textInput) => {
    const link = document.createElement('a')
    link.setAttribute('href', 'data:text/plain;charset=utf-8, ' + encodeURIComponent(textInput))
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    link.parentNode.removeChild(link);
  }

  const handleClick_DownloadFile_TemplateDataset = (FILE) => {
    _download(FILE.title, FILE.content)
  }

  const handleClick_DownloadFile_CustomTopology = () => {
    _download(FILE_TOPOLOGY.title, FILE_TOPOLOGY.content)
  }

  console.log("render")
  return (
    <>
      <N4LNavBar/>
      <main className={"mb-3"} data-title={"Manual"}>
        <Container>
          <Row className={"mt-2"}>
            <Col xl={12}>
              <h1>Manual</h1>
            </Col>
            <Col xl={12} className={"mt-3"}>
              <Card border={"primary"}>
                <Card.Header><h3>Objetivos de la herramienta</h3></Card.Header>
                <Card.Body>
                  <Card.Text>
                    Este proyecto muestra distintas tareas que pueden realizar las Redes Neuronales cuando se entrenan mediante aprendizaje automático, es por ello que vamos a abordar desde tres enfoques
                    (Clasificación, Identificar objetos, clasificar imágenes), cada uno de estos enfoques se explican a continuación en las siguientes entradas con una breve descripción de la técnica y como usar la herramienta con esa
                    técnica.
                  </Card.Text>
                  <Card.Text>
                    Algunos de los motivos por los que aprender redes neuronales es importante son los siguientes:
                  </Card.Text>
                  <ol>
                    <li>
                      <b>Aplicaciones prácticas</b>: Las redes neuronales se utilizan en una amplia variedad de aplicaciones, desde reconocimiento de voz y visión por computadora hasta análisis de datos y predicción de resultados.
                      Aprender sobre redes neuronales puede ayudar a los profesionales a desarrollar habilidades que pueden aplicarse en campos como la medicina, la ingeniería, la ciencia de datos, el marketing y muchos otros.
                    </li>
                    <li>
                      <b>Solución de problemas complejos</b>: Las redes neuronales son útiles para resolver problemas complejos que tienen múltiples variables y relaciones no lineales.
                      Al aprender redes neuronales, los profesionales pueden desarrollar soluciones más efectivas para estos tipos de problemas y mejorar la precisión y la eficiencia de sus análisis.
                    </li>
                    <li>
                      <b>Innovación tecnológica</b>: Las redes neuronales son una tecnología innovadora que sigue evolucionando y mejorando.
                      Aprender sobre redes neuronales puede ayudar a los profesionales a mantenerse actualizados en las últimas tendencias y desarrollos en el campo del aprendizaje automático y la inteligencia artificial.
                    </li>
                  </ol>
                  <Card.Text>
                    Las redes neuronales son una forma de aprendizaje automático que imita la forma en que funciona el cerebro humano.
                    Estas redes están diseñadas para aprender y mejorar continuamente a partir de datos y experiencias pasadas, permitiendo a las máquinas realizar tareas complejas que antes eran imposibles o muy difíciles para los sistemas
                    programados tradicionales.
                  </Card.Text>
                  <Card.Text>
                    En resumen, aprender redes neuronales es importante porque puede ayudar a los profesionales a desarrollar habilidades que son valiosas en una amplia variedad de campos, resolver problemas complejos de manera más efectiva
                    y mantenerse actualizados en la tecnología y la innovación.
                  </Card.Text>
                </Card.Body>
              </Card>

              <Accordion className={"mt-3"}>
                <Accordion.Item eventKey={"0"}>
                  <Accordion.Header><h3>Clasificación tabular</h3></Accordion.Header>
                  <Accordion.Body>
                    <h4>Modelos entrenados</h4>
                    <p>
                      Debemos acceder a la sección de modelos entrenados y seleccionar uno de los dos disponibles.
                    </p>
                    <ol>
                      <li>Clasificación de la evaluación por características del coche</li>
                      <li>Clasificación del tipo de flor por características de las flores</li>
                    </ol>
                    <p>
                      La herramienta cuenta con una lista de ejemplos representativos que permiten alterar el formulario de características.
                    </p>
                    <p>
                      Al acceder a la sección de la herramienta en ambos modelos podremos editar las características de los elemento a predecir.
                      La herramienta cuenta con formulario dinámico que permite cambiar los tipos de datos de entrada de la red neuronal.
                    </p>
                    <h4>Entrenar modelos</h4>
                    <p>
                      La herramienta cuenta con un visualizador de datos que permite mostrar las clases y los atributos del conjunto de datos.
                      Así como un gestor para crear, diseñar, entrenar y exportar un modelo de datos.
                    </p>
                    <p>
                      A la izquierda contamos con un editor de las distintas capas que tiene la red neuronal.
                      Se debe dejar que la ultima capa de la red tenga el mismo numero de unidades que clases a predecir.
                    </p>
                    <p>
                      A la derecha contamos con un editor de las distintos tipos de datos de para el entrenamiento, tasa de aprendizaje, numero de iteraciones, tamaño del banco de pruebas, función del optimizador, función de pérdida,
                      función de la métrica.
                    </p>
                    <p>
                      Debemos pulsar el botón de "Crear y entrenar modelo" para que se inicie el proceso de entrenamiento de la red neuronal.
                      Si toda la configuración y selección de las funciones es correcta entonces se añadirá en la tabla de abajo una entrada con los distintos modelos entrenados.
                    </p>
                    <p>
                      Una vez entrenado modelo de datos podremos realizar predicciones, para ello se incluye un formulario dinámico con las características del conjunto de datos.
                      En función del entrenamiento y las opciones seleccionadas, nuestro modelo irá prediciendo distintas clases objetivo con una mayor o menor precisión.
                    </p>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey={"2"}>
                  <Accordion.Header><h3>Identificación de objetos</h3></Accordion.Header>
                  <Accordion.Body>
                    <h4>Modelos entrenados</h4>
                    <p>
                      Dentro de la identificación de objetos contamos con cuatro modelos, para usar esta herramienta es tan sencillo como activar la opción de usar webcam o subir una imagen.
                    </p>
                    <p>
                      La sección de la herramienta cuenta con cuatro modelos de identificación de objetos, dichos modelos han sido optimizados para ser funcionales en dispositivos mobiles.
                    </p>
                    <ol>
                      <li>Identificación de la geometría facial.</li>
                      <li>Identificación de una malla facial completa.</li>
                      <li>Identificación de las articulaciones.</li>
                      <li>Identificación de objetos (también es un clasificador).</li>
                    </ol>
                    <p>
                      La herramienta en caso de activar la identificación por webcam se activara el filtro de forma que se pueda ver en tiempo real sobre la image de entrada los puntos que se están detectando.
                      En caso de usar la opción de subir imágenes podemos adjuntar un fichero en formato png o jpg, dicho fichero se cargarán en la misma sección en tres secciones, imagen original, filtro aplicado, imagen con el filtro
                      detectado.
                    </p>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey={"3"}>
                  <Accordion.Header><h3>Clasificador de imágenes</h3></Accordion.Header>
                  <Accordion.Body>
                    <h4>Modelos entrenados</h4>
                    <p>
                      En la sección del clasificador de imágenes podemos seleccionar entre dos ejemplos muy representativos de las redes neuronales.
                      Estos son el conjunto de imágenes mnist y el conjunto de imágenes.
                    </p>
                    <ol>
                      <li>MNIST, clasificador de imágenes que detecta números.</li>
                      <li>Mobilenet, clasificador de imágenes que puede detectar 1001 categorías.</li>
                    </ol>
                    <p>
                      En el modelo de MNIST se permite seleccionar entre una lista de imágenes que contienen un número, dibujar en un canvas el número a predecir o subir una imagen de un número.
                    </p>
                    <p>
                      En el modelo de Mobilenet se han incluido una lista de imágenes de ejemplo que pueden ser seleccionadas o podemos subir una imagen que la red neuronal analizará para poder clasificar.
                    </p>
                    <p>
                      Para ambos modelos el sistema hará una predicción que indicará el porcentaje de precisión que ha detectado.
                    </p>
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey={"0_1"} style={{ display: "none" }}>
                  <Accordion.Body>
                    <h4>Pasos para el entrenamiento</h4>
                    <ol>
                      <li>Subimos el conjunto de datos que queremos analizar. (<code onClick={() => handleClick_DownloadFile_TemplateDataset(FILE_TEMPLATE)}>dataset.json</code>)</li>
                      <li>Subimos una topología ya definida o la creamos nosotros. (<code onClick={handleClick_DownloadFile_CustomTopology}>my-model.json</code>)</li>
                      <li>Definimos los hiperparámetros de la red neuronal.</li>
                      <li>Entrenamos la red neuronal.</li>
                      <li>Predecir en función de los tipos de datos seleccionados (categóricos, reales, numéricos, etc...).</li>
                    </ol>
                    <p>Debes tener en cuenta la forma de los datos, puedes jugar con las capas de la red y descubrir diferentes comportamientos de la red.</p>
                    <p>Se recomienda para tareas de clasificación usar en las capas iniciales funciones de activación sigmoid, y en las capas finales funciones de activación softmax.</p>
                    <p>Debes tener el número de unidades de la última capa que coincida con el número de categorías que tu red puede predecir.</p>

                    <p className="text-muted">
                      Descarga ficheros con conjuntos de datos preparados:

                      <Button variant={"outline-info"}
                              size={"sm"}
                              onClick={() => handleClick_DownloadFile_TemplateDataset(FILE_TEMPLATE)}>Descargar plantilla</Button>
                      <Button variant={"outline-info ms-3"}
                              size={"sm"}
                              onClick={() => handleClick_DownloadFile_TemplateDataset(FILE_TEMPLATE_IRIS)}>Descargar conjunto de datos | iris</Button>
                      <Button variant={"outline-info ms-3"}
                              size={"sm"}
                              onClick={() => handleClick_DownloadFile_TemplateDataset(FILE_TEMPLATE_LYMPHATCS)}>Descargar conjunto de datos | lymphatcs</Button>

                    </p>

                    <p className="text-muted">
                      Descarga ficheros con arquitecturas de modelos preparados:
                      <Button variant={"outline-info"}
                              size={"sm"}
                              onClick={handleClick_DownloadFile_CustomTopology}>Descargar plantilla topología</Button>
                    </p>

                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Col>
          </Row>
        </Container>
      </main>
      <N4LFooter/>
    </>
  )
}