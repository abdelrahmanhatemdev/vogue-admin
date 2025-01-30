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
import { Switch } from "@/components/ui/switch";
import { editProduct } from "@/actions/Product";
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
  () => import("@/components/modules/products/EditProduct"),
  {
    loading: Loading,
  }
);
const DeleteProduct = dynamic(
  () => import("@/components/modules/products/DeleteProduct"),
  {
    loading: Loading,
  }
);
const ProductList = dynamic(
  () => import("@/components/modules/products/ProductList"),
  { loading: Loading }
);

export type OptimisicDataType = Product & { isPending?: boolean };

function Products({ data }: { data: Product[] }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modal, setModal] = useState<ModalState>({
    title: "",
    description: "",
    children: <></>,
  });

  const { data: categories } = useData("categories");
  const { data: brands } = useData("brands");

  const [optimisicData, addOptimisticData] = useOptimistic(data);
  const [isPending, startTransition] = useTransition();

  const sortedOptimisicData = useMemo(() => {
    return optimisicData?.length
      ? optimisicData.sort((a: OptimisicDataType, b: OptimisicDataType) =>
          b.updatedAt.localeCompare(a.updatedAt)
        )
      : [];
  }, [optimisicData]);

  const columns: ColumnDef<Product>[] = useMemo(
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
        id: "name",
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => {
          const item: OptimisicDataType = row.original;
          return (
            <Link
              href={`/products/${item.slug}`}
              className={
                "hover:bg-neutral-200 dark:hover:bg-neutral-500 p-2 rounded-lg truncate" +
                (item.isPending ? " opacity-50" : "")
              }
              title="Go to Product page"
            >
              {item.name}
            </Link>
          );
        },
      },
      {
        id: "slug",
        accessorKey: "slug",
        header: "Slug",
        cell: ({ row }) => {
          const item: OptimisicDataType = row.original;
          return (
            <span
              className={
                "p-2 line-clamp-1 leading-4 h-6" +
                (item.isPending ? " opacity-50" : "")
              }
            >
              {item.slug ? "/" + item.slug : ""}
            </span>
          );
        },
      },
      {
        id: "brand_name",
        accessorKey: "brand_name",
        header: "Brand",
        cell: ({ row }) => {
          const item = row.original as OptimisicDataType & {
            brand_name: string;
            brand_slug: string;
          };

          return item.brand_slug ? (
            <Link
              href={`/brands/${item.brand_slug}`}
              className={
                "hover:bg-neutral-200 dark:hover:bg-neutral-500 p-2 rounded-lg" +
                (item.isPending ? " opacity-50" : "")
              }
              title="Go to brand page"
            >
              {item.brand_name}
            </Link>
          ) : (
            <></>
          );
        },
        filterFn: (row, columnId, filterValue) => {
          const rowValue = row.getValue(columnId);
          return filterValue.length === 0 || filterValue.includes(rowValue);
        },
      },

      {
        id: "subproduct_count",
        accessorKey: "subproduct_count",
        header: "Sub Products",
        cell: ({ row }) => {
          const item: Product & { subproduct_count?: string } = row.original;
          const subproductsCount: number = item?.subproduct_count
            ? Number(item.subproduct_count)
            : 0;

          return (
            <div className="flex items-center justify-center">
              <span className="text-center dark:bg-neutral-700 rounded-md p-1 w-6 ">
                {subproductsCount}
              </span>
            </div>
          );
        },
      },
      {
        id: "trending",
        accessorKey: "trending",
        header: "trending",
        cell: ({ row }) => {
          const item: OptimisicDataType = row.original;

          return (
            <span
              className={cn(
                `${item.isPending ? " opacity-50" : ""}`,
                "dark:border-border"
              )}
            >
              <Switch
                checked={item.trending}
                onCheckedChange={async () => {
                  const { trending, ...rest } = item;

                  const optimisticObj: OptimisicDataType = {
                    ...rest,
                    trending: !trending,
                    isPending: !isPending,
                  };

                  startTransition(() => {
                    addOptimisticData((prev: Product[]) => [
                      ...prev.filter((sub) => sub.id !== item.id),
                      optimisticObj,
                    ]);
                  });

                  const res: ActionResponse = await editProduct({
                    uuid: item.uuid,
                    property: "trending",
                    value: !item.trending,
                  });

                  notify(res);
                }}
              />
            </span>
          );
        },
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const item: Product = row.original;

          return (
            <div className="flex items-center gap-2 justify-end">
              <TbEdit
                size={20}
                className="cursor-pointer"
                onClick={() => {
                  setModalOpen(true);
                  setModal({
                    title: `Edit Product`,
                    description:
                      "Update Product here. Click Update when you'are done.",
                    children: (
                      <EditProduct
                        item={item}
                        setModalOpen={setModalOpen}
                        addOptimisticData={addOptimisticData}
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
                    title: `Delete Product`,
                    description: (
                      <p className="font-medium">
                        Are you sure To delete the <strong>product</strong> and{" "}
                        <strong>its subproducts</strong> permenantly?
                      </p>
                    ),
                    children: (
                      <DeleteProduct
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
    [setModalOpen, setModal, addOptimisticData, brands, categories]
  );

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
        <ProductList
          data={sortedOptimisicData}
          columns={columns}
          setModalOpen={setModalOpen}
          setModal={setModal}
          addOptimisticData={addOptimisticData}
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

export default memo(Products);
