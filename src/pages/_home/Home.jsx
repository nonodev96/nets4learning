import './Home.css'
import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { Trans } from 'react-i18next'
import InitialMenu from '../_initialMenu/InitialMenu'
import { CookiesModal } from '@components/cookiesModal/CookiesModal'

export default function Home () {

  return (
    <>
      <main className="mb-3" data-title={'Home'}>
        <Container>
          <Row>
            <Col>
              <h1 className="mt-3"><Trans i18nKey={'welcome'} /></h1>
              <h2 className="mt-3"><Trans i18nKey={'welcome-2'} /></h2>
            </Col>
          </Row>
        </Container>

        <CookiesModal />

        <InitialMenu />
      </main>
    </>
  )
}
