"use client";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Dispatch, memo, SetStateAction, useTransition } from "react";
import { deleteLabel } from "@/actions/Label";
import { notify } from "@/lib/utils";
import { useRefresh } from "@/hooks/useData";

function DeleteLabel({
  itemId,
  setModalOpen,
  addOptimisticData,
}: {
  itemId: string;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  addOptimisticData: (
    action: Label[] | ((pendingState: Label[]) => Label[])
  ) => void;
}) {
  const data = { id: itemId };

  const [isPending, startTransition] = useTransition();
  const refresh = useRefresh()

  async function onSubmit() {
    setModalOpen(false);
    startTransition(() => {
      addOptimisticData((prev: Label[]) => [
        ...prev.map((item) => {
          if (item.id === data.id) {
            const pendingItem = { ...item, isPending: !isPending };
            return pendingItem;
          }
          return item;
        }),
      ]);
    });

    const res: ActionResponse = await deleteLabel(data);
    notify(res);
    if (res?.status === "success") {
      refresh()
    }
  }

  return (
    <DialogFooter onClick={() => onSubmit()}>
      <Button type="submit" variant="destructive">
        Delete
      </Button>
    </DialogFooter>
  );
};

export default memo(DeleteLabel);
