"use client";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Dispatch, memo, SetStateAction, useTransition } from "react";
import { deleteSubproduct } from "@/actions/Subproduct";
import { notify } from "@/lib/utils";

function DeleteSubproduct({
  itemId,
  setModalOpen,
  addOptimisticData,
  productId
}: {
  itemId: string;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  addOptimisticData: (
    action: Subproduct[] | ((pendingState: Subproduct[]) => Subproduct[])
  ) => void;
  productId: string;
}) {
  const data = { id: itemId, productId };

  const [isPending, startTransition] = useTransition();

  async function onSubmit() {
    setModalOpen(false);
    startTransition(() => {
      addOptimisticData((prev: Subproduct[]) => [
        ...prev.map((item) => {
          if (item.id === itemId) {
            const pendingItem = { ...item, isPending: !isPending };
            return pendingItem;
          }
          return item;
        }),
      ]);
    });

    const res: ActionResponse = await deleteSubproduct(data);
    notify(res);
  }

  return (
    <DialogFooter onClick={() => onSubmit()}>
      <Button type="submit" variant="destructive">
        Delete
      </Button>
    </DialogFooter>
  );
};

export default memo(DeleteSubproduct);
