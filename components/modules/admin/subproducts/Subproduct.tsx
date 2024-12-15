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
const EditProduct = dynamic(
  () => import("@/components/modules/admin/products/EditProduct"),
  {
    loading: Loading,
  }
);
const DeleteProduct = dynamic(
  () => import("@/components/modules/admin/products/DeleteProduct"),
  {
    loading: Loading,
  }
);

type SubproductPageType = Subproduct & {
  product_slug: string;
  product_name: string;
};

function Subproduct({ subproduct }: { subproduct: SubproductPageType }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modal, setModal] = useState<ModalState>({
    title: "",
    description: "",
    children: <></>,
  });

  // const { data: categories } = useData("categories");
  // const { data: brands } = useData("brands");
  // const { data: colors } = useData("colors");
  // const { data: sizes } = useData("sizes");

  // const [optimisicData, addOptimisticData] = useOptimistic(subproduct);

  // const sortedOptimisicData = useMemo(() => {
  //   return optimisicData?.length
  //     ? optimisicData.sort((a: SubProduct, b: SubProduct) =>
  //         b.updatedAt.localeCompare(a.updatedAt)
  //       )
  //     : [];
  // }, [optimisicData]);

  return (
    <div className="flex flex-col gap-4">
      <AdminBreadcrumb page={`${subproduct.sku}`} between={[{link:`/admin/products/${subproduct.product_slug}`, title:`${subproduct.product_name}`}]}/>
      <div className="flex flex-col gap-4 rounded-lg p-8 bg-background">
        <div className="flex justify-between items-center">
          <Heading
            title={`${subproduct.sku}`}
            description="Here's details of your subproduct!"
          />
        </div>
      </div>
      <p>sku: {subproduct.sku}</p>
      <p>product: {subproduct.product_name}</p>
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

export default memo(Subproduct);
