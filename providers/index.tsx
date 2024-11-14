import { ReactNode } from "react";
import { AuthProvider } from "./AuthProvider";
import ProductProvider from "./ProductProvider";

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <AuthProvider>
      <ProductProvider>{children}</ProductProvider>
    </AuthProvider>
  );
};
export default Providers;
