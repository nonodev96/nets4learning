import { useEffect, useState } from "react";
import { Card, Col, Container, Row } from 'react-bootstrap'
import { Trans, useTranslation } from "react-i18next";
import { MODEL_AUTO_MPG, MODEL_BREAST_CANCER, MODEL_DIABETES, MODEL_STUDENT_PERFORMANCE, MODEL_WINE } from "./models";

export default function LinearRegressionModelReview(props) {

  const { dataset } = props
  const { t } = useTranslation()

  const [Model, setModel] = useState(null);

  useEffect(() => {
    // const dataset_ID = parseInt(dataset)
    // const dataset_key = getKeyDatasetByID_LinearRegression(dataset_ID)
    switch (dataset) {
      case MODEL_AUTO_MPG.KEY:
        setModel(new MODEL_AUTO_MPG(t));
        break
      case MODEL_BREAST_CANCER.KEY:
        setModel(new MODEL_BREAST_CANCER(t));
        break
      case MODEL_DIABETES.KEY:
        setModel(new MODEL_DIABETES(t));
        break
      case MODEL_STUDENT_PERFORMANCE.KEY:
        setModel(new MODEL_STUDENT_PERFORMANCE(t));
        break
      case MODEL_WINE.KEY:
        setModel(new MODEL_WINE(t));
        break
      default:
        console.error("Error, incorrect model");
        break
    }
  }, [dataset])

  useEffect(() => {
    async function asyncFunction() {
      if (Model !== null) {
        (await Model.dataframe()).plot("plot_div").table()
      }
    }

    asyncFunction().then(_r => undefined)
  }, [Model])

  console.log("render LinearRegressionModelReview")
  return (
    <>
      <Container id={"LinearRegressionModelReview"}>
        {Model !== null &&
          <Row>
            <Col xs={12} sm={12} md={12} xl={3} xxl={3}>
              <Card className={"sticky-top border-info mt-3"}>
                <Card.Header>
                  <h3><Trans i18nKey={Model.i18n_TITLE} /></h3>
                </Card.Header>
                <Card.Body>
                  {Model.DESCRIPTION()}
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} sm={12} md={12} xl={9} xxl={9}>
              <Card className={"mt-3"}>
                <Card.Header>
                  <h3>Featured</h3>
                </Card.Header>
                <Card.Body>
                  <Card.Title>Card Title</Card.Title>

                  <div id="plot_div"></div>

                </Card.Body>
              </Card>
            </Col>
          </Row>
        }
      </Container>
    </>
  )
}