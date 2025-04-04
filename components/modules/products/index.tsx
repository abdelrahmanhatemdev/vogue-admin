"use client";
import { memo, useMemo, useOptimistic, useState, useTransition } from "react";
import type { ModalState } from "@/components/custom/Modal";
import { ColumnDef, Table } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import dynamic from "next/dynamic";
import Loading from "@/components/custom/Loading";
import { cn, notify } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { editProduct } from "@/actions/Product";
import useCategoryStore from "@/store/useCategoryStore";
import useBrandStore from "@/store/useBrandStore";
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

const SelectAllCheckbox = dynamic<{ table: Table<Product> }>(() => import("@/components/custom/table/SelectAllCheckbox"), {
  loading: Loading,
});

const DeleteButton = dynamic(() => import("@/components/custom/table/DeleteButton"), {
  loading: Loading,
});

const EditButton = dynamic(() => import("@/components/custom/table/EditButton"), {
  loading: Loading,
});

export type OptimisicDataType = Product & { isPending?: boolean };

function Products({ data }: { data: Product[] }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modal, setModal] = useState<ModalState>({
    title: "",
    description: "",
    children: <></>,
  });

  const { data: categories } = useCategoryStore();
  const { data: brands } = useBrandStore();

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
          <SelectAllCheckbox table={table}/>
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
        id: "brandId",
        accessorKey: "brandId",
        header: "Brand",
        cell: ({ row }) => {
          const item = row.original as OptimisicDataType;
          const rowBrand =
            brands.length > 0
              ? brands.find((brand) => brand.uuid === item.brandId)
              : undefined;
          const brand = { ...rowBrand, isPending: item.isPending };

          return brand ? (
            <Link
              href={`/brands/${brand.slug}`}
              className={
                "hover:bg-neutral-200 dark:hover:bg-neutral-500 p-2 rounded-lg" +
                (brand.isPending ? " opacity-50" : "")
              }
              title="Go to brand page"
            >
              {brand.name}
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
        id: "subproducts",
        accessorKey: "subproducts",
        header: "Sub Products",
        cell: ({ row }) => {
          const item = row.original;

          const spCount = item.subproducts as number;

          return spCount ? (
            <div className="flex items-center justify-center">
              <span className="text-center dark:bg-neutral-700 rounded-md p-1 w-6 ">
                {spCount}
              </span>
            </div>
          ) : (
            ""
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
                    id: item.id,
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
              <EditButton
                isProtected={item.isProtected}
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
              <DeleteButton
                isProtected={item.isProtected}
                onClick={() => {
                  console.log("item.isPotected", item.isProtected);
                  
                  if (item.isProtected) return notify({status: "500", message: "Item is protected"})
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
                        params={{id: item.id, uuid: item.uuid}}
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
      <div className="flex flex-col gap-4 rounded-lg md:p-8 bg-background">
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
