"use client";
import { memo, useState} from "react";
import type { ModalState } from "@/components/custom/Modal";
import dynamic from "next/dynamic";
import Loading from "@/components/custom/Loading";
import { TbEdit } from "react-icons/tb";
import { Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";


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

type SubproductPageType = Subproduct & {
  product_slug: string;
  product_name: string;
  product_id: string;
};

export type OptimisicImagesType = ProductImage & { isPending?: boolean };

function Subproduct({
  subproduct,
}: {
  subproduct: SubproductPageType;
}) {
  
  const {
    uuid,
    sku,
    currency,
    price,
    discount,
    qty,
    sold,
    featured,
    inStock,
    colors: item_colors,
    sizes: item_sizes,
    product_name: productName,
    product_slug,
    product_id,
  } = subproduct;

  const [modalOpen, setModalOpen] = useState(false);
  const [modal, setModal] = useState<ModalState>({
    title: "",
    description: "",
    children: <></>,
  });

  const [productSlug] = useState(product_slug);
  
  return (
    <div className="flex flex-col gap-4">
      {/* <AdminBreadcrumb
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
      /> */}
      <div className="flex flex-col gap-4 rounded-lg p-8 bg-background">
        {/* <div className="flex flex-col gap-4 sm:flex-row justify-between sm:items-center">
          <Heading
            title={`${sku}`}
            description="Here's details of your subproduct!"
          />
          <div className="flex items-center gap-2 justify-start lg:justify-end">
            <Button
              size={"sm"}
              className="flex items-center gap-2 group"
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
                      productId={product_id}
                    />
                  ),
                });
              }}
            >
              <span>Edit</span>
              <TbEdit size={20} className="cursor-pointer" />
            </Button>
            <Button
              variant={"destructive"}
              size={"sm"}
              className="flex items-center gap-2 group"
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
                      itemId={uuid}
                      setModalOpen={setModalOpen}
                      redirect={true}
                      productSlug={productSlug}
                    />
                  ),
                });
              }}
            >
              <span>Delete</span>
              <Trash2Icon size={20} className="cursor-pointer" />
            </Button>
          </div>
        </div> */}

        <div className="flex flex-col gap-4 ">
          {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 ">
            <DetailsSquares
              price={price}
              currency={`${currency}`}
              discount={discount}
              sold={sold}
              qty={qty}
              featured={featured}
              inStock={inStock}
              uuid={uuid}
            />

            <ColorsChart sold= {sold}/>
          </div>
          <ColorsAndSizes item_colors={item_colors as string} item_sizes={item_sizes as string}/> */}
          <SubproductImages setModal={setModal} setModalOpen={setModalOpen} uuid= {uuid}/>
          {/* <div className="flex flex-wrap gap-4 rounded-lg">
            <PaymentChart
              title="Sold Orders"
              description="Your Marketing target are ahead of where you normally are."
            />
            <GoalCalender />
          </div> */}
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
