import dynamic from "next/dynamic";

import Loading from "@/components/custom/Loading"
const AdminBreadcrumb= dynamic(() => import("@/components/custom/AdminBreadcrumb"), {loading: Loading});
const AddUser= dynamic(() => import("@/components/modules/admin/users/AddUser"), {loading: Loading});
export default function Users() {
  return (
    <>
      <AdminBreadcrumb page="Users" />
      <AddUser />
    </>
  );
}
