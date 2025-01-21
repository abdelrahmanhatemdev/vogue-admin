import dynamic from "next/dynamic";
import { Metadata } from "next";
import {title} from "@/app/(website)/(pages)/settings/layout"
import { getGlobalNotification } from "@/actions/GlobalNotification";
const GlobalNotification = dynamic(
  () => import("@/components/modules/settings/globalNotifications")
);

export const SubTitle = "Global Notification"

export const metadata: Metadata = {
  title: `${title} - ${SubTitle}`
};

export default async function Settings() {
  const data: GlobalNotification[] = await getGlobalNotification();
  return <GlobalNotification data = {data}/>;
}
