import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Row, Col, Button, Card } from 'react-bootstrap'
import './InitialMenu.css'

export const modelsType = [
  'Clasificación clasica',
  'Deep Learning',
  'Identificación de objetos',
  'Clasificador de imágenes',
]

export default function InitialMenu() {
  const history = useHistory()

  const [ButtonActive, setButtonActive] = useState(-1)
  const [DataSet, setDataSet] = useState(-1)

  // const modelsType = [
  //   "Empieza de cero y crea tu propia arquitectura",
  //   "Edita una arquitectura creada por tí o facilitado por nosotros",
  //   "Entrena un modelo hecho por tí o si no tienes, no te preocupes te prestamos uno :)",
  //   "Ejecutar un modelo hecho por tí o facilitado por nosotros",
  // ];

  const handleClickTrainEdit = (ButtonActive, type) => {
    console.log(ButtonActive, type, DataSet)
    // if (DataSet == 2) {
    //   history.push('/edit-architecture/' + ButtonActive + '/' + type + '/' + 2)
    // } else if (DataSet == 1) {
    //   history.push('/edit-architecture/' + ButtonActive + '/' + type + '/' + 1)
    // } else if (DataSet == 0) {
    //   history.push('/edit-architecture/' + ButtonActive + '/' + type + '/' + 0)
    // } else {
    //   history.push(
    //     '/edit-architecture/' + ButtonActive + '/' + type + '/' + '-1',
    //   )
    // }
    if (type === 2) history.push(process.env.REACT_APP_DOMAIN + '/select-dataset/' + ButtonActive)
    if (type === 1) history.push(process.env.REACT_APP_DOMAIN + '/select-model/' + ButtonActive)
  }

  const colors = ['primary', 'danger', 'warning', 'info']

  const handleClick = (modelType) => {
    setButtonActive(modelType)
    // history.push("/editor/" + modelType);
  }

  const handleChangeDataSet = () => {
    let aux = document.getElementById('FormDataSet').value
    if (aux !== undefined) {
      setDataSet(aux)
    }
  }

  const menuSelection = () => {
    switch (ButtonActive) {
      case -1:
        return ''
      case 0:
        return (
          <>
            <div className="card">
              <div className="card-header">
                <h3 className="">La clasificación</h3>
              </div>
              <div className="card-body">
                <article>
                  <p>
                    La clasificación es una técnica para determinar la clase a la que pertenece el dependiente según una
                    o más variables independientes.
                  </p>
                  <p>La clasificación se utiliza para predecir respuestas discretas.</p>
                  <Button onClick={() => handleClickTrainEdit(ButtonActive, 1)}>
                    Modelo Pre-entrenado
                  </Button>
                  <Button onClick={() => handleClickTrainEdit(ButtonActive, 2)}
                          style={{ "marginLeft": "1em" }}>
                    Crear y edita arquitectura
                  </Button>
                </article>
              </div>
            </div>
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
      //             onClick={() => handleClickTrainEdit(ButtonActive, 1)}
      //           >
      //             Modelo Pre-entrenado
      //           </Button>
      //         </Col>
      //         <Col className="col-description">
      //           <Button
      //             className="btn-custom-description"
      //             onClick={() => handleClickTrainEdit(ButtonActive, 2)}
      //           >
      //             Crear/Editar arquitectura
      //           </Button>
      //         </Col>
      //       </Row>
      //     </div>
      //   )
      case 2:
        return (
          <>
            <div className="card">
              <div className="card-header">
                <h3>La clasificación</h3>
              </div>
              <div className="card-body">
                <article>
                  <p>
                    La clasificación de objetos consiste en organizar los elementos de acuerdo a sus diferencias y
                    semejanzas.
                  </p>
                  <p>
                    Estos modelos son entrenados con multitud de imágenes diferentes que les permite aprender poco a
                    poco qué caracteriza a cada objeto.
                  </p>
                  <Button onClick={() => handleClickTrainEdit(ButtonActive, 1)}>
                    Modelo Pre-entrenado
                  </Button>
                </article>
              </div>
            </div>
          </>
        )
      case 3:
        return (
          <>
            <div className="card">
              <div className="card-header">
                <h3>La clasificación</h3>
              </div>
              <div className="card-body">
                <article>
                  <p>
                    La clasificación de imágenes de igual forma que la clasificación clásica nos sirve para determinar
                    la clase a la que pertenece el dependiente según una o más variables independientes.
                  </p>
                  <p>
                    En este caso la variable de entrada será una imagen.
                  </p>
                  <Button onClick={() => handleClickTrainEdit(ButtonActive, 1)}>
                    Modelo Pre-entrenado
                  </Button>
                  <Button style={{ "marginLeft": "1em" }}
                          onClick={() => handleClickTrainEdit(ButtonActive, 2)}>
                    Crear y edita arquitectura
                  </Button>
                </article>
              </div>
            </div>

          </>
        )
      default:
        return ''
    }
  }

  return (
    <>
      <Row>
        {modelsType.map((type, i) => {
          if (i !== 1) {
            const actualColor = colors[i % colors.length]
            return (
              <Col key={i} className="d-grid gap-2">
                <Button variant={actualColor}
                        size={"lg"}
                        onClick={() => handleClick(i)}>{type}</Button>
              </Col>
            )
          }
        })}
      </Row>

      {/*
        <Row>
          {modelsType.map((type, i) => {
            if (i !== 1) {
              if (i === ButtonActive) {
                return (
                  <Col key={10 + i}>
                    <p className="vl"></p>
                  </Col>
                )
              } else {
                return (
                  <Col key={10 + i}>
                    <p className="vl-clear"></p>
                  </Col>
                )
              }
            }
          })}
        </Row>
        */}

      <Row className="mt-3">
        <Col>
          {menuSelection()}
        </Col>
      </Row>
    </>
  )
}
