
import Loading from "@/components/custom/Loading";
import dynamic from "next/dynamic";
import { memo } from "react";
const AdminBreadcrumb = dynamic(
  () => import("@/components/custom/AdminBreadcrumb"),
  { loading: Loading }
);
function Brand({ data }: { data: Brand }) {
  return data?.id ? (
    <div className="flex flex-col gap-4">
      <AdminBreadcrumb
        page={`${data.name}`}
        between={[{ link: "/admin/brands", title: "Brands" }]}
      />
      <div className="flex flex-col gap-4 rounded-lg p-8 bg-background">
        <div>ID : {data.id}</div>
        <div>Name : {data.name}</div>
        <div>Slug : {data.slug}</div>
        <div>Created At : {data.createdAt}</div>
        <div>Updated At : {data.updatedAt}</div>
      </div>
    </div>
  ) : (
    <></>
  );
}

export default memo(Brand);
