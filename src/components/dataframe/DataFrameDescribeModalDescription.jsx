import { Modal } from 'react-bootstrap'
import { Trans } from 'react-i18next'

export default function DataFrameDescribeModalDescription ({ showDescription, setShowDescription }) {
console.log({ showDescription })
  return <>
    <Modal show={showDescription}
           onHide={() => setShowDescription(false)}
           size={'xl'}
           fullscreen={'md-down'}>
      <Modal.Header closeButton>
        <Modal.Title><Trans i18nKey={`dataframe.describe.title`} /></Modal.Title>
      </Modal.Header>
      <Modal.Body>
        hello
      </Modal.Body>
    </Modal>
  </>
}