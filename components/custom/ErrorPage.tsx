import dynamic from "next/dynamic";
import Loading from "@/components/custom/Loading";
import Link from "next/link";
import Image from "next/image";
import { memo, ReactNode } from "react";

const Logo = dynamic(() => import("@/components/custom/Logo"), {
  loading: Loading,
});

const MainLayout = dynamic(() => import("@/components/custom/MainLayout"), {
  loading: Loading,
});

async function ErrorPage({children}: {children: ReactNode}) {
  return (
    <MainLayout>
      <div className="flex h-[90svh] lg:h-full  w-full flex-wrap">
        <div className="w-full h-full relative flex items-center justify-center">
          <Image
            src={`/assets/images/404/404.png`}
            alt="Not found page"
            fill
            className="rounded-lg object-cover filter brightness-[.7]"
            sizes="(max-width: 768px) 33vw, (max-width: 1200px) 50vw, 33vw"
            priority={true}
          />
          <div className="flex items-center absolute inset-5 justify-between h-fit p-2">
            <Logo className="z-10" invert={true} />
            <Link href={`/`} className="z-10 ">
              <span className="bg-[hsla(0,0%,0%,10%)] text-neutral-50 text-xs rounded-full p-2 hover:bg-[hsla(0,0%,0%,30%)] transition-colors shadow-sm">
                Back to Website
              </span>
            </Link>
          </div>

          <div className="flex flex-col gap-4 items-center justify-center rounded-2xl min-w-fit lg:w-[50%] h-[50%] z-10 p-4"
            style={{ background: "hsl(0 0% 2% /60%)" }}
          >
            {children}
            
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default memo(ErrorPage)