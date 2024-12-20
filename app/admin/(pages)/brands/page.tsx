import dynamic from "next/dynamic";
import { getBrands } from "@/actions/Brand";
import { Metadata } from "next";

const BrandsModule = dynamic(() => import("@/components/modules/admin/brands"));

export const title = "Brands"

export const metadata: Metadata = {
  title
};

export default async function Brands() {
  const data: Brand[] = await getBrands();
  return <BrandsModule data={data} />;
}
