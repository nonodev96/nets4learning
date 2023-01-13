import React from "react";
import Footer from "./footer/Footer";
import "./Home.css";
import NavBar from "./navBar/NavBar";
import InitialMenu from "./views/initialMenu/InitialMenu";
import { Col, Row } from "react-bootstrap";

export default function Home() {
  return (
    <>
      <NavBar/>
      <div className="wrapper container" style={{"marginBottom": "1em"}}>
        <Row>
          <Col>
            <h1 className="mt-3">Bienvenido a Nets4learning</h1>
            <h2 className="mt-3">Para continuar selecciona una de estas disciplinas</h2>
          </Col>
        </Row>
        <InitialMenu/>
      </div>
      <Footer/>
    </>
  );
}
