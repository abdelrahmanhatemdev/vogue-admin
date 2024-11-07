import { getCategoryById } from "@/actions/Category";
import dynamic from "next/dynamic";

import Loading from "@/components/custom/Loading";
const Category = dynamic(
  () => import("@/components/modules/admin/categories/Category"),
  { loading: Loading }
);

export default async function CatergoryPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;

  const { id } = params;

  const data: Category = await getCategoryById(id);
  return <Category data={data} />;
}
