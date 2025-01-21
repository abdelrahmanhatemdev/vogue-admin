import dynamic from "next/dynamic";
import { Metadata } from "next";
import { title } from "@/app/(website)/(pages)/settings/layout";
import { getCurrency } from "@/actions/Currency";
import Loading from "@/components/custom/Loading";
const Currency = dynamic(
  () => import("@/components/modules/settings/currencies"),
  {
    loading: Loading,
  }
);

export const SubTitle = "Social Media";

export const metadata: Metadata = {
  title: `${title} - ${SubTitle}`,
};

export default async function Settings() {
  const data: Currency[] = await getCurrency();
  return <Currency data={data} />;
}
