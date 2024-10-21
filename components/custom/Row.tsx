import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export default function Row({
  children,
  className,
}: Readonly<{
  children: ReactNode;
  className?: string;
}>) {
  return <div className={cn("row flex items-center", className)}>{children}</div>;
}
