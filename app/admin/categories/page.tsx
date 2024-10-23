import Heading from "@/components/custom/Heading";
import Row from "@/components/custom/Row";
import AddCategory from "@/components/modules/admin/categories/AddCategory";

export default function Categories() {
  return (
    <div>
        <Row className="justify-between items-center">
            <Heading title="Categories"/>
            <AddCategory/>
        </Row>
    </div>
  )
}