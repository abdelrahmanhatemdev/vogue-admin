import AdminBreadcrumb from "@/components/custom/AdminBreadcrumb";
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { memo } from "react";

function Color({ data }: { data: Color }) {
  return (
    <div className="flex flex-col gap-4">
      <AdminBreadcrumb page={`${data.hex}`}>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/admin/Colors">Colors</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
      </AdminBreadcrumb>
      <div className="flex flex-col gap-4 rounded-lg p-8 bg-background">
        <div>ID : {data.id}</div>
        <div>Hex Code : {data.hex}</div>
        <div>Created At : {data.createdAt}</div>
        <div>Updated At : {data.updatedAt}</div>
      </div>
    </div>
  );
}

export default memo(Color)