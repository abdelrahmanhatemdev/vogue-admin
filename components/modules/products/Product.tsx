"use client";
import { memo, useMemo, useOptimistic, useState, useTransition } from "react";
import type { ModalState } from "@/components/custom/Modal";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { TbEdit } from "react-icons/tb";
import { Trash2Icon } from "lucide-react";
import dynamic from "next/dynamic";
import Loading from "@/components/custom/Loading";
import useData from "@/hooks/useData";
import { cn, notify } from "@/lib/utils";
import { discountPrice, currencyPrice } from "@/lib/productService";
import { editSubproduct } from "@/actions/Subproduct";
import { Switch } from "@/components/ui/switch";
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
const SubproductList = dynamic(
  () => import("@/components/modules/subproducts/SubproductList"),
  { loading: Loading }
);

export type OptimisicDataType = Subproduct & { isPending?: boolean };

function Product({
  product,
  subproducts,
}: {
  product: Partial<Product>;
  subproducts: Subproduct[];
}) {
  
  const [modalOpen, setModalOpen] = useState(false);
  const [modal, setModal] = useState<ModalState>({
    title: "",
    description: "",
    children: <></>,
  });

  const { data: colors } = useData("colors");
  const { data: sizes } = useData("sizes");

  const [optimisicData, addOptimisticData] = useOptimistic(subproducts);
  const [isPending, startTransition] = useTransition();

  const sortedOptimisicData = useMemo(() => {
    return optimisicData?.length
      ? optimisicData.sort((a: OptimisicDataType, b: OptimisicDataType) =>
          b.updatedAt.localeCompare(a.updatedAt)
        )
      : [];
  }, [optimisicData]);

  const columns: ColumnDef<Subproduct>[] = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value: boolean) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            onChange={table.getToggleAllRowsSelectedHandler()}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value: boolean) => row.toggleSelected(!!value)}
            onChange={row.getToggleSelectedHandler()}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
        enableResizing: false,
        size: 40,
      },
      {
        id: "sku",
        accessorKey: "sku",
        header: "SKU",
        cell: ({ row }) => {
          const item: OptimisicDataType = row.original;
          return (
            <Link
              href={`/products/${product.slug}/${item.sku}`}
              className={
                "hover:bg-neutral-300 p-2 rounded-lg bg-neutral-200 dark:bg-neutral-700 dark:hover:bg-neutral-800 transition-colors" +
                (item.isPending ? " opacity-50" : "")
              }
              title="Go to Subproduct page"
            >
              {item.sku}
            </Link>
          );
        },
      },
      {
        id: "price",
        accessorKey: "price",
        header: () => <span title="Price before discount">Price</span>,
        cell: ({ row }) => {
          const item: OptimisicDataType = row.original;
          const { price, currency } = item;

          return (
            <span className={`${item.isPending ? " opacity-50" : ""}`}>
              {currencyPrice({ price, currency })}
            </span>
          );
        },
      },
      {
        id: "discount",
        accessorKey: "discount",
        header: () => <span title="Discount Percentage">Disc.</span>,
        cell: ({ row }) => {
          const item: OptimisicDataType = row.original;

          return (
            <span className={`${item.isPending ? " opacity-50" : ""}`}>
              {item.discount}%
            </span>
          );
        },
      },
      {
        id: "discountPrice",
        accessorKey: "price",
        header: () => <span title="Net Price">N</span>,
        cell: ({ row }) => {
          const item: OptimisicDataType = row.original;
          const { price, discount, currency } = item;

          return (
            <span
              className={`${cn(
                item.isPending ? " opacity-50" : "",
                "font-bold"
              )}`}
            >
              {currencyPrice({
                price: discountPrice({ price, discount }),
                currency,
              })}
            </span>
          );
        },
        sortingFn: (rowA, rowB) => {
          const { price: priceA, discount: discountA } = rowA.original;
          const { price: priceB, discount: discountB } = rowB.original;
          return discountPrice({ price: priceA, discount: discountA }) >
            discountPrice({ price: priceB, discount: discountB })
            ? 1
            : -1;
        },
      },
      {
        id: "qty",
        accessorKey: "qty",
        header: () => <span title="Quantity">Qty</span>,
        cell: ({ row }) => {
          const item: OptimisicDataType = row.original;

          return (
            <span className={`${item.isPending ? " opacity-50" : ""}`}>
              {item.qty}
            </span>
          );
        },
      },
      {
        id: "sold",
        accessorKey: "sold",
        header: () => <span title="Total sold items">Sold</span>,
        cell: ({ row }) => {
          const item: OptimisicDataType = row.original;

          return (
            <span className={`${item.isPending ? " opacity-50" : ""}`}>
              {item.sold}
            </span>
          );
        },
      },
      {
        id: "featured",
        accessorKey: "featured",
        header: "featured",
        cell: ({ row }) => {
          const item: OptimisicDataType = row.original;

          return (
            <span className={cn(`${item.isPending ? " opacity-50" : ""}`, "dark:border-border") }>
              <Switch
                checked={item.featured}
                onCheckedChange={async () => {
                  const { featured, ...rest } = item;

                  const optimisticObj: OptimisicDataType = {
                    ...rest,
                    featured: !featured,
                    isPending: !isPending,
                  };

                  startTransition(() => {
                    addOptimisticData((prev: Subproduct[]) => [
                      ...prev.filter((sub) => sub.id !== item.id),
                      optimisticObj,
                    ]);
                  });

                  const res: ActionResponse = await editSubproduct({
                    id: item.id,
                    property: "featured",
                    value: !item.featured,
                  });

                  notify(res);
                }}
              />
            </span>
          );
        },
      },
      {
        id: "inStock",
        accessorKey: "inStock",
        header: "inStock",
        cell: ({ row }) => {
          const item: OptimisicDataType = row.original;

          return (
            <span className={`${item.isPending ? " opacity-50" : ""}`}>
              <Switch
                checked={item.inStock}
                onCheckedChange={async () => {
                  const { inStock, ...rest } = item;

                  const optimisticObj: OptimisicDataType = {
                    ...rest,
                    inStock: !inStock,
                    isPending: !isPending,
                  };

                  startTransition(() => {
                    addOptimisticData((prev: Subproduct[]) => [
                      ...prev.filter((sub) => sub.id !== item.id),
                      optimisticObj,
                    ]);
                  });

                  const res: ActionResponse = await editSubproduct({
                    id: item.id,
                    property: "inStock",
                    value: !item.inStock,
                  });

                  notify(res);
                }}
              />
            </span>
          );
        },
        filterFn: "equals",
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const item: Subproduct = row.original;

          return (
            <div className="flex items-center gap-2 justify-end">
              <TbEdit
                size={20}
                className="cursor-pointer"
                onClick={() => {
                  setModalOpen(true);
                  setModal({
                    title: `Edit Sub Product`,
                    description:
                      "Update Sub Product here. Click Update when you'are done.",
                    children: (
                      <EditSubproduct
                        item={item}
                        setModalOpen={setModalOpen}
                        addOptimisticData={addOptimisticData}
                        productId={product.uuid as string}
                      />
                    ),
                  });
                }}
              />
              <Trash2Icon
                size={20}
                color="#dc2626"
                className="cursor-pointer"
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
                        itemId={item.id}
                        setModalOpen={setModalOpen}
                        addOptimisticData={addOptimisticData}
                      />
                    ),
                  });
                }}
              />
            </div>
          );
        },
      },
    ],
    [setModalOpen, setModal, addOptimisticData, sizes, colors]
  );
  

  return (
    <div className="flex flex-col gap-4">
      <AdminBreadcrumb
        page={product.name}
        between={[{ link: "/products", title: "Products" }]}
      />
      <div className="flex flex-col gap-4 rounded-lg p-8 bg-background">
        <div className="flex justify-between items-center">
          <Heading
            title={`${product.name}`}
            description={`Here's a subproduct list of ${product.name}!`}
          />
        </div>
        <SubproductList
          data={sortedOptimisicData}
          columns={columns}
          setModalOpen={setModalOpen}
          setModal={setModal}
          addOptimisticData={addOptimisticData}
          productId={product.id as string}
        />
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

export default memo(Product);
