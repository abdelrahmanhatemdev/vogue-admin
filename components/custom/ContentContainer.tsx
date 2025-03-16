import { cn } from "@/lib/utils";
import { memo, ReactNode } from "react";

function ContentContainer({
  children,
  className,
}: Readonly<{
  children: ReactNode;
  className?: string;
}>) {
  return <div className={cn("w-[96%] mx-auto", className)}>{children}</div>;
}

export default memo(ContentContainer)