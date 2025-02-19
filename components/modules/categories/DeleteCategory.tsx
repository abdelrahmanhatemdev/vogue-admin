"use client";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Dispatch, memo, SetStateAction } from "react";
import { deleteCategory } from "@/actions/Category";
import { notify } from "@/lib/utils";
import useCategoryStore from "@/store/useCategoryStore";

function DeleteCategory({
  itemId,
  setModalOpen,
}: {
  itemId: string;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const data = { id: itemId };
  const { data: categories, fetchData: refresh, setData } = useCategoryStore();

  async function onSubmit() {
    setModalOpen(false);

    setData([
      ...categories.map((item) => {
        if (item.id === data.id) {
          const pendingItem = { ...item, isPending: true };
          return pendingItem;
        }
        return item;
      }),
    ]);

    const res: ActionResponse = await deleteCategory(data);
    notify(res);
    if (res?.status === "success") {
      refresh();
    }
  }

  return (
    <DialogFooter onClick={() => onSubmit()}>
      <Button type="submit" variant="destructive">
        Delete
      </Button>
    </DialogFooter>
  );
}

export default memo(DeleteCategory);
