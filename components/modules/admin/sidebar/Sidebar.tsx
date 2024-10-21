import Col from "@/components/custom/Col";
import Logo from "@/components/custom/Logo";
import Link from "next/link";

export default function Sidebar({
    className,
  }: Readonly<{
    className?: string;
  }>) {
  return (
    <aside className="w-52">
      <Logo />
        <ul className="p-4 border-e border-solid border-stone-800 w-full">
          <li>
            <Link href="/admin/users" className="font-bold">Users</Link>
          </li>
        </ul>
    </aside>
  )
}