import React, { useState, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import { useParams } from "react-router";
import doIris from "../../../modelos/Clasificador";
import useLocalStorage from "../../../hooks/useLocalStorage";
import CodePen from "../../codePen/CodePen";
import "./Editor.css";

export default function Editor(props) {
  const { tipo } = props;

  const [html, setHtml] = useLocalStorage(
    "html",
    `<div id="demo" className={"borde console"} width="100%" height="100%"><p>Aquí se muestran los resultados</p></div>`
  );
  const [css, setCss] = useLocalStorage("css", "");
  const [js, setJs] = useLocalStorage("js", `hlhlhl`);
  const [srcDoc, setSrcDoc] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSrcDoc(`
      <html>
      <body>${html}</body>
      <style>${css}</style>
      <script>${js}</script>
      </html>
      `);
    }, 250);

    return () => clearTimeout(timeout);
  }, [html, css, js]);

  const modelsType = [
    "Clasificación clásica",
    "Clasificación de imágenes",
    "Identificación de objetos",
    "Regresión lineal",
  ];
  const { id } = useParams();

  const HandleButtonClasificador = async () => {
    await doIris(0.1);
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
      {}
      <div className="container">
        <div className="borde header-model-editor">
          <p>
            A continuación se ha pre cargado una arquitectura.
            Programa dentro de la función "createArchitecture".
            A esta función se el pasa un array preparado que continue la información del dataset.
          </p>
        </div>
      </div>
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
            <Col>
              {/* <iframe
                id="iframe"
                srcDoc={srcDoc}
                title="output"
                sandbox="allow-scripts"
                frameBorder="1"
                className="borde"
                width="100%"
                height="100%"
              /> */}
            </Col>
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
    </>
  );
}
