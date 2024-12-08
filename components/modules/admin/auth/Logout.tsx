"use client";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const Logout = () => {
  const router = useRouter()
  const handleLogOut = async () => {
    await signOut({ redirect: false})
    router.push("/admin/login")
  };

  return <button onClick={handleLogOut}>logout</button>;
};
export default Logout;
