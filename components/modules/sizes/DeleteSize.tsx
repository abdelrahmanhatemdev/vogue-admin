"use client";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Dispatch, memo, SetStateAction, useTransition } from "react";
import { deleteSize } from "@/actions/Size";
import { notify } from "@/lib/utils";
import { useRefresh } from "@/hooks/useData";

function DeleteSize({
  itemId,
  setModalOpen,
  addOptimisticData,
}: {
  itemId: string;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  addOptimisticData: (
    action: Size[] | ((pendingState: Size[]) => Size[])
  ) => void;
}) {
  const data = { id: itemId };

  const [isPending, startTransition] = useTransition();
  const refresh = useRefresh()

  async function onSubmit() {
    setModalOpen(false);
    startTransition(() => {
      addOptimisticData((prev: Size[]) => [
        ...prev.map((item) => {
          if (item.id === data.id) {
            const pendingItem = { ...item, isPending: !isPending };
            return pendingItem;
          }
          return item;
        }),
      ]);
    });

    const res: ActionResponse = await deleteSize(data);
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

export default memo(DeleteSize);
