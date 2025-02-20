"use client";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Dispatch, memo, SetStateAction, useTransition } from "react";
import { deleteLabel } from "@/actions/Label";
import { notify } from "@/lib/utils";
import useLabelStore from "@/store/useLabelStore";

function DeleteLabel({
  itemId,
  setModalOpen,
}: {
  itemId: string;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const data = { id: itemId };

  const { data: labels, setData, fetchData: refresh } = useLabelStore();

  async function onSubmit() {
    setModalOpen(false);

    setData([
      ...labels.map((item) => {
        if (item.id === data.id) {
          const pendingItem = { ...item, isPending: true };
          return pendingItem;
        }
        return item;
      }),
    ]);

    const res: ActionResponse = await deleteLabel(data);
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

export default memo(DeleteLabel);
