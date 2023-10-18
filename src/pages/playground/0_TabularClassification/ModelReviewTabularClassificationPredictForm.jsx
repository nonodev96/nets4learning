import React from 'react'
import { Col, Form, Row } from 'react-bootstrap'
import { Trans, useTranslation } from 'react-i18next'
import { VERBOSE } from '@/CONSTANTS'

export default function ModelReviewTabularClassificationPredictForm (props) {

  const { iModelInstance, dataToTest, setDataToTest } = props
  const { t } = useTranslation()

  const handleChange_Parameter = (key_parameter, value) => {
    setDataToTest((prevState) => ({
      ...prevState,
      [key_parameter]: value,
    }))
  }

  if (VERBOSE) console.debug('render ModelReviewTabularClassificationPredictForm')
  return <>
    <Row xs={6} sm={6} md={4} lg={4} xl={4} xxl={3}>
      {iModelInstance.FORM.map((value, index) => {
        // VALUES:
        // {name: "type1", type: "int32" },
        // {name: "type2", type: "float32" },
        // {name: "type3", type: "string", options: [{value: "", text: ""] },
        switch (value.type) {
          case 'int32': {
            return <Col key={'form' + index} className={'mb-3'}>
              <Form.Group>
                <Form.Label>{t('pages.playground.form.select-parameter')}: <b>{value.name}</b></Form.Label>
                <Form.Control type="number"
                              min={0}
                              size={'sm'}
                              placeholder={t('pages.playground.form.parameter-integer')}
                              step={1}
                              value={dataToTest[value.name] ?? 0}
                              onChange={($event) => handleChange_Parameter(value.name, $event.target.value)} />
                <Form.Text className="text-muted">
                  <Trans i18nKey={'pages.playground.form.parameter-integer'} />: {value.name}
                </Form.Text>
              </Form.Group>
            </Col>
          }

          case 'float32': {
            return <Col key={'form' + index} className={'mb-3'}>
              <Form.Group controlId={value.name}>
                <Form.Label>{t('pages.playground.form.select-parameter')}: <b>{value.name}</b></Form.Label>
                <Form.Control type="number"
                              min={0}
                              size={'sm'}
                              placeholder={t('pages.playground.form.parameter-decimal')}
                              step={0.1}
                              value={dataToTest[value.name] ?? 0.0}
                              onChange={($event) => handleChange_Parameter(value.name, $event.target.value)} />
                <Form.Text className="text-muted">
                  <Trans i18nKey={'pages.playground.form.parameter-decimal'} />: {value.name}
                </Form.Text>
              </Form.Group>
            </Col>
          }
          case 'label-encoder': {
            return <Col key={'form' + index} className={'mb-3'}>
              <Form.Group controlId={value.name}>
                <Form.Label>{t('pages.playground.form.select-parameter')}: <b>{value.name}</b></Form.Label>
                <Form.Select aria-label={t('pages.playground.form.select-parameter')}
                             value={dataToTest[value.name] ?? 0}
                             size={'sm'}
                             onChange={($event) => handleChange_Parameter(value.name, $event.target.value)}>
                  {value
                    .options
                    .map((option_value, option_index) => {
                      return <option key={value.name + '_option_' + option_index}
                                     value={option_value.value}>
                        {option_value.text}
                      </option>
                    })}
                </Form.Select>
                <Form.Text className="text-muted">
                  <Trans i18nKey={'pages.playground.form.parameter-decimal'} />: {value.name}
                </Form.Text>
              </Form.Group>
            </Col>
          }
          default:
            return <>default</>
        }
      })}
    </Row>
  </>
}