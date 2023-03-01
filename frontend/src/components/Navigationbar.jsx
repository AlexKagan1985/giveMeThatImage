import React from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Avatar from "react-avatar";
import classes from "./Navigationbar.module.css";
import { NavLink } from "react-router-dom";

function Navigationbar() {
  return (
    <>
      <Navbar className="fixed-top" bg="light">
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <NavLink to="/" >
            <Nav.Link className={classes.link} as="span">
              Home
            </Nav.Link>
          </NavLink>
          <NavLink to="/user-history" >
            <Nav.Link className={classes.link} as="span">
              History
            </Nav.Link>
          </NavLink>
          <Nav.Link className={classes.link} as="span">
            Favorites
          </Nav.Link>
          <NavLink to="/profile" >
            <Nav.Link className={classes.link} as="span">
              Profile
            </Nav.Link>
          </NavLink>
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
