import { Accordion, Col, Row } from "react-bootstrap";
import { Trans, useTranslation } from "react-i18next";
import Latex from "react-latex-next";
import React from "react";

export default function Glossary4MetricFunctions() {

  const { t } = useTranslation()

  return <>
    <Accordion defaultValue={""} defaultActiveKey={""}>
      <Accordion.Item eventKey={"functions-metrics"}>
        <Accordion.Header><h3>{t("pages.glossary.metric-functions.title")}</h3></Accordion.Header>
        <Accordion.Body>
          <p><Trans i18nKey={"pages.glossary.metric-functions.text-1"}/></p>
          <p><Trans i18nKey={"pages.glossary.metric-functions.text-2"}/></p>
          <p><Trans i18nKey={"pages.glossary.metric-functions.text-3"}/></p>
          <p><Trans i18nKey={"pages.glossary.metric-functions.text-4"}/></p>
          <Trans i18nKey={"references"}/>: <a target="_blank" rel="noreferrer" className="link-secondary" href="https://js.tensorflow.org/api/3.14.0/#Metrics">TensorFlow JS. Metrics</a>

          {/*
          <Table striped bordered hover responsive={true}>
            <thead>
            <tr>
              <th>{t("pages.glossary.table-head.function")}</th>
              <th>{t("pages.glossary.table-head.references")}</th>
              <th>{t("pages.glossary.table-head.description")}</th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <th>BinaryAccuracy</th>
              <td><Trans i18nKey={"pages.glossary.metric-functions.table.BinaryAccuracy.references"} /></td>
              <td><Trans i18nKey={"pages.glossary.metric-functions.table.BinaryAccuracy.description"} /></td>
            </tr>
            <tr>
              <th>BinaryCrossentropy</th>
              <td><Trans i18nKey={"pages.glossary.metric-functions.table.BinaryCrossentropy.references"} /></td>
              <td><Trans i18nKey={"pages.glossary.metric-functions.table.BinaryCrossentropy.description"} /></td>
            </tr>
            <tr>
              <th>CategoricalAccuracy</th>
              <td><Trans i18nKey={"pages.glossary.metric-functions.table.CategoricalAccuracy.references"} /></td>
              <td><Trans i18nKey={"pages.glossary.metric-functions.table.CategoricalAccuracy.description"} /></td>
            </tr>
            <tr>
              <th>CategoricalCrossentropy</th>
              <td><Trans i18nKey={"pages.glossary.metric-functions.table.CategoricalCrossentropy.references"} /></td>
              <td><Trans i18nKey={"pages.glossary.metric-functions.table.CategoricalCrossentropy.description"} /></td>
            </tr>
            <tr>
              <th>CosineProximity</th>
              <td><Trans i18nKey={"pages.glossary.metric-functions.table.CosineProximity.references"} /></td>
              <td><Trans i18nKey={"pages.glossary.metric-functions.table.CosineProximity.description"} /></td>
            </tr>
            <tr>
              <th>MeanAbsoluteError</th>
              <td><Trans i18nKey={"pages.glossary.metric-functions.table.MeanAbsoluteError.references"} /></td>
              <td><Trans i18nKey={"pages.glossary.metric-functions.table.MeanAbsoluteError.description"} /></td>
            </tr>
            <tr>
              <th>MeanAbsolutePercentageError</th>
              <td><Trans i18nKey={"pages.glossary.metric-functions.table.MeanAbsolutePercentageError.references"} /></td>
              <td><Trans i18nKey={"pages.glossary.metric-functions.table.MeanAbsolutePercentageError.description"} /></td>
            </tr>
            <tr>
              <th>MeanSquaredError</th>
              <td><Trans i18nKey={"pages.glossary.metric-functions.table.MeanSquaredError.references"} /></td>
              <td><Trans i18nKey={"pages.glossary.metric-functions.table.MeanSquaredError.description"} /></td>
            </tr>
            </tbody>
          </Table>
          */}
        </Accordion.Body>
      </Accordion.Item>
      {process.env.REACT_APP_ENVIRONMENT === "development" && <>
        <Accordion.Item eventKey={"equation-metric"}>
          <Accordion.Header><h3>{t("equations.title-metrics")}</h3></Accordion.Header>
          <Accordion.Body>
            <Row xs={1} sm={1} md={2} lg={2} xl={2} xxl={2}>
              <Col className={"mt-3"}>
                <h4 className={"text-lg-center"}>{t("equations.metric-functions.acc-prec-recall-f1.title")}</h4>
                <Latex>{"$$ Accuracy = \\frac{TP+TN}{TP+TN+FP+FN} $$"}</Latex>
                <Latex>{"$$ Precision = \\frac{TP}{TP+FP} $$"}</Latex>
                <Latex>{"$$ Recall = \\frac{TP}{TP+FN} $$"}</Latex>
                <Latex>{"$$ F1 = \\frac{2*Precision*Recall}{Precision+Recall} = \\frac{2*TP}{2*TP+FP+FN} $$"}</Latex>
              </Col>
              <Col className={"mt-3"}>
                <h4 className={"text-lg-center"}>{t("equations.metric-functions.sen-spe-auc.title")}</h4>
                <Latex>{"$$ Sensitivity = Recall = \\frac{TP}{TP+FN} $$"}</Latex>
                <Latex>{"$$ Specificity = \\frac{TN}{FP+TN}\n $$"}</Latex>
                <Latex>{t("equations.metric-functions.sen-spe-auc.text-1")}</Latex>
              </Col>
            </Row>
          </Accordion.Body>
        </Accordion.Item>
      </>}
    </Accordion>
  </>
}