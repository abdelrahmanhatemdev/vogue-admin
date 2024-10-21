import { User } from "lucide-react";
import Link from "next/link";

export default function IconsGroup() {
  return (
    <>
      <Link href="/account">
        <User size={30}/>
      </Link>
    </>
  );
}
