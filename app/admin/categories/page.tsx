import Heading from "@/components/custom/Heading";
import Row from "@/components/custom/Row";
import CategoriesModule from "@/components/modules/admin/categories";
import CategoriesList from "@/components/modules/admin/categories/CategoriesList";
import getCategories from "@/actions/Category"

export default async function Categories() {
  const data: Category[] = await getCategories()
  return <CategoriesModule data={data}/>

}