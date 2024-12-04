import dynamic from "next/dynamic";

const CategoriesModule = dynamic(
  () => import("@/components/modules/admin/categories")
);
import { getCategories } from "@/actions/Category";

export default async function Categories() {
  const data: Category[] = await getCategories();
  return <CategoriesModule data={data} />;
}
