"use client";
import { IoShareSocialOutline } from "react-icons/io5";
import { IoIosNotifications } from "react-icons/io";
import { BsCurrencyDollar } from "react-icons/bs";
import { CgDarkMode } from "react-icons/cg";
import { CiSettings } from "react-icons/ci";

import Link from "next/link";
import { memo } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";

const Heading = dynamic(() => import("@/components/custom/Heading"));

const sidebarLinks = [
  {
    link: "/settings/social-media",
    title: "Social Media",
    icon: IoShareSocialOutline,
  },
  {
    link: "/settings/global-notifications",
    title: "Global Notifications",
    icon: IoIosNotifications,
  },
  {
    link: "/settings/currencies",
    title: "Currencies",
    icon: BsCurrencyDollar,
  },
  {
    link: "/settings/appearence",
    title: "Appearnce",
    icon: CgDarkMode,
  },
  {
    link: "/settings/settings",
    title: "Global Settings",
    icon: CiSettings,
  },
];

const SettingsSidebar = () => {
  const currentPath = usePathname();

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex justify-between items-center">
        <Heading
          title="Settings"
          description="Manage your account settings and info!"
        />
      </div>
      <ul className="lg:w-full flex lg:flex-col gap-1 overflow-auto scrollbar-hide w-full">
        {sidebarLinks.map((link, index) => {
          const isActive = currentPath.startsWith(link.link);

          return (
            <li className="lg:w-full" key={index}>
              <Link
                href={`${link.link}`}
                className={cn(
                  "rounded-lg dark:hover:bg-neutral-700 transition-colors p-2 w-full flex gap-2 items-center font-medium",
                  isActive ? "bg-neutral-700" : ""
                )}
              >
                <link.icon />
                <p className="w-max truncate">{link.title}</p>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
export default memo(SettingsSidebar);
