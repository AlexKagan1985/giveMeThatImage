/* eslint-disable no-unused-vars */
import axios from "axios";
import { useId, useState } from "react"
import { Alert, Button, FloatingLabel, Form } from "react-bootstrap"
import { useNavigate } from "react-router-dom";

const RegistrationForm = ({ redirect }) => {
  const emailFieldId = useId();
  const loginFieldId = useId();
  const passwordFieldId = useId();
  const passwordRepeatFieldId = useId();

  const [login, setLogin] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    //TODO: actually do the registration here
    try {
      const result = await axios.post("http://localhost:3001/user", {
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
    <Form onSubmit={handleSubmit}>
      <FloatingLabel controlId={loginFieldId} label="login name:" className="mb-3">
        <Form.Control type="input" placeholder="Name" value={login} onChange={(e) => setLogin(e.target.value)} />
      </FloatingLabel>
      <FloatingLabel controlId={emailFieldId} label="email:" className="mb-3">
        <Form.Control type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
      </FloatingLabel>
      <FloatingLabel controlId={passwordFieldId} label="password: " className="mb-3">
        <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </FloatingLabel>
      <FloatingLabel controlId={passwordRepeatFieldId} label="repeat password: " className="mb-3">
        <Form.Control type="password" value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)} />
      </FloatingLabel>
      <Form.Group className="d-grid">
        <Button size="lg" type="submit">Register...</Button>
      </Form.Group>
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
    </Form>
  )
}

export default RegistrationForm
