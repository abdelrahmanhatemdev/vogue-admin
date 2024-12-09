"use client";
import ContentContainer from "@/components/custom/ContentContainer";
import IconsGroup from "./IconsGroup";
import Logo from "@/components/custom/Logo";
import { CiMenuBurger } from "react-icons/ci";
import { memo } from "react";

function Header({ toggleSidebar }: { toggleSidebar?: () => void }) {
  return (
    <header className="p-2 lg:hidden">
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
