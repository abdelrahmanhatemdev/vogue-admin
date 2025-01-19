import dynamic from "next/dynamic";
import { getSizes } from "@/actions/Size";
import { Metadata } from "next";

const SizesModule = dynamic(() => import("@/components/modules/sizes"));

export const title = "Sizes";

export const metadata: Metadata = {
  title,
};

export default async function Sizes() {
  const data: Size[] = await getSizes();
  return <SizesModule data={data} />;
}
