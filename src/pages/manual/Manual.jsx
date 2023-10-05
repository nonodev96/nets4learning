import 'katex/dist/katex.min.css'
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Trans, useTranslation } from 'react-i18next'
import { Accordion, Col, Container, Row } from 'react-bootstrap'

import ManualDescription from '@pages/manual/ManualDescription'
import { VERBOSE } from '@/CONSTANTS'
import N4LMarkdown from '@components/markdown/N4LMarkdown'

export default function Manual () {

  const history = useHistory()
  const { t, i18n } = useTranslation()
  const [filesData, setFilesData] = useState({
    '01. Tool Objectives.md': 'DOWNLOAD',
    '02. Glossary.md'       : 'DOWNLOAD'
  })
  const [accordionActiveManual, setAccordionActiveManual] = useState([])

  useEffect(() => {

    const fetchFile = async (fileName) => {
      try {
        const response = await fetch(process.env.REACT_APP_PATH + `/docs/${i18n.language}/${fileName}`) // Reemplaza con la ruta correcta
        if (response.ok) {
          const fileContent = await response.text()
          setFilesData((prevData) => ({
            ...prevData,
            [fileName]: fileContent,
          }))
        } else {
          console.error(`No se pudo descargar ${fileName}`)
        }
      } catch (error) {
        console.error(`Error al descargar ${fileName}`, error)
      }
    }
    const fileNames = ['01. Tool Objectives.md', '02. Glossary.md']
    for (const fileName of fileNames) {
      fetchFile(fileName).then(() => {
        console.debug('end')
      })
    }
  }, [i18n.language])

  useEffect(() => {
    if (history.location.state?.action) {
      openManualInSection(history.location.state.action)
    }
  }, [history])

  const toggleAccordionActiveManual = (itemActive) => {
    const copy = JSON.parse(JSON.stringify(accordionActiveManual))
    let index = copy.indexOf(itemActive)
    if (index === -1) {
      copy.push(itemActive)
    } else {
      copy.splice(index, 1)
    }
    setAccordionActiveManual(copy)
  }

  const openManualInSection = (action) => {
    switch (action) {
      case 'open-layer-editor-tabular-classification': {
        toggleAccordionActiveManual('tabular-classification-layer-editor')
        break
      }
      case 'open-hyperparameters-editor-tabular-classification': {
        toggleAccordionActiveManual('tabular-classification-hyperparameters-editor')
        break
      }
      default: {
        console.log('Error, action not valid')
      }
    }
  }

  if (VERBOSE) console.debug('render Manual')
  return (
    <>
      <main className={'mb-3'} data-title={'Manual'}>
        <Container>
          <Row className={'mt-3'}>
            <Col>
              <h1><Trans i18nKey={'pages.manual.title'} t={t} /></h1>
            </Col>
          </Row>
          <Row className={'mt-3'}>
            <Col>
              <ManualDescription />

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
                    <p><Trans i18nKey={'pages.manual.1-linear-regression.1-description.0'} /></p>
                    {/*TODO*/}
                    {/*<p><Trans i18nKey={'pages.manual.1-linear-regression.1-description.1'} /></p>*/}
                    {/*<p><Trans i18nKey={'pages.manual.1-linear-regression.1-description.2'} /></p>*/}
                    <hr />
                    <h4><Trans i18nKey={'pages.manual.1-linear-regression.2-title'} /></h4>
                    <p><Trans i18nKey={'pages.manual.1-linear-regression.2-description.0'} /></p>
                    <p><Trans i18nKey={'pages.manual.1-linear-regression.2-description.1'} /></p>
                    <p><Trans i18nKey={'pages.manual.1-linear-regression.2-description.2'} /></p>
                    <p><Trans i18nKey={'pages.manual.1-linear-regression.2-description.3'} /></p>
                    <p><Trans i18nKey={'pages.manual.1-linear-regression.2-link'}
                              components={{
                                link1: <a href={'https://www.ugr.es/~jsalinas/apuntes/C5.pdf'}
                                          target={'_blank'}
                                          rel={'noreferrer'}
                                          className={'text-info'}>link</a>
                              }} /></p>
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

              <hr />

              <Accordion className={'mt-3'} defaultActiveKey={[]} activeKey={accordionActiveManual}>
                <Accordion.Item eventKey={'tabular-classification-layer-editor'}>
                  <Accordion.Header onClick={() => toggleAccordionActiveManual('tabular-classification-layer-editor')}>
                    <h3><Trans i18nKey={'pages.manual.layer-editor.title'} /></h3>
                  </Accordion.Header>
                  <Accordion.Body>
                    <N4LMarkdown>{filesData['01. Tool Objectives.md']}</N4LMarkdown>
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey={'tabular-classification-hyperparameters-editor'}>
                  <Accordion.Header onClick={() => toggleAccordionActiveManual('tabular-classification-hyperparameters-editor')}>
                    <h3><Trans i18nKey={'pages.manual.hyperparameters-editor.title'} /></h3>
                  </Accordion.Header>
                  <Accordion.Body>
                    <N4LMarkdown>{filesData['02. Glossary.md']}</N4LMarkdown>
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