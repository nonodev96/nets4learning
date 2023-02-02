import React from "react"
import { Container, Navbar } from "react-bootstrap"

export default function N4LNavBar() {
  return (
    <>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand href={process.env.PUBLIC_URL + "/"}>Nets4learning</Navbar.Brand>
        </Container>
      </Navbar>
    </>
  )
}
