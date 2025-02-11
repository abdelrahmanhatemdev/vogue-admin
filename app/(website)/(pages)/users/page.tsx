import dynamic from "next/dynamic";
import { Metadata } from "next";
import Loading from "@/components/custom/Loading";

const AdminBreadcrumb = dynamic(
  () => import("@/components/custom/AdminBreadcrumb"),
  { loading: Loading }
);
const UsersModule = dynamic(
  () => import("@/components/modules/users"),
  { loading: Loading }
);

export const title = "Users";

export const metadata: Metadata = {
  title
};

export default function Users() {
  return (
    <>
      <UsersModule />
    </>
  );
}
