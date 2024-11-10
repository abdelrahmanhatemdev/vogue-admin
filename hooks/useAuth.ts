import { AuthContext } from "@/context/AuthContext";
import { useContext } from "react";

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("Auth Context should be used within Auth Provider");
  }
  return context;
};
export default useAuth;
