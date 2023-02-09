import React from "react"
import "./N4LFooter.css"
import { Container, Row } from "react-bootstrap";

export default function N4LFooter() {
  return (
    <>
      <footer className="footer mt-auto py-3 bg-light">
        <Container>
          <Row>
            {/*
            <div className="col-md-4 item">
              <h3>Acerca de</h3>
              <ul>
                <li>
                  <a target="_blank" rel="noreferrer" href="https://ujaen.es">
                    Universidad de Jaén
                  </a>
                </li>
                <li>
                  <a target="_blank" rel="noreferrer" href="https://eps.Ujaen.es">
                    Escuela Politécnica Superior de Jaén
                  </a>
                </li>
                <li>
                  <a target="_blank" rel="noreferrer" href="https://simidat.ujaen.es/">
                    SIMiDat
                  </a>
                </li>
              </ul>
            </div>
            */}
            <div className="col-xs-12 col-sm-12 col-md-4 item text">
              <h4>Nets4learning</h4>
              <p>
                Esta aplicación web forma parte de un Trabajo de Fin de Grado de Ingeniería Informática de la
                Universidad de Jaén "Plataforma Web para el diseño y ejecución de modelos de aprendizaje profundo"
              </p>
            </div>
            <div className="col-xs-12 col-sm-12 col-md-8 item">
              <h3>Acerca de:</h3>
              <ul style={{padding: "0 1em"}}>
                <li>
                  Autor: <a target="_blank"
                            href="https://github.com/Davavico22"
                            className="link-secondary">David Valdivia Vico</a>
                </li>
                <li>
                  Directores: Antonio Jesús Rivera Rivas, María Dolores Pérez Godoy
                </li>
                <li>
                  Mantenimiento y mejoras: Alejandro Cruz Fernandez de Moya, Antonio Mudarra Machuca
                </li>
                <li>
                  <a target="_blank"
                     rel="noreferrer"
                     className="link-secondary"
                     href="https://simidat.ujaen.es/">
                    Grupo de investigación del SIMIDAT
                  </a>
                </li>
                {/*<li>
                  <a target="_blank"
                     rel="noreferrer"
                     href="https://eps.Ujaen.es"
                     class="link-secondary">
                    Escuela Politécnica Superior de Jaén
                  </a>
                </li>
                */}
                <li>
                  <a target="_blank"
                     rel="noreferrer"
                     href="https://ujaen.es"
                     className="link-secondary">
                    Universidad de Jaén
                  </a>
                </li>
              </ul>
            </div>

            {/*
            <div className="col-md-4 item text">
              <h3>
                <a target='_blank' rel="noreferrer" href="https://simidat.ujaen.es/"
                   style={{ "textDecoration": "none", "color": "black" }}>SIMiDat</a>
              </h3>
              <p>
                El grupo de investigación SIMiDat, creado en 2007, está compuesto por 10 investigadores. Sus lineas
                de trabajo están centradas en dos ramas de investigación: el descubrimiento de conocimiento y la
                aplicación de técnicas de inteligencia artificial para el desarrollo de soluciones a problemas del
                mundo real.
              </p>
            </div>
            */}
          </Row>
          {/*<p className="personal-link copyright">*/}
          {/*  <a className="personal-link" target="blanck" href="https://dvalvico.es">David Valdivia </a>© 2022*/}
          {/*</p>*/}
        </Container>
      </footer>
    </>
  )
}