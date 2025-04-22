"use client";
import { memo, useState } from "react";
import type { ModalState } from "@/components/custom/Modal";
import dynamic from "next/dynamic";
import Loading from "@/components/custom/Loading";
import BaseButton from "@/components/custom/buttons/BaseButton";

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
const EditSubproduct = dynamic(
  () => import("@/components/modules/subproducts/EditSubproduct"),
  {
    loading: Loading,
  }
);
const DeleteSubproduct = dynamic(
  () => import("@/components/modules/subproducts/DeleteSubproduct"),
  {
    loading: Loading,
  }
);
const PaymentChart = dynamic(
  () => import("@/components/modules/dashboard/PaymentChart"),
  { loading: Loading }
);

const GoalCalender = dynamic(
  () => import("@/components/modules/dashboard/GoalCalender"),
  {
    loading: Loading,
  }
);
const DetailsSquares = dynamic(
  () => import("@/components/modules/subproducts/subproduct/DetailsSquares"),
  { loading: Loading }
);

const ColorsChart = dynamic(
  () => import("@/components/modules/subproducts/subproduct/ColorsChart"),
  { loading: Loading }
);

const ColorsAndSizes = dynamic(
  () => import("@/components/modules/subproducts/subproduct/ColorsAndSizes"),
  { loading: Loading }
);

const SubproductImages = dynamic(
  () => import("@/components/modules/subproducts/subproduct/SubproductImages"),
  { loading: Loading }
);

export type OptimisicImagesType = ProductImage & { isPending?: boolean };

function Subproduct({
  subproduct,
  product,
  images,
}: {
  subproduct: Subproduct;
  product: Partial<Product>;
  images: ProductImage[];
}) {
  const {
    id,
    uuid,
    sku,
    currency,
    price,
    discount,
    qty,
    sold,
    featured,
    inStock,
    colors,
    sizes,
    isProtected,
  } = subproduct;

  const { name: productName, slug: product_slug } = product;

  const [modalOpen, setModalOpen] = useState(false);
  const [modal, setModal] = useState<ModalState>({
    title: "",
    description: "",
    children: <></>,
  });

  const [productSlug] = useState(product_slug);

  return (
    <div className="flex flex-col gap-4">
      <AdminBreadcrumb
        page={`${sku}`}
        between={[
          {
            link: `/products`,
            title: `Products`,
          },
          {
            link: `/products/${productSlug}`,
            title: `${productName}`,
          },
        ]}
      />
      <div className="flex flex-col gap-4 rounded-lg md:p-8 bg-background">
        <div className="flex flex-col gap-4 sm:flex-row justify-between sm:items-center">
          <Heading
            title={`${sku}`}
            description="Here's details of your subproduct!"
          />
          <div className="flex items-center gap-2 justify-start lg:justify-end">
            <BaseButton
              isProtected={isProtected}
              type="edit"
              onClick={() => {
                setModalOpen(true);
                setModal({
                  title: `Edit Sub Product`,
                  description:
                    "Update Sub Product here. Click Update when you'are done.",
                  children: (
                    <EditSubproduct
                      item={subproduct}
                      setModalOpen={setModalOpen}
                    />
                  ),
                });
              }}
            />
            <BaseButton
              isProtected={isProtected}
              type="delete"
              onClick={() => {
                setModalOpen(true);
                setModal({
                  title: `Delete Sub Product`,
                  description: (
                    <p className="font-medium">
                      Are you sure To delete the Sub Product permenantly ?
                    </p>
                  ),
                  children: (
                    <DeleteSubproduct
                      itemId={id}
                      setModalOpen={setModalOpen}
                      redirect={true}
                      productSlug={productSlug}
                    />
                  ),
                });
              }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-4 ">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 ">
            <DetailsSquares
              price={price}
              currency={`${currency}`}
              discount={discount}
              sold={sold}
              qty={qty}
              featured={featured}
              inStock={inStock}
              id={id}
              isProtected={isProtected}
            />

            <ColorsChart />
          </div>
          <ColorsAndSizes
            itemColors={colors as string[]}
            itemSizes={sizes as string[]}
          />
          <SubproductImages
            setModal={setModal}
            setModalOpen={setModalOpen}
            uuid={uuid}
            images={images}
            isProtected={isProtected}
          />
          <div className="flex flex-wrap gap-4 rounded-lg">
            <PaymentChart
              title="Sold Orders"
              description="Your Marketing target are ahead of where you normally are."
            />
            <GoalCalender />
          </div>
        </div>
      </div>
      <Modal
        title={modal.title}
        description={modal.description}
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        className={modal.className}
        onPointerDownOutsideClose={modal.onPointerDownOutsideClose}
      >
        <>{modal.children}</>
      </Modal>
    </div>
  );
}

export default memo(Subproduct);
