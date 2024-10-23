import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export default function Heading({
  children,
  className,
  title
}: Readonly<{
  children?: ReactNode;
  className?: string;
  title?: string;
}>) {
  return (
    <div className={cn("my-8", className)}>
        <h1 className="capitalize text-xl font-semibold text-neutral-900">{title}</h1>
      {children}
    </div>
  );
}
