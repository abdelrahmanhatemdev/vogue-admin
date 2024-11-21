import { getProductBySlug } from "@/actions/Product";
import dynamic from "next/dynamic";

import Loading from "@/components/custom/Loading";
import { getSubproductById } from "@/actions/Subproduct";
const Product = dynamic(
  () => import("@/components/modules/admin/products/Product"),
  { loading: Loading }
);

export default async function ProductPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;

  const { slug } = params;

  const productRes: Product = await getProductBySlug(slug);

  const subproducts = productRes?.subproducts as Subproduct[];
  const product = {
    id: productRes?.id,
    name: productRes?.name,
    slug: productRes?.slug,
  };

  return <Product subproducts={subproducts} product={product} />;
}
