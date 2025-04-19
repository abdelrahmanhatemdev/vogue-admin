"use client"
import useTheme from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { memo, useEffect, useState } from "react";

function Logo({
  className,
  small,
  invert = false,
}: Readonly<{ className?: string; invert?: boolean; small?: boolean }>) {
  const { theme } = useTheme();
  const isDark = (theme === "dark" ? true : false) || false
  const currentInvert = invert ? !isDark : isDark
  const src = `/assets/images/logo${small ? `-small` : ``}${currentInvert ? "-light" : ""}`;

  const [mounted, setMounted] = useState(false)

  useEffect(()=> {
    setMounted(true)
  }, [mounted])

  if (!mounted) return null


  return (
    <Link className={cn("", className)} href="/">
      {theme ? (<Image
        src={`${src}.png`}
        alt="Vogue Logo"
        height={small ? 20 : 36}
        width={small ? 20 : 96}
      />): (<></>)}
      
    </Link>
  );
}

export default memo(Logo);
