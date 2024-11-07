"use client";
import { memo, useMemo, useOptimistic, useState } from "react";
import type { ModalState } from "@/components/custom/Modal";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { TbEdit } from "react-icons/tb";
import { Trash2Icon } from "lucide-react";

import dynamic from "next/dynamic";
import Loading from "@/components/custom/Loading";
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
const EditSize = dynamic(() => import("@/components/modules/admin/sizes/EditSize"), { loading: Loading });
const DeleteSize = dynamic(() => import("@/components/modules/admin/sizes/DeleteSize"), {
  loading: Loading,
});
const SizeList = dynamic(
  () => import("@/components/modules/admin/sizes/SizeList"),
  { loading: Loading }
);

function Sizes({ data }: { data: Size[] }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modal, setModal] = useState<ModalState>({
    title: "",
    description: "",
    children: <></>,
  });

  const [optimisicData, addOptimisticData] = useOptimistic(data);

  const sortedOptimisicData = useMemo(() => {
    return optimisicData?.length
      ? optimisicData.sort((a: Size, b: Size) =>
          b.updatedAt.localeCompare(a.updatedAt)
        )
      : [];
  }, [optimisicData]);

  const columns: ColumnDef<Size>[] = useMemo(
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
          const item: Size = row.original;
          return (
            <Link
              href={`/admin/sizes/${item.id}`}
              className={
                "hover:bg-main-200 p-2 rounded-lg" +
                (item.isPending ? " opacity-50" : "")
              }
              title="Go to Size page"
            >
              {item.name}
            </Link>
          );
        },
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const item: Size = row.original;

          return (
            <div className="flex items-center gap-2 justify-end">
              <TbEdit
                size={20}
                className="cursor-pointer"
                onClick={() => {
                  setModalOpen(true);
                  setModal({
                    title: `Edit Size`,
                    description:
                      "Update Size here. Click Update when you'are done.",
                    children: (
                      <EditSize
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
                    title: `Delete Size`,
                    description: (
                      <p className="font-medium">
                        Are you sure To delete the Size permenantly ?
                      </p>
                    ),
                    children: (
                      <DeleteSize
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
    [setModalOpen, setModal, addOptimisticData]
  );

  return (
    <div className="flex flex-col gap-4">
      <AdminBreadcrumb page="Sizes" />
      <div className="flex flex-col gap-4 rounded-lg p-8 bg-background">
        <div className="flex justify-between items-center">
          <Heading title="Sizes" description="Here's a list of your Sizes!" />
        </div>

        <SizeList
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

export default memo(Sizes);
