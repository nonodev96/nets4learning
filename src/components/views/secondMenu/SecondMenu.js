import React, { useState } from "react";
import "./SecondMenu.css";

import { Row, Col, Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import ButtonDescription from "../../buttonDescription/ButtonDescription";

export default function SecondMenu(props) {
  const { id } = props;

  const [buttonActive, setbuttonActive] = useState(-1);

  const modelsType = ["Clasificación clásica", "Regresión lineal", "Identificación de objetos", "Clasificador de imágenes",];

  const modelsType2 = ["Empieza de cero y crea tu propia arquitectura", "Edita una arquitectura hecho por tí o facilitado por nosotros", "Entrena un modelo hecho por tí o  si no tienes, no te preocupes te prestamos uno :)", "Ejecutar un modelo hecho por tí o facilitado por nosotros",];
  const colors = ["yellow", "red", "green", "blue"];
  const history = useHistory();

  const handleClick = (modelType) => {
    setbuttonActive(modelType);
  };

  const handleClickEmpezar = () => {
    history.push(process.env.REACT_APP_DOMAIN + "/starting/");
  };

  const handleClickArchCustom = () => {
    history.push(process.env.REACT_APP_DOMAIN + "/upload-architecture-custom/");
  };

  const handleClickArchEdit = () => {

    history.push(process.env.REACT_APP_DOMAIN + "/edit-architecture/" + id + "/2");
  };

  const handleClickTrainCustom = () => {
    history.push(process.env.REACT_APP_DOMAIN + "/upload-training-custom/");
  };

  const handleClickTrainEdit = () => {
    history.push(process.env.REACT_APP_DOMAIN + "/edit-training/");
  };

  const handleClickModelCustom = () => {
    history.push(process.env.REACT_APP_DOMAIN + "/upload-model-custom/");
  };

  const handleClickModelEdit = () => {
    history.push(process.env.REACT_APP_DOMAIN + "/edit-model/");
  };

  const modelsDescription = [
    {
      buttons: [
        { Title: "Comenzar a desarrollar", accion: handleClickEmpezar }
      ],
      text: "Crea de forma guiada un modelo desde cero. Crea y entrena modelos de AA con facilidad con ejecución inmediata, que permite una iteración de modelos al instante y una depuración fácil.",
    },
    {
      buttons: [
        { Title: "Cargar mi arquitectura", accion: handleClickArchCustom },
        { Title: "Editar una arquitectura", accion: handleClickArchEdit }
      ],
      text: "Puedes subir tu propia arquitectura para editarla o elegir una nuestra pre hecha",
    },
    {
      buttons: [
        { Title: "Cargar mi modelo", accion: handleClickTrainCustom },
        { Title: "Entrenar un modelo", accion: handleClickTrainEdit }
      ],
      text: "Crea y entrena modelos de AA con facilidad con ejecución inmediata, que permite una iteración de modelos al instante y una depuración fácil.",
    },
    {
      buttons: [
        { Title: "Cargar mi modelo ya entrenado", accion: handleClickModelCustom },
        { Title: "Jugar con otros modelos", accion: handleClickModelEdit }
      ],
      text: "Ejecuta tu propio modelo o prueba una de nuestros ejemplos finales",
    }
  ];

  return (<>
    <div className="container">
      <h2 className="titulos">{modelsType[id]}</h2>
      <Row>
        {modelsType2.map((type, i) => {
          const actualColor = colors[i % colors.length];
          const style = "btn-custom " + actualColor;
          return (
            <Col key={i}>
              <Button onClick={() => handleClick(i)}
                      type="button"
                      className={style}>
                {type}
              </Button>
            </Col>
          );
        })}
      </Row>
      {/*ELIMINADO */}
      {/*
      <Row>
        {modelsType.map((type, i) => {
          if (i === buttonActive) {
            return (
              <Col key={10 + i}>
                <p className="vl"></p>
              </Col>
            );
          } else {
            return (
              <Col key={10 + i}>
                <p className="vl-clear"></p>
              </Col>
            );
          }
        })}
      </Row>
      */}
      <Row>
        <Col>
          <div className={buttonActive === -1 ? "container smargen" : "borde container smargen"}>
            <div className="details-menu">
              {buttonActive !== -1 ? (
                <ButtonDescription data={modelsDescription[buttonActive]} click={handleClickEmpezar}/>) : ("")
              }
            </div>
          </div>
        </Col>
      </Row>
    </div>
  </>);
}
