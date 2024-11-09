import { getCategoryBySlug } from "@/actions/Category";
import dynamic from "next/dynamic";

import Loading from "@/components/custom/Loading";
const Category = dynamic(
  () => import("@/components/modules/admin/categories/Category"),
  { loading: Loading }
);

export default async function CatergoryPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;

  const { slug } = params;

  const data: Category = await getCategoryBySlug(slug);
  return <Category data={data} />;
}
