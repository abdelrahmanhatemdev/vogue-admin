"use client";
import ContentContainer from "@/components/custom/ContentContainer";
import IconsGroup from "./IconsGroup";
import Row from "@/components/custom/Row";
import Logo from "@/components/custom/Logo";
import MobileSidebar from "../sidebar/MobileSidebar";

export default function Header() {

  return (
    <header className="p-2">
      <ContentContainer>
        <Row className="justify-between lg:justify-end items-center">
          <MobileSidebar/>
          <Logo className="lg:hidden" />
          <IconsGroup />
        </Row>
      </ContentContainer>
    </header>
  );
}
