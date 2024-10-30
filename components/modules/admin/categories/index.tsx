"use client";
import Heading from "@/components/custom/Heading";
import Modal from "@/components/custom/Modal";
import Row from "@/components/custom/Row";
import CategoriesList from "@/components/modules/admin/categories/CategoriesList";
import { Button } from "@/components/ui/button";
import { useOptimistic, useState } from "react";
import AddCategory from "@/components/modules/admin/categories/AddCategory";
import { ModalProps } from "@/components/custom/Modal";
import NoResults from "@/components/custom/NoResults";
import AdminBreadcrumb from "@/components/custom/AdminBreadcrumb";

export default function Categories({ data }: { data: Category[] }) {
  const [optimisicData, addOptimisticData] = useOptimistic(data)
  const [open, setOpen] = useState(false);
  const [modal, setModal] = useState<ModalProps>({
    title: "",
    description: "",
    children: <></>,
  });

  const sortedOptimisicData = optimisicData?.length 
  ? optimisicData.sort((a:Category, b:Category) => b.updatedAt.localeCompare(a.updatedAt))
  : []

  return (
    <div>
      <AdminBreadcrumb page="Categories" />
      <Row className="justify-between items-center">
        <Heading title="Categories" />
        <Button
          onClick={() => {
            setOpen(true);
            setModal({
              title: "Add Category",
              description:
                "Add new Category here. Click Add when you'are done.",
              children: <AddCategory setOpen={setOpen} addOptimisticData={addOptimisticData} />,
            });
          }}
        >
          Add New
        </Button>
      </Row>

      {
        data?.length
        ?<CategoriesList 
        data={sortedOptimisicData} 
        setOpen={setOpen} 
        setModal={setModal} 
        addOptimisticData={addOptimisticData}
        />
        :<NoResults/>
      }
      
      <Modal
        title={modal.title}
        description={modal.description}
        open={open}
        setOpen={setOpen}
      >
        <>{modal.children}</>
      </Modal>
    </div>
  );
}
