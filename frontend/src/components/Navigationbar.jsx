import React from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Profile from "./Profile";

function Navigationbar() {
  return (
    <>
      <Navbar className="fixed-top" bg="light" expand={false}>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Navbar.Offcanvas>
            <Nav.Link href="#/action-1">History</Nav.Link>
            <Nav.Link href="#/action-2">Favorites</Nav.Link>
            <Nav.Link href="#/action-3">Profile</Nav.Link>
            <Nav.Link href="#/action-2">Statistics</Nav.Link>
            <Nav.Link href="#/action-3">Log out</Nav.Link>
          </Navbar.Offcanvas>
        </Navbar.Collapse>
        <Profile />
      </Navbar>
    </>
  );
}

export default Navigationbar;
