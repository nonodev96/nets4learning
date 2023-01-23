import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import N4LNavBar from "./navBar/N4LNavBar";
import InitialMenu from "../views/initialMenu/InitialMenu";
import N4LFooter from "./footer/N4LFooter";
import "./Home.css";

export default function Home() {
  return (
    <>
      <N4LNavBar/>
      <main className="mb-3" data-title={"Home"}>
        <Container>
          <Row>
            <Col>
              <h1 className="mt-3">Bienvenido a Nets4learning</h1>
              <h2 className="mt-3">Para continuar selecciona una de estas disciplinas</h2>
            </Col>
          </Row>
        </Container>

        <InitialMenu/>
      </main>
      <N4LFooter/>
    </>
  );
}
