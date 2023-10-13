import { VERBOSE } from '@/CONSTANTS'
import { Accordion, Card, Col, Container, Row } from 'react-bootstrap'
import { Trans } from 'react-i18next'
import { useEffect, useState } from 'react'
import N4LMarkdown from '@components/markdown/N4LMarkdown'
import N4LDivider from '@components/divider/N4LDivider'

const DEFAULT_LIST_FILES_WIKI = {
  'tabular-classification-add-dataset': '00. Tabular Classification - Add ModelDataset.md',
  'linear-regression-add-dataset'     : '01. Linear Regression - Add ModelDataset.md',
}
export default function Contribute (props) {

  const [directoryStructure, setDirectoryStructure] = useState({})
  const [filesDataWiki, setFilesDataWiki] = useState({})

  useEffect(() => {
    const fetchWikiFile = async (file_key, file_name) => {
      try {
        const response = await fetch(process.env.REACT_APP_PATH + `/docs/wiki/${file_name}`)
        if (response.ok) {
          return await response.text()
        } else {
          console.error(`Can't download ${file_name}`)
        }
      } catch (error) {
        console.error(`Error in download ${file_name}`, error)
      }
    }

    const directory_structure_key = 'directory-structure'
    const directory_structure_name = 'directory-structure.md'
    fetchWikiFile(directory_structure_key, directory_structure_name).then((file_content) => {
      setDirectoryStructure((prevData) => {
        return {
          ...prevData,
          [directory_structure_key]: {
            file_name   : directory_structure_name,
            file_content: file_content
          }
        }
      })
    })

    for (const [file_key, file_name] of Object.entries(DEFAULT_LIST_FILES_WIKI)) {
      fetchWikiFile(file_key, file_name).then((file_content) => {
        console.log(file_content)
        setFilesDataWiki((prevData) => ({
          ...prevData,
          [file_key]: {
            file_name   : file_name,
            file_content: file_content
          },
        }))
      })
    }

  }, [])

  if (VERBOSE) console.debug('render Contribute')
  return <>
    <main className={'mb-3'} data-title={'Contribute'}>
      <Container>
        <Row className={'mt-3'}>
          <Col><h1><Trans i18nKey={'pages.contribute.title'} /></h1></Col>
        </Row>
        <Row className={'mt-3'}>
          <Col>
            <Card>
              <Card.Header>
                <h3>Directory structure</h3>
              </Card.Header>
              <Card.Body>
                <N4LMarkdown>{directoryStructure['directory-structure']?.file_content}</N4LMarkdown>
              </Card.Body>
            </Card>

            <N4LDivider i18nKey={'hr.add-model-dataset'} />
            <Accordion className={'mt-3'}>
              {Object.entries(filesDataWiki).map(([file_key, { file_name, file_content }], index) => {
                return <Accordion.Item eventKey={file_key} key={index}>
                  <Accordion.Header>
                    <h3>{file_name}</h3>
                  </Accordion.Header>
                  <Accordion.Body>
                    <N4LMarkdown key={index}>{filesDataWiki[file_key].file_content}</N4LMarkdown>
                  </Accordion.Body>
                </Accordion.Item>
              })}
            </Accordion>

          </Col>
        </Row>
      </Container>
    </main>
  </>
}