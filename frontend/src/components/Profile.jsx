import React from "react";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

function Profile() {
  return (
    <div>
      <Form>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" />
          <Form.Text className="text-muted">text</Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="confirm-password"
            placeholder="Confirm Password"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Login/User Name</Form.Label>
          <Form.Control type="confirm-password" placeholder="Login/User Name" />
        </Form.Group>

        <Form.Group className="position-relative mb-3">
          <Form.Label>File</Form.Label>
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

        <Form.Label htmlFor="text">Short description</Form.Label>
        <Form.Control type="text" id="text" placeholder="Please Enter text" />
        <Form.Text id="passwordHelpBlock" muted>
          please provide a short description about yourself
        </Form.Text>

        <Form.Group className="mb-3" controlId="formBasicCheckbox">
          <Form.Check type="checkbox" label="Check me out" />
          <Form.Check type="checkbox" label="Check me out" />
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
}

export default Profile;
