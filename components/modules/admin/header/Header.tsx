"use client";
import ContentContainer from "@/components/custom/ContentContainer";
import IconsGroup from "./IconsGroup";
import Row from "@/components/custom/Row";
import Logo from "@/components/custom/Logo";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { CiMenuBurger } from "react-icons/ci";
export default function Header() {

  return (
    <header className="p-2">
      <ContentContainer>
        <Row className="justify-between lg:justify-end items-center">
          <SidebarTrigger/>
          <Logo className="lg:hidden" />
          <IconsGroup />
        </Row>
      </ContentContainer>
    </header>
  );
}
