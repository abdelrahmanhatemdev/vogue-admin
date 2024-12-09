"use client";
import { memo, ReactNode, useEffect, useState } from "react";
import NoInternet from "./NoInternet";
import AppLayout from "./AppLayout";

function MainLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(()=> {
    setIsOnline(navigator.onLine)

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  })

  return !isOnline ? <NoInternet/> : <AppLayout>{children}</AppLayout>
}

export default memo(MainLayout)
