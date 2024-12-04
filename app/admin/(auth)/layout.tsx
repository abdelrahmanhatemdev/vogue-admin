import dynamic from "next/dynamic";
import { ReactNode } from "react";
import Loading from "@/components/custom/Loading";
import Link from "next/link";

const Logo = dynamic(() => import("@/components/custom/Logo"), {
  loading: Loading,
});
const AuthSwiper = dynamic(
  () => import("@/components/modules/admin/auth/AuthSwiper"),
  {
    loading: Loading,
  }
);

const MainLayout = dynamic(() => import("@/components/custom/MainLayout"), {
  loading: Loading,
});

export default function layout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <MainLayout>
      <div className="flex h-full bg-red-500 *:w-[50%] w-full flex-wrap">
        <div className="bg-main-200 hidden lg:block w-full relative">
          <AuthSwiper />
          <div className="flex items-center absolute inset-5 justify-between h-fit p-2">
            <Logo className="z-10" invert={true}/>
            <Link href={`/`} className="z-10 bg-main-600 text-main-50 text-xs rounded-full p-2 hover:bg-main-700 transition-colors shadow-sm">Back to Website</Link>
          </div>
        </div>
        {children}
      </div>
    </MainLayout>
  );
}
