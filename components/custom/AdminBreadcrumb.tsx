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

const ToggleThemeSwitch = dynamic(
  () => import("@/components/custom/ToggleThemeSwitch"),
  {
    loading: Loading,
  }
);

interface AdminBreadcrumbProps {
  page?: string;
  between?: {
    link: string;
    title: string;
  }[];
}

function AdminBreadcrumb({ page, between = [] }: AdminBreadcrumbProps) {
  return (
    <div className="flex justify-between items-center w-full dark:bg-neutral-800 md:dark:bg-background bg-neutral-100 md:bg-white px-4 py-2 md:p-4 rounded-lg">
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
              <Link href="/">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          {(between?.length > 0  || page) && <BreadcrumbSeparator />}
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
          {page && (
            <BreadcrumbItem>
              <BreadcrumbPage>{page}</BreadcrumbPage>
            </BreadcrumbItem>
          )}
        </BreadcrumbList>
      </Breadcrumb>
      <ToggleThemeSwitch />
    </div>
  );
}

export default memo(AdminBreadcrumb);
