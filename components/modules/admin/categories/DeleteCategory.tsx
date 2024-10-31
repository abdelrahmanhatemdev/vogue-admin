"use client";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Dispatch, SetStateAction, useContext, useTransition } from "react";
import { deleteCategory } from "@/actions/Category";
import { notify } from "@/lib/utils";
import { OptimisticContext } from ".";

export default function DeleteCategory({
  item,
  setOpen,
}: {
  item: Category;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const data = { id: item.id };

  const [isPending, startTransition] = useTransition();

  const { addOptimisticData } = useContext(OptimisticContext);

  async function onSubmit() {
    setOpen(false);
    startTransition(() => {
      addOptimisticData((prev) => [
        ...prev.filter((item) => item.id !== data.id),
      ]);
    });
    
    const res: ActionResponse = await deleteCategory(data);
    notify(res);

    return isPending
  }

  return (
    <DialogFooter onClick={() => onSubmit()}>
      <Button type="submit" variant="destructive">
        Delete
      </Button>
    </DialogFooter>
  );
}
