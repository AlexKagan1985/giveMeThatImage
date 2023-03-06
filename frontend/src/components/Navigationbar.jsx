import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Avatar from "react-avatar";
import classes from "./Navigationbar.module.scss";
import { NavLink, useLocation } from "react-router-dom";
import { useAtomValue } from "jotai";
import { loggedInUser, logOut } from "../atoms/auth";
import { Button } from "react-bootstrap";

function Navigationbar() {
  const theUser = useAtomValue(loggedInUser);
  const currentLocation = useLocation();

  const handleLogout = (e) => {
    e.preventDefault();
    logOut();
  };

  return (
    <>
      <Navbar className="fixed-top" bg="light">
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <NavLink
            className={({ isActive }) =>
              isActive ? classes.activeNavlink : classes.nonActiveNavlink
            }
            to="/"
          >
            Home
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive ? classes.activeNavlink : classes.nonActiveNavlink
            }
            to="/user-history"
          >
            History
          </NavLink>

          {theUser && (
            <NavLink
              className={({ isActive }) =>
                isActive ? classes.activeNavlink : classes.nonActiveNavlink
              }
              to="/profile"
            >
              Profile
            </NavLink>
          )}
          {!theUser && (
            <NavLink
              className={({ isActive }) =>
                isActive ? classes.activeNavlink : classes.nonActiveNavlink
              }
              to={`/login/${encodeURIComponent(currentLocation.pathname)}`}
            >
              Log in
            </NavLink>
          )}
          {theUser && (
            <Button variant="light" onClick={handleLogout}>
              Log out
            </Button>
          )}
        </Navbar.Collapse>
        <div className={classes.user_info}>
          <div className={classes.user_name}>{theUser && theUser.login}</div>
          <div>{theUser && theUser.description}</div>
        </div>
        {theUser && (
          <Avatar
            size="50"
            round={true}
            name={theUser.login}
            padding="2rem"
            className={classes.avatar}
          />
        )}
      </Navbar>
    </>
  );
}

export default Navigationbar;
