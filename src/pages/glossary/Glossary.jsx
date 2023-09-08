import 'katex/dist/katex.min.css'
import React from 'react'
import { Accordion, Col, Container, Row } from 'react-bootstrap'
import { Trans, useTranslation } from 'react-i18next'

import Glossary1Optimizers from './Glossary1Optimizers'
import Glossary2ActivationFunctions from './Glossary2ActivationFunctions'
import Glossary3LossFunctions from './Glossary3LossFunctions'
import Glossary4MetricFunctions from './Glossary4MetricFunctions'
import { VERBOSE } from '@/CONSTANTS'

export default function Glossary () {

  const { t } = useTranslation()

  if (VERBOSE) console.debug('render Glossary')
  return <>
    <main className={'mb-3'} data-title={'Glossary'}>
      <Container>
        <Row className={"mt-3"}>
          <Col>
            <h1><Trans i18nKey={'pages.glossary.title'} t={t} /></h1>
          </Col>
        </Row>
        <Row className={"mt-3"}>
          <Col>
            <Accordion defaultValue={'classification-tabular'}>
              <Accordion.Item eventKey={'classification-tabular'}>
                <Accordion.Header><h3><Trans i18nKey={'pages.glossary.tabular-classification.title'} /></h3></Accordion.Header>
                <Accordion.Body>
                  <p><Trans i18nKey={'pages.glossary.tabular-classification.text-1'} /></p>
                  <p><Trans i18nKey={'pages.glossary.tabular-classification.text-2'} /></p>
                  <p><Trans i18nKey={'pages.glossary.tabular-classification.text-3'} /></p>
                  <p><Trans i18nKey={'pages.glossary.tabular-classification.text-4'} /></p>
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey={'linear-regression'}>
                <Accordion.Header><h3><Trans i18nKey={'pages.glossary.linear-regression.title'} /></h3></Accordion.Header>
                <Accordion.Body>
                  <p><Trans i18nKey={'pages.glossary.linear-regression.text.0'} /></p>
                  <p><Trans i18nKey={'pages.glossary.linear-regression.text.1'} /></p>
                  <p><Trans i18nKey={'pages.glossary.linear-regression.text.2'} /></p>
                  <p><Trans i18nKey={'pages.glossary.linear-regression.text.3'} /></p>
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey={'classification-imagen'}>
                <Accordion.Header><h3><Trans i18nKey={'pages.glossary.image-classification.title'} /></h3></Accordion.Header>
                <Accordion.Body>
                  <p><Trans i18nKey={'pages.glossary.image-classification.text-1'} /></p>
                  <p><Trans i18nKey={'pages.glossary.image-classification.text-2'} /></p>
                  <p><Trans i18nKey={'pages.glossary.image-classification.text-3'} /></p>
                  <p><Trans i18nKey={'pages.glossary.image-classification.text-4'} /></p>
                  <p><Trans i18nKey={'pages.glossary.image-classification.text-5'} /></p>
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey={'objects-detection'}>
                <Accordion.Header><h3><Trans i18nKey={'pages.glossary.object-identification.title'} /></h3></Accordion.Header>
                <Accordion.Body>
                  <p><Trans i18nKey={'pages.glossary.object-identification.text-1'} /></p>
                  <p><Trans i18nKey={'pages.glossary.object-identification.text-2'} /></p>
                  <p><Trans i18nKey={'pages.glossary.object-identification.text-3'} /></p>
                  <p><Trans i18nKey={'pages.glossary.object-identification.text-4'} /></p>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>

            <hr />
            {/*/!* Funciones de optimización *!/*/}
            <Glossary1Optimizers />

            <hr />
            {/*/!* Funciones de activación *!/*/}
            <Glossary2ActivationFunctions />

            <hr />
            {/*/!* Funciones de perdida *!/*/}
            <Glossary3LossFunctions />

            <hr />
            {/*/!* Funciones de métricas *!/*/}
            <Glossary4MetricFunctions />

            {/*<hr />*/}
            {/*/!* Layers *!/*/}
            {/*<Glossary5Layers />*/}
          </Col>
        </Row>
      </Container>
    </main>
  </>

}