import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export default function Row({
  children,
  classname,
}: Readonly<{
  children: ReactNode;
  classname?: string;
}>) {
  return <div className={cn("row", classname)}>{children}</div>;
}
