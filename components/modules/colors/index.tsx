"use client";
import { memo, useMemo, useOptimistic, useState } from "react";
import type { ModalState } from "@/components/custom/Modal";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { TbEdit } from "react-icons/tb";
import { Trash2Icon } from "lucide-react";

import dynamic from "next/dynamic";
import Loading from "@/components/custom/Loading";
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
const EditColor = dynamic(
  () => import("@/components/modules/colors/EditColor"),
  { loading: Loading }
);
const DeleteColor = dynamic(
  () => import("@/components/modules/colors/DeleteColor"),
  {
    loading: Loading,
  }
);
const ColorList = dynamic(
  () => import("@/components/modules/colors/ColorList"),
  { loading: Loading }
);

export type OptimisicDataType = Color & {isPending?: boolean}

function Colors({ data }: { data: Color[] }) {
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

  const columns: ColumnDef<Color>[] = useMemo(
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
        Color: 40,
      },
      {
        id: "name",
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => {
          const item: OptimisicDataType = row.original;
          return <div
          className={
            (item.isPending ? " opacity-50" : "")
          }
        >{item.name}</div>;
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
          const item: Color = row.original;

          return (
            <div className="flex items-center gap-2 justify-end">
              <TbEdit
                size={20}
                className="cursor-pointer"
                onClick={() => {
                  setModalOpen(true);
                  setModal({
                    title: `Edit Color`,
                    description:
                      "Update Color here. Click Update when you'are done.",
                    children: (
                      <EditColor
                        item={item}
                        setModalOpen={setModalOpen}
                        
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
                    title: `Delete Color`,
                    description: (
                      <p className="font-medium">
                        Are you sure To delete the Color permenantly ?
                      </p>
                    ),
                    children: (
                      <DeleteColor
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
      <AdminBreadcrumb page="Colors" />
      <div className="flex flex-col gap-4 rounded-lg p-8 bg-background">
        <div className="flex justify-between items-center">
          <Heading title="Colors" description="Here's a list of your Colors!" />
        </div>

        <ColorList
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

export default memo(Colors);
