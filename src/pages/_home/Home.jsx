import "./Home.css";
import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import InitialMenu from "../_initialMenu/InitialMenu";
import N4LNavbar from "../../components/header/N4LNavbar";
import N4LFooter from "../../components/footer/N4LFooter";
import { Trans, useTranslation } from "react-i18next";


export default function Home() {
  const { t } = useTranslation();
  return (
    <>
      <N4LNavbar />
      <main className="mb-3" data-title={"Home"}>
        <Container>
          <Row>
            <Col>
              <h1 className="mt-3"><Trans i18nKey={"welcome"} /></h1>
              <h2 className="mt-3">{t("welcome-2")}</h2>
            </Col>
          </Row>
        </Container>

        <InitialMenu />
      </main>
      <N4LFooter />
    </>
  );
}
