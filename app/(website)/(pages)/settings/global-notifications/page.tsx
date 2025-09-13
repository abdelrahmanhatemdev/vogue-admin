import dynamic from "next/dynamic";
import { Metadata } from "next";
import { title } from "@/app/(website)/(pages)/settings/layout";
import { getGlobalNotification } from "@/actions/GlobalNotification";
import Loading from "@/components/custom/Loading";
const GlobalNotification = dynamic(
  () => import("@/modules/settings/globalNotifications"),
  {
    loading: Loading,
  }
);

export const SubTitle = "Global Notification";

export const metadata: Metadata = {
  title: `${title} - ${SubTitle}`,
};

export default async function Settings() {
  const data: GlobalNotification[] = await getGlobalNotification();
  return <GlobalNotification data={data} />;
}
