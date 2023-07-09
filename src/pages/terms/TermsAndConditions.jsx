import React from 'react'
import { Card, Col, Container, Row } from 'react-bootstrap'
import { Trans } from 'react-i18next'

export default function TermsAndConditions () {

  console.debug('render TermsAndConditions')
  return <>
    <main className={'mb-3'} data-title={'TermsAndConditions'}>
      <Container>
        <Row>
          <Col><h1><Trans i18nKey={'pages.terms.title'} /></h1></Col>
        </Row>
        <Row>
          <Col className={'mt-3'}>

            <Card>
              <Card.Header><h3><Trans i18nKey={'pages.terms.privacy-title'} /></h3></Card.Header>
              <Card.Body>
                <Card.Text>
                  <Trans i18nKey={'pages.terms.privacy-text'} />
                </Card.Text>
              </Card.Body>
            </Card>

            <Card className={'mt-3'}>
              <Card.Header><h3><Trans i18nKey={'pages.terms.cookies-title'} /></h3></Card.Header>
              <Card.Body>
                <Card.Text>
                  <Trans i18nKey={'pages.terms.cookies-text'} />
                </Card.Text>
              </Card.Body>
            </Card>

          </Col>
        </Row>
      </Container>
    </main>
  </>

}