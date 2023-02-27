import { useParams } from "react-router-dom"
import RegistrationForm from "./RegistrationForm"

const RegistrationPage = () => {
  const { redirect } = useParams();
  return (
    <div>
      <h2>Registration page</h2>

      <RegistrationForm redirect={redirect} />
    </div>
  )
}

export default RegistrationPage
