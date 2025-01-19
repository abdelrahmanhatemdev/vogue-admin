import dynamic from "next/dynamic";
import { getProducts } from "@/actions/Product";
import { Metadata } from "next";

const ProductsModule = dynamic(
  () => import("@/components/modules/products")
);

export const title = "Products";

export const metadata: Metadata = {
  title,
};

export default async function Products() {
  const data: Product[] = await getProducts();

  return <ProductsModule data={data} />;
}
