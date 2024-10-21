import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export default function Sidebar({
    className,
  }: Readonly<{
    className?: string;
  }>) {
  return (
    <div className={cn("", className)}>Sidebar</div>
  )
}