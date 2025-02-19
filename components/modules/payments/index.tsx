"use client";
import { memo } from "react";
import dynamic from "next/dynamic";
import Loading from "@/components/custom/Loading";
import useTheme from "@/hooks/useTheme";
const Heading = dynamic(() => import("@/components/custom/Heading"), {
  loading: Loading,
});
const AdminBreadcrumb = dynamic(
  () => import("@/components/custom/AdminBreadcrumb"),
  { loading: Loading }
);
const WorkingOnArea = dynamic(
  () => import("@/components/custom/WorkingOnArea"),
  { loading: Loading }
);

function Payments() {
  return (
    <div className="flex flex-col gap-4">
      <AdminBreadcrumb page="Payments" />
      <div className="flex flex-col gap-4 rounded-lg p-8 bg-background">
        <div className="flex justify-between items-center">
          <Heading
            title="Payments"
            description="Here's a list of your Payments!"
          />
        </div>

        <WorkingOnArea />
      </div>
    </div>
  );
}

export default memo(Payments);
