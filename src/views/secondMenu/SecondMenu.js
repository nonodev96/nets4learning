import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Row, Col, Button, Container } from "react-bootstrap";
import ButtonDescription from "../../components/buttonDescription/ButtonDescription";
import "./SecondMenu.css";
import { LIST_TYPE_MODELS, LIST_TYPE_MODELS_DESCRIPTION } from "../../DATA_MODEL";

export default function SecondMenu(props) {
  const { id } = props;

  const [buttonActive, setButtonActive] = useState(-1);

  const colors = ["yellow", "red", "green", "blue"];
  const History = useHistory();

  const handleClick = (modelType) => {
    setButtonActive(modelType);
  };

  const handleClickEmpezar = () => {
    History.push("/starting/");
  };

  const handleClickArchCustom = () => {
    History.push("/upload-architecture-custom/");
  };

  const handleClickArchEdit = () => {
    History.push("/edit-architecture/" + id + "/2");
  };

  const handleClickTrainCustom = () => {
    History.push("/upload-training-custom/");
  };

  const handleClickTrainEdit = () => {
    History.push("/edit-training/");
  };

  const handleClickModelCustom = () => {
    History.push("/upload-model-custom/");
  };

  const handleClickModelEdit = () => {
    History.push("/edit-model/");
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

  return (
    <>
      <Container>
        <h2>{LIST_TYPE_MODELS[id]}</h2>
        <Row>
          {LIST_TYPE_MODELS_DESCRIPTION.map((type, i) => {
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
        {buttonActive !== -1 ? (
          <ButtonDescription data={modelsDescription[buttonActive]} click={handleClickEmpezar}/>) : ("")
        }
      </Container>
    </>
  );
}
