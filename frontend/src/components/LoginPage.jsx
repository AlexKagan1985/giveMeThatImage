import { NavLink, useParams } from "react-router-dom"
import LoginForm from "./LoginForm";
import classes from "./LoginPage.module.scss";

const LoginPage = () => {
  const { redirect } = useParams();
  return (
    <div className={classes.container}>
      <div className={classes.loginpage}>
        <h2>Login page</h2>

        <LoginForm redirect={redirect} />

        <p> Do you want to register? <NavLink to={`/register/${encodeURIComponent(redirect)}`}>Click here</NavLink></p>
      </div>
    </div>
  )
}

export default LoginPage

