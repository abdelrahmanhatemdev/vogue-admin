import { memo, ReactNode } from "react";

function Heading({
  children,
  title,
  description,
}: Readonly<{
  children?: ReactNode;
  className?: string;
  title?: ReactNode;
  description?: ReactNode;
}>) {
  return (
      <div>
        <h1 className="capitalize text-2xl font-semibold text-neutral-900 dark:text-neutral-50">
          {title}
        </h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-300">{description}</p>
        {children}
      </div>
  );
}

export default memo(Heading);
