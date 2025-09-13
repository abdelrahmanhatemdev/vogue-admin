"use client";
import { ReactNode } from "react";

import ThemeProvider from "@/providers/ThemeProvider";
import { AuthProvider } from "@/context/AuthContext";
import QueryProvider from "@/providers/QueryProvider";

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <QueryProvider>
      <ThemeProvider>
        <AuthProvider>
         {children}
        </AuthProvider>
      </ThemeProvider>
    </QueryProvider>
  );
};
export default Providers;
