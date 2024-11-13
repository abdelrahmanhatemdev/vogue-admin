"use client";

import { logoutUser } from "@/lib/authService";

const Logout = () => {
  const handleLogOut = async () => {
    await logoutUser()
  };

  return <button onClick={handleLogOut}>logout</button>;
};
export default Logout;
