import "./Glossary.css"
import { Accordion, Col, Row, Table } from "react-bootstrap";
import { Trans, useTranslation } from "react-i18next";
import Latex from "react-latex-next";
import React from "react";
import IMGLinear from "./assets/Linear.png"
import IMGTanh from "./assets/Tanh.png"
import IMGLeakyReLU from "./assets/LeakyReLu.png"
import IMGRelu from "./assets/ReLu.png"
import IMGSigmoid from "./assets/Sigmoid.png"

export default function Glossary2ActivationFunctions() {

  const { t } = useTranslation()

  return <>
    <Accordion defaultValue={""} defaultActiveKey={""}>
      <Accordion.Item eventKey={"functions-activations"}>
        <Accordion.Header><h3>{t("pages.glossary.activation-functions.title")}</h3></Accordion.Header>
        <Accordion.Body>
          <p>{t("pages.glossary.activation-functions.text-1")}</p>
          <Table striped bordered hover>
            <thead>
            <tr>
              <th>{t("pages.glossary.table-head.name")}</th>
              <th>{t("pages.glossary.table-head.description")}</th>
              <th>{t("pages.glossary.table-head.characteristics")}</th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <th>Sigmoid</th>
              <td><Trans i18nKey={"pages.glossary.activation-functions.table.sigmoid.description"} /></td>
              <td>
                <ol>
                  <li>{t("pages.glossary.activation-functions.table.sigmoid.characteristics.0")}</li>
                  <li>{t("pages.glossary.activation-functions.table.sigmoid.characteristics.1")}</li>
                  <li>{t("pages.glossary.activation-functions.table.sigmoid.characteristics.2")}</li>
                </ol>
              </td>
            </tr>
            <tr>
              <th>Softmax</th>
              <td><Trans i18nKey={"pages.glossary.activation-functions.table.softmax.description"} /></td>
              <td>
                <ol>
                  <li>{t("pages.glossary.activation-functions.table.softmax.characteristics.0")}</li>
                  <li>{t("pages.glossary.activation-functions.table.softmax.characteristics.1")}</li>
                  <li>{t("pages.glossary.activation-functions.table.softmax.characteristics.2")}</li>
                </ol>
              </td>
            </tr>
            <tr>
              <th>ReLu</th>
              <td><Trans i18nKey={"pages.glossary.activation-functions.table.relu.description"} /></td>
              <td>
                <ol>
                  <li>{t("pages.glossary.activation-functions.table.relu.characteristics.0")}</li>
                  <li>{t("pages.glossary.activation-functions.table.relu.characteristics.1")}</li>
                </ol>
              </td>
            </tr>
            </tbody>
          </Table>
        </Accordion.Body>
      </Accordion.Item>
      {process.env.REACT_APP_ENVIRONMENT === "development" && <>
        <Accordion.Item eventKey={"equations-activation"}>
          <Accordion.Header><h3>{t("equations.title-activation")}</h3></Accordion.Header>
          <Accordion.Body>
            <Row xs={1} sm={1} md={2} lg={4} xl={4} xxl={4}>

              <Col>
                <Row>
                  <Col>
                    <h4 className={"text-lg-center"}>Linear</h4>
                    <div><img src={IMGLinear} alt="linear-activation-function" className={"img-n4l-glossary img-thumbnail d-block mx-auto"} /></div>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <p><Latex>{"$$ \\begin{split} R(z,m) = \\begin{Bmatrix} z*m \\end{Bmatrix} \\end{split} $$"}</Latex></p>
                  </Col>
                </Row>
              </Col>

              <Col>
                <Row>
                  <Col>
                    <h4 className={"text-lg-center"}>Sigmoid</h4>
                    <div><img src={IMGSigmoid} alt="sigmoid-activation-function" className={"img-n4l-glossary img-thumbnail d-block mx-auto"} /></div>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <p><Latex>{"$$ S(z) = \\frac{1} {1 + e^{-z}}$$"}</Latex></p>
                  </Col>
                </Row>
              </Col>

              <Col>
                <Row>
                  <Col>
                    <h4 className={"text-lg-center"}>Relu</h4>
                    <div><img src={IMGRelu} alt="relu-activation-function" className={"img-n4l-glossary img-thumbnail d-block mx-auto"} /></div>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <p><Latex>{"$$ ReLu(z) = max(0, z)$$"}</Latex></p>
                  </Col>
                </Row>
              </Col>

              <Col>
                <Row>
                  <Col>
                    <h4 className={"text-lg-center"}>LeakyReLU</h4>
                    <div><img src={IMGLeakyReLU} alt="LeakyReLU-activation-function" className={"img-n4l-glossary img-thumbnail d-block mx-auto"} /></div>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <p><Latex>{"$$ \\begin{split}R(z) = \\begin{Bmatrix} z & z > 0 \\\\ \\alpha z & z <= 0 \\end{Bmatrix}\\end{split} $$"}</Latex></p>
                  </Col>
                </Row>
              </Col>

              <Col>
                <Row>
                  <Col>
                    <h4 className={"text-lg-center"}>Tanh</h4>
                    <div><img src={IMGTanh} alt="tanh-activation-function" className={"img-n4l-glossary img-thumbnail d-block mx-auto"} /></div>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <p><Latex>{"$$ tanh(z) = \\frac{e^{z} - e^{-z}}{e^{z} + e^{-z}} $$"}</Latex></p>
                  </Col>
                </Row>
              </Col>

              <Col>
                <Row>
                  <Col>
                    <h4 className={"text-lg-center"}>Softmax</h4>
                    <div className="img-n4l-glossary"></div>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <p><Latex>{"$$ \\sigma(z_i) = \\frac{e^{z_{i}}}{\\sum_{j=1}^K e^{z_{j}}} \\ \\ \\ for\\ i=1,2,\\dots,K $$"}</Latex></p>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Accordion.Body>
        </Accordion.Item>
      </>}
    </Accordion>
  </>
}
