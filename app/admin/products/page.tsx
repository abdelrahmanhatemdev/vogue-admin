import dynamic from "next/dynamic";

const ProductsModule = dynamic(
  () => import("@/components/modules/admin/products")
);
import { getProducts } from "@/actions/Product";

export default async function Products() {
  const data: Product[] = await getProducts();

  return (
    <ProductsModule
      data={data}
    />
  );
}
