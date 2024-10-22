import AdminBreadcrumb from "@/components/custom/AdminBreadcrumb";
import ContentContainer from "@/components/custom/ContentContainer";
import AddUser from "@/components/modules/admin/users/AddUser";

export default function Users() {
  return (
    <ContentContainer>
      <AdminBreadcrumb page="Users" />
      <AddUser />
    </ContentContainer>
  );
}
