"use client";
import { memo, useMemo, useOptimistic, useState } from "react";
import type { ModalState } from "@/components/custom/Modal";
import { ColumnDef, Table } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
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
const EditAdmin = dynamic(
  () => import("@/components/modules/admins/EditAdmin"),
  { loading: Loading }
);
const DeleteAdmin = dynamic(
  () => import("@/components/modules/admins/DeleteAdmin"),
  {
    loading: Loading,
  }
);
const AdminList = dynamic(
  () => import("@/components/modules/admins/AdminList"),
  { loading: Loading }
);

const SelectAllCheckbox = dynamic<{ table: Table<Admin> }>(
  () => import("@/components/custom/table/SelectAllCheckbox"),
  {
    loading: Loading,
  }
);

const DeleteButton = dynamic(
  () => import("@/components/custom/table/DeleteButton"),
  {
    loading: Loading,
  }
);

const EditButton = dynamic(
  () => import("@/components/custom/table/EditButton"),
  {
    loading: Loading,
  }
);

export type OptimisicDataType = Admin & { isPending?: boolean };

function Admins({ data }: { data: Admin[] }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modal, setModal] = useState<ModalState>({
    title: "",
    description: "",
    children: <></>,
  });

  const [optimisicData, addOptimisticData] = useOptimistic(data);

  const sortedOptimisicData = useMemo(() => {
    return optimisicData?.length
      ? optimisicData.sort((a: OptimisicDataType, b: OptimisicDataType) =>
          b.updatedAt.localeCompare(a.updatedAt)
        )
      : [];
  }, [optimisicData]);

  const columns: ColumnDef<Admin>[] = useMemo(
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
          const item: Admin = row.original;
          return <span>{item.name}</span>;
        },
      },
      {
        id: "email",
        accessorKey: "email",
        header: "email",
        cell: ({ row }) => {
          const item: Admin = row.original;
          return <span>{item.email}</span>;
        },
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const item: Admin = row.original;

          return (
            <div className="flex items-center gap-2 justify-end">
              <EditButton
                isProtected={item.isProtected}
                onClick={() => {
                  setModalOpen(true);
                  setModal({
                    title: `Edit Admin`,
                    description:
                      "Update Admin here. Click Update when you'are done.",
                    children: (
                      <EditAdmin
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
                  setModalOpen(true);
                  setModal({
                    title: `Delete Admin`,
                    description: (
                      <p className="font-medium">
                        Are you sure To delete the Admin permenantly ?
                      </p>
                    ),
                    children: (
                      <DeleteAdmin
                        itemId={item.id}
                        itemUid={item.uid}
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
      <AdminBreadcrumb page="Admins" />
      <div className="flex flex-col gap-4 rounded-lg md:p-8 bg-background">
        <div className="flex justify-between items-center">
          <Heading title="Admins" description="Here's a list of your Admins!" />
        </div>

        <AdminList
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

export default memo(Admins);
