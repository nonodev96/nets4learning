import React, { useState, useEffect } from "react";
import "./Editor.css";
import { Col, Row } from "react-bootstrap";
import NavBar from "../../navBar/NavBar";
import Footer from "../../footer/Footer";
import doIris from "../../../modelos/Clasificador";
import { useParams } from "react-router";
import useLocalStorage from "../../../hooks/useLocalStorage";
import CodePen from "../../codePen/CodePen";

export default function Editor() {
  const [html, setHtml] = useLocalStorage(
    "html",
    `<div id="demo" className="borde console" width="100%" height="100%"><p>Aquí se muestran los resultados</p></div>`
  );
  const [css, setCss] = useLocalStorage("css", "");
  const [js, setJs] = useLocalStorage(
    "js",
    `async function trainModel(xTrain, yTrain, xTest, yTest) {
    const model = tf.sequential();
    const learningRate = 0.01;
    const numberOfEpoch = 40;
    const optimizer = tf.train.adam(learningRate);
  
    model.add(
      tf.layers.dense({
        units: 10,
        activation: "sigmoid",
        inputShape: [xTrain.shape[1]],
      })
    );
  
    model.add(tf.layers.dense({ units: 3, activation: "softmax" }));
  
    model.compile({
      optimizer: optimizer,
      loss: "categoricalCrossentropy",
      metrics: ["accuracy"],
    });
  
    const history = await model.fit(xTrain, yTrain, {
      epochs: numberOfEpoch,
      validationData: [xTest, yTest],
      callbacks: {
        onEpochEnd: async (epoch, logs) => {
          var mostrar=document.getElementById("demo").innerHTML +="Epoch: " + epoch + " Logs:" + logs.loss);
          await tf.nextFrame();
        },
      },
    });
    return model;
  }
  
  async function doIris(testSplit) {
    const [xTrain, yTrain, xTest, yTest] = getIrisData(testSplit);
    const model = await trainModel(xTrain, yTrain, xTest, yTest);
  
    const input = tf.tensor2d([0.1, 4.3, 2.1, 0.2], [1, 4]);
    const prediction = model.predict(input);
  
    const predictionWithArgMax = model.predict(input).argMax(-1).dataSync();
    alert(prediction + "tipo: " + IRIS_CLASSES[predictionWithArgMax]);
  }
  
  var console = {
    panel: $(parent.document.body).append("<div>"),
    log: function(m){
    this.panel.prepend("<div>"+m+"</div>");
    }
    };
    console.log("message");`
  );
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
    "Clasificación de imágenes",
    "Regresión lineal",
    "Clasificación clásica",
  ];
  const { id } = useParams();

  const HandleButtonClasificador = async () => {
    await doIris(0.1);
  };

  const getExampleText = (id) => {
    console.log(id);
    switch (parseInt(id)) {
      case 0:
        return `async function trainModel(xTrain, yTrain, xTest, yTest) {
          const model = tf.sequential();
          const learningRate = 0.01;
          const numberOfEpoch = 40;
          const optimizer = tf.train.adam(learningRate);
        
          model.add(
            tf.layers.dense({
              units: 10,
              activation: "sigmoid",
              inputShape: [xTrain.shape[1]],
            })
          );
        
          model.add(tf.layers.dense({ units: 3, activation: "softmax" }));
        
          model.compile({
            optimizer: optimizer,
            loss: "categoricalCrossentropy",
            metrics: ["accuracy"],
          });
        
          const history = await model.fit(xTrain, yTrain, {
            epochs: numberOfEpoch,
            validationData: [xTest, yTest],
            callbacks: {
              onEpochEnd: async (epoch, logs) => {
                console.log("Epoch: " + epoch + " Logs:" + logs.loss);
                await tf.nextFrame();
              },
            },
          });
          return model;
        }
        
        async function doIris(testSplit) {
          const [xTrain, yTrain, xTest, yTest] = getIrisData(testSplit);
          const model = await trainModel(xTrain, yTrain, xTest, yTest);
        
          const input = tf.tensor2d([0.1, 4.3, 2.1, 0.2], [1, 4]);
          const prediction = model.predict(input);
        
          const predictionWithArgMax = model.predict(input).argMax(-1).dataSync();
          alert(prediction + "\ntipo: " + IRIS_CLASSES[predictionWithArgMax]);
        }
        var console = {
          panel: $(parent.document.body).append("<div>"),
          log: function(m){
          this.panel.prepend("<div>"+m+"</div>");
          }
          };
          console.log("message");`;

      case 1:
        return "Ejemplo 2";
      case 2:
        return "Ejemplo 3";
      default:
        console.log("pasamos", id);
        return `function onLoad(editor) {\nconsole.log("I'm ready to Code!");\n}`;
    }
  };

  const handleClickPlay = () => {
    // const editText = document.getElementById("editorTexto");
    // console.log(editText);
    eval(js);
  };

  return (
    <>
      {/* <NavBar /> */}
      <div className="container">
        <div className="borde header-model-editor">
          <h1>{modelsType[id]}</h1>
          <p>
            Aquí puedes encontrar un modelo creado, el cual puedes editarlo y
            observar como funciona.
          </p>
        </div>
      </div>
      <div className="container-fluid container-fluid-w1900">
        <Row className="editor">
          <Col className="codigo" xs={8} id="editorTexto">
            {/* <AceEditor
              id="editorTexto"
              width="100%"
              height="100%"
              placeholder="Write here your code"
              mode="javascript"
              theme="solarized_dark"
              name="blah2"
              fontSize={18}
              showPrintMargin={true}
              showGutter={true}
              highlightActiveLine={true}
              value={getExampleText(id)}
              setOptions={{
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: false,
                enableSnippets: true,
                showLineNumbers: true,
                tabSize: 2,
              }}
            /> */}
            <div className="pane borde">
              {/* <CodePen
                language="xml"
                displayName="HTML"
                value={html}
                onChange={setHtml}
              /> */}
              <CodePen
                language="javascript"
                displayName="JS"
                value={js}
                onChange={setJs}
              />
              {/* <CodePen
                language="css"
                displayName="CSS"
                value={css}
                onChange={setCss}
              /> */}
            </div>
            {/* <div className="pane">
              <iframe
                srcDoc={srcDoc}
                title="output"
                sandbox="allow-scripts"
                frameBorder="0"
                width="100%"
                height="100%"
              />
            </div> */}
          </Col>
          <Col className="buttons-group">
            <div className="container items">
              <Row className="items2">
                <p>
                  Aquí puedes ejecutar el código que has creado o añadir
                  diferentes capas al modelo
                </p>
                <Col>
                  <button
                    onClick={handleClickPlay}
                    className="btn-custom green play"
                    type="button"
                  >
                    Play
                  </button>
                </Col>
                <Col>
                  <button
                    // onClick={}
                    onClick={HandleButtonClasificador}
                    className="btn-custom red clear"
                    type="button"
                  >
                    Clear
                  </button>
                </Col>
              </Row>

              <Row className="items2">
                <p>Añade una neurona básica</p>
                <button
                  // onClick={HandleButtonClasificador}
                  className="btn-custom blue"
                  type="button"
                >
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
        <div id="resultado">Aqui va el Resultado</div>
        <div className="">
          <Row>
            <Col>
              <iframe
                id="iframe"
                srcDoc={srcDoc}
                title="output"
                sandbox="allow-scripts"
                frameBorder="1"
                className="borde"
                width="100%"
                height="100%"
              />
            </Col>
            <Col>
              <div
                id="demo"
                className="borde console"
                width="100%"
                height="100%"
              >
                <p>Aquí se muestran los resultados</p>
              </div>
            </Col>
          </Row>
        </div>
      </div>
      {/* <Footer /> */}
    </>
  );
}
