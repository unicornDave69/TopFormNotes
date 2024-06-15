import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import BootstrapNavbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

function Navbar() {
  return (
    <BootstrapNavbar expand="lg" className="bg-body-tertiary">
      <Container className="d-flex justify-content-center">
        <BootstrapNavbar.Brand href="/">
          T🍏pFormNotes App
        </BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <NavDropdown title="Další" id="basic-nav-dropdown">
              <NavDropdown.Item href="/records">
                Tvé záznamy 🗂️
              </NavDropdown.Item>
              <NavDropdown.Item href="/healthActivities">
                Pohybové aktivity ⚽
              </NavDropdown.Item>
              <NavDropdown.Item href="/healthReceipts">
                Zdravé recepty 🥙
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
}

export default Navbar;
