import React from "react";
import N4LFooter from "./footer/N4LFooter";
import "./Home.css";
import N4LNavBar from "./navBar/N4LNavBar";
import InitialMenu from "./views/initialMenu/InitialMenu";
import { Col, Row } from "react-bootstrap";

export default function Home() {
  return (
    <>
      <N4LNavBar/>
      <div className="container wrapper mb-3">
        <Row>
          <Col>
            <h1 className="mt-3">Bienvenido a Nets4learning</h1>
            <h2 className="mt-3">Para continuar selecciona una de estas disciplinas</h2>
          </Col>
        </Row>
        <InitialMenu/>
      </div>
      <N4LFooter/>
    </>
  );
}
