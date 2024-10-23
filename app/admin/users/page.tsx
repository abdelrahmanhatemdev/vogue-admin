import AdminBreadcrumb from "@/components/custom/AdminBreadcrumb";
import AddUser from "@/components/modules/admin/users/AddUser";

export default function Users() {
  return (
    <>
      <AdminBreadcrumb page="Users" />
      <AddUser />
    </>
  );
}
