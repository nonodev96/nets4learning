import './InitialMenu.css'
import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { Row, Col, Button, Card, Container } from 'react-bootstrap'
import { useTranslation } from "react-i18next";


export const SELECTOR = {
  MODEL  : "MODEL",
  DATASET: "DATASET"
}
export default function InitialMenu() {
  const history = useHistory()
  const { t } = useTranslation()
  // const colors = ['primary', 'danger', 'warning', 'info']

  const [buttonActive, setButtonActive] = useState(0)

  const handleClick_TrainEdit = (selector) => {
    if (selector === SELECTOR.MODEL)
      history.push('/select-model/' + buttonActive)
    if (selector === SELECTOR.DATASET)
      history.push('/select-dataset/' + buttonActive)
  }


  const handleClick_OpenCardModel = (modelType) => {
    setButtonActive(modelType)
    // history.push("/editor/" + modelType);
  }

  const menuSelection = () => {
    switch (buttonActive) {
      case 0:
        return (
          <>
            <Card className={"border-primary"}>
              <Card.Header><h3>{t("pages.index.tabular-classification.1-title")}</h3></Card.Header>
              <Card.Body>
                <Card.Text>
                  {t("pages.index.tabular-classification.1-description-1")}
                </Card.Text>
                <Card.Text>
                  {t("pages.index.tabular-classification.1-description-2")}
                </Card.Text>
                <div className="d-flex gap-2 justify-content-center">
                  <Button onClick={() => handleClick_TrainEdit(SELECTOR.MODEL)}>
                    {t("pages.index.tabular-classification.1-button")}
                  </Button>
                </div>
              </Card.Body>
            </Card>

            <Card className={"border-primary mt-3"}>
              <Card.Header><h3>{t("pages.index.tabular-classification.2-title")}</h3></Card.Header>
              <Card.Body>
                <Card.Text>
                  {t("pages.index.tabular-classification.2-description-1")}
                </Card.Text>
                <Card.Text>
                  {t("pages.index.tabular-classification.2-description-2")}
                </Card.Text>
                <Row>
                  <Col>
                    <ul>
                      <li>{t("pages.index.tabular-classification.2-description-list.1")}</li>
                      <li>{t("pages.index.tabular-classification.2-description-list.2")}</li>
                      <li>{t("pages.index.tabular-classification.2-description-list.3")}</li>
                    </ul>
                  </Col>
                  <Col>
                    <ul>
                      <li>{t("pages.index.tabular-classification.2-description-list.4")}</li>
                      <li>{t("pages.index.tabular-classification.2-description-list.5")}</li>
                      <li>{t("pages.index.tabular-classification.2-description-list.6")}</li>
                    </ul>
                  </Col>
                </Row>
                {/*
                <Card.Text>
                  {t("pages.index.tabular-classification.2-description-footer")}
                </Card.Text>
                */}
                <div className="d-flex gap-2 justify-content-center">
                  <Button onClick={() => handleClick_TrainEdit(SELECTOR.DATASET)}>
                    {t("pages.index.tabular-classification.2-button")}
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </>
        )
      case 1:
        return (
          <>
            <Card className={"border-danger"}>
              <Card.Header><h3>{t("pages.index.linear-regression.1-title")}</h3></Card.Header>
              <Card.Body>
                <Card.Text>{t("pages.index.linear-regression.1-description-1")}</Card.Text>
                <div className="d-flex gap-2 justify-content-center">
                  <Button onClick={() => handleClick_TrainEdit(SELECTOR.MODEL)}>
                    {t("pages.index.linear-regression.1-button")}
                  </Button>
                </div>
              </Card.Body>
            </Card>

            <Card className={"border-primary mt-3"}>
              <Card.Header><h3>{t("pages.index.linear-regression.2-title")}</h3></Card.Header>
              <Card.Body>
                <Card.Text>{t("pages.index.linear-regression.2-description-1")}</Card.Text>
                <Card.Text>{t("pages.index.linear-regression.2-description-2")}</Card.Text>
                <Row>
                  <Col>
                    <ul>
                      <li>{t("pages.index.linear-regression.2-description-list.1")}</li>
                      <li>{t("pages.index.linear-regression.2-description-list.2")}</li>
                      <li>{t("pages.index.linear-regression.2-description-list.3")}</li>
                    </ul>
                  </Col>
                  <Col>
                    <ul>
                      <li>{t("pages.index.linear-regression.2-description-list.4")}</li>
                      <li>{t("pages.index.linear-regression.2-description-list.5")}</li>
                      <li>{t("pages.index.linear-regression.2-description-list.6")}</li>
                    </ul>
                  </Col>
                </Row>
                <div className="d-flex gap-2 justify-content-center">
                  <Button onClick={() => handleClick_TrainEdit(SELECTOR.DATASET)}>
                    {t("pages.index.tabular-classification.2-button")}
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </>
        )
      case 2:
        return (
          <>
            <Card className={"border-warning"}>
              <Card.Header><h3>{t("pages.index.object-detection.1-title")}</h3></Card.Header>
              <Card.Body>
                <Card.Text>
                  {t("pages.index.object-detection.1-description-1")}
                </Card.Text>
                <Card.Text>
                  {t("pages.index.object-detection.1-description-2")}
                </Card.Text>
                <div className="d-flex gap-2 justify-content-center">
                  <Button onClick={() => handleClick_TrainEdit(SELECTOR.MODEL)}>
                    {t("pages.index.object-detection.1-button")}
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </>
        )
      case 3:
        return (
          <>
            <Card className={"border-info"}>
              <Card.Header><h3>{t("pages.index.image-classification.1-title")}</h3></Card.Header>
              <Card.Body>
                <Card.Text>
                  {t("pages.index.image-classification.1-description-1")}
                </Card.Text>
                {/*
                <Card.Text>
                  {t("pages.index.image-classification.1-description-2")}
                </Card.Text>
                */}
                <div className="d-flex gap-2 justify-content-center">
                  <Button onClick={() => handleClick_TrainEdit(SELECTOR.MODEL)}>
                    {t("pages.index.image-classification.1-button")}
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </>
        )
      default:
        return ''
    }
  }

  console.debug("render InitialMenu")
  return (
    <>
      <Container>
        <Row className={"row-cols-1 row-cols-md-3 row-cols-xl-3"}>
          <Col className={"mt-3"}>
            <div className="d-grid gap-2">
              <Button onClick={() => handleClick_OpenCardModel(0)}
                      variant={"primary"}
                      size={"lg"}>
                {t("pages.index.tabular-classification.1-title")}
              </Button>
            </div>
          </Col>
          {process.env.REACT_APP_ENVIRONMENT === "development" &&
            <Col className={"mt-3"}>
              <div className="d-grid gap-2">
                <Button onClick={() => handleClick_OpenCardModel(1)}
                        variant={"danger"}
                        size={"lg"}>
                  {t("pages.index.linear-regression.1-title")}
                </Button>
              </div>
            </Col>
          }
          <Col className={"mt-3"}>
            <div className="d-grid gap-2">
              <Button onClick={() => handleClick_OpenCardModel(3)}
                      variant={"info"}
                      size={"lg"}>
                {t("pages.index.image-classification.1-title")}
              </Button>
            </div>
          </Col>

          <Col className={"mt-3"}>
            <div className="d-grid gap-2">
              <Button onClick={() => handleClick_OpenCardModel(2)}
                      variant={"warning"}
                      size={"lg"}>
                {t("pages.index.object-detection.1-title")}
              </Button>
            </div>
          </Col>
        </Row>
        <Row className={"mt-3"}>
          {/*<Col xl={12}>*/}
          {/*  <NeuralNetwork />*/}
          {/*</Col>*/}
          <Col xl={12}>
            {menuSelection()}
          </Col>
        </Row>
      </Container>
    </>
  )
}
