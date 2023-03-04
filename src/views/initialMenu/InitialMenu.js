import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Row, Col, Button, Card, Container } from 'react-bootstrap'
import './InitialMenu.css'
import { LIST_TYPE_MODELS } from "../../DATA_MODEL";

export default function InitialMenu() {
  const history = useHistory()

  const [buttonActive, setButtonActive] = useState(0)

  const handleClick_TrainEdit = (_buttonActive, type) => {
    if (type === 1) history.push('/select-model/' + _buttonActive)
    if (type === 2) history.push('/select-dataset/' + _buttonActive)
  }

  const colors = ['primary', 'danger', 'warning', 'info']

  const handleClick = (modelType) => {
    setButtonActive(modelType)
    // history.push("/editor/" + modelType);
  }

  const menuSelection = () => {
    switch (buttonActive) {
      case -1:
        return ''
      case 0:
        return (
          <>
            <Card className={"border-primary"}>
              <Card.Header><h3>Clasificación clásica</h3></Card.Header>
              <Card.Body>
                <Card.Text>
                  La clasificación es una técnica para determinar la clase a la que pertenece el dependiente según una
                  o más variables independientes.
                </Card.Text>
                <Card.Text>La clasificación se utiliza para predecir respuestas discretas.</Card.Text>
                <div className="d-flex gap-2 justify-content-center">
                  <Button onClick={() => handleClick_TrainEdit(buttonActive, 1)}>
                    Modelo Pre-entrenado
                  </Button>
                </div>
              </Card.Body>
            </Card>

            <Card className={"border-primary mt-3"}>
              <Card.Header><h3>Diseñar, crear y editar una arquitectura para clasificar</h3></Card.Header>
              <Card.Body>
                <Card.Text>
                  A través de esta herramienta podemos crear una red neuronal para clasificar datos multi-etiqueta.
                  Diseñando, creando, entrenando y evaluando una arquitectura personalizada.
                </Card.Text>
                <Row>
                  <Col>
                    <ul>
                      <li>Definir el número de capas, sus funciones de activación.</li>
                      <li>Definir la tasa de entrenamiento.</li>
                      <li>Definir el número de iteraciones.</li>
                    </ul>
                  </Col>
                  <Col>
                    <ul>
                      <li>Definir el optimizador.</li>
                      <li>Definir la función de perdida.</li>
                      <li>Definir la métrica para la evaluación.</li>
                    </ul>
                  </Col>
                </Row>
                <Card.Text>La clasificación se utiliza para predecir respuestas discretas.</Card.Text>
                <div className="d-flex gap-2 justify-content-center">
                  <Button onClick={() => handleClick_TrainEdit(buttonActive, 2)}>
                    Diseñar, crear y editar arquitectura
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </>
        )
      // case 1:
      //   return (
      //     <div className="container">
      //       <h3 className="titulos">
      //         La regresión lineal consiste...Lorem Ipsum is simply dummy text of
      //         the printing and typesetting industry. Lorem Ipsum has been the
      //         industry's standard dummy text ever since the 1500s, when an
      //         unknown printer took a galley of type and scrambled it to make a
      //         type specimen book.
      //       </h3>

      //       <Row className="btns-description">
      //         <Col className="col-description">
      //           <Button
      //             className="btn-custom-description"
      //             onClick={() => handleClickTrainEdit(ButtonActive, 1)}>
      //             Modelo Pre-entrenado
      //           </Button>
      //         </Col>
      //         <Col className="col-description">
      //           <Button
      //             className="btn-custom-description"
      //             onClick={() => handleClickTrainEdit(ButtonActive, 2)}>
      //             Crear/Editar arquitectura
      //           </Button>
      //         </Col>
      //       </Row>
      //     </div>
      //   )
      case 2:
        return (
          <>
            <Card className={"border-warning"}>
              <Card.Header><h3>Identificación de objetos</h3></Card.Header>
              <Card.Body>
                <Card.Text>
                  La clasificación de objetos consiste en organizar los elementos de acuerdo a sus diferencias y
                  semejanzas.
                </Card.Text>
                <Card.Text>
                  Estos modelos son entrenados con multitud de imágenes diferentes que les permite aprender poco a
                  poco qué caracteriza a cada objeto.
                </Card.Text>
                <div className="d-flex gap-2 justify-content-center">
                  <Button onClick={() => handleClick_TrainEdit(buttonActive, 1)}>
                    Modelo Pre-entrenado
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </>
        )
      case 3:
        return (
          <>
            <Card className={"border-info"}>
              <Card.Header><h3>Clasificador de imágenes</h3></Card.Header>
              <Card.Body>
                <Card.Text>
                  La clasificación de imágenes de igual forma que la clasificación clásica nos sirve para determinar
                  la clase a la que pertenece el dependiente según una o más variables independientes.
                </Card.Text>
                <Card.Text>
                  En este caso la variable de entrada será una imagen.
                </Card.Text>
                <div className="d-flex gap-2 justify-content-center">
                  <Button onClick={() => handleClick_TrainEdit(buttonActive, 1)}>
                    Modelo Pre-entrenado
                  </Button>
                  <Button style={{ display: "none " }}
                          onClick={() => handleClick_TrainEdit(buttonActive, 2)}>
                    Crear y edita arquitectura
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </>
        )
      default:
        return ''
    }
  }

  return (
    <>
      <Container>
        <Row className={"row-cols-1 row-cols-md-3 row-cols-xl-3"}>
          {LIST_TYPE_MODELS.map((type, i) => {
            if (i !== 1) {
              const actualColor = colors[i % colors.length]
              return (
                <Col key={i} className={"mt-3"}>
                  <div className="d-grid gap-2">
                    <Button onClick={() => handleClick(i)}
                            variant={actualColor}
                            size={"lg"}>
                      {type}
                    </Button>
                  </div>
                </Col>
              )
            } else {
              return <></>
            }
          })}
        </Row>
        <Row className={"mt-3"}>
          <Col xl={12}>
            {menuSelection()}
          </Col>
        </Row>
      </Container>
    </>
  )
}
