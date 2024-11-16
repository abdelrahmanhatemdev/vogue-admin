import { ReactNode } from "react";
import { AuthProvider } from "./AuthProvider";
import DataProvider from "./DataProvider";

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <AuthProvider>
      <DataProvider>{children}</DataProvider>
    </AuthProvider>
  );
};
export default Providers;
