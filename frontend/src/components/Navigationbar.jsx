import React from "react";
// import Dropdown from "react-bootstrap/Dropdown";
// import DropdownButton from "react-bootstrap/DropdownButton";
// import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Profile from "./Profile";
// import styles from "./Navigationbar.module.css";
// import NavDropdown from "react-bootstrap/NavDropdown";

function Navigationbar() {
  return (
    <>
      <Navbar className="fixed-top" bg="light" expand={false}>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Navbar.Offcanvas>
            {/* <DropdownButton
              id="dropdown-button"
              title="Dropdown button menu"
              variant="secondary"
            > */}
            <Nav.Link href="#/action-1">History</Nav.Link>
            <Nav.Link href="#/action-2">Favorites</Nav.Link>
            <Nav.Link href="#/action-3">Profile</Nav.Link>
            <Nav.Link href="#/action-2">Statistics</Nav.Link>
            <Nav.Link href="#/action-3">Log out</Nav.Link>
            {/* </DropdownButton> */}
          </Navbar.Offcanvas>
        </Navbar.Collapse>
        <Profile />
      </Navbar>
      {/* <Avatar
        size="100"
        facebook-id="invalidfacebookusername"
        src="http://www.gravatar.com/avatar/a16a38cdfe8b2cbd38e8a56ab93238d3"
      />
      <DropdownButton id="dropdown-basic-button" title="Dropdown button menu">
        <Dropdown.Item href="#/action-1">History</Dropdown.Item>
        <Dropdown.Item href="#/action-2">Favorites</Dropdown.Item>
        <Dropdown.Item href="#/action-3">Profile</Dropdown.Item>
        <Dropdown.Item href="#/action-2">Statistics</Dropdown.Item>
        <Dropdown.Item href="#/action-3">Log out</Dropdown.Item>
      </DropdownButton> */}
    </>
  );
}

export default Navigationbar;
