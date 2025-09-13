import dynamic from "next/dynamic";
import { Metadata } from "next";

const LabelsModule = dynamic(
  () => import("@/modules/labels")
);

export const title = "Labels"

export const metadata: Metadata = {
  title
};

export default async function Labels() {
  return <LabelsModule />;
}
