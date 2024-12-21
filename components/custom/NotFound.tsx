import dynamic from "next/dynamic";
import Loading from "@/components/custom/Loading";
import Link from "next/link";
import Image from "next/image";

const Logo = dynamic(() => import("@/components/custom/Logo"), {
  loading: Loading,
});
const AuthSwiper = dynamic(() => import("@/components/custom/AuthSwiper"), {
  loading: Loading,
});

const MainLayout = dynamic(() => import("@/components/custom/MainLayout"), {
  loading: Loading,
});

export default async function NotFound() {
  return (
    <MainLayout>
      <div className="flex h-[90svh] lg:h-full  w-full flex-wrap">
        <div className="w-full h-full relative flex items-center justify-center">
          <Image
            src={`/assets/images/404/404.png`}
            alt="Not found page"
            fill
            className="rounded-lg object-cover filter brightness-[.2]"
            sizes="(max-width: 768px) 33vw, (max-width: 1200px) 50vw, 33vw"
            priority={true}
          />
          <div className="flex items-center absolute inset-5 justify-between h-fit p-2">
            <Logo className="z-10" invert={true} />
            <Link href={`/`} className="z-10 ">
              <span className="bg-[hsla(0,0%,0%,10%)] text-main-50 text-xs rounded-full p-2 hover:bg-[hsla(0,0%,0%,30%)] transition-colors shadow-sm">
                Back to Website
              </span>
            </Link>
          </div>

          <div className="flex flex-col gap-4 items-center justify-center rounded-2xl min-w-fit lg:w-[50%] h-[50%] z-10 p-4"
            style={{ background: "hsl(0 0% 2% /60%)" }}
          >
            <h1 className="text-[1.5rem] lg:text-4xl text-main-100 font-bold text-center">
              404 Page
            </h1>
            <p className="text-main-100 text-center ">
              This is not page you are looking for!
            </p>
            <Link
              href={`/admin`}
              className="text-main-100 hover:bg-slate-100 hover:text-main-900 p-2 rounded-md text-sm transition-colors text-center "
            >
              Take me back to <strong>Webiste</strong>
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
