import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Row, Col, Button, Card, Container } from 'react-bootstrap'
import './InitialMenu.css'
import { LIST_TYPE_MODELS } from "../../DATA_MODEL";

export default function InitialMenu() {
  const history = useHistory()

  const [buttonActive, setButtonActive] = useState(0)

  const handleClickTrainEdit = (_buttonActive, type) => {
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
            <Card>
              <Card.Header><h3>La clasificación</h3></Card.Header>
              <Card.Body>
                <Card.Text>
                  La clasificación es una técnica para determinar la clase a la que pertenece el dependiente según una
                  o más variables independientes.
                </Card.Text>
                <p>La clasificación se utiliza para predecir respuestas discretas.</p>
                <Button onClick={() => handleClickTrainEdit(buttonActive, 1)}>
                  Modelo Pre-entrenado
                </Button>
                <Button onClick={() => handleClickTrainEdit(buttonActive, 2)}
                        style={{ "marginLeft": "1em" }}>
                  Crear y edita arquitectura
                </Button>
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
            <Card>
              <Card.Header><h3>La clasificación</h3></Card.Header>
              <Card.Body>
                <Card.Text>
                  La clasificación de objetos consiste en organizar los elementos de acuerdo a sus diferencias y
                  semejanzas.
                </Card.Text>
                <p>
                  Estos modelos son entrenados con multitud de imágenes diferentes que les permite aprender poco a
                  poco qué caracteriza a cada objeto.
                </p>
                <Button onClick={() => handleClickTrainEdit(buttonActive, 1)}>
                  Modelo Pre-entrenado
                </Button>
              </Card.Body>
            </Card>
          </>
        )
      case 3:
        return (
          <>
            <Card>
              <Card.Header><h3>La clasificación</h3></Card.Header>
              <Card.Body>
                <Card.Text>
                  La clasificación de imágenes de igual forma que la clasificación clásica nos sirve para determinar
                  la clase a la que pertenece el dependiente según una o más variables independientes.
                </Card.Text>
                <Card.Text>
                  En este caso la variable de entrada será una imagen.
                </Card.Text>
                <Button onClick={() => handleClickTrainEdit(buttonActive, 1)}>
                  Modelo Pre-entrenado
                </Button>
                <Button style={{ "marginLeft": "1em" }}
                        onClick={() => handleClickTrainEdit(buttonActive, 2)}>
                  Crear y edita arquitectura
                </Button>
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
