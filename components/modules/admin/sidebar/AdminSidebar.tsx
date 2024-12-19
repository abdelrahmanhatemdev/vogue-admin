"use client";
import { usePathname } from "next/navigation";
import Logo from "@/components/custom/Logo";
import Link from "next/link";
import { BiSolidCategoryAlt } from "react-icons/bi";
import { MdSpaceDashboard } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
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
  SidebarRail,
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
const Logout = dynamic(() => import("@/components/modules/admin/auth/Logout"), {
  loading: Loading,
});
import { CgSize } from "react-icons/cg";
import { IoIosColorPalette } from "react-icons/io";
import { AiOutlineProduct } from "react-icons/ai";
import { IoSettingsOutline } from "react-icons/io5";

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
  const { data: session } = useSession();
  const user = session?.user;

  const { state } = useSidebar();

  const currentPath = usePathname();

  return (
    <Sidebar
      collapsible="icon"
      className="absolute h-[90.25vh] top-[2.375vh] start-[1rem] rounded-lg border-transparent"
    >
      <SidebarHeader className="py-8 px-4">
        {state === "expanded" ? (
          <Logo className="hidden lg:block" />
        ) : (
          <Logo className="hidden lg:block w-5 h-5 mx-auto" small={true} />
        )}
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
                    : false;

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
            <DropdownMenuTrigger
              className="focus:ring-0 focus:bg-transparent data-[state=open]:bg-transparent
            "
            >
              <Link
                href="/admin/account"
                aria-label={`Sidebar Account Dropdown`}
                className="w-full flex gap-2"
              >
                <div className="bg-main-700 flex items-center justify-center w-10 h-10 rounded-md p-2">
                  <User className="text-main-50" size={25} />
                </div>
                <div className="flex flex-col items-start">
                  <div className="text-sm font-bold">
                    {user.name?.slice(0, 25)}
                  </div>
                  <div className="text-sm text-main-700 capitalize">
                    {user.email?.slice(0, 25)}
                  </div>
                </div>
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
          <Link href={`/admin/login`}>Login</Link>
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
export default memo(AdminSidebar);
