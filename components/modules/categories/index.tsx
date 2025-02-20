"use client";
import { memo, useMemo, useState } from "react";
import type { ModalState } from "@/components/custom/Modal";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { TbEdit } from "react-icons/tb";
import { Trash2Icon } from "lucide-react";
import dynamic from "next/dynamic";
import Loading from "@/components/custom/Loading";
import { cn, notify } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { editCategory } from "@/actions/Category";
import useCategoryStore from "@/store/useCategoryStore";
import useLabelStore from "@/store/useLabelStore";
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
const EditCategory = dynamic(() => import("./EditCategory"), {
  loading: Loading,
});
const DeleteCategory = dynamic(() => import("./DeleteCategory"), {
  loading: Loading,
});
const CategoryList = dynamic(
  () => import("@/components/modules/categories/CategoryList"),
  { loading: Loading }
);

export type OptimisicDataType = Category & { isPending?: boolean };

function Categories() {
  const { data, setData, fetchData: refresh, loading } = useCategoryStore();
  const { data: labels } = useLabelStore();

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

  const columns: ColumnDef<OptimisicDataType>[] = useMemo(
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
          const item: OptimisicDataType = row.original;
          return (
            <Link
              href={`/categories/${item.slug}`}
              className={
                "hover:bg-neutral-200 dark:hover:bg-neutral-500 p-2 rounded-lg" +
                (item.isPending ? " opacity-50" : "")
              }
              title="Go to category page"
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
        id: "parent",
        accessorKey: "parent",
        header: "Parent",
        cell: ({ row }) => {
          const item: OptimisicDataType = row.original;
          return (
            <span className={"p-2" + (item.isPending ? " opacity-50" : "")}>
              {sortedData.find((cat) => cat.uuid === item.parent)?.name}
            </span>
          );
        },
      },
      {
        id: "label",
        accessorKey: "label",
        header: "label",
        cell: ({ row }) => {
          const item: OptimisicDataType = row.original;
          const label = labels.find((label) => label.uuid === item.label);
          return (
            <span className={"p-1" + (item.isPending ? " opacity-50" : "")}>
              <span
                className="p-1 rounded-md text-xs text-neutral-100"
                style={{ background: label?.hex }}
              >
                {label?.title}
              </span>
            </span>
          );
        },
      },
      {
        id: "additional",
        accessorKey: "additional",
        header: "Additional",
        cell: ({ row }) => {
          const item: OptimisicDataType = row.original;

          return (
            <span
              className={cn(
                `${item.isPending ? " opacity-50" : ""}`,
                "dark:border-border"
              )}
            >
              <Switch
                checked={item.additional}
                onCheckedChange={async () => {
                  const { additional, ...rest } = item;

                  const optimisticObj: OptimisicDataType = {
                    ...rest,
                    additional: !additional,
                    isPending: true,
                  };
                  setData([
                    ...data.filter((sub) => sub.id !== item.id),
                    optimisticObj,
                  ]);

                  const res: ActionResponse = await editCategory({
                    id: item.id,
                    property: "additional",
                    value: !item.additional,
                  });

                  notify(res);
                  if (res?.status === "success") {
                    refresh();
                  }
                }}
              />
            </span>
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
                      <EditCategory item={item} setModalOpen={setModalOpen} />
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
    [setModalOpen, setModal, data, labels]
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

        {loading && <Loading />}
        <CategoryList
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

export default memo(Categories);
