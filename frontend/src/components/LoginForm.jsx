/* eslint-disable no-unused-vars, no-unreachable */
import axios from "axios";
import { useId } from "react"
import { Alert, Button, FloatingLabel, Form } from "react-bootstrap"
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import { object, string } from "yup";
import { useAtom } from "jotai";
import { loggedInUser } from "../atoms/auth";

const InnerForm = (params) => {
  console.log("params", params);
  const { submitCount, values, errors, touched, handleChange, handleBlur, handleSubmit, status, isSubmitting } = params;
  const loginFieldId = useId();
  const passwordFieldId = useId();

  console.log("errors", errors);
  console.log("touched,", touched);
  console.log("submitting", isSubmitting);

  return (

    <Form onSubmit={handleSubmit} noValidate validated={false}>
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
      {status?.submitError && <Alert variant="danger">{status.submitError}</Alert>}
      {submitCount > 1 && Object.values(errors).map(val => (<Alert variant="danger" key={val}>{val}</Alert>))}
      <Form.Group className="d-grid">
        <Button size="lg" type="submit" disabled={isSubmitting}>Login...</Button>
      </Form.Group>
    </Form>
  )
}

const LoginForm = ({ redirect }) => {
  const navigate = useNavigate();
  const [_user, setUser] = useAtom(loggedInUser);

  const schema = object().shape({
    login: string().required(),
    password: string().required(),
  })

  const handleSubmit = async (formValues, { setStatus }) => {
    const { login, password } = formValues;
    console.log("handle submit, ", login, password);

    //TODO: actually do the registration here
    try {
      const result = await axios.post("http://localhost:3001/user/login", {
        login,
        password
      });
      console.log("retrieved data from the auth server: ", result.data);
      setUser(result.data);
      setStatus({});
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
        login: "", password: "",
      }}
      initialStatus={{}}
      onSubmit={handleSubmit}
      validationSchema={schema}
    >
      {InnerForm}
    </Formik>
  )
}

export default LoginForm