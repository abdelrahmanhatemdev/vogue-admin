import dynamic from "next/dynamic";
import { getProducSubproducts, getProducts } from "@/actions/Product";
import { Metadata } from "next";

const ProductsModule = dynamic(() => import("@/components/modules/products"));

export const title = "Products";

export const metadata: Metadata = {
  title,
};

export default async function Products() {
  const data: Product[] = await getProducts();

  const products = await Promise.all(
    data.map(async (product) => {
      const subProducts: Subproduct[] = await getProducSubproducts(
        product.slug
      );

      return { ...product, subproducts: subProducts.length } as Product;
    })
  );

  return <ProductsModule data={products} />;
}
