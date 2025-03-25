"use client";
import { memo, useMemo, useState } from "react";
import type { ModalState } from "@/components/custom/Modal";
import { ColumnDef, Table } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import dynamic from "next/dynamic";
import Loading from "@/components/custom/Loading";
import useLabelStore from "@/store/useLabelStore";
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
const EditLabel = dynamic(
  () => import("@/components/modules/labels/EditLabel"),
  { loading: Loading }
);
const DeleteLabel = dynamic(
  () => import("@/components/modules/labels/DeleteLabel"),
  {
    loading: Loading,
  }
);
const LabelList = dynamic(
  () => import("@/components/modules/labels/LabelList"),
  { loading: Loading }
);

const SelectAllCheckbox = dynamic<{ table: Table<Label> }>(() => import("@/components/custom/table/SelectAllCheckbox"), {
  loading: Loading,
});

const DeleteButton = dynamic(() => import("@/components/custom/table/DeleteButton"), {
  loading: Loading,
});

const EditButton = dynamic(() => import("@/components/custom/table/EditButton"), {
  loading: Loading,
});

export type OptimisicDataType = Label & { isPending?: boolean };

function Labels() {
  const { data, loading } = useLabelStore();

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

  const columns: ColumnDef<Label>[] = useMemo(
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
        Label: 40,
      },
      {
        id: "title",
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => {
          const item: OptimisicDataType = row.original;
          return (
            <div className={item.isPending ? " opacity-50" : ""}>
              {item.title}
            </div>
          );
        },
      },
      {
        id: "hex",
        accessorKey: "hex",
        header: "Hex Code",
        cell: ({ row }) => {
          const item: OptimisicDataType = row.original;
          return (
            <div
              className={
                "rounded-lg flex gap-1 items-center" +
                (item.isPending ? " opacity-50" : "")
              }
            >
              <div
                className={`h-4 w-4 rounded-sm block ring-ring ring-1`}
                style={{ backgroundColor: item.hex }}
              ></div>
              <span>{item.hex}</span>
            </div>
          );
        },
        enableSorting: false,
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const item: Label = row.original;

          return (
            <div className="flex items-center gap-2 justify-end">
              <EditButton
                isProtected={item.isProtected}
                onClick={() => {
                  setModalOpen(true);
                  setModal({
                    title: `Edit Label`,
                    description:
                      "Update Label here. Click Update when you'are done.",
                    children: (
                      <EditLabel item={item} setModalOpen={setModalOpen} />
                    ),
                  });
                }}
              />
              <DeleteButton
                isProtected={item.isProtected}
                onClick={() => {
                  setModalOpen(true);
                  setModal({
                    title: `Delete Label`,
                    description: (
                      <p className="font-medium">
                        Are you sure To delete the Label permenantly ?
                      </p>
                    ),
                    children: (
                      <DeleteLabel
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
      <AdminBreadcrumb page="Labels" />
      <div className="flex flex-col gap-4 rounded-lg md:p-8 bg-background">
        <div className="flex justify-between items-center">
          <Heading title="Labels" description="Here's a list of your Labels!" />
        </div>
        {loading && <Loading />}
          <LabelList
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

export default memo(Labels);
