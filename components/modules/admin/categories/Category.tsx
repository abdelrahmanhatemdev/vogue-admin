import AdminBreadcrumb from "@/components/custom/AdminBreadcrumb";
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { memo } from "react";

function Category({ data }: { data: Category }) {
  return (
    <div className="flex flex-col gap-4">
      <AdminBreadcrumb page={`${data.name}`} between={[{link:"/admin/categories", title:"Categories"}]}/>
      <div className="flex flex-col gap-4 rounded-lg p-8 bg-background">
        <div>ID : {data.id}</div>
        <div>Name : {data.name}</div>
        <div>Created At : {data.createdAt}</div>
        <div>Updated At : {data.updatedAt}</div>
      </div>
    </div>
  );
}

export default memo(Category)