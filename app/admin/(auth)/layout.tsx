import dynamic from "next/dynamic";
import { ReactNode } from "react";
import Loading from "@/components/custom/Loading";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

const Logo = dynamic(() => import("@/components/custom/Logo"), {
  loading: Loading,
});
const AuthSwiper = dynamic(
  () => import("@/components/custom/AuthSwiper"),
  {
    loading: Loading,
  }
);

const MainLayout = dynamic(() => import("@/components/custom/MainLayout"), {
  loading: Loading,
});

export default async function layout({
  children,
}: Readonly<{ children: ReactNode }>) {

  const session = await getServerSession(authOptions);

  if (session && session?.user?.role === "admin") {
    redirect("/admin")
  }

  return (
    <MainLayout>
      <div className="flex h-full *:md:w-[50%] w-full flex-wrap">
        <div className="hidden md:block w-full h-full relative">
          <AuthSwiper />
          <div className="flex items-center absolute inset-5 justify-between h-fit p-2">
            <Logo className="z-10" invert={true} />
            <Link href={`/`} className="z-10 ">
              <span className="bg-[hsla(0,0%,0%,10%)] text-neutral-50 dark:text-neutral-800 text-xs rounded-full p-2 hover:bg-[hsla(0,0%,0%,30%)] transition-colors shadow-sm">
                Back to Website
              </span>
            </Link>
          </div>
        </div>
        {children}
      </div>
    </MainLayout>
  );
}
