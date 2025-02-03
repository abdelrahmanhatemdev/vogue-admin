import { cookies } from "next/headers";
import { ReactNode } from "react";
import * as motion from "framer-motion/client";
import dynamic from "next/dynamic";
import Loading from "@/components/custom/Loading";
// import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
const MainLayout = dynamic(() => import("@/components/custom/MainLayout"), {
  loading: Loading,
});

const Header = dynamic(
  () => import("@/components/modules/header/Header"),
  { loading: Loading }
);
const SidebarProvider = dynamic(
  () =>
    import("@/components/ui/sidebar").then((module) => module.SidebarProvider),
  { loading: Loading }
);
const AdminSidebar = dynamic(
  () => import("@/components/modules/sidebar/AdminSidebar"),
  { loading: Loading }
);
const ContentContainer = dynamic(
  () => import("@/components/custom/ContentContainer"),
  { loading: Loading }
);

const Footer = dynamic(
  () => import("@/components/modules/footer/Footer"),
  { loading: Loading }
);
export default async function layout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";

  // const session = await getServerSession(authOptions);

  // if (!session || session?.user?.role !== "admin") {
  //   redirect("/login");
  // }

  return (
    <MainLayout>
      <SidebarProvider defaultOpen={defaultOpen} className="
      md:h-full md:min-h-full
      overflow-auto scrollbar-hide">
        <Header />
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <AdminSidebar />
        </motion.div>

        <main className="grow w-[50%] md:h-[90.25vh] md:mt-[2.375vh]">
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <ContentContainer>{children}</ContentContainer>
            <Footer />
          </motion.div>
        </main>
      </SidebarProvider>
    </MainLayout>
  );
}
