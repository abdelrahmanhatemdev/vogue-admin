"use client";
import { ReactNode } from "react";
import DataProvider from "@/providers/DataProvider";
import ThemeProvider from "@/providers/ThemeProvider";
import { AuthProvider } from "@/context/AuthContext";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <DataProvider>{children}</DataProvider>
        </QueryClientProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};
export default Providers;
