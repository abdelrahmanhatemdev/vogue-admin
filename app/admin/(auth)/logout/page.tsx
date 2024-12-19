import dynamic from "next/dynamic";
const LogoutModule = dynamic(
  () => import("@/components/modules/admin/auth/Logout")
);

const Logout = () => {
  return <LogoutModule />;
};
export default Logout;
