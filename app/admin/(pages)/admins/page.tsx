import dynamic from "next/dynamic";

const AdminsModule = dynamic(
  () => import("@/components/modules/admin/Admins")
);
import { getAdmins } from "@/actions/Admin";

export default async function Admins() {
  const data: Admin[] = await getAdmins();
  return <AdminsModule data={data} />;
}
