import { getProductBySlug } from "@/actions/Product";
import dynamic from "next/dynamic";

import Loading from "@/components/custom/Loading";
const Product = dynamic(
  () => import("@/components/modules/admin/products/Product"),
  { loading: Loading }
);

export default async function ProductPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;

  const { slug } = params;

  const product: Product = await getProductBySlug(slug);
  const subProducts = product?.subProducts ? product?.subProducts : []
  return <Product subProducts={subProducts} product={product} />;
}
