import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import N4LFooter from "../footer/N4LFooter";
import N4LNavBar from "../navBar/N4LNavBar";

export default function Training() {
  return (
    <>
      <N4LNavBar/>
      <Container>
        <Row>
          <Col>
            <h1>MENÚ DE ENTRENAMIENTO DE TU MODELO</h1>
          </Col>
        </Row>
      </Container>
      <N4LFooter/>
    </>
  )
}