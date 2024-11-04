import { memo, ReactNode } from "react";

function NoResults({title}: {title?:string | ReactNode}) {
  return (
    <div>
      {title}
    </div>
  );
}

export default memo(NoResults)