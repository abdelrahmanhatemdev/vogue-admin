"use client";
import DataTable from "@/components/custom/DataTable";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { Trash2Icon } from "lucide-react";
import { TbEdit } from "react-icons/tb";
import { Dispatch, SetStateAction } from "react";
import EditCategory from "./EditCategory";
import { ModalProps } from "@/components/custom/Modal";
import DeleteCategory from "./DeleteCategory";

export default function CategoriesList({ 
  data, 
  setOpen, 
  setModal
}: { 
  data: Category[];
  setOpen: Dispatch<SetStateAction<boolean>>;
  setModal: Dispatch<SetStateAction<ModalProps>>; 
}) {

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
      cell: ({ row }) =>{
        const item: Category = row.original

        return  (
          <div className="flex items-center gap-2 justify-end">
            <TbEdit size={20} className="cursor-pointer"
            onClick={()=> {
              setOpen(true)
                setModal({
                  title: `Edit Category`, 
                  description: "Update Category here. Click Update when you'are done.",
                  children: <EditCategory item={item}/>, 
                  
                })
            }} 
            
            />
            <Trash2Icon size={20} color="#dc2626" className="cursor-pointer"
            onClick={()=> {
              setOpen(true)
                setModal({
                  title: `Delete Category`, 
                  description: <p className="font-medium">Are you sure To delete the category permenantly ?</p>,
                  children: <DeleteCategory item={item}/>, 
                  
                })
            }} 
            />
          </div>
        )
      }
    },
  ];

  return (
    <div className="pb-12">
      <DataTable data={data} columns={columns} />
    </div>
  );
}
