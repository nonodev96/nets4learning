import React from "react"
import "./N4LFooter.css"
import { Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function N4LFooter(props) {

  return (
    <>
      <footer className="footer mt-auto py-3 bg-light">
        <Container>
          <Row>
            <div className="col-xs-12 col-sm-12 col-md-4 item text">
              <h4>Nets4Learning</h4>
              <p>
                Esta aplicación web forma parte de un Trabajo de Fin de Grado de Ingeniería Informática de la
                Universidad de Jaén "Plataforma Web para el diseño y ejecución de modelos de aprendizaje profundo"
              </p>
            </div>
            <div className="col-xs-12 col-sm-12 col-md-8 item">
              <h3>Sobre nosotros</h3>
              <ul style={{ padding: "0 1em" }}>
                <li>Autor: <a href="https://github.com/Davavico22" target="_blank" rel="noreferrer" className="link-secondary">David Valdivia Vico</a></li>
                <li>Directores:{" "}
                  <a href="https://simidat.ujaen.es/members/arivera/" target="_blank" rel="noreferrer" className="link-secondary">Antonio Jesús Rivera Rivas</a>,
                  <a href="https://simidat.ujaen.es/members/lperez/" target="_blank" rel="noreferrer" className="link-secondary">María Dolores Pérez Godoy</a>
                </li>
                <li>Mantenimiento y mejoras: Alejandro Cruz Fernandez de Moya, Antonio Mudarra Machuca</li>
                <li><a href="https://dasci.es/" target="_blank" rel="noreferrer" className="link-secondary">Instituto Andaluz Interuniversitario en Data Science and Computational Intelligence</a></li>
                <li><a href="https://ujaen.es" target="_blank" rel="noreferrer" className="link-secondary">Universidad de Jaén</a></li>
                <li><a href="https://simidat.ujaen.es/" target="_blank" rel="noreferrer" className="link-secondary">Grupo de investigación del SIMIDAT</a></li>
                <li><Link to={"/terms-and-conditions/"} className="link-secondary">Términos y condiciones</Link></li>
              </ul>
            </div>
          </Row>
        </Container>
      </footer>
    </>
  )
}