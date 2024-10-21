import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export default function Container({
  children,
  className,
}: Readonly<{
  children: ReactNode;
  className?: string;
}>) {
  return <div className={cn("container w-full h-full", className)}>{children}</div>;
}
