import { cn } from "@/lib/utils";
import Image from "next/image";
import { memo } from "react";

function Logo({ className }: Readonly<{ className?: string }>) {
  return (
    <div className={cn("", className)}>
      <Image
        src="/assets/images/logo.webp"
        alt="Vogue Logo"
        height={96}
        width={96}
        priority= {true}
      />
    </div>
  );
}

export default memo(Logo)