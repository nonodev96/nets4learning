import React from "react"
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap"
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
          <Navbar.Brand href="#home">Nets4learning</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav"/>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#home" onClick={handleClick_GoHomePage}>Inicio</Nav.Link>
              <Nav.Link href="#link" onClick={handleClick_GoManualPage}>Manual</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  )
}
