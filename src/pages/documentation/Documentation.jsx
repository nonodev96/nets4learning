import React from 'react'
import { Accordion, Col, Container, Row } from 'react-bootstrap'
import { Trans } from 'react-i18next'

import N4LDivider from '@components/divider/N4LDivider'
import N4LMarkdownDownloader from '@components/markdown/N4LMarkdownDownloader'
import { VERBOSE } from '@/CONSTANTS'

export default function Documentation ({}) {

  if (VERBOSE) console.debug('render Documentation')
  return <>
    <main className={'mb-3'} data-title={'Documentation'}>
      <Container>
        <Row className={'mt-3'}>
          <Col><h1><Trans i18nKey={'pages.documentation.title'} /></h1></Col>
        </Row>
        <Row className={'mt-3'}>
          <Col>

            <N4LDivider i18nKey={'hr.dataframe'} />
            <Accordion className={'mt-3'}>
              <Accordion.Item eventKey={'DataFrame'}>
                <Accordion.Header>
                  <h3>DataFrame</h3>
                </Accordion.Header>
                <Accordion.Body>
                  <N4LMarkdownDownloader file_name={'_0. DataFrame.md'} />
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey={'DataFrameUtils'}>
                <Accordion.Header>
                  <h3>DataFrame Utils</h3>
                </Accordion.Header>
                <Accordion.Body>
                  <N4LMarkdownDownloader file_name={'DataFrameUtils.md'} />
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>

          </Col>
        </Row>
      </Container>
    </main>
  </>
}