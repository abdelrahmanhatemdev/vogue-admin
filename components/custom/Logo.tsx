import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { memo } from "react";

function Logo({
  className,
  invert,
  small,
}: Readonly<{ className?: string; invert?: boolean; small?: boolean }>) {
  const src = `/assets/images/logo${small ? `-small` : ``}`;

  return (
    <Link className={cn("", className)} href="/admin">
      <Image
        src={`${src}${invert ? "-light" : ""}.png`}
        alt="Vogue Logo"
        height={80}
        width={80}
        priority={true}
      />
    </Link>
  );
}

export default memo(Logo);
