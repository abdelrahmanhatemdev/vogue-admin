import Container from "@/components/custom/Container";
import ContentContainer from "@/components/custom/ContentContainer";
import Row from "@/components/custom/Row";
import Footer from "@/components/modules/admin/footer/Footer";
import Header from "@/components/modules/admin/header/Header";
import Sidebar from "@/components/modules/admin/sidebar/Sidebar";
import { ReactNode } from "react";

export default function layout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <Container>
        <Row>
          <Sidebar className="hidden lg:block w-80" />
          <main className="grow relative h-screen">
            <Header />
            <ContentContainer>{children}</ContentContainer>
            <Footer/>
          </main>
        </Row>
      </Container>
    </>
  );
}
