import { useState } from 'react'
import N4LModal from '@components/modal/N4LModal'
import { Container, Row, Col, Button, ButtonGroup, Tabs, Tab } from 'react-bootstrap'
import { Trans } from 'react-i18next'
import { ASL_bibtex, SSL_bibtex } from './MODEL_6_HAND_SIGN_INFO'

export function HandSignInfo() {
  const [showModal, setShowModal] = useState(false)
  const title = <>
    <h3><Trans i18nKey={'Info Hand sign'} /></h3>
  </>

  const body = <>
    <Tabs
      defaultActiveKey="asl"
      id="tab-SL"
      className="mb-3"
    >
      <Tab eventKey="asl" title={<Trans i18nKey={'ASL'} />}>
      <Container fluid={true}>
          <Row>
            <Col xs={12} md={8}>
            <div className="d-flex justify-content-center">
              <img className="w-100 object-fit-cover border rounded" src={process.env.REACT_APP_PATH + '/assets/handsign/ASL.png'} alt="ASL" />
            </div>
            </Col>
            <Col xs={12} md={4}>
              <pre>{ASL_bibtex}</pre>
            </Col>
          </Row>
        </Container>
      </Tab>
      <Tab eventKey="ssl" title={<Trans i18nKey={'SSL'} />}>
        <Container fluid={true}>
          <Row>
            <Col xs={12} md={8}>
            <div className="d-flex justify-content-center">
              <img className="w-100 object-fit-cover border rounded" src={process.env.REACT_APP_PATH + '/assets/handsign/SSL.png'} alt="SSL" />
            </div>
            </Col>
            <Col xs={12} md={4}>
              <pre>{SSL_bibtex}</pre>
            </Col>
          </Row>
        </Container>
      </Tab>
    </Tabs>

  </>
  return <>
    <ButtonGroup className="d-flex">
      <Button
        onClick={() => { setShowModal(!showModal) }}
        size={'sm'}
        variant={'outline-primary'}
        className="btn-block mr-1 mt-1 btn-lg"
      >
        <Trans i18nKey={'Info'} />
      </Button>
    </ButtonGroup>
    <N4LModal
      showModal={showModal}
      setShowModal={setShowModal}
      size='xl'
      fullscreen={'md-down'}
      centered={true}
      title={title}
      ComponentBody={body} />
  </>
}

// import React from 'react'
// 
// export default class HandSignInfo extends React.Component {
//   render() {
//     return <h2>I am a {this.props.color} Car!</h2>
//   }
// }