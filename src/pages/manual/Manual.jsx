import 'katex/dist/katex.min.css'
import { Accordion, Card, Col, Container, Row } from 'react-bootstrap'
import React from 'react'
import { Trans } from 'react-i18next'
import { VERBOSE } from '@/CONSTANTS'

export default function Manual () {

  if (VERBOSE) console.debug('render Manual')
  return (
    <>
      <main className={'mb-3'} data-title={'Manual'}>
        <Container>
          <Row className={'mt-2'}>
            <Col xl={12}>
              <h1>Manual</h1>
            </Col>
            <Col xl={12} className={'mt-3'}>
              <Card border={'primary'}>
                <Card.Header><h3><Trans i18nKey={'pages.manual.app.title'} /></h3></Card.Header>
                <Card.Body>
                  <Card.Text><Trans i18nKey={'pages.manual.app.description-1'} /></Card.Text>
                  <Card.Text><Trans i18nKey={'pages.manual.app.description-2'} /></Card.Text>
                  <ol>
                    <li><b><Trans i18nKey={'pages.manual.app.list.0.title'} />: </b> <Trans i18nKey={'pages.manual.app.list.0.description'} /></li>
                    <li><b><Trans i18nKey={'pages.manual.app.list.1.title'} />: </b> <Trans i18nKey={'pages.manual.app.list.1.description'} /></li>
                    <li><b><Trans i18nKey={'pages.manual.app.list.2.title'} />: </b> <Trans i18nKey={'pages.manual.app.list.2.description'} /></li>
                  </ol>
                  <Card.Text><Trans i18nKey={'pages.manual.app.description-3'} /></Card.Text>
                  <Card.Text><Trans i18nKey={'pages.manual.app.description-4'} /></Card.Text>
                </Card.Body>
              </Card>

              <Accordion className={'mt-3'}>
                <Accordion.Item eventKey={'manual-0-tabular-classification'}>
                  <Accordion.Header><h3><Trans i18nKey={'pages.manual.0-tabular-classification.title'} /></h3></Accordion.Header>
                  <Accordion.Body>
                    <h4><Trans i18nKey={'pages.manual.0-tabular-classification.1-title'} /></h4>
                    <p><Trans i18nKey={'pages.manual.0-tabular-classification.1-description-1'} /></p>
                    <p><Trans i18nKey={'pages.manual.0-tabular-classification.1-description-2'} /></p>
                    <p><Trans i18nKey={'pages.manual.0-tabular-classification.1-description-3'} /></p>
                    <hr />
                    <h4><Trans i18nKey={'pages.manual.0-tabular-classification.2-title'} /></h4>
                    <p><Trans i18nKey={'pages.manual.0-tabular-classification.2-description-1'} /></p>
                    <p><Trans i18nKey={'pages.manual.0-tabular-classification.2-description-2'} /></p>
                    <p><Trans i18nKey={'pages.manual.0-tabular-classification.2-description-3'} /></p>
                    <p><Trans i18nKey={'pages.manual.0-tabular-classification.2-description-4'} /></p>
                    <p><Trans i18nKey={'pages.manual.0-tabular-classification.2-description-5'} /></p>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey={'manual-1-linear-regression'}>
                  <Accordion.Header><h3><Trans i18nKey={'pages.manual.1-linear-regression.title'} /></h3></Accordion.Header>
                  <Accordion.Body>
                    <h4><Trans i18nKey={'pages.manual.1-linear-regression.1-title'} /></h4>
                    <p><Trans i18nKey={'pages.manual.1-linear-regression.1-description-1'} /></p>
                    <p><Trans i18nKey={'pages.manual.1-linear-regression.1-description-2'} /></p>
                    <p><Trans i18nKey={'pages.manual.1-linear-regression.1-description-3'} /></p>
                    <hr />
                    <h4><Trans i18nKey={'pages.manual.1-linear-regression.2-title'} /></h4>
                    <p><Trans i18nKey={'pages.manual.1-linear-regression.2-description-1'} /></p>
                    <p><Trans i18nKey={'pages.manual.1-linear-regression.2-description-2'} /></p>
                    <p><Trans i18nKey={'pages.manual.1-linear-regression.2-description-3'} /></p>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey={'manual-2-object-identification'}>
                  <Accordion.Header><h3><Trans i18nKey={'pages.manual.2-object-identification.title'} /></h3></Accordion.Header>
                  <Accordion.Body>
                    <h4><Trans i18nKey={'pages.manual.2-object-identification.1-title'} /></h4>
                    <p><Trans i18nKey={'pages.manual.2-object-identification.1-description-1'} /></p>
                    <p><Trans i18nKey={'pages.manual.2-object-identification.1-description-2'} /></p>
                    <ol>
                      <li><Trans i18nKey={'pages.manual.2-object-identification.1-list.0'} /></li>
                      <li><Trans i18nKey={'pages.manual.2-object-identification.1-list.1'} /></li>
                      <li><Trans i18nKey={'pages.manual.2-object-identification.1-list.2'} /></li>
                      <li><Trans i18nKey={'pages.manual.2-object-identification.1-list.3'} /></li>
                    </ol>
                    <p><Trans i18nKey={'pages.manual.2-object-identification.1-description-3'} /></p>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey={'manual-3-image-classification'}>
                  <Accordion.Header><h3><Trans i18nKey={'pages.manual.3-image-classification.title'} /></h3></Accordion.Header>
                  <Accordion.Body>
                    <h4><Trans i18nKey={'pages.manual.3-image-classification.1-title'} /></h4>
                    <p><Trans i18nKey={'pages.manual.3-image-classification.1-description-1'} /></p>
                    <ol>
                      <li><Trans i18nKey={'pages.manual.3-image-classification.1-list.0'} /></li>
                      <li><Trans i18nKey={'pages.manual.3-image-classification.1-list.1'} /></li>
                    </ol>
                    <p><Trans i18nKey={'pages.manual.3-image-classification.1-description-2'} /></p>
                    <p><Trans i18nKey={'pages.manual.3-image-classification.1-description-3'} /></p>
                    <p><Trans i18nKey={'pages.manual.3-image-classification.1-description-4'} /></p>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Col>
          </Row>
        </Container>
      </main>
    </>
  )
}