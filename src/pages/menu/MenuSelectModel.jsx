import React, { useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { Form, Button, Row, Col, Container, Card } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

import alertHelper from '@utils/alertHelper'
import {
  MODEL_CAR,
  MODEL_IRIS,
  MODEL_LYMPHOGRAPHY,

  MODEL_1_SALARY,
  MODEL_2_AUTO_MPG,
  MODEL_3_BOSTON_HOUSING,
  MODEL_4_BREAST_CANCER,
  MODEL_5_STUDENT_PERFORMANCE,
  MODEL_6_WINE,

  MODEL_IMAGE_MNIST,
  MODEL_IMAGE_MOBILENET,

  MODEL_FACE_DETECTOR,
  MODEL_FACE_MESH,
  MODEL_MOVE_NET_POSE_NET,
  MODEL_COCO_SSD,
  TASKS,
} from '@/DATA_MODEL'
import { VERBOSE } from '@/CONSTANTS'

export default function MenuSelectModel (_props) {

  const { id } = useParams()
  const { t } = useTranslation()
  const history = useHistory()

  const [model_key, setModelKey] = useState('select-model')

  const handleSubmit = async ($event) => {
    $event.preventDefault()
    if (model_key === 'select-model') {
      await alertHelper.alertWarning(t('alert.menu.need-select-model'))
    } else {
      history.push('/playground/' + id + '/model/' + model_key)
    }
  }

  const PrintFormSelectOptions = () => {
    switch (id) {
      case TASKS.TABULAR_CLASSIFICATION: {
        // tabular-classification
        return <>
          <option value={MODEL_CAR.KEY}>{t('datasets-models.0-tabular-classification.list-models.0-option-1')}</option>
          <option value={MODEL_IRIS.KEY}>{t('datasets-models.0-tabular-classification.list-models.0-option-2')}</option>
          <option value={MODEL_LYMPHOGRAPHY.KEY}>{t('datasets-models.0-tabular-classification.list-models.0-option-3')}</option>
        </>
      }
      case TASKS.LINEAR_REGRESSION: {
        // linear-regression
        return <>
          <option value={MODEL_1_SALARY.KEY}>{t('datasets-models.1-linear-regression.list-models.salary')}</option>
          <option value={MODEL_2_AUTO_MPG.KEY}>{t('datasets-models.1-linear-regression.list-models.auto-mpg')}</option>
          <option value={MODEL_3_BOSTON_HOUSING.KEY}>{t('datasets-models.1-linear-regression.list-models.boston-housing')}</option>
          <option value={MODEL_4_BREAST_CANCER.KEY}>{t('datasets-models.1-linear-regression.list-models.breast-cancer')}</option>
          <option value={MODEL_5_STUDENT_PERFORMANCE.KEY}>{t('datasets-models.1-linear-regression.list-models.student-performance')}</option>
          <option value={MODEL_6_WINE.KEY}>{t('datasets-models.1-linear-regression.list-models.wine')}</option>
        </>
      }
      case TASKS.OBJECT_DETECTION: {
        // object-detection
        return <>
          <option value={MODEL_FACE_DETECTOR.KEY}>{t('datasets-models.2-object-detection.list-models.2-option-1')}</option>
          <option value={MODEL_FACE_MESH.KEY}>{t('datasets-models.2-object-detection.list-models.2-option-2')}</option>
          <option value={MODEL_MOVE_NET_POSE_NET.KEY}>{t('datasets-models.2-object-detection.list-models.2-option-3')}</option>
          <option value={MODEL_COCO_SSD.KEY}>{t('datasets-models.2-object-detection.list-models.2-option-4')}</option>
        </>
      }
      case TASKS.IMAGE_CLASSIFICATION: {
        // Clasificación imágenes
        return <>
          <option value={MODEL_IMAGE_MNIST.KEY}>{t('datasets-models.3-image-classifier.list-models.3-option-1')}</option>
          <option value={MODEL_IMAGE_MOBILENET.KEY}>{t('datasets-models.3-image-classifier.list-models.3-option-2')}</option>
          {/*<option value={MODEL_RESNET.KEY}>{t('datasets-models.3-image-classifier.list-models.3-option-3')}</option>*/}
        </>
      }
      default: {
        console.error('Opción no disponible')
      }
    }
  }

  if (VERBOSE) console.debug('render MenuSelectModel')
  return (
    <>
      <Form onSubmit={($event) => handleSubmit($event)}>

        <Container id={'MenuSelectModel'} data-testid={'Test-MenuSelectModel'}>
          <Row className="mt-3 mb-3">
            <Col>
              <Card>
                <Card.Header><h3>{t('modality.' + id)}</h3></Card.Header>
                <Card.Body>
                  <Card.Text>
                    {t('pages.menu-selection-model.form-description-1')}
                  </Card.Text>
                  {/*<Card.Text>*/}
                  {/*  {t("pages.menu-selection-model.form-description-2")}*/}
                  {/*</Card.Text>*/}
                  <Form.Group controlId="FormModel">
                    <Form.Label>{t('pages.menu-selection-model.form-label')}</Form.Label>
                    <Form.Select aria-label={t('pages.menu-selection-model.form-label')}
                                 defaultValue={'select-model'}
                                 data-testid={'Test-MenuSelectModel-Select'}
                                 onChange={(e) => {
                                   console.log({ e })
                                   setModelKey(e.target.value)
                                 }}>
                      <option value={'select-model'} disabled>{t('pages.menu-selection-model.form-option-_-1')}</option>

                      <PrintFormSelectOptions />

                    </Form.Select>
                  </Form.Group>

                  <Button className="mt-3"
                          type={'submit'}
                          data-testid={'Test-MenuSelectModel-Submit'}>
                    {t('pages.menu-selection-model.form-submit')}
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </Form>
    </>
  )
}
