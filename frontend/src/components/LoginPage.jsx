import { useParams } from "react-router-dom"
import LoginForm from "./LoginForm";
import classes from "./LoginPage.module.scss";

const LoginPage = () => {
  const { redirect } = useParams();
  return (
    <div className={classes.loginpage}>
      <h2>Login page</h2>

      <LoginForm redirect={redirect} />
    </div>
  )
}

export default LoginPage

