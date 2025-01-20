import dynamic from "next/dynamic";
// import { getSettings } from "@/actions/Admin";
import { Metadata } from "next";
import AdminBreadcrumb from "@/components/custom/AdminBreadcrumb";
import Heading from "@/components/custom/Heading";
import SettingsSidebar from "@/components/modules/settings/SettingsSidebar";
import { ReactNode } from "react";

const SettingsModule = dynamic(() => import("@/components/modules/settings/socialMedia/SocialMedia"));

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
      <div className="flex flex-col gap-4 rounded-lg p-8 bg-background">
        <div className="flex justify-between items-center">
          <Heading
            title="Settings"
            description="Manage your account settings and info!"
          />
        </div>
        <div className="grid lg:grid-cols-[30%_70%] gap-4">
          <SettingsSidebar />
          <div className="px-4">{children}</div>
        </div>
      </div>
    </div>
  );
}
