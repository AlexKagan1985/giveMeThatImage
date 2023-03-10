/* eslint-disable no-unused-vars, no-unreachable */
import axios from "../axios";
import { useId } from "react"
import { Alert, Button, FloatingLabel, Form } from "react-bootstrap"
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import { object, string } from "yup";
import classes from "./RegistrationForm.module.scss";

const InnerForm = (params) => {
  console.log("params", params);
  const { submitCount, values, errors, touched, handleChange, handleBlur, handleSubmit, status, isSubmitting } = params;
  const emailFieldId = useId();
  const loginFieldId = useId();
  const passwordFieldId = useId();
  const passwordRepeatFieldId = useId();

  console.log("errors", errors);
  console.log("touched,", touched);
  console.log("submitting", isSubmitting);

  return (

    <Form onSubmit={handleSubmit} noValidate validated={false} className={classes.registration_form}>
      <FloatingLabel controlId={loginFieldId} label="login" className="mb-3">
        <Form.Control
          onBlur={handleBlur}
          type="input"
          name="login"
          value={values.login}
          onChange={handleChange}
          isValid={touched.login && !errors.login}
          isInvalid={touched.login && errors.login}
        />
        <Form.Control.Feedback type="invalid"> {errors?.login} </Form.Control.Feedback>
      </FloatingLabel>
      <FloatingLabel controlId={emailFieldId} label="email:" className="mb-3">
        <Form.Control
          onBlur={handleBlur}
          type="input"
          name="email"
          value={values.email}
          onChange={handleChange}
          isValid={touched.email && !errors.email}
          isInvalid={touched.email && errors.email}
        />
        <Form.Control.Feedback type="invalid"> {errors?.email} </Form.Control.Feedback>
      </FloatingLabel>
      <FloatingLabel controlId={passwordFieldId} label="password: " className="mb-3">
        <Form.Control
          onBlur={handleBlur}
          type="password"
          value={values.password}
          name="password"
          onChange={handleChange}
          isValid={touched.password && !errors.password}
          isInvalid={touched.password && errors.password}
        />
        <Form.Control.Feedback type="invalid"> {errors?.password} </Form.Control.Feedback>
      </FloatingLabel>
      <FloatingLabel controlId={passwordRepeatFieldId} label="repeat password: " className="mb-3">
        <Form.Control
          onBlur={handleBlur}
          type="password"
          value={values.repeatPassword}
          name="repeatPassword"
          onChange={handleChange}
          isValid={touched.repeatPassword && !errors.repeatPassword}
          isInvalid={touched.repeatPassword && errors.repeatPassword}
        />
        <Form.Control.Feedback type="invalid"> {errors?.repeatPassword} </Form.Control.Feedback>
      </FloatingLabel>
      {status.submitError && <Alert variant="danger">{status.submitError}</Alert>}
      {submitCount > 1 && Object.values(errors).map(val => (<Alert variant="danger" key={val}>{val}</Alert>))}
      <Form.Group className="d-grid">
        <Button size="lg" type="submit" disabled={isSubmitting}>Register...</Button>
      </Form.Group>
    </Form>
  )
}

const RegistrationForm = ({ redirect }) => {
  const navigate = useNavigate();

  const schema = object().shape({
    login: string().required(),
    password: string().required(),
    email: string().email().required(),
    repeatPassword: string().required(),
  })

  const handleSubmit = async (formValues, { setStatus }) => {
    const { login, email, password, repeatPassword } = formValues;
    console.log("handle submit, ", login, password, email, repeatPassword);

    //TODO: actually do the registration here
    try {
      await axios.post("/user", {
        email,
        login,
        password
      });
      navigate(redirect);
    } catch (err) {
      console.log(err);
      //setErrorMessage(err.response.data);
      setStatus({
        submitError: err.response.data
      });
    }
  }

  return (
    <Formik 
      initialValues={{
        email: "", login: "", password: "", repeatPassword: "",
      }}
      
      onSubmit={handleSubmit}
      initialStatus={{test: "hello"}}
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
