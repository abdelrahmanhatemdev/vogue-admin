"use client"
import Logo from "@/components/custom/Logo";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { BiSolidCategoryAlt } from "react-icons/bi";
import { MdSpaceDashboard } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { usePathname } from "next/navigation";

export const SidebarLinks = [
  {
    name: "Dashboard",
    link: "/admin",
    icon: <MdSpaceDashboard className="text-2xl"/>,
  },
  {
    name: "Users",
    link: "/admin/users",
    icon: <FaUsers className="text-2xl" />,
  },
  {
    name: "Categories",
    link: "/admin/categories",
    icon: <BiSolidCategoryAlt className="text-2xl"/>,
  },
];

export default function Sidebar({
  className,
}: Readonly<{
  className?: string;
}>) {
  const currentPath = usePathname()
  return (
    <aside className={cn("w-52", className)}>
      <Logo />
      <ul className="p-4 border-e border-solid border-stone-800 w-full flex flex-col gap-2">
        {SidebarLinks.map((link) => (
          <li key={link.name} className="flex items-center gap-2">
            {link.icon}
            <Link href={`${link.link}`} className={currentPath === link.link ? "font-bold": "font-medium"}>
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
