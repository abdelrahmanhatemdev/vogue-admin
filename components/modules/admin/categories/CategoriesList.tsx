"use client";
import DataTable from "@/components/custom/DataTable";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { Trash2Icon } from "lucide-react";
import { TbEdit } from "react-icons/tb";
import { Dispatch, memo, SetStateAction, useMemo } from "react";
import EditCategory from "./EditCategory";
import { ModalProps } from "@/components/custom/Modal";
import DeleteCategory from "./DeleteCategory";
import Link from "next/link";

const CategoriesList = function CategoriesList({
  data,
  setOpen,
  setModal,
  addOptimisticData,
}: {
  data: Category[];
  setOpen: Dispatch<SetStateAction<boolean>>;
  setModal: Dispatch<SetStateAction<ModalProps>>;
  addOptimisticData: (
    action: Category[] | ((pendingState: Category[]) => Category[])
  ) => void;
}) {
  const columns: ColumnDef<Category>[] = useMemo(
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
        size: 50,
        maxSize: 50,
      },
      {
        id: "name",
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => {
          const item: Category = row.original;
          return (
            <Link
              href={`/admin/categories/${item.id}`}
              className={item.isPending ? "opacity-50" : ""}
            >
              {item.name}
            </Link>
          );
        },
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const item: Category = row.original;

          return (
            <div className="flex items-center gap-2 justify-end">
              <TbEdit
                size={20}
                className="cursor-pointer"
                onClick={() => {
                  setOpen(true);
                  setModal({
                    title: `Edit Category`,
                    description:
                      "Update Category here. Click Update when you'are done.",
                    children: (
                      <EditCategory
                        item={item}
                        setOpen={setOpen}
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
                  setOpen(true);
                  setModal({
                    title: `Delete Category`,
                    description: (
                      <p className="font-medium">
                        Are you sure To delete the category permenantly ?
                      </p>
                    ),
                    children: (
                      <DeleteCategory
                        item={item}
                        setOpen={setOpen}
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
    [setOpen, setModal]
  );

  return (
    <div className="pb-12">
      <DataTable
        data={data}
        columns={columns}
        setOpen={setOpen}
        setModal={setModal}
        addOptimisticData={addOptimisticData}
      />
    </div>
  );
};

export default memo(CategoriesList);
