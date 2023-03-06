import React from "react"
import { Container, Nav, Navbar } from "react-bootstrap"
import { useHistory } from "react-router-dom";

export default function N4LNavBar() {
  const history = useHistory();

  const handleClick_GoHomePage = () => {
    history.push("/");
  }

  const handleClick_GoManualPage = () => {
    history.push("/manual/");
  }

  return (
    <>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand>Nets4learning</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link onClick={handleClick_GoHomePage}>Inicio</Nav.Link>
            <Nav.Link onClick={handleClick_GoManualPage}>Manual</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </>
  )
}
