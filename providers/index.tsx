"use client";
import { ReactNode } from "react";
import DataProvider from "@/providers/DataProvider";
import { SessionProvider } from "next-auth/react";
import ThemeProvider from "@/providers/ThemeProvider";

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeProvider>
      <SessionProvider>
        <DataProvider>{children}</DataProvider>
      </SessionProvider>
    </ThemeProvider>
  );
};
export default Providers;
