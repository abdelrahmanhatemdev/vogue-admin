import { getSizeById } from "@/actions/Size";
import dynamic from "next/dynamic";

import Loading from "@/components/custom/Loading";
const Size = dynamic(
  () => import("@/components/modules/admin/sizes/Size"),
  { loading: Loading }
);

export default async function SizePage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;

  const { id } = params;

  const data: Size = await getSizeById(id);
  return <Size data={data} />;
}
