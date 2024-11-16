import dynamic from "next/dynamic";
const HomeModule = dynamic(
    () => import("@/components/modules/website")
  );

export default function Home() {
  return (
    <HomeModule/>
  );
}
