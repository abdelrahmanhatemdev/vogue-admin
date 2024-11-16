"use client";
import { memo, useMemo, useOptimistic, useState } from "react";
import type { ModalState } from "@/components/custom/Modal";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { TbEdit } from "react-icons/tb";
import { Trash2Icon } from "lucide-react";

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
const EditProduct = dynamic(() => import("./EditProduct"), {
  loading: Loading,
});
const DeleteProduct = dynamic(() => import("./DeleteProduct"), {
  loading: Loading,
});
const ProductList = dynamic(
  () => import("@/components/modules/admin/products/ProductList"),
  { loading: Loading }
);

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

  const sortedOptimisicData = useMemo(() => {
    return optimisicData?.length
      ? optimisicData.sort((a: Product, b: Product) =>
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
          const item: Product = row.original;
          return (
            <Link
              href={`/admin/products/${item.slug}`}
              className={
                "hover:bg-main-200 p-2 rounded-lg" +
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
          const item: Product = row.original;
          return (
            <span className={"p-2" + (item.isPending ? " opacity-50" : "")}>
              {item.slug ? "/" + item.slug : ""}
            </span>
          );
        },
      },
      {
        id: "brand",
        accessorKey: "brand",
        header: "Brand",
        cell: ({ row }) => {
          const item: Product = row.original;
          const brand = brands
            ? brands.find(({ id }) => id === item.brand)
            : undefined;

          return (
            <Link
              href={`/admin/brands/${item.brand}`}
              className={
                "hover:bg-main-200 p-2 rounded-lg" +
                (item.isPending ? " opacity-50" : "")
              }
              title="Go to brand page"
            >
              {brand ? brand.name : (item.brand as string)}
            </Link>
          );
        },
        enableSorting: false,
        filterFn: (row, columnId, filterValue) => {
          const rowValue = row.getValue(columnId)
          return filterValue.length === 0 || filterValue.includes(rowValue)
        }
      },
      {
        id: "categories",
        accessorKey: "categories",
        header: "categories",
        cell: ({ row }) => {
          const item: Product = row.original;
          const itemCatsIds = item.categories as string[];
          const itemCats: Category[] = [];

          if (itemCatsIds.length > 0 && categories.length > 0) {
            for (let i = 0; i < itemCatsIds.length; i++) {
              const cat = categories.find(({ id }) => id === itemCatsIds[i]);
              if (cat) {
                itemCats.push(cat);
              }
            }
          }

          return itemCats?.length > 0 ? (
            itemCats.map((cat) => (
              <Link
                href={`/admin/categories/${cat.slug}`}
                className={
                  "hover:bg-main-200 p-2 rounded-lg text-xs" +
                  (item.isPending ? " opacity-50" : "")
                }
                title="Go to categories page"
                key={cat.id}
              >
                {cat.name.length > 8 ? `${cat.name.slice(0, 8)}...` : cat.name}
              </Link>
            ))
          ) : (
            <></>
          );
        },
        enableSorting: false,
        filterFn: (row, columnId, filterValue) => {
          const rowValue: string[] = row.getValue(columnId);
          return filterValue.length === 0 || rowValue.some(item => filterValue.includes(item))
        }
      },
      {
        id: "subProducts",
        accessorKey: "subProducts",
        header: "Sub Products",
        cell: ({ row }) => {
          const item: Product = row.original;
          const subProductsCount: number = item?.subProducts
            ? item.subProducts.length
            : 0;

          return <span>{subProductsCount}</span>;
        },
        enableSorting: false,
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
                        Are you sure To delete the Product permenantly ?
                      </p>
                    ),
                    children: (
                      <DeleteProduct
                        item={item}
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
      >
        <>{modal.children}</>
      </Modal>
    </div>
  );
}

export default memo(Products);
