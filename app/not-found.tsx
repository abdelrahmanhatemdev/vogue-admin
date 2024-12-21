import ErrorPage from "@/components/custom/ErrorPage";
import Link from "next/link";

export default async function NotFound() {
  return (
    <ErrorPage>
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
    </ErrorPage>
  );
}
