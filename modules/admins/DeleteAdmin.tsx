"use client";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Dispatch, memo, SetStateAction, useTransition } from "react";
import { deleteAdmin } from "@/actions/Admin";
import { notify } from "@/lib/utils";

function DeleteAdmin({
  itemId,
  itemUid,
  setModalOpen,
  addOptimisticData,
}: {
  itemId: string;
  itemUid: string;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  addOptimisticData: (
    action: Admin[] | ((pendingState: Admin[]) => Admin[])
  ) => void;
}) {
  const data = { id: itemId, uid: itemUid };

  const [isPending, startTransition] = useTransition();

  async function onSubmit() {
    setModalOpen(false);
    startTransition(() => {
      addOptimisticData((prev: Admin[]) => [
        ...prev.map((item) => {
          if (item.id === data.id) {
            const pendingItem = { ...item, isPending: !isPending };
            return pendingItem;
          }
          return item;
        }),
      ]);
    });

    const res: ActionResponse = await deleteAdmin(data);
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

export default memo(DeleteAdmin);
