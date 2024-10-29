import { getCategoryById } from "@/actions/Category";
import Category from "@/components/modules/admin/categories/Category";

export default async function CatergoryPage({params:{id}}: {params:{id:string}}) {
    const data: Category = await getCategoryById(id)
  return (
    // <>Category Page</>
    <Category data = {data}/>
  )
}