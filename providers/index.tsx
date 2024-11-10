import { ReactNode } from "react";
import { AuthProvider } from "./AuthProvider";

const Providers = ({ children }: { children: ReactNode }) => {
  return <AuthProvider>{children}</AuthProvider>;
};
export default Providers;
