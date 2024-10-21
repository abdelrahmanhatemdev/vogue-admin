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
      <Header />
      <div>
        <Sidebar className="hidden lg:block" />
        <MobileSidebar />
        <main>{children}</main>
      </div>
      <Footer />
    </>
  );
}
