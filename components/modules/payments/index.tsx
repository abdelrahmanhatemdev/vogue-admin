"use client";
import { memo } from "react";
import dynamic from "next/dynamic";
import Loading from "@/components/custom/Loading";
import Image from "next/image";
import useTheme from "@/hooks/useTheme";
const Heading = dynamic(() => import("@/components/custom/Heading"), {
  loading: Loading,
});
const AdminBreadcrumb = dynamic(
  () => import("@/components/custom/AdminBreadcrumb"),
  { loading: Loading }
);

function Payments() {
  const { theme } = useTheme();

  const isLight = theme ? (theme === "light" ? true : false) : false;

  return (
    <div className="flex flex-col gap-4">
      <AdminBreadcrumb page="Payments" />
      <div className="flex flex-col gap-4 rounded-lg p-8 bg-background">
        <div className="flex justify-between items-center">
          <Heading title="Payments" description="Here's a list of your Payments!" />
        </div>

        <div className="flex flex-col gap-4 justify-center items-center border border-dashed rounded-lg p-4 lg:mx-20 lg:p-10">
          <div className="border border-dashed rounded-md">
            <Image
              src={`/assets/images/working-on${isLight ? "-light" : ""}.png`}
              alt="Working ON"
              className="rounded-lg"
              sizes="(max-width: 768px) 80vw, (max-width: 1200px) 50vw, 33vw"
              priority={true}
              width={400}
              height={200}
            />
          </div>
          <h2>Working On Area</h2>
        </div>
      </div>
    </div>
  );
}

export default memo(Payments);
