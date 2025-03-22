import { getSubproductBySku } from "@/actions/Subproduct";
import dynamic from "next/dynamic";

import Loading from "@/components/custom/Loading";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getProductById } from "@/actions/Product";
import { getSubproductImages } from "@/actions/Image";
const Subproduct = dynamic(
  () => import("@/components/modules/subproducts/Subproduct"),
  { loading: Loading }
);

const title = "Subproducts";

export async function generateMetadata({
  params,
}: {
  params: { sku: string };
}): Promise<Metadata> {
  const { sku } = await params;

  if (sku) {
    const data = await getSubproductBySku(sku);

    if (data?.sku) {
      return {
        title: `${title} - ${data.sku}`,
      };
    }
  }
  return {
    title: "Not Found",
  };
}

export default async function SubproductPage(props: {
  params: Promise<{ sku: string}>;
}) {
  const params = await props.params;

  const { sku } = await params;
  const subproduct = await getSubproductBySku(sku);

  console.log("sub", subproduct);
  

  if (!subproduct?.uuid) {
    notFound();
  }

  const productObj = await getProductById(subproduct.productId);

  const product = {
    id: productObj?.uuid,
    name: productObj?.name,
    slug: productObj?.slug,
  };

  const images = await getSubproductImages(subproduct.uuid)

  return <Subproduct subproduct={subproduct} product={product} images= {images}/>;
}
