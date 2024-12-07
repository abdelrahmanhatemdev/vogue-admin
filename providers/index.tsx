"use client"
import { ReactNode } from "react";
import { AuthProvider } from "./AuthProvider";
import DataProvider from "./DataProvider";
import { SessionProvider } from "next-auth/react";

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <SessionProvider>
      <DataProvider>{children}</DataProvider>
    </SessionProvider>
    
  );
};
export default Providers;
