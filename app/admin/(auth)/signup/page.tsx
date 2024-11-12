
import dynamic from "next/dynamic";
const SignUpModule = dynamic(
    () => import("@/components/modules/admin/auth/SignUp")
  );


const SignUp = () => {
  return (
    <SignUpModule/>
  )
}
export default SignUp