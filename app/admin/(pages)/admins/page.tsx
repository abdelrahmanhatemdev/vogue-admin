import dynamic from "next/dynamic";
import { getAdmins } from "@/actions/Admin";
import { Metadata } from "next";

const AdminsModule = dynamic(
  () => import("@/components/modules/admin/admins")
);

export const title = "Admins"

export const metadata: Metadata = {
  title
};

export default async function Admins() {
  const data: Admin[] = await getAdmins();
  return <AdminsModule data={data} />;
}
