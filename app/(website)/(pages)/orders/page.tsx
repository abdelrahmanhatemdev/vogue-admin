import dynamic from "next/dynamic";
import { Metadata } from "next";
import Loading from "@/components/custom/Loading";

const OrdersModule = dynamic(
  () => import("@/components/modules/orders"),
  { loading: Loading }
);

export const title = "Orders";

export const metadata: Metadata = {
  title
};

export default function Orders() {
  return (
    <>
      <OrdersModule />
    </>
  );
}
