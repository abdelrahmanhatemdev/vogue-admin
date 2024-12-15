import { getSubproductBySku } from "@/actions/Subproduct";
import dynamic from "next/dynamic";

import Loading from "@/components/custom/Loading";
import { notFound, redirect } from "next/navigation";
const Subproduct = dynamic(
  () => import("@/components/modules/admin/subproducts/Subproduct"),
  { loading: Loading }
);

export default async function SubproductPage(props: {
  params: Promise<{ sku: string }>;
}) {
  const params = await props.params;

  const { sku } = params;
  const data = await getSubproductBySku(sku);

  console.log("data", data);
  

  if (!data?.subproduct) {
    notFound();
  }

  const { subproduct } = data;

  return <Subproduct subproduct={subproduct} />;
}
