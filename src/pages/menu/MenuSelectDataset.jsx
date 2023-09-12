import React, { useEffect, useState } from 'react'
import { Form, Button, Row, Col, Container, Card } from 'react-bootstrap'
import { useParams, useHistory } from 'react-router-dom'
import { Trans, useTranslation } from 'react-i18next'
import alertHelper from '@utils/alertHelper'
import {
  TASKS,
  UPLOAD,

  MODEL_1_SALARY,
  MODEL_2_AUTO_MPG,
  MODEL_3_BOSTON_HOUSING,
  MODEL_4_BREAST_CANCER,
  MODEL_5_STUDENT_PERFORMANCE,
  MODEL_6_WINE,

  MODEL_CAR,
  MODEL_IRIS,
  MODEL_LYMPHOGRAPHY,
  MODEL_IMAGE_MNIST
} from '@/DATA_MODEL'
import { VERBOSE } from '@/CONSTANTS'

export default function MenuSelectDataset () {

  const { id } = useParams()
  const { t } = useTranslation()
  const history = useHistory()

  const [dataset_id, setDatasetId] = useState('select-dataset')
  const [options, setOptions] = useState([])

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (dataset_id === 'select-dataset') {
      await alertHelper.alertWarning(t('alert.menu.need-select-dataset'))
    } else {
      history.push('/playground/' + id + '/dataset/' + dataset_id)
    }
  }

  useEffect(() => {
    let _options = []
    const taskOptions = {
      [TASKS.TABULAR_CLASSIFICATION]: [
        { i18n: 'pages.menu-selection-dataset.0-tabular-classification.csv', value: UPLOAD },
        { i18n: 'datasets-models.0-tabular-classification.list-datasets.0-option-1', value: MODEL_CAR.KEY },
        { i18n: 'datasets-models.0-tabular-classification.list-datasets.0-option-2', value: MODEL_IRIS.KEY },
        { i18n: 'datasets-models.0-tabular-classification.list-datasets.0-option-3', value: MODEL_LYMPHOGRAPHY.KEY },
      ],
      [TASKS.LINEAR_REGRESSION]     : [
        { i18n: 'pages.menu-selection-dataset.1-linear-regression.csv', value: UPLOAD },
        { i18n: 'datasets-models.1-linear-regression.list-datasets.salary', value: MODEL_1_SALARY.KEY },
        { i18n: 'datasets-models.1-linear-regression.list-datasets.auto-mpg', value: MODEL_2_AUTO_MPG.KEY },
        { i18n: 'datasets-models.1-linear-regression.list-datasets.boston-housing', value: MODEL_3_BOSTON_HOUSING.KEY },
        { i18n: 'datasets-models.1-linear-regression.list-datasets.breast-cancer', value: MODEL_4_BREAST_CANCER.KEY },
        { i18n: 'datasets-models.1-linear-regression.list-datasets.student-performance', value: MODEL_5_STUDENT_PERFORMANCE.KEY },
        { i18n: 'datasets-models.1-linear-regression.list-datasets.wine', value: MODEL_6_WINE.KEY },
      ],
      [TASKS.OBJECT_DETECTION]      : [],
      [TASKS.IMAGE_CLASSIFICATION]  : [
        { i18n: 'pages.menu-selection-dataset.1-image-classifier', value: MODEL_IMAGE_MNIST.KEY },
      ],
    }

    if (taskOptions.hasOwnProperty(id)) {
      _options = taskOptions[id]
    } else {
      console.error('Error, option not valid')
    }
    setOptions(_options)
  }, [id])

  if (VERBOSE) console.debug('render MenuSelectDataset')
  return <>
    <Form onSubmit={($event) => handleSubmit($event)}>
      <Container id={'MenuSelectDataset'} data-testid={'Test-MenuSelectDataset'}>
        <Row className="mt-3 mb-3">
          <Col>
            <Card>
              <Card.Header><h3><Trans i18nKey={'modality.' + id} /></h3></Card.Header>
              <Card.Body>
                <Card.Text>
                  <Trans i18nKey={'pages.menu-selection-dataset.form-description-1'} />
                </Card.Text>
                <Form.Group className="mb-3" controlId="FormDataSet">
                  <Form.Label><Trans i18nKey={'pages.menu-selection-dataset.form-label'} /></Form.Label>
                  <Form.Select aria-label={t('pages.menu-selection-dataset.form-label')}
                               defaultValue={'select-dataset'}
                               onChange={(e) => setDatasetId(e.target.value)}>
                    <option value={'select-dataset'} disabled>{t('pages.menu-selection-dataset.form-option-_-1')}</option>
                    {options.map(({ value, i18n }, index) => {
                      return <option value={value} key={index}>{t(i18n)}</option>
                    })}
                  </Form.Select>
                </Form.Group>
                <Button className={'mt-3'}
                        type="submit"
                        data-testid={'Test-MenuSelectDataset-Submit'}>
                  <Trans i18nKey={'pages.menu-selection-dataset.form-submit'} />
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Form>
  </>

}
