import Col from "@/components/custom/Col";
import Logo from "@/components/custom/Logo";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function Sidebar({
    className,
  }: Readonly<{
    className?: string;
  }>) {
  return (
    <aside className={cn("w-52", className)}>
      <Logo />
      <ul className="p-4 border-e border-solid border-stone-800 w-full">
          <li>
            <Link href="/admin" className="font-bold">Dashboard</Link>
          </li>
          <li>
            <Link href="/admin/users" className="font-bold">Users</Link>
          </li>
        </ul>
    </aside>
  )
}