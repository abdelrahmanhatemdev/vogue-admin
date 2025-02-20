import dynamic from "next/dynamic";
import { Metadata } from "next";

const ColorsModule = dynamic(
  () => import("@/components/modules/colors")
);

export const title = "Colors"

export const metadata: Metadata = {
  title
};

export default async function Colors() {
  return <ColorsModule/>;
}
