import Container from "@/components/custom/Container";
import Row from "@/components/custom/Row";
import Footer from "@/components/modules/footer/Footer";
import Header from "@/components/modules/header/Header";
import MobileSidebar from "@/components/modules/sidebar/MobileSidebar";
import Sidebar from "@/components/modules/sidebar/Sidebar";
import { ReactNode } from "react";

export default function layout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <Container>
        <Row>
          <Sidebar className="hidden lg:block w-80" />
          <MobileSidebar className="lg:hidden" />
          <main className="grow relative h-screen">
            <Header />
            {children}
            <Footer />
          </main>
        </Row>
      </Container>
    </>
  );
}
