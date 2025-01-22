import dynamic from "next/dynamic";
import { Metadata } from "next";
import { title } from "@/app/(website)/(pages)/settings/layout";
import Loading from "@/components/custom/Loading";
const Appearence = dynamic(
  () => import("@/components/modules/settings/appearence"),
  {
    loading: Loading,
  }
);

export const SubTitle = "Appearence";

export const metadata: Metadata = {
  title: `${title} - ${SubTitle}`,
};

export default async function Appearences() {
  return <Appearence/>;
}
