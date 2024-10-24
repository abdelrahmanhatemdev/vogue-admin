import Heading from "@/components/custom/Heading";
import Row from "@/components/custom/Row";
import AddCategory from "@/components/modules/admin/categories/AddCategory";
import CategoriesList from "@/components/modules/admin/categories/CategoriesList";
import getCategories from "@/actions/Category"

export default async function Categories() {
  const data: Category[] = await getCategories()
  return (
    <div>
        <Row className="justify-between items-center">
            <Heading title="Categories"/>
            <AddCategory/>
        </Row>
        
        <CategoriesList data={data}/>
    </div>
  )
}