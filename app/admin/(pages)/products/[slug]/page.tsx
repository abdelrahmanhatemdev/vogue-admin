import { getProductBySlug } from "@/actions/Product";
import dynamic from "next/dynamic";

import Loading from "@/components/custom/Loading";
import { notFound, redirect } from "next/navigation";
const Product = dynamic(
  () => import("@/components/modules/admin/products/Product"),
  { loading: Loading }
);

export default async function ProductPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;

  const { slug } = params;
  const data = await getProductBySlug(slug);

  if (!data?.product) {
    notFound()
  }
  const { product: productObj, subproducts } = data;
  const product = {
    id: productObj?.uuid,
    name: productObj?.name,
    slug: productObj?.slug,
  };

  return <Product subproducts={subproducts} product={product} />;
}
