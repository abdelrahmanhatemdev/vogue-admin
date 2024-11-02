import Container from "@/components/custom/Container";
import ContentContainer from "@/components/custom/ContentContainer";
import Footer from "@/components/modules/admin/footer/Footer";
import Header from "@/components/modules/admin/header/Header";
import AdminSidebar from "@/components/modules/admin/sidebar/AdminSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { cookies } from "next/headers";
import { ReactNode } from "react";

export default async function layout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";
  return (
    <>
      <Container>
        <SidebarProvider defaultOpen={defaultOpen}>
          <AdminSidebar />
          <main className="grow h-screen">
            <Header />
            <ContentContainer>{children}</ContentContainer>
            <Footer />
          </main>
        </SidebarProvider>
      </Container>
    </>
  );
}
