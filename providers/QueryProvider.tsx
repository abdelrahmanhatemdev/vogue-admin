"use client";
import { ReactNode } from "react";
import { QueryClientProvider, QueryClient, keepPreviousData } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnReconnect: true,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      refetchInterval: false,
      refetchIntervalInBackground: false,
      placeholderData: keepPreviousData, 
      staleTime: 10 * 1000,
      gcTime: 60 * 1000,
      retryOnMount: true,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});

const QueryProvider = ({ children }: { children: ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default QueryProvider;