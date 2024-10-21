import AdminBreadcrumb from "@/components/custom/AdminBreadcrumb";
import ContentContainer from "@/components/custom/ContentContainer";
import Link from "next/link";

export default function Users() {
  return (
    <ContentContainer>
      <AdminBreadcrumb page="Users"/>
    </ContentContainer>
  )
}