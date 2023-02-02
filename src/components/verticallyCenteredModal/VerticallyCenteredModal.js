import React from "react"
import { Button, Modal } from "react-bootstrap"

export default class VerticallyCenteredModal extends React.Component {
  constructor(props) {
    super(props)
    const { static_template_render } = props

    this.handleShow = this.handleShow.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleEntered = this.handleEntered.bind(this)
    this.handleExited = this.handleExited.bind(this)
    this.handleClick = this.handleClick.bind(this)

    this.state = {
      fullscreen: true,
      show: false,
      headerTitle: "",
      template_render: static_template_render,
    }

    console.log("", { props, this_pros: this.props })
  }

  componentDidMount() {
    // console.log("componentDidMount", this.state)
  }

  componentDidUpdate() {
    // console.log("componentDidUpdate", prevProps, this.state)
  }

  handleClose() {
    this.setState({ show: false })
  }

  handleShow() {
    this.setState({ show: true })
  }

  handleEntered() {
    console.log("handleEntered")
  }

  handleExited() {
    console.log("handleExited")
  }

  handleClick() {

  }

  render() {
    return <>
      <Modal show={this.state.show}
             fullscreen={this.state.fullscreen}
             onHide={this.handleClose}
             onEntered={this.handleEntered}
             onExited={this.handleExited}
             size="lg"
             aria-labelledby="contained-modal-title-vcenter"
             centered>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {this.state.headerTitle}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <button onClick={this.handleClick}>Click</button>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.handleClose}>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  }
}