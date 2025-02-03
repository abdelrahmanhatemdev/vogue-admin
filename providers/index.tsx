"use client";
import { ReactNode } from "react";
import DataProvider from "@/providers/DataProvider";
import ThemeProvider from "@/providers/ThemeProvider";

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeProvider>
        <DataProvider>{children}</DataProvider>
    </ThemeProvider>
  );
};
export default Providers;
