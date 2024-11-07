import dynamic from "next/dynamic";

const ColorsModule = dynamic(
  () => import("@/components/modules/admin/colors")
);
import { getColors } from "@/actions/Color";

export default async function Colors() {
  const data: Color[] = await getColors();
  return <ColorsModule data={data} />;
}
