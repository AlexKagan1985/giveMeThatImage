/* eslint-disable no-unused-vars, no-unreachable */
import React, { useEffect, useId } from "react";
import classes from "./Profile.module.scss";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useAtomValue } from "jotai";
import { loggedInUser } from "../atoms/auth";
import { useLocation, useNavigate } from "react-router-dom";
import { FloatingLabel } from "react-bootstrap";
import { Formik } from "formik";
import { object, string } from "yup";

function ChangePasswordForm({ submitCount, values, errors, touched, handleChange, handleBlur, handleSubmit, status, isSubmitting }) {
  const passId = useId();
  const newPassId = useId();
  const repeatPassId = useId();

  return (
    <Form className={classes.form} onSubmit={handleSubmit}>
      <FloatingLabel controlId={passId} label="current password:" className="mb-3">
        <Form.Control
          onBlur={handleBlur}
          type="password"
          name="currentPassword"
          value={values.currentPassword}
          onChange={handleChange}
          isValid={touched.currentPassword && !errors.currentPassword}
          isInvalid={touched.currentPassword && errors.currentPassword}
        />
        <Form.Control.Feedback type="invalid" >{errors.currentPassword}</Form.Control.Feedback>
      </FloatingLabel>

      <FloatingLabel controlId={newPassId} label="new password:" className="mb-3">
        <Form.Control
          onBlur={handleBlur}
          type="password"
          name="newPassword"
          value={values.newPassword}
          onChange={handleChange}
          isValid={touched.newPassword && !errors.newPassword}
          isInvalid={touched.newPassword && errors.newPassword}
        />
        <Form.Control.Feedback type="invalid" >{errors.newPassword}</Form.Control.Feedback>
      </FloatingLabel>

      <FloatingLabel controlId={passId} label="repeat new password:" className="mb-3">
        <Form.Control
          onBlur={handleBlur}
          type="password"
          name="repeatPassword"
          value={values.repeatPassword}
          onChange={handleChange}
          isValid={touched.repeatPassword && !errors.repeatPassword}
          isInvalid={touched.repeatPassword && errors.repeatPassword}
        />
        <Form.Control.Feedback type="invalid" >{errors.repeatPassword}</Form.Control.Feedback>
      </FloatingLabel>

      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  )
}

function InnerForm({ submitCount, values, errors, touched, handleChange, handleBlur, handleSubmit, status, isSubmitting }) {

  const emailid = useId();
  const loginid = useId();

  return (
    <Form className={classes.form} onSubmit={handleSubmit}>
      <FloatingLabel controlId={emailid} label="email" className="mb-3">
        <Form.Control
          onBlur={handleBlur}
          type="input"
          name="email"
          value={values.email}
          onChange={handleChange}
          isValid={touched.email && !errors.email}
          isInvalid={touched.email && errors.email}
          disabled={true}
        />
        <Form.Control.Feedback type="invalid" >{errors.email}</Form.Control.Feedback>
      </FloatingLabel>

      <FloatingLabel controlId={loginid} label="Login/username" className="mb-3">
        <Form.Control
          onBlur={handleBlur}
          type="input"
          name="login"
          value={values.login}
          onChange={handleChange}
          isValid={touched.login && !errors.login}
          isInvalid={touched.login && errors.login}
          disabled={true}
        />
        <Form.Control.Feedback type="invalid" >{errors.login}</Form.Control.Feedback>
      </FloatingLabel>

      <Form.Group className="position-relative mb-3">
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

      <FloatingLabel controlId={loginid} label="Please provider a short description" className="mb-3">
        <Form.Control
          as="textarea"
          onBlur={handleBlur}
          type="input"
          name="description"
          value={values.description}
          onChange={handleChange}
          isValid={touched.description && !errors.description}
          isInvalid={touched.description && errors.description}
        />
        <Form.Control.Feedback type="invalid" >{errors.description}</Form.Control.Feedback>
      </FloatingLabel>

      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  )
}

function Profile() {
  // only allow this when the user has authenticated
  const user = useAtomValue(loggedInUser);
  const navigate = useNavigate();
  const location = useLocation();

  const changePassSchema = object({
    currentPassword: string().min(6).required(),
    newPassword: string().min(6).required(),
    repeatPassword: string().min(6).required(),
  })

  useEffect(() => {
    if (!user) {
        navigate(`/login/${encodeURIComponent(location.pathname)}`);
    }
  }, [])

  console.log("user ", user);

  const handleSubmit = (formValues) => {
    console.log("submitting with values ... ", formValues);
  }

  const handleChangePassword = (formValues) => {
    console.log("changing password: ", formValues);
  }

  return (
    user && (
    <div className={classes.content}>
      <Formik
        component={InnerForm}
        onSubmit={handleSubmit}
        initialValues={user}
      />

      <p>If you want to change your password, you can do it here: </p>
      <Formik
        component={ChangePasswordForm}
        onSubmit={handleChangePassword}
        validationSchema={changePassSchema}
        initialValues={{
          currentPassword: "",
          newPassword: "",
          repeatPassword: "",
        }}
        validate={(values) => {
          if (values.newPassword !== values.repeatPassword) {
            return {
              repeatPassword: "values should match"
            }
          }
          return {};
        }}
      />
    </div>)
  );
}

export default Profile;
