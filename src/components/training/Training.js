import React from "react";
import { Container } from "react-bootstrap";
import N4LFooter from "../footer/N4LFooter";
import N4LNavBar from "../navBar/N4LNavBar";

export default function Training() {
  return (
    <>
      <N4LNavBar/>
      <Container>
        <h1>MENÚ DE ENTRENAMIENTO DE TU MODELO</h1>
      </Container>
      <N4LFooter/>
    </>
  )
}