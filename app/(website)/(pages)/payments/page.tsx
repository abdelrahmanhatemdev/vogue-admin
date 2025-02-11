import dynamic from "next/dynamic";
import { Metadata } from "next";
import Loading from "@/components/custom/Loading";

const AdminBreadcrumb = dynamic(
  () => import("@/components/custom/AdminBreadcrumb"),
  { loading: Loading }
);
const PaymentsModule = dynamic(
  () => import("@/components/modules/payments"),
  { loading: Loading }
);

export const title = "Payments";

export const metadata: Metadata = {
  title
};

export default function Payments() {
  return (
    <>
      <PaymentsModule />
    </>
  );
}
