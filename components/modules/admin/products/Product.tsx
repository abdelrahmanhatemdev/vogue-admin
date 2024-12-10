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
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
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
  () => import("@/components/modules/admin/subproducts/EditSubproduct"),
  {
    loading: Loading,
  }
);
const DeleteSubproduct = dynamic(
  () => import("@/components/modules/admin/subproducts/DeleteSubproduct"),
  {
    loading: Loading,
  }
);
const SubproductList = dynamic(
  () => import("@/components/modules/admin/subproducts/SubproductList"),
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
              href={`/admin/products/${product.slug}/${item.sku}`}
              className={
                "hover:bg-main-300 p-2 rounded-lg bg-main-200 transition-colors" +
                (item.isPending ? " opacity-50" : "")
              }
              title="Go to Subproduct page"
            >
              {item.sku}
            </Link>
          );
        },
      },
      // {
      //   id: "color",
      //   accessorKey: "color",
      //   header: "color",
      //   cell: ({ row }) => {
      //     const item: Subproduct = row.original;
      //     return (
      //       <div
      //         className={
      //           "rounded-lg flex gap-1 items-center" +
      //           (item.isPending ? " opacity-50" : "")
      //         }
      //       >
      //         {item.colors.map((color) => {
      //           console.log("color", color);
      //           const itemColor = colors.find(
      //             (c) => c.id === (color as string)
      //           );

      //           return (
      //             <div
      //               className={`h-4 w-4 rounded-sm block ring-ring ring-1`}
      //               title={`${itemColor?.name}`}
      //               style={{
      //                 backgroundColor: itemColor?.hex,
      //               }}
      //             ></div>
      //           );
      //         })}
      //       </div>
      //     );
      //   },
      // },
      // {
      //   id: "sizes",
      //   accessorKey: "sizes",
      //   header: "Sizes",
      //   cell: ({ row }) => {
      //     const item: Subproduct = row.original;
      //     const itemSizes = item.sizes as string[];

      //     return (
      //       <div
      //         className={
      //           "rounded-lg flex gap-1 items-center" +
      //           (item.isPending ? " opacity-50" : "")
      //         }
      //       >
      //         {sizes &&
      //           itemSizes?.length > 0 &&
      //           itemSizes.map((is) => {
      //             return <span>{sizes.find((s) => s.id === is)?.name}</span>;
      //           })}
      //       </div>
      //     );
      //   },
      //   filterFn: (row, columnId, filterValue) => {
      //     const rowValue = row.getValue(columnId);
      //     return filterValue.length === 0 || filterValue.includes(rowValue);
      //   },
      //   // sortingFn: (rowA, rowB) => {
      //   //   const brandA = brands
      //   //     .find((b) => b.id === rowA.original.brand)
      //   //     ?.name?.toLowerCase();
      //   //   const brandB = brands
      //   //     ?.find((b) => b.id === rowB.original.brand)
      //   //     ?.name?.toLowerCase();

      //   //   if (brandA && brandB) {
      //   //     if (brandA > brandB) return 1;
      //   //     if (brandA < brandB) return -1;
      //   //   }

      //   //   return 0;
      //   // },
      // },
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
            <span className={`${item.isPending ? " opacity-50" : ""}`}>
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
                    uuid: item.uuid,
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
                    uuid: item.uuid,
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
                        productId={product.id as string}
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
                        itemId={item.uuid}
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
      <AdminBreadcrumb page={product.slug as string}>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/admin/products">Products</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
      </AdminBreadcrumb>
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
      >
        <>{modal.children}</>
      </Modal>
    </div>
  );
}

export default memo(Product);
