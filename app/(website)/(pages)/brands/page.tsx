import dynamic from "next/dynamic";
import { Metadata } from "next";

const BrandsModule = dynamic(() => import("@/components/modules/brands"));

export const title = "Brands"

export const metadata: Metadata = {
  title
};

export default async function Brands() {
  return <BrandsModule />;
}
