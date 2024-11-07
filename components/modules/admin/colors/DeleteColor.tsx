"use client";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Dispatch, memo, SetStateAction, useTransition } from "react";
import { deleteColor } from "@/actions/Color";
import { notify } from "@/lib/utils";

function DeleteColor({
  item,
  setModalOpen,
  addOptimisticData,
}: {
  item: Color;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  addOptimisticData: (
    action: Color[] | ((pendingState: Color[]) => Color[])
  ) => void;
}) {
  const data = { id: item.id };

  const [isPending, startTransition] = useTransition();

  async function onSubmit() {
    setModalOpen(false);
    startTransition(() => {
      addOptimisticData((prev: Color[]) => [
        ...prev.map((item) => {
          if (item.id === data.id) {
            const pendingItem = { ...item, isPending: !isPending };
            return pendingItem;
          }
          return item;
        }),
      ]);
    });

    const res: ActionResponse = await deleteColor(data);
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

export default memo(DeleteColor);
