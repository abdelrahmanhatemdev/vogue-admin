"use client"
import { IoShareSocialOutline } from "react-icons/io5";
import { IoIosNotifications } from "react-icons/io";
import { BsCurrencyDollar } from "react-icons/bs";
import { CgDarkMode } from "react-icons/cg";
import { FaShippingFast } from "react-icons/fa";
import Link from "next/link";
import { memo } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const sidebarLinks = [
  {
    link: "/settnigs/social-media",
    title: "Social Media",
    icon: IoShareSocialOutline,
  },
  {
    link: "/settnigs/global-notifications",
    title: "Global Notifications",
    icon: IoIosNotifications,
  },
  {
    link: "/settnigs/currencies",
    title: "Currencies",
    icon: BsCurrencyDollar,
  },
  {
    link: "/settnigs/appearence",
    title: "Appearnce",
    icon: CgDarkMode,
  },
  {
    link: "/settnigs/shipping",
    title: "Shipping",
    icon: FaShippingFast,
  },
];

const SettingsSidebar = () => {

  const currentPath = usePathname();



  return (
    <ul className="w-full flex lg:flex-col -ms-2">
      {sidebarLinks.map((link, index) => {
        const isActive =
        link.link === "/settings"
          ? currentPath === "/settings"
          : currentPath.startsWith(link.link);

          console.log('currentPath === "/settings"', currentPath === "/settings");
          console.log('isActive', isActive);
          
        return (
          <li className="w-full" key={index}>
            <Link
              href={`${link.link}`}
              className={cn("rounded-lg dark:hover:bg-neutral-700 transition-colors p-2 w-full flex gap-2 items-center", isActive ? "bg-neutral-700" : "")}
            >
              <link.icon />
              <span>{link.title}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
};
export default memo(SettingsSidebar);
