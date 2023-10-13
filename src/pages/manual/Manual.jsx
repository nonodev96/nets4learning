import 'katex/dist/katex.min.css'
import React, { useCallback, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Trans, useTranslation } from 'react-i18next'
import { Accordion, Col, Container, Row } from 'react-bootstrap'

import N4LDivider from '@components/divider/N4LDivider'
import N4LMarkdown from '@components/markdown/N4LMarkdown'

import ManualDescription from '@pages/manual/ManualDescription'
import { VERBOSE } from '@/CONSTANTS'

const DEFAULT_LAYOUT = [
  {
    i18n_hr: 'hr.00-tabular-classification',
    files  : [
      {
        key : '00-tabular-classification-Hyperparameters-editor',
        file: {
          i18n_title  : 'pages.manual.hyperparameters-editor.title',
          file_name   : '00. Tabular Classification - Editor Hyperparameters.md',
          file_content: ''
        }
      },
      {
        key : '00-tabular-classification-layer-editor',
        file: {
          i18n_title  : 'pages.manual.layer-editor.title',
          file_name   : '00. Tabular Classification - Editor Layer.md',
          file_content: ''
        }
      },
    ]
  },
  // {
  //   i18n_hr: 'hr.01-linear-regression',
  //   files  : [
  //     {
  //       key : '01-linear-regression-Hyperparameters-editor',
  //       file: {
  //         i18n_title  : 'pages.manual.hyperparameters-editor.title',
  //         file_name   : '01. Linear Regression - Editor Hyperparameters.md',
  //         file_content: ''
  //       }
  //     },
  //     {
  //       key : '01-linear-regression-layer-editor',
  //       file: {
  //         i18n_title  : 'pages.manual.layer-editor.title',
  //         file_name   : '01. Linear Regression - Editor Layer.md',
  //         file_content: ''
  //       }
  //     },
  //   ]
  // },

]

export default function Manual () {

  const history = useHistory()
  const { t, i18n } = useTranslation()
  const [filesData, setFilesData] = useState(DEFAULT_LAYOUT)
  const [accordionActiveManual, setAccordionActiveManual] = useState([])

  useEffect(() => {
    console.log('useEffect[i18n.language]')

    const fetchFile = async (indexTask, indexFile, file_name) => {
      try {
        const response = await fetch(process.env.REACT_APP_PATH + `/docs/${i18n.language}/${file_name}`) // Reemplaza con la ruta correcta
        if (response.ok) {
          const file_content = await response.text()
          setFilesData((prevState) => {
            const newArray = [...prevState]
            newArray[indexTask].files[indexFile].file.file_content = file_content
            return newArray
          })
        } else {
          console.error(`No se pudo descargar ${file_name}`)
        }
      } catch (error) {
        console.error(`Error al descargar ${file_name}`, error)
      }
    }
    for (const [indexTask, { files }] of DEFAULT_LAYOUT.entries()) {
      for (const [indexFile, { file }] of files.entries()) {
        fetchFile(indexTask, indexFile, file.file_name).then(() => {})
      }
    }
  }, [i18n.language])

  const toggleAccordionActiveManual = useCallback((itemActive) => {
    console.log('useCallback -> toggleAccordionActiveManual')
    setAccordionActiveManual((prevActive) => {
      if (prevActive.includes(itemActive)) {
        return prevActive.filter((item) => item !== itemActive)
      } else {
        return [...prevActive, itemActive]
      }
    })
  }, [setAccordionActiveManual])

  useEffect(() => {
    console.log('useEffect[history, toggleAccordionActiveManual]')
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
    if (history.location.state?.action) {
      openManualInSection(history.location.state.action)
    }
  }, [history, toggleAccordionActiveManual])

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
              <N4LDivider i18nKey={'hr.tasks'} />
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
                {process.env.REACT_APP_SHOW_NEW_FEATURE === 'true' &&
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
                }
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

              {(filesData).map(({ i18n_hr, files }, index) => {
                return <Row key={index}>
                  <Col>
                    <N4LDivider i18nKey={i18n_hr} />
                    <Accordion className={'mt-3'} defaultActiveKey={[]} activeKey={accordionActiveManual}>
                      {files.map(({ key, file }, index_2) => {
                        return <Accordion.Item eventKey={key}>
                          <Accordion.Header onClick={() => toggleAccordionActiveManual(key)}>
                            <h3><Trans i18nKey={file.i18n_title} /></h3>
                          </Accordion.Header>
                          <Accordion.Body>
                            <N4LMarkdown>{file.file_content}</N4LMarkdown>
                          </Accordion.Body>
                        </Accordion.Item>
                      })}
                    </Accordion>
                  </Col>
                </Row>
              })}

            </Col>
          </Row>
        </Container>
      </main>
    </>
  )
}