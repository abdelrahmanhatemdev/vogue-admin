"use client";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Dispatch, memo, SetStateAction, useTransition } from "react";
import { deleteCategory } from "@/actions/Category";
import { notify } from "@/lib/utils";

const DeleteCategory = function DeleteCategory({
  item,
  setOpen,
  addOptimisticData,
}: {
  item: Category;
  setOpen: Dispatch<SetStateAction<boolean>>;
  addOptimisticData: (
    action: Category[] | ((pendingState: Category[]) => Category[])
  ) => void;
}) {
  const data = { id: item.id };

  const [isPending, startTransition] = useTransition();

  async function onSubmit() {
    setOpen(false);
    startTransition(() => {
      addOptimisticData((prev) => [
        ...prev.filter((item) => item.id !== data.id),
      ]);
    });

    const res: ActionResponse = await deleteCategory(data);
    notify(res);

    return isPending;
  }

  return (
    <DialogFooter onClick={() => onSubmit()}>
      <Button type="submit" variant="destructive">
        Delete
      </Button>
    </DialogFooter>
  );
}

export default memo(DeleteCategory)