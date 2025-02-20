import dynamic from "next/dynamic";
import { Metadata } from "next";

const SizesModule = dynamic(() => import("@/components/modules/sizes"));

export const title = "Sizes";

export const metadata: Metadata = {
  title,
};

export default async function Sizes() {
  return <SizesModule />;
}
