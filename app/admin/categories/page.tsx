// "use cache"
import CategoriesModule from "@/components/modules/admin/categories";
import {getCategories} from "@/actions/Category"

export default async function Categories() {
  const data: Category[] = await getCategories()
  return <CategoriesModule data={data}/>

}