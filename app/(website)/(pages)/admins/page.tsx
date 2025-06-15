import dynamic from "next/dynamic";
import { Metadata } from "next";

const AdminsModule = dynamic(
  () => import("@/components/modules/admins")
);

export const title = "Admins"

export const metadata: Metadata = {
  title
};

export default async function Admins() {
  return <AdminsModule/>;
}
