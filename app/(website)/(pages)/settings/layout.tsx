import { Metadata } from "next";
import AdminBreadcrumb from "@/components/custom/AdminBreadcrumb";
import SettingsSidebar from "@/components/modules/settings/SettingsSidebar";
import { ReactNode } from "react";

export const title = "Settings";

export const metadata: Metadata = {
  title,
};

export default async function Settings({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <div className="flex flex-col gap-4">
      <AdminBreadcrumb page="Settings" />
      <div className="flex flex-col gap-4 rounded-lg md:p-8 bg-background">
        <div className="grid grid-cols-1 lg:grid-cols-[30%_70%] gap-4">
          <SettingsSidebar />
          <div className="px-4">{children}</div>
        </div>
      </div>
    </div>
  );
}
