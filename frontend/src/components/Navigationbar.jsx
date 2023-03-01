import React from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Avatar from "react-avatar";
import classes from "./Navigationbar.module.scss";
import { NavLink, useLocation } from "react-router-dom";
import { useAtomValue } from "jotai";
import { loggedInUser, logOut } from "../atoms/auth";

function Navigationbar() {
  const theUser = useAtomValue(loggedInUser);
  const currentLocation = useLocation();

  const handleLogout = (e) => {
    e.preventDefault();
    logOut();
  }

  return (
    <>
      <Navbar className="fixed-top" bg="light">
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <NavLink className="nav-link" to="/" >
            <Nav.Link className={classes.link} as="span">
              Home
            </Nav.Link>
          </NavLink>
          <NavLink className="nav-link" to="/user-history" >
            <Nav.Link className={classes.link} as="span">
              History
            </Nav.Link>
          </NavLink>
          <Nav.Link className={classes.link} as="span">
            Favorites
          </Nav.Link>
          {theUser && <NavLink className="nav-link" to="/profile" >
            <Nav.Link className={classes.link} as="span">
              Profile
            </Nav.Link>
          </NavLink>}
          {!theUser && <NavLink className="nav-link" to={`/login/${encodeURIComponent(currentLocation.pathname)}`} >
            <Nav.Link className={classes.link} as="span">
              Log in
            </Nav.Link>
          </NavLink>}
          {theUser && <Nav.Link className={classes.link} onClick={handleLogout}>
            Log out
          </Nav.Link>}
        </Navbar.Collapse>
        <div className={classes.user_info}>
          <div className={classes.user_name}>{theUser && theUser.login}</div>
          <div>{theUser && theUser.description}</div>
        </div>
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
