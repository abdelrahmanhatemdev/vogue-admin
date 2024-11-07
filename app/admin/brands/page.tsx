import dynamic from "next/dynamic";

const BrandsModule = dynamic(
  () => import("@/components/modules/admin/brands")
);
import { getBrands } from "@/actions/Brand";

export default async function Brands() {
  const data: Brand[] = await getBrands();
  return <BrandsModule data={data} />;
}
