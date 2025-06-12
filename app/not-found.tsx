import ErrorPage from "@/components/custom/ErrorPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 Page",
};

export default function NotFound() {
  return <ErrorPage heading="404" description="Not Found!" />;
}
