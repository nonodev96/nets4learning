import React from "react"
import { Container, Navbar } from "react-bootstrap"

export default function N4LNavBar() {
  return (
    <>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand href={process.env.REACT_APP_DOMAIN}>Nets4learning</Navbar.Brand>
        </Container>
      </Navbar>
    </>
  )
}
