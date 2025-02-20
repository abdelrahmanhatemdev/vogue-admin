"use client";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Dispatch, memo, SetStateAction } from "react";
import { deleteSize } from "@/actions/Size";
import { notify } from "@/lib/utils";
import useSizeStore from "@/store/useSizeStore";

function DeleteSize({
  itemId,
  setModalOpen,
}: {
  itemId: string;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const data = { id: itemId };

  const { data: sizes, setData, fetchData: refresh } = useSizeStore();

  async function onSubmit() {
    setModalOpen(false);

    setData([
      ...sizes.map((item) => {
        if (item.id === data.id) {
          const pendingItem = { ...item, isPending: true };
          return pendingItem;
        }
        return item;
      }),
    ]);

    const res: ActionResponse = await deleteSize(data);
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

export default memo(DeleteSize);
