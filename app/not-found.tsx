import ErrorPage from "@/components/custom/ErrorPage";
import Link from "next/link";

export default async function NotFound() {
  return (
    <ErrorPage>
      <h1 className="text-[1.5rem] lg:text-4xl text-neutral-100 font-bold text-center">
        404 Page
      </h1>
      <p className="text-neutral-100 text-center ">
        This is not page you are looking for!
      </p>
      <Link
        href={`/`}
        className="text-neutral-100 hover:bg-slate-100 hover:text-neutral-900 dark:text-neutral-50 p-2 rounded-md text-sm transition-colors text-center "
      >
        Take me back to <strong>Webiste</strong>
      </Link>
    </ErrorPage>
  );
}
