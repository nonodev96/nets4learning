import React from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import N4LNavbar from "../../components/header/N4LNavbar";
import N4LFooter from "../../components/footer/N4LFooter";
import { useTranslation } from "react-i18next";
import * as es_ES from "./es_ES.json"

export default function TermsAndConditions() {
  const { t } = useTranslation()

  const click = async () => {
    const url = "https://jsonplaceholder.typicode.com/todos";
    const options = {
      method : "POST",
      headers: {
        "Accept"      : "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
      body   : JSON.stringify(es_ES),
    };
    fetch(url, options)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      });
  }

  console.log("render")
  return (
    <>
      <N4LNavbar />

      <main className={"mb-3"} data-title={"TermsAndConditions"}>
        <Container>
          <Row className={"mt-2"}>
            <Col xl={12}>
              <h1>{t("terms.title")}</h1>
              <Button onClick={click}>Translate</Button>
            </Col>
            <Col xl={12} className={"mt-3"}>

              <Card border={"primary"}>
                <Card.Header><h3>{t("terms.privacy-title")}</h3></Card.Header>
                <Card.Body>
                  <Card.Text>
                    {t("terms.privacy-text")}
                  </Card.Text>
                </Card.Body>
              </Card>

              <Card border={"primary"} className={"mt-3"}>
                <Card.Header><h3>{t("terms.cookies-title")}</h3></Card.Header>
                <Card.Body>
                  <Card.Text>
                    {t("terms.cookies-text")}
                  </Card.Text>
                </Card.Body>
              </Card>


            </Col>
          </Row>
        </Container>
      </main>

      <N4LFooter />
    </>
  )
}