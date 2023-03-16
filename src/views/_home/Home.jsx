import "./Home.css";
import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import InitialMenu from "../_initialMenu/InitialMenu";
import N4LNavbar from "../../components/header/N4LNavbar";
import N4LFooter from "../../components/footer/N4LFooter";


export default function Home() {
  return (
    <>
      <N4LNavbar/>
      <main className="mb-3" data-title={"Home"}>
        <Container>
          <Row>
            <Col>
              <h1 className="mt-3">Bienvenido a Nets4Learning</h1>
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
