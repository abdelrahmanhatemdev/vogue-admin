import { cn } from "@/lib/utils";
import { ReactNode } from "react";


export default function Container({
  children, 
  classname
}: Readonly<{
  children: ReactNode;
  classname?: string
}>) {
  return (
    <div className={cn("container", classname)}>
      {children}
    </div>
  )
}