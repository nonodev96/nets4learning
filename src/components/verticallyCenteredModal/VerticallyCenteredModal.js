import React from "react";
import { Button, Modal } from "react-bootstrap";

export default class VerticallyCenteredModal extends React.Component {
  constructor(props) {
    super(props);
    const { template_render, onHide, ...others } = props
    this.state = {
      props: { ...others }
    }
  }

  componentDidMount() {
  }

  render() {
    console.log("render VerticallyCenteredModal")
    console.log({ ...this.state.props })
    return <>
      <Modal {...this.state.props}
             size="lg"
             aria-labelledby="contained-modal-title-vcenter"
             centered>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Modal heading
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/*{this.props.template_render()}*/}
          log2
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => this.props.onHide()}>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  }
}