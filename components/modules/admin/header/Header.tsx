"use client";
import ContentContainer from "@/components/custom/ContentContainer";
import IconsGroup from "./IconsGroup";
import Row from "@/components/custom/Row";
import Logo from "@/components/custom/Logo";
import { CiMenuBurger } from "react-icons/ci";
import { useSidebar } from "@/components/ui/sidebar";


export default function Header() {
  const {toggleSidebar} = useSidebar()

  return (
    <header className="p-2 lg:hidden">
      <ContentContainer>
        <Row className="justify-between lg:justify-end items-center">
          <CiMenuBurger onClick={toggleSidebar} className="lg:hidden"/>
          <Logo className="lg:hidden" />
          <IconsGroup />
        </Row>
      </ContentContainer>
    </header>
  );
}
