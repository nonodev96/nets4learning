import React, { useEffect, useState } from 'react'
import { Card, Col, Container, Row } from 'react-bootstrap'
import { useParams } from 'react-router'
import { Trans, useTranslation } from 'react-i18next'

import {
  DATASET_1_SALARY,
  DATASET_2_AUTO_MPG,
  DATASET_3_BOSTON_HOUSING,
  DATASET_4_BREAST_CANCER,
  DATASET_5_STUDENT_PERFORMANCE,
  DATASET_6_WINE,
} from './datasets'

export default function ModelReviewLinearRegression (props) {

  const { dataset: param_id } = useParams()
  const { dataset } = props
  const { t } = useTranslation()

  const [iModel, setIModel] = useState(null)

  useEffect(() => {
    // const dataset_ID = parseInt(dataset)
    // const dataset_key = getKeyDatasetByID_LinearRegression(dataset_ID)
    switch (dataset) {
      case DATASET_1_SALARY.KEY:
        setIModel(new DATASET_1_SALARY(t, {}))
        break
      case DATASET_2_AUTO_MPG.KEY:
        setIModel(new DATASET_2_AUTO_MPG(t, {}))
        break
      case DATASET_3_BOSTON_HOUSING.KEY:
        setIModel(new DATASET_3_BOSTON_HOUSING(t, {}))
        break
      case DATASET_4_BREAST_CANCER.KEY:
        setIModel(new DATASET_4_BREAST_CANCER(t, {}))
        break
      case DATASET_5_STUDENT_PERFORMANCE.KEY:
        setIModel(new DATASET_5_STUDENT_PERFORMANCE(t, {}))
        break
      case DATASET_6_WINE.KEY:
        setIModel(new DATASET_6_WINE(t, {}))
        break
      default:
        console.error('Error, incorrect model', param_id)
        break
    }
  }, [dataset, t, param_id])

  useEffect(() => {
    async function asyncFunction () {
      if (iModel !== null) {
        (await iModel.DATASETS()).datasets[0].dataframe_original.plot('plot_div').table()
      }
    }

    asyncFunction().then(_r => undefined)
  }, [iModel])

  console.debug('render ModelReviewLinearRegression')
  return (
    <>
      <Container>
        <Row className={'mt-2'}>
          <Col xl={12}>
            <div className="d-flex justify-content-between">
              <h1><Trans i18nKey={'modality.' + param_id} /></h1>
            </div>
          </Col>
        </Row>
      </Container>

      <Container id={'ModelReviewLinearRegression'} data-testid="Test-ModelReviewLinearRegression">
        {iModel !== null &&
          <Row>
            <Col xs={12} sm={12} md={12} xl={3} xxl={3}>
              <Card className={'sticky-top border-info mt-3'}>
                <Card.Header>
                  <h3><Trans i18nKey={iModel.i18n_TITLE} /></h3>
                </Card.Header>
                <Card.Body>
                  {iModel.DESCRIPTION()}
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} sm={12} md={12} xl={9} xxl={9}>
              <Card className={'mt-3'}>
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