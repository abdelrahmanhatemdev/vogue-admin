"use client";
import { memo, useMemo, useState } from "react";
import type { ModalState } from "@/components/custom/Modal";
import { ColumnDef, Table } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import dynamic from "next/dynamic";
import Loading from "@/components/custom/Loading";
import useSizeStore from "@/store/useSizeStore";
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
const EditSize = dynamic(() => import("@/components/modules/sizes/EditSize"), {
  loading: Loading,
});
const DeleteSize = dynamic(
  () => import("@/components/modules/sizes/DeleteSize"),
  {
    loading: Loading,
  }
);
const SizeList = dynamic(() => import("@/components/modules/sizes/SizeList"), {
  loading: Loading,
});
const SelectAllCheckbox = dynamic<{ table: Table<Size> }>(() => import("@/components/custom/table/SelectAllCheckbox"), {
  loading: Loading,
});

const DeleteButton = dynamic(() => import("@/components/custom/table/DeleteButton"), {
  loading: Loading,
});

const EditButton = dynamic(() => import("@/components/custom/table/EditButton"), {
  loading: Loading,
});

export type OptimisicDataType = Size & { isPending?: boolean };

function Sizes() {
  const { data, loading } = useSizeStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [modal, setModal] = useState<ModalState>({
    title: "",
    description: "",
    children: <></>,
  });

  const sortedData = useMemo(() => {
    return data?.length
      ? data.sort((a: OptimisicDataType, b: OptimisicDataType) =>
          b.sortOrder < a.sortOrder ? -1 : 1
        )
      : [];
  }, [data]);

  const columns: ColumnDef<Size>[] = useMemo(
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
          const item: Size = row.original;
          return <span>{item.name}</span>;
        },
      },
      {
        id: "symbol",
        accessorKey: "symbol",
        header: "Symbol",
        cell: ({ row }) => {
          const item: Size = row.original;
          return <span>{item.symbol}</span>;
        },
      },
      {
        id: "sortOrder",
        accessorKey: "sortOrder",
        header: "Order",
        cell: ({ row }) => {
          const item: Size = row.original;
          return <span>{item.sortOrder}</span>;
        },
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const item: Size = row.original;

          return (
            <div className="flex items-center gap-2 justify-end">
              <EditButton
                isProtected={item.isProtected}
                onClick={() => {
                  setModalOpen(true);
                  setModal({
                    title: `Edit Size`,
                    description:
                      "Update Size here. Click Update when you'are done.",
                    children: (
                      <EditSize item={item} setModalOpen={setModalOpen} />
                    ),
                  });
                }}
              />
              <DeleteButton
                isProtected={item.isProtected}
                onClick={() => {
                  setModalOpen(true);
                  setModal({
                    title: `Delete Size`,
                    description: (
                      <p className="font-medium">
                        Are you sure To delete the Size permenantly ?
                      </p>
                    ),
                    children: (
                      <DeleteSize
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
    [setModalOpen, setModal, sortedData]
  );

  return (
    <div className="flex flex-col gap-4">
      <AdminBreadcrumb page="Sizes" />
      <div className="flex flex-col gap-4 rounded-lg md:p-8 bg-background">
        <div className="flex justify-between items-center">
          <Heading title="Sizes" description="Here's a list of your Sizes!" />
        </div>
        {loading && <Loading />}
        <SizeList
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

export default memo(Sizes);
