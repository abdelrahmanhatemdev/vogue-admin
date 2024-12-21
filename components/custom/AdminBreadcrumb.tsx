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
import { Button } from "../ui/button";
import useTheme from "@/hooks/useTheme";

interface AdminBreadcrumbProps {
  page: string;
  between?: {
    link: string;
    title: string;
  }[];
}

function AdminBreadcrumb({ page, between = [] }: AdminBreadcrumbProps) {
  const {theme, toggleTheme} = useTheme()
  return (
    <div className="flex flex-col md:flex-row justify-between items-center w-full bg-background p-4 rounded-lg">
      <Breadcrumb className="">
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
      <Button onClick={toggleTheme}>
        {theme}
      </Button>
    </div>
  );
}

export default memo(AdminBreadcrumb);
