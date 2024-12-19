"use client";
import ContentContainer from "@/components/custom/ContentContainer";
import IconsGroup from "./IconsGroup";
import Logo from "@/components/custom/Logo";
import { CiMenuBurger } from "react-icons/ci";
import { memo } from "react";

function Header({ toggleSidebar }: { toggleSidebar?: () => void }) {
  return (
    <header className="
    p-4 md:hidden fixed inset-0 bg-main-100  z-10
    h-16 top-[2.5vh]
    w-[95vw] xs:w-[90vw]
    start-[2.5vw] xs:start-[5vw] rounded-lg">
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
