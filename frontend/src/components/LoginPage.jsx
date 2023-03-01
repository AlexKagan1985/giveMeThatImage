import { useParams } from "react-router-dom"
import LoginForm from "./LoginForm";

const LoginPage = () => {
  const { redirect } = useParams();
  return (
    <div>
      <h2>Login page</h2>

      <LoginForm redirect={redirect} />
    </div>
  )
}

export default LoginPage

