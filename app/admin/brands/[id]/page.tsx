import { getBrandById } from "@/actions/Brand";
import dynamic from "next/dynamic";

import Loading from "@/components/custom/Loading";
const Brand = dynamic(
  () => import("@/components/modules/admin/brands/Brand"),
  { loading: Loading }
);

export default async function BrandPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;

  const { id } = params;

  const data: Brand = await getBrandById(id);
  return <Brand data={data} />;
}
