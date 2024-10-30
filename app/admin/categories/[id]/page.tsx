import { getCategoryById } from "@/actions/Category";
import Category from "@/components/modules/admin/categories/Category";

export default async function CatergoryPage(props: {params: Promise<{id:string}>}) {
  const params = await props.params;

  const {
    id
  } = params;

  const data: Category = await getCategoryById(id)
  return (
    <Category data = {data}/>
  )
}