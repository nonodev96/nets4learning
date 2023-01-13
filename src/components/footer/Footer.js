import React from "react"
import "./Footer.css"

export default function Footer() {
  return (
    <>
      <div className="footer-dark">
        <footer>
          <div className="container">
            <div className="row">
              <div className="col-sm-4 col-md-3 item">
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
              <div className="col-md-4 item text">
                <h3>Nets4learning</h3>
                <p>
                  Esta aplicación web forma parte de un Trabajo de Fin de Grado de Ingeniería Informática de la
                  Universidad de Jaén "Plataforma Web para el diseño y ejecución de modelos de aprendizaje profundo"
                </p>
              </div>
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
              <div className="col item social">
                <a href="#"><i className="icon ion-social-facebook"></i></a>
                <a href="#"><i className="icon ion-social-twitter"></i></a>
                <a href="#"><i className="icon ion-social-snapchat"></i></a>
                <a href="#"><i className="icon ion-social-instagram"></i></a>
              </div>
            </div>
            <p className="personal-link copyright">
              <a className="personal-link" target="blanck" href="https://dvalvico.es">David Valdivia </a>© 2022
            </p>
          </div>
        </footer>
      </div>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.1.3/js/bootstrap.bundle.min.js"></script>
    </>
  )
}