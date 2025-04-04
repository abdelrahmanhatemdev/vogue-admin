"use client";
import { memo, useMemo, useState } from "react";
import type { ModalState } from "@/components/custom/Modal";
import { ColumnDef, Table } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import dynamic from "next/dynamic";
import Loading from "@/components/custom/Loading";
import Link from "next/link";
import useBrandStore from "@/store/useBrandStore";

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
const EditBrand = dynamic(
  () => import("@/components/modules/brands/EditBrand"),
  { loading: Loading }
);
const DeleteBrand = dynamic(
  () => import("@/components/modules/brands/DeleteBrand"),
  {
    loading: Loading,
  }
);
const BrandList = dynamic(
  () => import("@/components/modules/brands/BrandList"),
  { loading: Loading }
);

const SelectAllCheckbox = dynamic<{ table: Table<Brand> }>(
  () => import("@/components/custom/table/SelectAllCheckbox"),
  {
    loading: Loading,
  }
);

const DeleteButton = dynamic(() => import("@/components/custom/table/DeleteButton"), {
  loading: Loading,
});

const EditButton = dynamic(() => import("@/components/custom/table/EditButton"), {
  loading: Loading,
});

export type OptimisicDataType = Brand & { isPending?: boolean };

function Brands() {
  const { data, loading } = useBrandStore();

  console.log("data", data);
  

  const [modalOpen, setModalOpen] = useState(false);
  const [modal, setModal] = useState<ModalState>({
    title: "",
    description: "",
    children: <></>,
  });

  const sortedData = useMemo(() => {
    return data?.length
      ? data.sort((a: OptimisicDataType, b: OptimisicDataType) =>
          b.updatedAt.localeCompare(a.updatedAt)
        )
      : [];
  }, [data]);

  const columns: ColumnDef<Brand>[] = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => <SelectAllCheckbox table={table} />,
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
              href={`/brands/${item.slug}`}
              className={
                "hover:bg-neutral-200 dark:hover:bg-neutral-500 p-2 rounded-lg" +
                (item.isPending ? " opacity-50" : "")
              }
              title="Go to brand page"
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
            <span className={"p-2" + (item.isPending ? " opacity-50" : "")}>
              {item.slug ? "/" + item.slug : ""}
            </span>
          );
        },
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const item: Brand = row.original;

          return (
            <div className="flex items-center gap-2 justify-end">
              <EditButton
                isProtected={item.isProtected}
                onClick={() => {
                  setModalOpen(true);
                  setModal({
                    title: `Edit Brand`,
                    description:
                      "Update Brand here. Click Update when you'are done.",
                    children: (
                      <EditBrand item={item} setModalOpen={setModalOpen} />
                    ),
                  });
                }}
              />
              <DeleteButton
                isProtected={item.isProtected}
                onClick={() => {
                  setModalOpen(true);
                  setModal({
                    title: `Delete Brand`,
                    description: (
                      <p className="font-medium">
                        Are you sure To delete the Brand permenantly ?
                      </p>
                    ),
                    children: (
                      <DeleteBrand
                        itemId={item.id}
                        setModalOpen={setModalOpen}
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
    [setModalOpen, setModal, data]
  );

  return (
    <div className="flex flex-col gap-4">
      <AdminBreadcrumb page="Brands" />
      <div className="flex flex-col gap-4 rounded-lg md:p-8 bg-background">
        <div className="flex justify-between items-center">
          <Heading title="Brands" description="Here's a list of your Brands!" />
        </div>

        {loading && <Loading />}
        <BrandList
          data={sortedData}
          columns={columns}
          setModalOpen={setModalOpen}
          setModal={setModal}
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

export default memo(Brands);
