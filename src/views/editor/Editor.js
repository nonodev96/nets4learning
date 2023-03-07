import React, { useState, useEffect } from "react"
import { useParams } from "react-router"
import { Col, Container, Row, Card } from "react-bootstrap"
import { doIris } from "../../modelos/ClassificationHelper_IRIS"
import useLocalStorage from "../../hooks/useLocalStorage"
import CodePen from "../../components/codePen/CodePen"
import "./Editor.css"

export default function Editor(props) {
  const { tipo } = props

  const { id } = useParams()

  const [html, setHtml] = useLocalStorage(
    "html",
    `<div id="demo" className={"console"}><p>Aquí se muestran los resultados</p></div>`
  )
  const [css, setCss] = useLocalStorage("css", "")
  const [js, setJs] = useLocalStorage("js", ``)

  const [srcDoc, setSrcDoc] = useState("")


  useEffect(() => {
    const timeout = setTimeout(() => {
      setSrcDoc(`
      <html lang="es">
      <head>
        <title>Test</title>
        <style>${css}</style>
      </head>
      <body>
        ${html}
        <script>${js}</script>
      </body>
      </html>
      `)
    }, 250)

    return () => clearTimeout(timeout)
  }, [html, css, js])

  const HandleButtonClasificador = async () => {
    // await doIris(0.1)
  };

  const handleClickPlay = () => {
    console.trace("handleClickPlay")
  };

  return (
    <>
      <Container id={"Editor"}>
        <Row className={"mt-3"}>
          <Col>
            <Card>
              <Card.Body>
                <Card.Text>A continuación se ha pre cargado una arquitectura.</Card.Text>
                <Card.Text>Programa dentro de la función "createArchitecture".</Card.Text>
                <Card.Text>
                  A esta función se el pasa un array preparado que continue la información del conjunto de datos.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <div className="container-fluid ">
          <Row className="mt-3 editor">
            <Col  xs={8} className="codigo"id="editorTexto">
              <div className="pane borde">
                <CodePen language="javascript"
                         displayName="JS"
                         value={js}
                         onChange={setJs}/>
              </div>
            </Col>
            <Col className="buttons-group">
              <div className="container items">
                <Row className="items2">
                  <Col>
                    <p>Aquí puedes ejecutar el código que has creado o añadir diferentes capas al modelo</p>
                  </Col>
                  <Col>
                    <button onClick={handleClickPlay}
                            className="btn-custom green play"
                            type="button">
                      Play
                    </button>
                  </Col>
                  <Col>
                    <button onClick={HandleButtonClasificador}
                            className="btn-custom red clear"
                            type="button">
                      Clear
                    </button>
                  </Col>
                </Row>

                <Row className="items2">
                  <p>Añade una neurona básica</p>
                  <button className="btn-custom blue"
                    // onClick={HandleButtonClasificador}
                          type="button">
                    Tipo Clasificador
                  </button>
                </Row>
                <Row className="items2">
                  <p>Añade una neurona básica</p>
                  <button className="btn-custom yellow" type="button">
                    Tipo 2
                  </button>
                </Row>
                <Row className="items2">
                  <p>Añade una neurona básica</p>
                  <button className="btn-custom green" type="button">
                    Tipo 2
                  </button>
                </Row>
                <Row className="items2">
                  <p>Añade una neurona básica</p>
                  <button className="btn-custom red" type="button">
                    Tipo 2
                  </button>
                </Row>
              </div>
            </Col>
          </Row>
          <div id="resultado">Aquí va el Resultado</div>
          <div className="">
            <Row>
              <Col></Col>
              <Col>
                <div id="demo" className="console">
                  <p>Aquí se muestran los resultados</p>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </Container>
    </>
  );
}
