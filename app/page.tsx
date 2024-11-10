import dynamic from "next/dynamic";
const HomeModule = dynamic(
    () => import("@/components/modules/home")
  );

export default function Home() {
  return (
    <HomeModule/>
  );
}
