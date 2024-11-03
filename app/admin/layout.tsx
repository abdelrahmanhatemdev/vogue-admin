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
      <div className="lg:fixed w-[95vw] start-[2.5vw] lg:w-[70vw] lg:start-[15vw] lg:h-[95vh] lg:top-[2.5vh] rounded-lg bg-main-100 mx-auto overflow-y-hidden">
        <SidebarProvider defaultOpen={defaultOpen}>
          <AdminSidebar/>
          <main className="grow lg:h-[90.25vh] lg:mt-[2.375vh] overflow-y-scroll">
            <Header />
            <ContentContainer className="">{children}</ContentContainer>
            <Footer />
          </main>
        </SidebarProvider>
      </div>
    </>
  );
}
