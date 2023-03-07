import { useParams } from "react-router-dom"
import RegistrationForm from "./RegistrationForm"
import classes from "./RegistrationPage.module.scss";

const RegistrationPage = () => {
  const { redirect } = useParams();
  return (
    <div className={classes.container} >
      <div className={classes.registration_page}>
        <h2>Registration page</h2>

        <RegistrationForm redirect={redirect} />
      </div>
    </div>
  )
}

export default RegistrationPage
