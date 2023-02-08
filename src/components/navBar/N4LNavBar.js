import React from "react"
import { Container, Navbar } from "react-bootstrap"
import { useHistory } from "react-router-dom";

export default function N4LNavBar() {
  const history = useHistory();

  function handleClick() {
    history.push("/");
  }

  return (
    <>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand onClick={handleClick}>Nets4learning</Navbar.Brand>
        </Container>
      </Navbar>
    </>
  )
}
