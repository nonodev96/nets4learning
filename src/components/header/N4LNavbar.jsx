import React from "react"
import { Container, Nav, Navbar } from "react-bootstrap"
import { useHistory } from "react-router-dom";

export default function N4LNavbar() {
  const history = useHistory();

  const handleClick_GoHomePage = () => {
    history.push("/");
  }

  const handleClick_GoManualPage = () => {
    history.push("/manual/");
  }

  const handleClick_GoGlossaryPage = () => {
    history.push("/glossary/");
  }

  return (
    <>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand onClick={handleClick_GoHomePage}>
            <img
              src={process.env.REACT_APP_PUBLIC_URL + "/without_background.png"}
              width="30"
              height="30"
              className="d-inline-block align-top"
              alt="N4L"
            />
            Nets4Learning
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav"/>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link onClick={handleClick_GoHomePage}>Inicio</Nav.Link>
              <Nav.Link onClick={handleClick_GoManualPage}>Manual</Nav.Link>
              <Nav.Link onClick={handleClick_GoGlossaryPage}>Glosario</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  )
}
