"use client";
import { auth } from "@/firebase.config";

const Logout = () => {
  return (
    <button
      onClick={() => {
        auth
          .signOut()
          .then(() => {
            console.log("Signed Out");
          })
          .catch((e) => {
            console.error("Sign Out Error", e);
          });
      }}
    >
      logout
    </button>
  );
};
export default Logout;
