import dynamic from "next/dynamic";
import { getCategories } from "@/actions/Category";
import { Metadata } from "next";

const CategoriesModule = dynamic(
  () => import("@/components/modules/admin/categories")
);

export const title = "Categories"

export const metadata: Metadata = {
  title
};

export default async function Categories() {
  const data: Category[] = await getCategories();
  return <CategoriesModule data={data} />;
}
