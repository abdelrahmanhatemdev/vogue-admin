"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { BiSolidCategoryAlt } from "react-icons/bi";
import { MdSpaceDashboard } from "react-icons/md";
import { IoMdBusiness } from "react-icons/io";
import { MdAdminPanelSettings } from "react-icons/md";
import { CiLogout } from "react-icons/ci";

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
  useSidebar,
} from "@/components/ui/sidebar";
import { User } from "lucide-react";
import { memo } from "react";

import dynamic from "next/dynamic";
import Loading from "@/components/custom/Loading";
import { useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
const Logout = dynamic(() => import("@/components/modules/auth/Logout"), {
  loading: Loading,
});
const Logo = dynamic(() => import("@/components/custom/Logo"), {
  loading: Loading,
});
import { CgSize } from "react-icons/cg";
import { IoIosColorPalette } from "react-icons/io";
import { AiOutlineProduct } from "react-icons/ai";
import { IoSettingsOutline } from "react-icons/io5";
import { MdLabel } from "react-icons/md";





import { cn } from "@/lib/utils";

export const SidebarLinks = [
  {
    title: "Dashboard",
    link: "/",
    icon: MdSpaceDashboard,
  },
  {
    title: "Admins",
    link: "/admins",
    icon: MdAdminPanelSettings,
  },
  {
    title: "Categories",
    link: "/categories",
    icon: BiSolidCategoryAlt,
  },
  {
    title: "Brands",
    link: "/brands",
    icon: IoMdBusiness,
  },
  {
    title: "Sizes",
    link: "/sizes",
    icon: CgSize,
  },
  {
    title: "Colors",
    link: "/colors",
    icon: IoIosColorPalette,
  },
  {
    title: "Labels",
    link: "/labels",
    icon: MdLabel,
  },
  {
    title: "Products",
    link: "/products",
    icon: AiOutlineProduct,
  },
  {
    title: "Settings",
    link: "/settings/social-media",
    icon: IoSettingsOutline,
  },
];

function AdminSidebar() {
  const { data: session } = useSession();
  const user = session?.user;

  const { state } = useSidebar();

  const currentPath = usePathname();

  return (
    <Sidebar
      collapsible="icon"
      className="
      absolute 
      h-[calc(100%-5vh)] top-[2.5vh]
      start-[1rem] 
      rounded-lg 
      border-transparent overflow-hidden"
    >
      <SidebarHeader className="hidden md:block py-8 px-4">
        {state === "expanded" ? (
          <Logo />
        ) : (
          <Logo className="w-5 h-5 mx-auto" small={true} />
        )}
      </SidebarHeader>
      <SidebarContent className="scrollbar-hide overflow-hidden">
        <SidebarGroup>
          <SidebarGroupLabel className="text-foreground">
            Vogue Admin
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {SidebarLinks.map((link) => {
                const isActive =
                  link.link === "/"
                    ? currentPath === "/"
                    : currentPath.startsWith(link.link);

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
            <DropdownMenuTrigger
              className="focus:ring-0 focus:bg-transparent data-[state=open]:bg-transparent
            "
            >
              <Link
                href="/account"
                aria-label={`Sidebar Account Dropdown`}
                className="w-full flex gap-2"
              >
                <div
                  className={cn(
                    "bg-neutral-700 dark:bg-neutral-300 flex items-center justify-center rounded-md p-2 transition-all",
                    state === "expanded" ? "w-10 h-10" : "w-8 h-8"
                  )}
                >
                  <User className="text-neutral-50 dark:text-neutral-800" size={25} />
                </div>
                {state === "expanded" ? (
                  <div className="flex flex-col items-start">
                    <div className="text-sm font-bold truncate">
                      {user.name}
                    </div>
                    <div className="text-sm text-neutral-700 dark:text-neutral-300 capitalize truncate">
                      {user.email}
                    </div>
                  </div>
                ) : (
                  <></>
                )}
              </Link>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem className="flex gap-2 cursor-pointer">
                  <IoSettingsOutline />
                  <span>Setting</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem className="flex gap-2 cursor-pointer">
                  <CiLogout />
                  <Logout />
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link href={`/login`}>Login</Link>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
export default memo(AdminSidebar);
