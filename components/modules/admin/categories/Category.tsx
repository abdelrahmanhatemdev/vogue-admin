import AdminBreadcrumb from "@/components/custom/AdminBreadcrumb";
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";

export default function Category({ data }: { data: Category }) {
  return (
    <div>
      <AdminBreadcrumb page={`${data.name}`}>
        <BreadcrumbItem>
          <BreadcrumbLink>
            <Link href="/admin/categories">Categories</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
      </AdminBreadcrumb>
      <div>ID : {data.id}</div>
      <div>Name : {data.name}</div>
      <div>Created At : {data.createdAt}</div>
      <div>Updated At : {data.updatedAt}</div>
    </div>
  );
}
