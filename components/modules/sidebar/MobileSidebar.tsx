import { cn } from "@/lib/utils";

export default function MobileSidebar({
  className,
}: Readonly<{
  className?: string;
}>) {
  return (
    <div className={cn("", className)}>MobileSidebar</div>
  )
}