import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { Trans, useTranslation } from 'react-i18next'
import { Card, Col, Container, Row } from 'react-bootstrap'
import ReactGA from 'react-ga4'

import {
  MODEL_1_SALARY,
  MODEL_2_AUTO_MPG,
  MODEL_3_BOSTON_HOUSING,
  MODEL_4_BREAST_CANCER,
  MODEL_5_STUDENT_PERFORMANCE,
  MODEL_6_WINE,
} from '@/DATA_MODEL'
import { VERBOSE } from '@/CONSTANTS'

export default function ModelReviewLinearRegression ({ dataset }) {
  const { id } = useParams()

  const { t } = useTranslation()

  const [iModel, setIModel] = useState(null)

  useEffect(() => {
    ReactGA.send({ hitType: 'pageview', page: '/ModelReviewLinearRegression/' + dataset, title: dataset, })
  }, [dataset])

  useEffect(() => {
    // const dataset_ID = parseInt(dataset)
    // const dataset_key = getKeyDatasetByID_LinearRegression(dataset_ID)
    switch (dataset) {
      case MODEL_1_SALARY.KEY:
        setIModel(new MODEL_1_SALARY(t, {}))
        break
      case MODEL_2_AUTO_MPG.KEY:
        setIModel(new MODEL_2_AUTO_MPG(t, {}))
        break
      case MODEL_3_BOSTON_HOUSING.KEY:
        setIModel(new MODEL_3_BOSTON_HOUSING(t, {}))
        break
      case MODEL_4_BREAST_CANCER.KEY:
        setIModel(new MODEL_4_BREAST_CANCER(t, {}))
        break
      case MODEL_5_STUDENT_PERFORMANCE.KEY:
        setIModel(new MODEL_5_STUDENT_PERFORMANCE(t, {}))
        break
      case MODEL_6_WINE.KEY:
        setIModel(new MODEL_6_WINE(t, {}))
        break
      default:
        console.error('Error, incorrect model', dataset)
        break
    }
  }, [dataset, t])

  useEffect(() => {
    async function asyncFunction () {
      if (iModel !== null) {
        (await iModel.DATASETS()).datasets[0].dataframe_original.plot('plot_div').table()
      }
    }

    asyncFunction().then(_r => undefined)
  }, [iModel])

  if (VERBOSE) console.debug('render ModelReviewLinearRegression')
  return (
    <>
      <Container>
        <Row className={'mt-2'}>
          <Col xl={12}>
            <div className="d-flex justify-content-between">
              <h1><Trans i18nKey={'modality.' + id} /></h1>
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