import React, { useState, useEffect } from "react"
import { useParams } from "react-router"
import { Col, Container, Row, Card } from "react-bootstrap"
import doIris from "../../modelos/Clasificador"
import useLocalStorage from "../../hooks/useLocalStorage"
import CodePen from "../../components/codePen/CodePen"
import "./Editor.css"

export default function Editor(props) {
  const { tipo } = props

  const { id } = useParams()

  const [html, setHtml] = useLocalStorage(
    "html",
    `<div id="demo" className={"borde console"} width="100%" height="100%"><p>Aquí se muestran los resultados</p></div>`
  )
  const [css, setCss] = useLocalStorage("css", "")
  const [js, setJs] = useLocalStorage("js", `hlhlhl`)

  const [srcDoc, setSrcDoc] = useState("")


  useEffect(() => {
    const timeout = setTimeout(() => {
      setSrcDoc(`
      <html lang="es">
      <body>${html}</body>
      <style>${css}</style>
      <script>${js}</script>
      </html>
      `)
    }, 250)

    return () => clearTimeout(timeout)
  }, [html, css, js])

  const HandleButtonClasificador = async () => {
    await doIris(0.1)
  };

  const handleClickPlay = () => {
    // const editText = document.getElementById("editorTexto");
    // console.log(editText);
    // fun(js);
    // let a = eval(js);
    // console.log("Esta es la salida", a);
    // const model=createClassicClassification(0.01,0.1,40,)
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

        <div className="container-fluid container-fluid-w1900">
          <Row className="editor">
            <Col className="codigo" xs={8} id="editorTexto">
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
                <div id="demo"
                     className="borde console"
                     width="100%"
                     height="100%">
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
