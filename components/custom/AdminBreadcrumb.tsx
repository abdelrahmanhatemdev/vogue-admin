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
  page: string;
  between?: {
    link: string;
    title: string;
  }[];
}

function AdminBreadcrumb({ page, between = [] }: AdminBreadcrumbProps) {
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
        {between?.length > 0 ? (
          between.map((item) => (
            <span key={item.link} className="inline-flex items-center gap-1.5">
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href={`${item.link}`}>{item.title}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </span>
          ))
        ) : (
          <></>
        )}
        <BreadcrumbItem>
          <BreadcrumbPage>{page}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export default memo(AdminBreadcrumb);
