import { getProducSubproducts, getProductBySlug, getProducts } from "@/actions/Product";
import dynamic from "next/dynamic";

import Loading from "@/components/custom/Loading";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { title } from "@/app/(website)/(pages)/products/page";
const Product = dynamic(() => import("@/components/modules/products/Product"), {
  loading: Loading,
});

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { slug } = await params;

  if (slug) {
    const product = await getProductBySlug(slug);

    if (product?.name) {
      return {
        title: `${title} - ${product.name}`,
      };
    }
  }
  return {
    title: "Not Found",
  };
}

export default async function ProductPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;

  const { slug } = await params;
  
  const productObj = await getProductBySlug(slug);

  if (!productObj?.id) {
    notFound();
  }

  const product = {
    id: productObj?.uuid,
    name: productObj?.name,
    slug: productObj?.slug,
  };

  const subproducts = await getProducSubproducts(slug);

  return <Product subproducts={subproducts} product={product} />;
}

export async function generateStaticParams() {
  const list: Product[] = await getProducts();

  return list?.length > 0 ? list.map(({ slug }: { slug: string }) => ({ slug })) : [];
}