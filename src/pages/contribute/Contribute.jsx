import React, { useState } from 'react'
import { Accordion, Card, Col, Container, Row } from 'react-bootstrap'
import { Trans } from 'react-i18next'

import N4LMarkdownDownloader from '@components/markdown/N4LMarkdownDownloader'
import N4LDivider from '@components/divider/N4LDivider'
import { VERBOSE } from '@/CONSTANTS'

export default function Contribute (props) {

  const prefix = 'pages.contribute.'

  if (VERBOSE) console.debug('render Contribute')
  return <>
    <main className={'mb-3'} data-title={'Contribute'}>
      <Container>
        <Row className={'mt-3'}>
          <Col><h1><Trans i18nKey={prefix + 'title'} /></h1></Col>
        </Row>
        <Row className={'mt-3'}>
          <Col>

            <Card border={'primary'}>
              <Card.Header><h2><Trans i18nKey={prefix + 'github.title'} /></h2></Card.Header>
              <Card.Body>
                <Card.Text><Trans i18nKey={prefix + 'github.description.0'} /></Card.Text>
                <Card.Text><Trans i18nKey={prefix + 'github.description.1'} /></Card.Text>
                <Card.Text><Trans i18nKey={prefix + 'github.description.2'} /></Card.Text>
              </Card.Body>
              <Card.Footer className={'d-flex justify-content-end'}>
                <p className={'text-muted mb-0 pb-0'}>
                  <Trans i18nKey={'more-information-in-link'}
                         components={{
                           link1: <a className={'text-info'}
                                     href={'https://github.com/SIMIDAT'} />,
                         }} />
                </p>
              </Card.Footer>
            </Card>

            <N4LDivider i18nKey={'hr.project'} />
            <Accordion className={'mt-3'}>
              <Accordion.Item eventKey={'i18n'}>
                <Accordion.Header>
                  <h3>Localization (i18n)</h3>
                </Accordion.Header>
                <Accordion.Body>
                  <N4LMarkdownDownloader file_name={'i18n.md'} />
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>

            <N4LDivider i18nKey={'hr.add-model-dataset'} />
            <Accordion className={'mt-3'}>
              <Accordion.Item eventKey={'directory-structure'}>
                <Accordion.Header>
                  <h3>Directory structure</h3>
                </Accordion.Header>
                <Accordion.Body>
                  <N4LMarkdownDownloader file_name={'directory-structure.md'} />
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey={'Example Pre-processing'}>
                <Accordion.Header>
                  <h3>Tabular classification - Example Pre-processing a data set</h3>
                </Accordion.Header>
                <Accordion.Body>
                  <N4LMarkdownDownloader file_name={'00. Tabular Classification - Example PreProcess.md'} />
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey={'Example Add Model'}>
                <Accordion.Header>
                  <h3>Tabular classification - Example Add Model</h3>
                </Accordion.Header>
                <Accordion.Body>
                  <N4LMarkdownDownloader file_name={'00. Tabular Classification - Example Add Model.md'} />
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey={'Create Model'}>
                <Accordion.Header>
                  <h3>Tabular classification - Create model</h3>
                </Accordion.Header>
                <Accordion.Body>
                  <N4LMarkdownDownloader file_name={'00. Tabular Classification - CreateModel.md'} />
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>

          </Col>
        </Row>
      </Container>
    </main>
  </>
}