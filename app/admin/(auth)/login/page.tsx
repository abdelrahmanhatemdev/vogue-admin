import { Metadata } from "next";
import dynamic from "next/dynamic";
const LoginModule = dynamic(
  () => import("@/components/modules/admin/auth/Login")
);

export const title = "Login"

export const metadata: Metadata = {
  title
};

const Login = () => {
  return <LoginModule />;
};
export default Login;
