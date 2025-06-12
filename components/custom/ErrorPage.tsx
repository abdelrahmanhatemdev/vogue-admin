import Logo from "@/components/custom/Logo";
import Link from "next/link";

export default function ErrorPage({
  heading,
  description,
}: {
  heading: string;
  description: string;
}) {
  return (
    <div className="w-full h-[100svh] p-5 flex flex-col gap-10 items-stretch">
      <div className="flex items-center justify-between h-fit flex-wrap p-5">
        <Logo className="z-10" />
        <Link href={`/`} className="z-10 ">
          <span className="bg-black/10 text-neutral-50  text-xs rounded-md p-2 hover:bg-black/50 transition-colors shadow-sm">
            Back to Website
          </span>
        </Link>
      </div>
      <div className="flex flex-col items-center justify-between grow bg-black/10 text-neutral-50  text-xs rounded-md p-5 transition-colors shadow-sm  min-h-64">
        <div className="flex flex-col gap-4 items-center justify-center rounded-2xl min-w-fit w-full z-10 p-4 grow bg-black/50 text-center">
          <p className="text-xl font-bold">{heading}</p>
          <p className="text-lg text-red-600">{description}</p>
        </div>
      </div>
    </div>
  );
}
