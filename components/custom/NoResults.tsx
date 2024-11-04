import { ReactNode } from "react";

export default function NoResults({title}: {title?:string | ReactNode}) {
  return (
    <div>
      {title}
    </div>
  );
}
