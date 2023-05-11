import React from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";

export default function TermsAndConditions() {
  const { t } = useTranslation()

  console.log("render")
  return (
    <>
      <main className={"mb-3"} data-title={"TermsAndConditions"}>
        <Container>
          <Row>
            <Col><h1>{t("pages.terms.title")}</h1></Col>
          </Row>
          <Row>
            <Col className={"mt-3"}>
              <Card border={"primary"}>
                <Card.Header><h3>{t("pages.terms.privacy-title")}</h3></Card.Header>
                <Card.Body>
                  <Card.Text>
                    {t("pages.terms.privacy-text")}
                  </Card.Text>
                </Card.Body>
              </Card>

              <Card border={"primary"} className={"mt-3"}>
                <Card.Header><h3>{t("pages.terms.cookies-title")}</h3></Card.Header>
                <Card.Body>
                  <Card.Text>
                    {t("pages.terms.cookies-text")}
                  </Card.Text>
                </Card.Body>
              </Card>

            </Col>
          </Row>
        </Container>
      </main>
    </>
  )
}