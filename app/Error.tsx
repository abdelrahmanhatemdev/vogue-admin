"use client";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
  }, [error]);

  return (
    <html>
      <head>
        <title>Something Went Wrong</title>
      </head>
      <body>
        <div style={{ padding: "2rem", textAlign: "center" }}>
          <h1>Something went wrong</h1>
          <p>{error.message}</p>
          <main className="flex flex-col items-center justify-center h-full">
            <h1 className="text-2xl">Something went wrong!</h1>
            <Button onClick={() => reset()}>Try Again</Button>
            
          </main>
        </div>
      </body>
    </html>
  );
}
