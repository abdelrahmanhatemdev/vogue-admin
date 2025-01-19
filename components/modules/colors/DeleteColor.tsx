"use client";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Dispatch, memo, SetStateAction, useTransition } from "react";
import { deleteColor } from "@/actions/Color";
import { notify } from "@/lib/utils";
import { useRefresh } from "@/hooks/useData";

function DeleteColor({
  itemId,
  setModalOpen,
  addOptimisticData,
}: {
  itemId: string;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  addOptimisticData: (
    action: Color[] | ((pendingState: Color[]) => Color[])
  ) => void;
}) {
  const data = { uuid: itemId };

  const [isPending, startTransition] = useTransition();
  const refresh = useRefresh()

  async function onSubmit() {
    setModalOpen(false);
    startTransition(() => {
      addOptimisticData((prev: Color[]) => [
        ...prev.map((item) => {
          if (item.uuid === data.uuid) {
            const pendingItem = { ...item, isPending: !isPending };
            return pendingItem;
          }
          return item;
        }),
      ]);
    });

    const res: ActionResponse = await deleteColor(data);
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

export default memo(DeleteColor);
