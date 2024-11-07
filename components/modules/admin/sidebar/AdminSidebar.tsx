"use client";
import { usePathname } from "next/navigation";
import Logo from "@/components/custom/Logo";
import Link from "next/link";
import { BiSolidCategoryAlt } from "react-icons/bi";
import { MdSpaceDashboard } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { IoMdBusiness } from "react-icons/io";

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

export const SidebarLinks = [
  {
    title: "Dashboard",
    link: "/admin",
    icon: MdSpaceDashboard,
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
];

function AdminSidebar ()  {
  const currentPath = usePathname();
  return (
    <Sidebar collapsible="icon" className="absolute h-[90.25vh] top-[2.375vh] start-[1rem] rounded-lg border-transparent">
      <SidebarHeader>
        <Logo className="hidden lg:block"/>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-foreground">Vogue Admin</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {SidebarLinks.map((link) => {
                const isActive = currentPath === link.link;
                return (
                  <SidebarMenuItem key={link.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={`${link.link}`} className="w-6 h-6 text-foreground">
                        <link.icon/>
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
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Link href="/admin/account" aria-label = {`Sidebar Account Dropdown`}  className="w-6 h-6">
              <User size={30} />
            </Link>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Setting</DropdownMenuItem>
            <DropdownMenuItem>Orders</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
      <SidebarRail/>
    </Sidebar>
  );
};
export default memo(AdminSidebar);
