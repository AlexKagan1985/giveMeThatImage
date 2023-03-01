import React, { useEffect } from "react";
import classes from "./Profile.module.scss";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useAtomValue } from "jotai";
import { loggedInUser } from "../atoms/auth";
import { useLocation, useNavigate } from "react-router-dom";

function Profile() {
  // only allow this when the user has authenticated
  const user = useAtomValue(loggedInUser);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
      if (!user) {
      navigate(`/login/${encodeURIComponent(location.pathname)}`);
    }
  }, []);

  console.log("user ", user);

  return (
    <Form className={classes.form}>
      <Form.Group className="m-0" controlId="formBasicEmail">
        <Form.Label></Form.Label>
        <Form.Control type="email" placeholder="Enter email" />
        <Form.Text className="text-muted"></Form.Text>
      </Form.Group>

      <Form.Group className="m-0" controlId="formBasicPassword">
        <Form.Label></Form.Label>
        <Form.Control type="password" placeholder="Password" />
      </Form.Group>

      <Form.Group className="m-0" controlId="formBasicPassword">
        <Form.Label></Form.Label>
        <Form.Control
          type="confirm-password"
          placeholder="Confirm Password"
        />
      </Form.Group>

      <Form.Group className="m-0" controlId="formBasicPassword">
        <Form.Label></Form.Label>
        <Form.Control type="confirm-password" placeholder="Login/User Name" />
      </Form.Group>

      <Form.Group className="position-relative m-0">
        <Form.Label>Upload/change profile picture</Form.Label>
        <Form.Control
          type="file"
          required
          name="file"
        // onChange={handleChange}
        // isInvalid={!!errors.file}
        />
        <Form.Control.Feedback type="invalid" tooltip>
          {/* {errors.file} */}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Label htmlFor="text"></Form.Label>
      <Form.Control
        as="textarea"
        placeholder="Please provider a short description"
      />
      <Form.Text id="passwordHelpBlock" muted></Form.Text>
      <div className={classes.checkbox}>
        <Form.Group className="mb-3" controlId="formBasicCheckbox">
          <Form.Check type="checkbox" label="Check me out" />
          <Form.Check type="checkbox" label="Check me out" />
        </Form.Group>
      </div>
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
}

export default Profile;
