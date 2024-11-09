import { getProductBySlug } from "@/actions/Product";
import dynamic from "next/dynamic";

import Loading from "@/components/custom/Loading";
const Product = dynamic(
  () => import("@/components/modules/admin/products/Product"),
  { loading: Loading }
);

export default async function CatergoryPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;

  const { slug } = params;

  const data: Product = await getProductBySlug(slug);
  return <Product data={data} />;
}
