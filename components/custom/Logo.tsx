import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { memo } from "react";

function Logo({ className, invert }: Readonly<{ className?: string; invert?: boolean }>) {
  return (
    <Link className={cn("", className)} href="/">
      <Image
        src={`/assets/images/logo${invert && "-light"}.png`}
        alt="Vogue Logo"
        height={96}
        width={96}
        priority= {true}
      />
    </Link>
  );
}

export default memo(Logo)