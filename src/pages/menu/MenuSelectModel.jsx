import React, { useEffect, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { Form, Button, Row, Col, Container, Card } from 'react-bootstrap'
import { Trans, useTranslation } from 'react-i18next'

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
  const [options, setOptions] = useState([])

  const handleSubmit = async ($event) => {
    $event.preventDefault()
    if (model_key === 'select-model') {
      await alertHelper.alertWarning(t('alert.menu.need-select-model'))
    } else {
      history.push('/playground/' + id + '/model/' + model_key)
    }
  }

  useEffect(() => {
    let _options = []
    const taskModelOptions = {
      [TASKS.TABULAR_CLASSIFICATION]: [
        { i18n: 'datasets-models.0-tabular-classification.list-models.0-option-1', value: MODEL_CAR.KEY },
        { i18n: 'datasets-models.0-tabular-classification.list-models.0-option-2', value: MODEL_IRIS.KEY },
        { i18n: 'datasets-models.0-tabular-classification.list-models.0-option-3', value: MODEL_LYMPHOGRAPHY.KEY },
      ],
      [TASKS.LINEAR_REGRESSION]     : [
        { i18n: 'datasets-models.1-linear-regression.list-models.salary', value: MODEL_1_SALARY.KEY },
        { i18n: 'datasets-models.1-linear-regression.list-models.auto-mpg', value: MODEL_2_AUTO_MPG.KEY },
        { i18n: 'datasets-models.1-linear-regression.list-models.boston-housing', value: MODEL_3_BOSTON_HOUSING.KEY },
        { i18n: 'datasets-models.1-linear-regression.list-models.breast-cancer', value: MODEL_4_BREAST_CANCER.KEY },
        { i18n: 'datasets-models.1-linear-regression.list-models.student-performance', value: MODEL_5_STUDENT_PERFORMANCE.KEY },
        { i18n: 'datasets-models.1-linear-regression.list-models.wine', value: MODEL_6_WINE.KEY },
      ],
      [TASKS.OBJECT_DETECTION]      : [
        { i18n: 'datasets-models.2-object-detection.list-models.2-option-1', value: MODEL_FACE_DETECTOR.KEY },
        { i18n: 'datasets-models.2-object-detection.list-models.2-option-2', value: MODEL_FACE_MESH.KEY },
        { i18n: 'datasets-models.2-object-detection.list-models.2-option-3', value: MODEL_MOVE_NET_POSE_NET.KEY },
        { i18n: 'datasets-models.2-object-detection.list-models.2-option-4', value: MODEL_COCO_SSD.KEY },
      ],
      [TASKS.IMAGE_CLASSIFICATION]  : [
        { i18n: 'datasets-models.3-image-classifier.list-models.3-option-1', value: MODEL_IMAGE_MNIST.KEY },
        { i18n: 'datasets-models.3-image-classifier.list-models.3-option-2', value: MODEL_IMAGE_MOBILENET.KEY },
      ],
    }

    if (taskModelOptions.hasOwnProperty(id)) {
      _options = taskModelOptions[id]
    } else {
      console.error('Error, option not valid')
    }

    setOptions(_options)
  }, [id])

  if (VERBOSE) console.debug('render MenuSelectModel')
  return (
    <>
      <Form onSubmit={($event) => handleSubmit($event)}>

        <Container id={'MenuSelectModel'} data-testid={'Test-MenuSelectModel'}>
          <Row className="mt-3 mb-3">
            <Col>
              <Card>
                <Card.Header><h3><Trans i18nKey={'modality.' + id} /></h3></Card.Header>
                <Card.Body>
                  <Card.Text>
                    <Trans i18nKey={'pages.menu-selection-model.form-description-1'} />
                  </Card.Text>
                  <Form.Group controlId="FormModel">
                    <Form.Label><Trans i18nKey={'pages.menu-selection-model.form-label'} /></Form.Label>
                    <Form.Select aria-label={t('pages.menu-selection-model.form-label')}
                                 defaultValue={'select-model'}
                                 data-testid={'Test-MenuSelectModel-Select'}
                                 onChange={(e) => {
                                   setModelKey(e.target.value)
                                 }}>
                      <option value={'select-model'} disabled>{t('pages.menu-selection-model.form-option-_-1')}</option>
                      {options.map(({ value, i18n }, index) => {
                        return <option value={value} key={index}>{t(i18n)}</option>
                      })}
                    </Form.Select>
                  </Form.Group>
                  <Button className="mt-3"
                          type={'submit'}
                          data-testid={'Test-MenuSelectModel-Submit'}>
                    <Trans i18nKey={'pages.menu-selection-model.form-submit'} />
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
