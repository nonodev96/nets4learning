import React from "react";
import N4LFooter from "../footer/N4LFooter";
import N4LNavBar from "../navBar/N4LNavBar";
import { Col, Container, Row } from "react-bootstrap";

export default function Test() {
  return (
    <>
      <N4LNavBar/>
      <Container>
        <Row className={"mt-3"}>
          <Col>
            <h1>Test de los modelos previamente creados</h1>
          </Col>
        </Row>
      </Container>
      <N4LFooter/>
    </>
  )
}