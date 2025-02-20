"use client";
import { memo } from "react";
import dynamic from "next/dynamic";
import Loading from "@/components/custom/Loading";
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
function Orders() {
  return (
    <div className="flex flex-col gap-4">
      <AdminBreadcrumb page="Orders" />
      <div className="flex flex-col gap-4 rounded-lg p-8 bg-background">
        <div className="flex justify-between items-center">
          <Heading title="Orders" description="Here's a list of your Orders!" />
        </div>
        <WorkingOnArea />
      </div>
    </div>
  );
}

export default memo(Orders);
