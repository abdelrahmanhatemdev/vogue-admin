import dynamic from "next/dynamic";
import { Metadata } from "next";
import {title} from "@/app/(website)/(pages)/settings/layout"
import { getSocialMedia } from "@/actions/SocialMedia";
const SocialMedia = dynamic(
  () => import("@/components/modules/settings/socialMedia/SocialMedia")
);

export const SubTitle = "Social Media"

export const metadata: Metadata = {
  title: `${title} - ${SubTitle}`
};

export default async function Settings() {
  const data: SocialMedia[] = await getSocialMedia();
  return <SocialMedia data = {data}/>;
}
