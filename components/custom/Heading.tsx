import { cn } from "@/lib/utils";
import { memo, ReactNode } from "react";

const Heading = function Heading({
  children,
  className,
  title,
  description,
}: Readonly<{
  children?: ReactNode;
  className?: string;
  title?: string;
  description?: string;
}>) {
  return (
    <div>
      <h1 className="capitalize text-2xl font-semibold text-neutral-900">
        {title}
      </h1>
      <p className="text-sm text-neutral-600">{description}</p>
      {children}
    </div>
  );
};

export default memo(Heading);
