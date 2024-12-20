import { getSubproductBySku } from "@/actions/Subproduct";
import dynamic from "next/dynamic";

import Loading from "@/components/custom/Loading";
import { notFound, redirect } from "next/navigation";
import { getSubproductImages } from "@/actions/Image";
import { Metadata } from "next";
const Subproduct = dynamic(
  () => import("@/components/modules/admin/subproducts/Subproduct"),
  { loading: Loading }
);

const title = "Subproducts"
export async function generateMetadata({
  params,
}: {
  params: { sku: string };
}): Promise<Metadata> {
  const { sku } = params;

  if (sku) {
    const data = await getSubproductBySku(sku);

    if (data.subproduct.sku) {
      return {
        title: `${title} - ${data.subproduct.sku}`,
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

  if (!data?.subproduct) {
    notFound();
  }

  const { subproduct } = data;

  const imagesRes = await getSubproductImages(subproduct?.uuid);

  let images: ProductImage[] = imagesRes?.images ? imagesRes.images : [];

  return <Subproduct subproduct={subproduct} images={images} />;
}
