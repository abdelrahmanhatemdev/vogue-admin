import dynamic from "next/dynamic";
import { Metadata } from "next";

const CategoriesModule = dynamic(
  () => import("@/modules/categories")
);

export const title = "Categories";

export const metadata: Metadata = {
  title,
};

export default async function Categories() {
  return <CategoriesModule />;
}
