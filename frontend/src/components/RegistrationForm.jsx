/* eslint-disable no-unused-vars, no-unreachable */
import axios from "axios";
import { useId, useState } from "react"
import { Alert, Button, FloatingLabel, Form } from "react-bootstrap"
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import { object, string } from "yup";

const InnerForm = ({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => {
  const emailFieldId = useId();
  const loginFieldId = useId();
  const passwordFieldId = useId();
  const passwordRepeatFieldId = useId();

  console.log("errors", errors);
  console.log("touched,", touched);

  return (

    <Form onSubmit={handleSubmit} noValidate validated={false}>
      <FloatingLabel controlId={loginFieldId} label="login" className="mb-3">
        <Form.Control
          onBlur={handleBlur}
          type="input"
          placeholder="Name"
          name="login"
          value={values.login}
          onChange={handleChange}
          className={touched.login ? (errors.login ? "is-invalid" : "is-valid") : ""}
        />
        <Form.Control.Feedback type="invalid"> Please enter a login name </Form.Control.Feedback>
      </FloatingLabel>
      <FloatingLabel controlId={emailFieldId} label="email:" className="mb-3">
        <Form.Control
          onBlur={handleBlur}
          type="input"
          placeholder="name@example.com"
          name="email"
          value={values.email}
          onChange={handleChange}
          className={touched.email ? (errors.email ? "is-invalid" : "is-valid") : ""}
        />
        <Form.Control.Feedback type="invalid"> Please enter a valid email </Form.Control.Feedback>
      </FloatingLabel>
      <FloatingLabel controlId={passwordFieldId} label="password: " className="mb-3">
        <Form.Control
          onBlur={handleBlur}
          type="password"
          value={values.password}
          name="password"
          onChange={handleChange}
          className={touched.password ? (errors.password ? "is-invalid" : "is-valid") : ""}
        />
        <Form.Control.Feedback type="invalid"> Invalid </Form.Control.Feedback>
      </FloatingLabel>
      <FloatingLabel controlId={passwordRepeatFieldId} label="repeat password: " className="mb-3">
        <Form.Control
          onBlur={handleBlur}
          type="password"
          value={values.repeatPassword}
          name="repeatPassword"
          onChange={handleChange}
          className={touched.repeatPassword ? (errors.repeatPassword ? "is-invalid" : "is-valid") : ""}
        />
        <Form.Control.Feedback type="invalid"> Passwords should match </Form.Control.Feedback>
      </FloatingLabel>
      <Form.Group className="d-grid">
        <Button size="lg" type="submit">Register...</Button>
      </Form.Group>
    </Form>
  )
}

const RegistrationForm = ({ redirect }) => {
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const schema = object().shape({
    login: string().required(),
    password: string().required(),
    email: string().email().required(),
    repeatPassword: string().required(),
  })

  const handleSubmit = async ({ login, email, password, repeatPassword }) => {
    console.log("handle submit, ", login, password, email, repeatPassword);

    //TODO: actually do the registration here
    try {
      await axios.post("http://localhost:3001/user", {
        email,
        login,
        password
      });
      navigate(redirect);
    } catch (err) {
      console.log(err);
      setErrorMessage(err.response.data);
    }
  }

  return (
    <Formik initialValues={{
      email: "", login: "", password: "", repeatPassword: "",
    }}
      onSubmit={handleSubmit}
      validationSchema={schema}
      validate={(values) => {
        if (values.repeatPassword === values.password) {
          return {};
        } else {
          return { repeatPassword: "passwords should match" }
        }
      }}
    >
      {InnerForm}
    </Formik>
  )
}

export default RegistrationForm
