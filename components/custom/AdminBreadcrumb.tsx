
import { memo } from "react";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import dynamic from "next/dynamic";
import Loading from "@/components/custom/Loading";

const ToggleTheme = dynamic(() => import("@/components/custom/ToggleTheme"), {
  loading: Loading,
});

interface AdminBreadcrumbProps {
  page: string;
  between?: {
    link: string;
    title: string;
  }[];
}

function AdminBreadcrumb({ page, between = [] }: AdminBreadcrumbProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center w-full bg-background p-4 rounded-lg">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem className="hidden md:block">
            <BreadcrumbLink asChild>
              <SidebarTrigger />
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="hidden md:block">
            |
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/admin">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          {between?.length > 0 ? (
            between.map((item) => (
              <span
                key={item.link}
                className="inline-flex items-center gap-1.5"
              >
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
      <ToggleTheme />
    </div>
  );
}

export default memo(AdminBreadcrumb);
