import Container from "@/components/custom/Container";
import Row from "@/components/custom/Row";
import Footer from "@/components/modules/admin/footer/Footer";
import Header from "@/components/modules/admin/header/Header";
import MobileSidebar from "@/components/modules/admin/sidebar/MobileSidebar";
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
