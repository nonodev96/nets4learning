// import './N4LNavbar.css'
import React, { useEffect, useState } from 'react'
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import { Trans, useTranslation } from 'react-i18next'
import { ReactComponent as IconLangES } from '../../assets/es.svg'
import { ReactComponent as IconLangGB } from '../../assets/gb.svg'
import { ReactComponent as IconThemeLight } from '../../assets/sun.svg'
import { ReactComponent as IconThemeDark } from '../../assets/moon.svg'

export default function N4LNavbar () {
  const history = useHistory()

  const { t, i18n } = useTranslation()
  const [dataTheme, setDataTheme] = useState('light')

  useEffect(() => {
    const htmlElement = document.querySelector('html')
    htmlElement.setAttribute('data-bs-theme', dataTheme)
    htmlElement.setAttribute('data-theme', dataTheme)
  }, [dataTheme])

  const handleClick_GoHomePage = () => {
    history.push('/')
  }

  const handleClick_GoTo__PAGE__ = (page) => {
    history.push(page)
  }

  return (
    <>
      <Navbar className={'bg-body-tertiary'}>
        <Container>
          <Navbar.Brand onClick={() => handleClick_GoHomePage()}>
            <img src={process.env.REACT_APP_PATH + '/without_background.png'}
                 width="30"
                 height="30"
                 className="d-inline-block align-top"
                 alt="N4L" />
            Nets4Learning
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link onClick={() => handleClick_GoHomePage()}>
                <Trans i18nKey={'header.home'} />
              </Nav.Link>
              <Nav.Link onClick={() => handleClick_GoTo__PAGE__('/manual/')}>
                <Trans i18nKey={'header.manual'} />
              </Nav.Link>
              <Nav.Link onClick={() => handleClick_GoTo__PAGE__('/glossary/')}>
                <Trans i18nKey={'header.glossary'} />
              </Nav.Link>
              {process.env.REACT_APP_SHOW_NEW_FEATURE === 'true' &&
                <Nav.Link onClick={() => handleClick_GoTo__PAGE__('/dataframe/')}>
                  <Trans i18nKey={'header.dataframe'} />
                </Nav.Link>
              }
              <Nav.Link onClick={() => handleClick_GoTo__PAGE__('/datasets/')}>
                <Trans i18nKey={'header.datasets'} />
              </Nav.Link>
              <Nav.Link onClick={() => handleClick_GoTo__PAGE__('/contribute/')}>
                <Trans i18nKey={'header.contribute'} />
              </Nav.Link>
            </Nav>
            <NavDropdown title={t('header.language')} id="change-language-nav-dropdown">
              <NavDropdown.Item onClick={() => i18n.changeLanguage('en')}>
                <IconLangGB width={'1rem'} className={'me-2'} style={{ verticalAlign: 'unset' }} />
                Ingles
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => i18n.changeLanguage('es')}>
                <IconLangES width={'1rem'} className={'me-2'} style={{ verticalAlign: 'unset' }} />
                Español
              </NavDropdown.Item>
            </NavDropdown>
            {process.env.REACT_APP_SHOW_NEW_FEATURE === 'true' &&
              <NavDropdown title={t('header.theme')} id="change-theme-nav-dropdown" className={'ms-3'}>
                <NavDropdown.Item onClick={() => setDataTheme('light')}>
                  <IconThemeLight width={'1rem'} className={'me-2'} />
                  Light
                </NavDropdown.Item>
                <NavDropdown.Item onClick={() => setDataTheme('dark')}>
                  <IconThemeDark width={'1rem'} className={'me-2'} />
                  Dark
                </NavDropdown.Item>
              </NavDropdown>
            }
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  )
}
