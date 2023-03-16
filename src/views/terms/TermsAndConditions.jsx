import React from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import N4LNavbar from "../../components/header/N4LNavbar";
import N4LFooter from "../../components/footer/N4LFooter";

export default function TermsAndConditions(props) {


  console.log("render")
  return (
    <>
      <N4LNavbar/>

      <main className={"mb-3"} data-title={"TermsAndConditions"}>
        <Container>
          <Row className={"mt-2"}>
            <Col xl={12}>
              <h1>Políticas de privacidad y cookies</h1>
            </Col>
            <Col xl={12} className={"mt-3"}>

              <Card border={"primary"}>
                <Card.Header><h3>Políticas de privacidad</h3></Card.Header>
                <Card.Body>
                  <Card.Text>
                    En nuestro sitio web, solo recopilamos información estadística sobre las visitas con el fin de mejorar el rendimiento y la funcionalidad del sitio. No recopilamos ni almacenamos ninguna información personal de nuestros
                    usuarios. Utilizamos cookies para contabilizar el número de visitantes y mejorar la experiencia de navegación. Si tienes alguna pregunta o duda sobre nuestra política de privacidad, no dudes en ponerte en contacto con
                    nosotros a través de nuestra página de contacto.
                  </Card.Text>
                </Card.Body>
              </Card>

              <Card border={"primary"} className={"mt-3"}>
                <Card.Header><h3>Cookies</h3></Card.Header>
                <Card.Body>
                  <Card.Text>
                    Nuestra página web utiliza cookies de Google Analytics para contabilizar el número de visitantes que recibimos. Estas cookies nos permiten recopilar información estadística anónima sobre el uso de nuestro sitio web y
                    nos ayudan a mejorar su rendimiento y funcionalidad. Las cookies de Google Analytics no recopilan información personal de los usuarios. Al navegar por nuestra web, aceptas el uso de estas cookies. Si deseas obtener más
                    información acerca de cómo utilizamos las cookies, por favor consulta nuestra política de privacidad.
                  </Card.Text>
                </Card.Body>
              </Card>


            </Col>
          </Row>
        </Container>
      </main>

      <N4LFooter/>
    </>
  )
}