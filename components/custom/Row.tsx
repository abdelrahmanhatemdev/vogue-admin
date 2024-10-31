import { cn } from "@/lib/utils";
import { memo, ReactNode } from "react";

const Row = function Row({
  children,
  className,
}: Readonly<{
  children: ReactNode;
  className?: string;
}>) {
  return <div className={cn("row flex", className)}>{children}</div>;
}


export default memo(Row)
