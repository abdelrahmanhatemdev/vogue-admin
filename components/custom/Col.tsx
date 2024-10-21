import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export default function Col({
  children,
  className,
}: Readonly<{
  children: ReactNode;
  className?: string;
}>) {
  return <div className={cn("flex flex-col h-full", className)}>{children}</div>;
}
