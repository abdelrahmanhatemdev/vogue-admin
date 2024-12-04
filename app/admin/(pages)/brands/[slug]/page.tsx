import { getBrandBySlug } from "@/actions/Brand";
import dynamic from "next/dynamic";

import Loading from "@/components/custom/Loading";
const Brand = dynamic(
  () => import("@/components/modules/admin/brands/Brand"),
  { loading: Loading }
);

export default async function CatergoryPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;

  const { slug } = params;

  const data: Brand = await getBrandBySlug(slug);
  return <Brand data={data} />;
}
