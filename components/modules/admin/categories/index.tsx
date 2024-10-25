"use client";
import Heading from "@/components/custom/Heading";
import Modal from "@/components/custom/Modal";
import Row from "@/components/custom/Row";
import CategoriesList from "@/components/modules/admin/categories/CategoriesList";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import AddCategory from "@/components/modules/admin/categories/AddCategory";
import { ModalProps } from "@/components/custom/Modal";

export default function Categories({ data }: { data: Category[] }) {
  const [open, setOpen] = useState(false);
  const [modal, setModal] = useState<ModalProps>({
    title: "",
    description: "",
    children: <></>,
  });

  return (
    <div>
      <Row className="justify-between items-center">
        <Heading title="Categories" />
        <Button
          onClick={() => {
            setOpen(true);
            setModal({
              type: "add",
              title: "Add Category",
              description:
                "Add new Category here. Click Add when you'are done.",
              children: <AddCategory setOpen={setOpen} />,
            });
          }}
        >
          Add New
        </Button>
      </Row>

      <CategoriesList data={data} setOpen={setOpen} setModal={setModal} />
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
