import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export default function ContentContainer({
  children,
  className,
}: Readonly<{
  children: ReactNode;
  className?: string;
}>) {
  return <div className={cn("w-[95%] lg:w-[90%] mx-auto", className)}>{children}</div>;
}
