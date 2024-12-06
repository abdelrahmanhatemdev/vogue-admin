"use client";
import { usePathname } from "next/navigation";
import Logo from "@/components/custom/Logo";
import Link from "next/link";
import { BiSolidCategoryAlt } from "react-icons/bi";
import { MdSpaceDashboard } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { IoMdBusiness } from "react-icons/io";
import { MdAdminPanelSettings } from "react-icons/md";


import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { User } from "lucide-react";
import { memo } from "react";
import { CgSize } from "react-icons/cg";
import { IoIosColorPalette } from "react-icons/io";
import { AiOutlineProduct } from "react-icons/ai";

import dynamic from "next/dynamic";
import Loading from "@/components/custom/Loading";
import useAuth from "@/hooks/useAuth";
const Logout = dynamic(() => import("@/components/modules/admin/auth/Logout"), {
  loading: Loading,
});

export const SidebarLinks = [
  {
    title: "Dashboard",
    link: "/admin",
    icon: MdSpaceDashboard,
  },
  {
    title: "Admins",
    link: "/admin/admins",
    icon: MdAdminPanelSettings,
  },
  {
    title: "Users",
    link: "/admin/users",
    icon: FaUsers,
  },
  {
    title: "Categories",
    link: "/admin/categories",
    icon: BiSolidCategoryAlt,
  },
  {
    title: "Brands",
    link: "/admin/brands",
    icon: IoMdBusiness,
  },
  {
    title: "Sizes",
    link: "/admin/sizes",
    icon: CgSize,
  },
  {
    title: "Colors",
    link: "/admin/colors",
    icon: IoIosColorPalette,
  },
  {
    title: "Products",
    link: "/admin/products",
    icon: AiOutlineProduct,
  },
];

function AdminSidebar() {
  const { user } = useAuth();

  // console.log("user", user);

  const currentPath = usePathname();
  return (
    <Sidebar
      collapsible="icon"
      className="absolute h-[90.25vh] top-[2.375vh] start-[1rem] rounded-lg border-transparent"
    >
      <SidebarHeader>
        <Logo className="hidden lg:block" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-foreground">
            Vogue Admin
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {SidebarLinks.map((link) => {
                const isActive =
                  link.link !== "/admin"
                    ? currentPath.startsWith(link.link)
                    : false


                // console.log(
                //   "link.link",
                //   link.link,
                //   "link.title",
                //   link.title,
                //   "isActive",
                //   isActive, 
                //   "link.link !== /admin", 
                //   link.link !== "/admin"
                // );
                return (
                  <SidebarMenuItem key={link.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link
                        href={`${link.link}`}
                        className="w-6 h-6 text-foreground"
                      >
                        <link.icon />
                        <span
                          className={isActive ? "font-bold" : "font-medium"}
                        >
                          {link.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Link
                href="/admin/account"
                aria-label={`Sidebar Account Dropdown`}
                className="w-6 h-6"
              >
                <User size={30} />
              </Link>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Setting</DropdownMenuItem>
              <DropdownMenuItem>Orders</DropdownMenuItem>
              <Logout />
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link href={`/admin/login`}>Login</Link>
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
export default memo(AdminSidebar);
