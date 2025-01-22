import dynamic from "next/dynamic";
import { Metadata } from "next";
import { title } from "@/app/(website)/(pages)/settings/layout";
import { getSetting } from "@/actions/Setting";
import Loading from "@/components/custom/Loading";
const Setting = dynamic(
  () => import("@/components/modules/settings/settings"),
  {
    loading: Loading,
  }
);

export const SubTitle = "Social Media";

export const metadata: Metadata = {
  title: `${title} - ${SubTitle}`,
};

export default async function Settings() {
  const data: Setting[] = await getSetting();
  return <Setting data={data} />;
}
