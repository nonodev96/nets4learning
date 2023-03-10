import N4LNavBar from "../../components/navBar/N4LNavBar";
import { Accordion, Button, Card, Col, Container, Row, Table } from "react-bootstrap";
import N4LFooter from "../../components/footer/N4LFooter";
import React from "react";
import { FILE_TEMPLATE, FILE_TEMPLATE_IRIS, FILE_TEMPLATE_LYMPHATCS, FILE_TOPOLOGY } from "../../constants/files_examples";

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

              <Card className={"mt-3"} border={"primary"}>
                <Card.Header><h3>Descripción de la herramienta</h3></Card.Header>
                <Card.Body>

                </Card.Body>
              </Card>

              <Card className={"mt-3"}  border={"info"}>
                <Card.Header><h3>Clasificación tabular</h3></Card.Header>
                <Card.Body>
                  <Card.Text></Card.Text>
                </Card.Body>
              </Card>

              <Card className={"mt-3"}  border={"info"}>
                <Card.Header><h3>Identificación de objetos</h3></Card.Header>
                <Card.Body>
                  <Card.Text></Card.Text>
                </Card.Body>
              </Card>

              <Card className={"mt-3"} border={"info"}>
                <Card.Header><h3>Clasificador de imágenes</h3></Card.Header>
                <Card.Body>
                  <Card.Text></Card.Text>
                </Card.Body>
              </Card>

              <Card className={"mt-3"}  border={"info"}>
                <Card.Body>
                  <h4>Pasos para el entrenamiento</h4>
                  <ol>
                    <li>Subimos el conjunto de datos que queremos analizar. (<code onClick={() => handleClick_DownloadFile_TemplateDataset(FILE_TEMPLATE)}>dataset.json</code>)</li>
                    <li>Subimos una topología ya definida o la creamos nosotros. (<code onClick={handleClick_DownloadFile_CustomTopology}>my-model.json</code>)</li>
                    <li>Definimos los hiperparámetros de la red neuronal.</li>
                    <li>Entrenamos la red neuronal.</li>
                    <li>Predecir en función de los tipos de datos seleccionados (categóricos, reales, numéricos, etc...).</li>
                  </ol>

                  <Card.Text>Debes tener en cuenta la forma de los datos, puedes jugar con las capas de la red y descubrir diferentes comportamientos de la red.</Card.Text>
                  <Card.Text>Se recomienda para tareas de clasificación usar en las capas iniciales funciones de activación sigmoid, y en las capas finales funciones de activación softmax.</Card.Text>
                  <Card.Text>Debes tener el número de unidades de la última capa que coincida con el número de categorías que tu red puede predecir.</Card.Text>

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

                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </main>
      <N4LFooter/>
    </>
  )
}