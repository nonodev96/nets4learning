import { VERBOSE } from '@/CONSTANTS'
import { Accordion, Card, Col, Container, Row, ProgressBar } from 'react-bootstrap'
import { Trans, useTranslation } from 'react-i18next'
import React, { useEffect, useState } from 'react'
import N4LMarkdown from '@components/markdown/N4LMarkdown'
import N4LDivider from '@components/divider/N4LDivider'

const DEFAULT_LIST_FILES_WIKI = {
  'tabular-classification-add-dataset': '00. Tabular Classification - Add ModelDataset.md',
  'linear-regression-add-dataset'     : '01. Linear Regression - Add ModelDataset.md',
  'types'                             : 'types.md',
}

function DownloadMarkdown ({ file_name, download = true }) {

  const { t } = useTranslation()
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const fetchFile = async (file_name) => {
      try {
        const response = await fetch(process.env.REACT_APP_PATH + `/docs/wiki/${file_name}`)
        if (!response.ok) {
          console.error("Error, download failed")
        }
        if (response.ok) {
          const reader = response.body.getReader()
          const totalSize = Number(response.headers.get('content-length'))
          let totalSizeDownload = 0
          let percentage = 1
          let content = ''

          async function read () {
            const { value, done } = await reader.read()
            if (value) {
              totalSizeDownload += value.length
              percentage = Math.floor((totalSizeDownload / totalSize) * 100)
              setProgress(percentage)
              await new Promise((resolve) => setTimeout(resolve, 1000))
              content += new TextDecoder('utf-8').decode(value)
            }
            if (!done) {
              return read()
            }
          }

          await read()
          console.log(content)

          setLoading(false)
          return content
        }
      } catch (error) {
        console.error(`Error in download ${file_name}`, error)
      }
    }
    if (download) {
      fetchFile(file_name)
        .then((file_content) => {
          setData({
            file_name   : file_name,
            file_content: file_content
          })
        })
        .catch((error) => {
          console.error()
        })
    }
  }, [file_name, download])

  return <>
    {loading && <>
      <ProgressBar label={progress < 100 ? t('downloading') : t('downloaded')}
                   striped={true}
                   animated={true}
                   now={progress} />
    </>}
    {!loading && <>
      <N4LMarkdown>{data.file_content}</N4LMarkdown>
    </>}
  </>
}

export default function Contribute (props) {

  const [directoryStructure, setDirectoryStructure] = useState({})
  const [download, setDownload] = useState(false)

  if (VERBOSE) console.debug('render Contribute')
  return <>
    <main className={'mb-3'} data-title={'Contribute'}>
      <Container>
        <Row className={'mt-3'}>
          <Col><h1><Trans i18nKey={'pages.contribute.title'} /></h1></Col>
        </Row>
        <Row className={'mt-3'}>
          <Col>
            <N4LDivider i18nKey={'hr.project'} />
            <Accordion className={'mt-3'}>
              <Accordion.Item eventKey={'directory-structure'}>
                <Accordion.Header>
                  <h3>Directory structure</h3>
                </Accordion.Header>
                <Accordion.Body>
                  <DownloadMarkdown file_name={'directory-structure.md'} />
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>

            <N4LDivider i18nKey={'hr.add-model-dataset'} />
            <Accordion className={'mt-3'}>
              <Accordion.Item eventKey={'Add ModelDataset'}>
                <Accordion.Item eventKey={'Example'}>
                  <Accordion.Header>
                    <h3>Example pre process</h3>
                  </Accordion.Header>
                  <Accordion.Body>
                    <DownloadMarkdown file_name={'00. Tabular Classification - Example preprocess.md'} />
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Header>
                  <h3>Add Model Dataset</h3>
                </Accordion.Header>
                <Accordion.Body>
                  <DownloadMarkdown file_name={'00. Tabular Classification - Add ModelDataset.md'} />
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>

            <N4LDivider i18nKey={'hr.dataframe-utils'} />
            <Accordion className={'mt-3'}>
              <Accordion.Item eventKey={'types'}>
                <Accordion.Header>
                  <h3>DataFrame Utils</h3>
                </Accordion.Header>
                <Accordion.Body>
                  <DownloadMarkdown file_name={'DataFrameUtils.md'} />
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>

          </Col>
        </Row>
      </Container>
    </main>
  </>
}