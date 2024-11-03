import { cn } from "@/lib/utils";
import Image from "next/image";

export default function Logo({ className }: Readonly<{ className?: string }>) {
  return (
    <div className={cn("", className)}>
      <Image
        src="/assets/images/logo.webp"
        alt="Vogue Logo"
        height={100}
        width={80}
        priority= {true}
      />
    </div>
  );
}
