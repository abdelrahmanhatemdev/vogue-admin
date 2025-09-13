
import Loading from "@/components/custom/Loading";
import dynamic from "next/dynamic";
import { memo } from "react";

const AdminBreadcrumb = dynamic(
  () => import("@/components/custom/AdminBreadcrumb"),
  { loading: Loading }
);

function Category({ data }: { data: Category }) {
  return (
    <div className="flex flex-col gap-4">
      <AdminBreadcrumb page={`${data.name}`} between={[{link:"/categories", title:"Categories"}]}/>
      <div className="flex flex-col gap-4 rounded-lg md:p-8 bg-background">
        <div>ID : {data.id}</div>
        <div>Name : {data.name}</div>
        <div>Created At : {data.createdAt}</div>
        <div>Updated At : {data.updatedAt}</div>
      </div>
    </div>
  );
}

export default memo(Category)