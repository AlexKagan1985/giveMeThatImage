import React from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Avatar from "react-avatar";
import classes from "./Navigationbar.module.css";

function Navigationbar() {
  return (
    <>
      <Navbar className="fixed-top" bg="light">
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
            <Nav.Link href="#/action-1" className={classes.link}>
              History
            </Nav.Link>
            <Nav.Link href="#/action-2" className={classes.link}>
              Favorites
            </Nav.Link>
            <Nav.Link href="#/action-3" className={classes.link}>
              Profile
            </Nav.Link>
            <Nav.Link href="#/action-4" className={classes.link}>
              Statistics
            </Nav.Link>
            <Nav.Link href="#/action-5" className={classes.link}>
              Log out
            </Nav.Link>
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
