import dynamic from "next/dynamic";

const ProductsModule = dynamic(
  () => import("@/components/modules/admin/products")
);
import { getProducts } from "@/actions/Category";

export default async function Products() {
  const data: Category[] = await getProducts();
  return <ProductsModule data={data} />;
}
