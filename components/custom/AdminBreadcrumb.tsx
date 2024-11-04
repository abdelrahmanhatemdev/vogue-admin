import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { memo, ReactNode } from "react";
import Link from "next/link";
import { SidebarTrigger } from "../ui/sidebar";

interface AdminBreadcrumbProps {
  children?: ReactNode;
  page: string;
}

function AdminBreadcrumb({ children, page }: AdminBreadcrumbProps) {
  return (
      <Breadcrumb className="bg-background p-4 rounded-lg">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <SidebarTrigger />
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>|</BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/admin">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          {children && children}
          <BreadcrumbItem>
            <BreadcrumbPage>{page}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
  );
}

export default memo(AdminBreadcrumb);

