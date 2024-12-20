import { getSubproductBySku } from "@/actions/Subproduct";
import dynamic from "next/dynamic";

import Loading from "@/components/custom/Loading";
import { notFound } from "next/navigation";
import { getSubproductImages } from "@/actions/Image";
import { Metadata } from "next";
const Subproduct = dynamic(
  () => import("@/components/modules/admin/subproducts/Subproduct"),
  { loading: Loading }
);

const title = "Subproducts";

export async function generateMetadata({
  params,
}: {
  params: { sku: string };
}): Promise<Metadata> {
  const { sku } = params;

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
  params: Promise<{ sku: string }>;
}) {
  const params = await props.params;

  const { sku } = params;
  const data = await getSubproductBySku(sku);

  if (!data?.uuid) {
    notFound();
  }

  const imagesRes = await getSubproductImages(data?.uuid);

  let images: ProductImage[] = imagesRes?.images ? imagesRes.images : [];

  return <Subproduct subproduct={data} images={images} />;
}
