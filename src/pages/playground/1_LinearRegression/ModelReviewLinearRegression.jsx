import { useEffect, useState } from "react";
import { Card, Col, Container, Row } from 'react-bootstrap'
import { Trans, useTranslation } from "react-i18next";
import { DATASET_1_SALARY, DATASET_2_AUTO_MPG, DATASET_3_BOSTON_HOUSING, DATASET_4_BREAST_CANCER, DATASET_5_STUDENT_PERFORMANCE, DATASET_6_WINE } from "./datasets";

export default function ModelReviewLinearRegression(props) {

  const { dataset } = props
  const { t } = useTranslation()

  const [Model, setModel] = useState(null);

  useEffect(() => {
    // const dataset_ID = parseInt(dataset)
    // const dataset_key = getKeyDatasetByID_LinearRegression(dataset_ID)
    switch (dataset) {
      case DATASET_1_SALARY.KEY:
        setModel(new DATASET_1_SALARY(t));
        break
      case DATASET_2_AUTO_MPG.KEY:
        setModel(new DATASET_2_AUTO_MPG(t));
        break
      case DATASET_3_BOSTON_HOUSING.KEY:
        setModel(new DATASET_3_BOSTON_HOUSING(t));
        break
      case DATASET_4_BREAST_CANCER.KEY:
        setModel(new DATASET_4_BREAST_CANCER(t));
        break
      case DATASET_5_STUDENT_PERFORMANCE.KEY:
        setModel(new DATASET_5_STUDENT_PERFORMANCE(t));
        break
      case DATASET_6_WINE.KEY:
        setModel(new DATASET_6_WINE(t));
        break
      default:
        console.error("Error, incorrect model");
        break
    }
  }, [dataset, t])

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