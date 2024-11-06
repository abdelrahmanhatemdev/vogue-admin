"use client";
import dynamic from "next/dynamic";
import { memo, useMemo, useOptimistic, useState } from "react";
import type { ModalState } from "@/components/custom/Modal";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { TbEdit } from "react-icons/tb";
import { Trash2Icon } from "lucide-react";
const Link = dynamic(() => import("next/link"));
const Heading = dynamic(() => import("@/components/custom/Heading"));
const AdminBreadcrumb = dynamic(() => import("@/components/custom/AdminBreadcrumb"));
const NoResults = dynamic(() => import("@/components/custom/NoResults"));
const Modal = dynamic(() => import("@/components/custom/Modal"));
const EditCategory = dynamic(() => import("./EditCategory"));
const DeleteCategory = dynamic(() => import("./DeleteCategory"));
const CategoryList = dynamic(() => import("@/components/modules/admin/categories/CategoryList"));

function Categories({ data }: { data: Category[] }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modal, setModal] = useState<ModalState>({
    title: "",
    description: "",
    children: <></>,
  });

  const [optimisicData, addOptimisticData] = useOptimistic(data);

  const sortedOptimisicData = useMemo(() => {
    return optimisicData?.length
      ? optimisicData.sort((a: Category, b: Category) =>
          b.updatedAt.localeCompare(a.updatedAt)
        )
      : [];
  }, [optimisicData]);

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
        size: 40,
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
              className={
                "hover:bg-main-200 p-2 rounded-lg" +
                (item.isPending ? " opacity-50" : "")
              }
              title="Go to Category page"
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
                  setModalOpen(true);
                  setModal({
                    title: `Edit Category`,
                    description:
                      "Update Category here. Click Update when you'are done.",
                    children: (
                      <EditCategory
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
                    title: `Delete Category`,
                    description: (
                      <p className="font-medium">
                        Are you sure To delete the category permenantly ?
                      </p>
                    ),
                    children: (
                      <DeleteCategory
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
      
        <AdminBreadcrumb page="Categories" />
      <div className="flex flex-col gap-4 rounded-lg p-8 bg-background">
        
          <div className="flex justify-between items-center">
            <Heading
              title="Categories"
              description="Here's a list of your categories!"
            />
          </div>
        {data?.length ? (
          
            <CategoryList
              data={sortedOptimisicData}
              columns={columns}
              setModalOpen={setModalOpen}
              setModal={setModal}
              addOptimisticData={addOptimisticData}
            />
        ) : (
          <NoResults title="Add some categories to show data!"/>
        )}
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

export default memo(Categories)
