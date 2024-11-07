// import { SidebarProvider } from "@/components/ui/sidebar";
import { cookies } from "next/headers";
import { ReactNode } from "react";
import * as motion from "framer-motion/client";


import dynamic from "next/dynamic";
import Loading from "@/components/custom/Loading"
const Footer= dynamic(() => import("@/components/modules/admin/footer/Footer"), {loading: Loading});
const Header=dynamic(() => import("@/components/modules/admin/header/Header"), {loading: Loading});
const AdminSidebar= dynamic(() => import("@/components/modules/admin/sidebar/AdminSidebar"), {loading: Loading});
const ContentContainer= dynamic(() => import("@/components/custom/ContentContainer"), {loading: Loading});
const SidebarProvider= dynamic(() => import("@/components/ui/sidebar").then(module => module.SidebarProvider), {loading: Loading});

export default async function layout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="lg:fixed w-[95vw] start-[2.5vw] lg:w-[70vw] lg:start-[15vw] lg:h-[95vh] lg:top-[2.5vh] my-4 rounded-lg bg-main-100 mx-auto overflow-y-hidden">
          <SidebarProvider defaultOpen={defaultOpen}>
            <motion.div
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <AdminSidebar />
            </motion.div>

            <main className="grow lg:h-[90.25vh] lg:mt-[2.375vh] overflow-y-scroll">
              <motion.div
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Header />
                <ContentContainer>
                    {children}
                </ContentContainer>
                <Footer />
              </motion.div>
            </main>
          </SidebarProvider>
        </div>
      </motion.div>
    </>
  );
}
