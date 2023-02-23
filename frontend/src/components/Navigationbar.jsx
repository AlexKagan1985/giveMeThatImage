import React from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
// import Profile from "./Profile";
import Avatar from "react-avatar";

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
        <Avatar
          size="50"
          facebook-id="invalidfacebookusername"
          src="http://www.gravatar.com/avatar/a16a38cdfe8b2cbd38e8a56ab93238d3"
        />
      </Navbar>
    </>
  );
}

export default Navigationbar;
