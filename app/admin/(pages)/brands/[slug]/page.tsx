import { getBrandBySlug } from "@/actions/Brand";
import dynamic from "next/dynamic";

import Loading from "@/components/custom/Loading";
import { notFound } from "next/navigation";
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

   if (!data) {
      notFound();
    }

  return <Brand data={data} />;
}
