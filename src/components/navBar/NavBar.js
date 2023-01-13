import React from "react"
import { Navbar } from "react-bootstrap"

export default function NavBar() {
  return (
    <>
      <div className="custom-navbar">
        <Navbar bg="white">
          <div className="container-xxl">
            <Navbar.Brand href={process.env.REACT_APP_DOMAIN}>Nets4learning</Navbar.Brand>
          </div>
        </Navbar>
      </div>
    </>
  )
}
