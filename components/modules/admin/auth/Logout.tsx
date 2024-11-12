"use client";

const Logout = () => {
  const handleLogOut = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_APP_API}/auth/logout`, {
        method: "POST",
      });
      if (res.ok) {
        console.log("User Logged out successfully!");
      } else {
        const data = await res.json();
        console.log(data.error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return <button onClick={handleLogOut}>logout</button>;
};
export default Logout;
