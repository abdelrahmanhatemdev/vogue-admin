import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { memo } from "react";

function Logo({
  className,
  invert,
  small,
}: Readonly<{ className?: string; invert?: boolean; small?: boolean }>) {
  const src = `/assets/${small ? `icons/favicon-180` : `images/logo`}`;

  return (
    <Link className={cn("", className)} href="/admin">
      <Image
        src={`${src}${invert ? "-light" : ""}.png`}
        alt="Vogue Logo"
        height={96}
        width={96}
        priority={true}
      />
    </Link>
  );
}

export default memo(Logo);
