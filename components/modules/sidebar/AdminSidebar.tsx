"use client";
import { usePathname, useRouter } from "next/navigation";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
const Logo = dynamic(() => import("@/components/custom/Logo"), {
  loading: Loading,
});
import { CgSize } from "react-icons/cg";
import { IoIosColorPalette } from "react-icons/io";
import { AiOutlineProduct } from "react-icons/ai";
import { IoSettingsOutline } from "react-icons/io5";
import { MdLabel } from "react-icons/md";
import { TbUsers } from "react-icons/tb";
import { PiTruckTrailerDuotone } from "react-icons/pi";
import { HiOutlineCurrencyDollar } from "react-icons/hi";

import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

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
    title: "Users",
    link: "/users",
    icon: TbUsers,
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
    title: "Orders",
    link: "/orders",
    icon: PiTruckTrailerDuotone,
  },
  {
    title: "Payments",
    link: "/payments",
    icon: HiOutlineCurrencyDollar,
  },
  {
    title: "Settings",
    link: "/settings/social-media",
    icon: IoSettingsOutline,
  },
];

function AdminSidebar() {
  const { user, logout } = useAuth();

  const { state } = useSidebar();

  const currentPath = usePathname();

  const router = useRouter();

  const handleLogOut = async () => {
    await logout();
    router.push("/login");
  };

  if (!state) return;

  return (
    <Sidebar
      collapsible="icon"
      className="
      absolute 
      inset-4
      w-(15rem)
      h-[calc(100vsh-1rem)]
      rounded-lg 
      bg-background
      border-transparent overflow-hidden"
    >
      <SidebarHeader className="hidden md:block p-4">
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
      <SidebarFooter className="p-4">
        {user && (
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
                    "flex items-center justify-center rounded-md transition-all",
                    state === "expanded"
                      && "bg-neutral-700 dark:bg-neutral-300 p-2"
                      
                  )}
                >
                  <User
                    className={
                      `${state === "expanded"
                        ? "text-neutral-50 dark:text-neutral-800"
                        : "dark:text-neutral-50 text-neutral-800"}`
                    }
                    size={15}
                  />
                </div>
                {state === "expanded" ? (
                  <div className="flex flex-col items-start text-xs">
                    <div className="font-bold truncate">
                      {user.displayName}
                      </div>
                    <div className="text-neutral-700 dark:text-neutral-300 capitalize truncate">
                      {user.email}
                    </div>
                  </div>
                ) : (
                  <></>
                )}
              </Link>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel className="bg-neutral-100 dark:bg-neutral-700">My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem className="flex gap-2 cursor-pointer">
                  <IoSettingsOutline />
                  <span>Setting</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  className="flex gap-2 cursor-pointer"
                  onClick={handleLogOut}
                >
                  <CiLogout />
                  <div>Logout</div>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
export default memo(AdminSidebar);
