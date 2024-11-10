
import dynamic from "next/dynamic";
const LoginModule = dynamic(
    () => import("@/components/modules/admin/auth/Login")
  );


const Login = () => {
  return (
    <LoginModule/>
  )
}
export default Login