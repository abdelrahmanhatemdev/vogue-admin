"use client";
import ErrorPage from "@/components/custom/ErrorPage";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import { useEffect } from "react";

export const metadata: Metadata = {
  title: "Something Wrong!",
};

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ErrorPage heading="Something went wrong!" description={`${error.message}`} />
  );
}
