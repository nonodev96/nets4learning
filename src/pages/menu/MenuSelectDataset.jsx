import React, { useState } from 'react'
import { Form, Button, Row, Col, Container, Card } from 'react-bootstrap'
import { useParams, useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
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

export default function MenuSelectDataset () {

  const { id } = useParams()
  const { t } = useTranslation()
  const history = useHistory()

  const [dataset_id, setDatasetId] = useState('select-dataset')

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (dataset_id === 'select-dataset') {
      await alertHelper.alertWarning(t('alert.menu.need-select-dataset'))
    } else {
      history.push('/playground/' + id + '/dataset/' + dataset_id)
    }
  }

  const PrintFormSelectOptions = () => {
    switch (id) {
      case TASKS.TABULAR_CLASSIFICATION: {
        // tabular-classification
        return <>
          <option value={UPLOAD}>{t('pages.menu-selection-dataset.0-tabular-classification.csv')}</option>
          <option value={MODEL_CAR.KEY}>{t('datasets-models.0-tabular-classification.list-datasets.0-option-1')}</option>
          <option value={MODEL_IRIS.KEY}>{t('datasets-models.0-tabular-classification.list-datasets.0-option-2')}</option>
          <option value={MODEL_LYMPHOGRAPHY.KEY}>{t('datasets-models.0-tabular-classification.list-datasets.0-option-3')}</option>
        </>
      }
      case TASKS.LINEAR_REGRESSION: {
        // linear-regression
        return <>
          <option value={UPLOAD}>{t('pages.menu-selection-dataset.1-linear-regression.csv')}</option>
          <option value={MODEL_1_SALARY.KEY}>{t('datasets-models.1-linear-regression.list-datasets.salary')}</option>
          <option value={MODEL_2_AUTO_MPG.KEY}>{t('datasets-models.1-linear-regression.list-datasets.auto-mpg')}</option>
          <option value={MODEL_3_BOSTON_HOUSING.KEY}>{t('datasets-models.1-linear-regression.list-datasets.boston-housing')}</option>
          <option value={MODEL_4_BREAST_CANCER.KEY}>{t('datasets-models.1-linear-regression.list-datasets.breast-cancer')}</option>
          <option value={MODEL_5_STUDENT_PERFORMANCE.KEY}>{t('datasets-models.1-linear-regression.list-datasets.student-performance')}</option>
          <option value={MODEL_6_WINE.KEY}>{t('datasets-models.1-linear-regression.list-datasets.wine')}</option>
        </>
      }
      case TASKS.OBJECT_DETECTION: {
        // object-detection
        console.warn('TODO')
        return <>
        </>
      }
      case TASKS.IMAGE_CLASSIFICATION: {
        // image-classifier
        console.warn('TODO')
        return <>
          <option value={MODEL_IMAGE_MNIST.KEY}>{t('pages.menu-selection-dataset.1-image-classifier')}</option>
        </>
      }
      default: {
        console.error('Opción no disponible')
      }
    }
  }

  console.debug('render MenuSelectDataset')
  return <>
    <Form onSubmit={($event) => handleSubmit($event)}>
      <Container id={'MenuSelectDataset'} data-testid={'Test-MenuSelectDataset'}>
        <Row className="mt-3 mb-3">
          <Col>
            <Card>
              <Card.Header><h3>{t('modality.' + id)}</h3></Card.Header>
              <Card.Body>
                <Card.Text>
                  {t('pages.menu-selection-dataset.form-description-1')}
                </Card.Text>
                <Form.Group className="mb-3" controlId="FormDataSet">
                  <Form.Label>{t('pages.menu-selection-dataset.form-label')}</Form.Label>
                  <Form.Select aria-label={t('pages.menu-selection-dataset.form-label')}
                               defaultValue={'select-dataset'}
                               onChange={(e) => setDatasetId(e.target.value)}>
                    <option value={'select-dataset'} disabled>{t('pages.menu-selection-dataset.form-option-_-1')}</option>
                    <PrintFormSelectOptions />
                  </Form.Select>
                </Form.Group>

                <Button className={'mt-3'}
                        type="submit"
                        data-testid={'Test-MenuSelectDataset-Submit'}>
                  {t('pages.menu-selection-dataset.form-submit')}
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Form>
  </>

}
