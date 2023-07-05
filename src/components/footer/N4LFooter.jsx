import React from 'react'
import './N4LFooter.css'
import { Col, Container, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function N4LFooter () {
  const { t } = useTranslation()

  return (
    <>
      <footer className="footer mt-auto py-3 bg-light">
        <Container>
          <Row>
            <Col xs={12} sm={12} md={7}>
              <h3>{t('footer.about-us')}</h3>
              <ul style={{ padding: '0 1em' }}>
                <li>{t('footer.developers')}:{' '}
                  <a href="https://github.com/Davavico22" target="_blank" rel="noreferrer" className="link-secondary">David Valdivia Vico</a>,{' '}
                  <a href="https://github.com/nonodev96" target="_blank" rel="noreferrer" className="link-secondary">Antonio Mudarra Machuca</a>

                </li>
                <li>{t('footer.directors')}:{' '}
                  <a href="https://simidat.ujaen.es/members/arivera/" target="_blank" rel="noreferrer" className="link-secondary">Antonio Jesús Rivera Rivas</a>,{' '}
                  <a href="https://simidat.ujaen.es/members/lperez/" target="_blank" rel="noreferrer" className="link-secondary">María Dolores Pérez Godoy</a>,{' '}
                  <a href="https://simidat.ujaen.es/members/mjjesus/" target="_blank" rel="noreferrer" className="link-secondary">María José del Jesus Díaz</a>
                </li>
                <li><Link to={'/terms-and-conditions'} className="link-secondary">{t('footer.terms')}</Link></li>
                <li><Link to={'/version'} className="link-secondary">{t('footer.version')}</Link></li>
              </ul>
            </Col>
            <Col xs={12} sm={12} md={5}>
              <h4>Nets4Learning</h4>
              <p>{t('footer.description-app')}</p>
              <div className="d-flex justify-content-xs-around justify-content-sm-between justify-content-md-between flex-wrap">
                <div>
                  <a href="https://ujaen.es" target="_blank" rel="noreferrer">
                    <img src={process.env.REACT_APP_PATH + '/assets/uja.svg'}
                         alt="Universidad de Jaén"
                         width={100}
                    />
                  </a>
                </div>
                <div>
                  <a href="https://simidat.ujaen.es" target="_blank" rel="noreferrer">
                    <img src={process.env.REACT_APP_PATH + '/assets/simidat-fill.svg'}
                         alt="SIMIDAT"
                         width={100}
                    />
                  </a>
                </div>
                <div>
                  <a href="https://dasci.es" target="_blank" rel="noreferrer">
                    <img src={process.env.REACT_APP_PATH + '/assets/DaSCI_logo-1.png'}
                         alt="DaSCI"
                         width={200}
                    />
                  </a>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </footer>
    </>
  )
}