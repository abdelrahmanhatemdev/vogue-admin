"use client"
import useTheme from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { memo } from "react";

function Logo({
  className,
  small,
  invert = false,
}: Readonly<{ className?: string; invert?: boolean; small?: boolean }>) {
  const { theme } = useTheme();
  let isDark = theme === "dark" ? true : false 
  const currentInvert = invert ? !isDark : isDark
  

  const src = `/assets/images/logo${small ? `-small` : ``}${currentInvert ? "-light" : ""}`;


  return (
    <Link className={cn("", className)} href="/admin">
      <Image
        src={`${src}.png`}
        alt="Vogue Logo"
        height={80}
        width={80}
        priority={true}
      />
    </Link>
  );
}

export default memo(Logo);
