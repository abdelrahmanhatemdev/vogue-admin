import { User } from "lucide-react";
import Link from "next/link";
import { memo } from "react";

function IconsGroup() {
  return (
    <>
      <Link href="/account" aria-label = {`Icons Group Account Dropdown`}>
        <User size={30}/>
      </Link>
    </>
  );
}

export default memo(IconsGroup)