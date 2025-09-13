"use client";
import IconsGroup from "./IconsGroup";
import Logo from "@/components/custom/Logo";
import { CiMenuBurger } from "react-icons/ci";
import { memo } from "react";
import { useSidebar } from "@/components/ui/sidebar";
import dynamic from "next/dynamic";
import Loading from "@/components/custom/Loading";
const ContentContainer = dynamic(
  () => import("@/components/custom/ContentContainer"),
  { loading: Loading }
);
function Header() {
  const { toggleSidebar } = useSidebar();
  return (
    <header
      className="
    p-4 
    md:hidden
    fixed inset-0 dark:bg-neutral-800 dark:md:bg-neutral-900 bg-neutral-100 z-50
    h-16 top-[2.5vh]
    w-[90%] start-[5%] md:w-[95vw] xs:w-[90vw]
    md:start-[2.5vw] xs:start-[5vw] rounded-lg"
    >
      <ContentContainer>
        <div className="flex justify-between lg:justify-end items-center">
          <CiMenuBurger onClick={toggleSidebar} className="lg:hidden" />
          <Logo className="lg:hidden" />
          <IconsGroup />
        </div>
      </ContentContainer>
    </header>
  );
}

export default memo(Header);
