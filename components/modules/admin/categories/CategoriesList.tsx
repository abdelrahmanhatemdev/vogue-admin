"use client";
import DataTable from "@/components/custom/DataTable";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { Trash2Icon } from "lucide-react";
import { TbEdit } from "react-icons/tb";

const columns: ColumnDef<Category>[] = [
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
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: boolean) => row.toggleSelected(!!value)}
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
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 justify-end">
        <TbEdit size={20} className="cursor-pointer" />
        <Trash2Icon size={20} color="#dc2626" className="cursor-pointer" />
      </div>
    ),
  },
];

export default function CategoriesList({ data }: { data: Category[] }) {
  return (
    <>
      <DataTable data={data} columns={columns} />
    </>
  );
}
