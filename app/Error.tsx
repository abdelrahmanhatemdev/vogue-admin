"use client"

import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function Error({
    error, 
    reset
}:{
    error: Error & {digest?: string};
    reset: () => void
}) {

    useEffect(() => {
        console.log(error);
        
    }, [error])
  return (
    <main className="flex flex-col items-center justify-center h-full">
        <h1 className="text-2xl">Something went wrong!</h1>
        <Button
        onClick={() => reset()}
        >Try Again</Button>

    </main>
  )
}