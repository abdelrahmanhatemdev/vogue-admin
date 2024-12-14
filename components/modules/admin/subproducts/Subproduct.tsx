"use client";
import { memo, useMemo, useOptimistic, useState } from "react";
import type { ModalState } from "@/components/custom/Modal";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";

import dynamic from "next/dynamic";
import Loading from "@/components/custom/Loading";
import useData from "@/hooks/useData";
const Link = dynamic(() => import("next/link"), { loading: Loading });
const Heading = dynamic(() => import("@/components/custom/Heading"), {
  loading: Loading,
});
const AdminBreadcrumb = dynamic(
  () => import("@/components/custom/AdminBreadcrumb"),
  { loading: Loading }
);
const Modal = dynamic(() => import("@/components/custom/Modal"), {
  loading: Loading,
});
const EditProduct = dynamic(() => import("@/components/modules/admin/products/EditProduct"), {
  loading: Loading,
});
const DeleteProduct = dynamic(() => import("@/components/modules/admin/products/DeleteProduct"), {
  loading: Loading,
});

function Product({
  product,
  subProduct,
}: {
  product: Product;
  subProduct: Subproduct;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modal, setModal] = useState<ModalState>({
    title: "",
    description: "",
    children: <></>,
  });

  const { data: categories } = useData("categories");
  const { data: brands } = useData("brands");
  const { data: colors } = useData("colors");
  const { data: sizes } = useData("sizes");

  const [optimisicData, addOptimisticData] = useOptimistic(subProduct);

  // const sortedOptimisicData = useMemo(() => {
  //   return optimisicData?.length
  //     ? optimisicData.sort((a: SubProduct, b: SubProduct) =>
  //         b.updatedAt.localeCompare(a.updatedAt)
  //       )
  //     : [];
  // }, [optimisicData]);

 

  return (
    <div className="flex flex-col gap-4">
      <AdminBreadcrumb page="Products" />
      <div className="flex flex-col gap-4 rounded-lg p-8 bg-background">
        <div className="flex justify-between items-center">
          <Heading
            title="Products"
            description="Here's a list of your Products!"
          />
        </div>
      </div>
      <Modal
        title={modal.title}
        description={modal.description}
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
      >
        <>{modal.children}</>
      </Modal>
    </div>
  );
}

export default memo(Product);
