"use client";

import ErrorPage from "@/components/custom/ErrorPage";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error])


  return (
    <ErrorPage>
      <h1 className="text-[1.5rem] lg:text-4xl text-red-600 font-bold text-center">
        Something went wrong!
      </h1>
      <p className="text-main-100 text-center capitalize">
        {error.message || "An unexpected error occurred."}
      </p>
      <button
        className="text-main-100 hover:bg-slate-100 hover:text-main-900 p-2 rounded-md text-sm transition-colors text-center "
        onClick={() => reset()}
      >
        <strong>Try</strong> again
      </button>
    </ErrorPage>
  );
}
