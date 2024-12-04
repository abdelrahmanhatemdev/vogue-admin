import dynamic from "next/dynamic";

const SizesModule = dynamic(
  () => import("@/components/modules/admin/sizes")
);
import { getSizes } from "@/actions/Size";

export default async function Sizes() {
  const data: Size[] = await getSizes();
  return <SizesModule data={data} />;
}
