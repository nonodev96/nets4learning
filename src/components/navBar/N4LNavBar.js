import React from "react"
import { Container, Navbar } from "react-bootstrap"

export default function N4LNavBar() {
  const REACT_APP_PUBLIC_URL = process.env.REACT_APP_PUBLIC_URL
  return (
    <>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand href={REACT_APP_PUBLIC_URL}>Nets4learning</Navbar.Brand>
        </Container>
      </Navbar>
    </>
  )
}
