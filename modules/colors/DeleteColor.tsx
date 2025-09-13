"use client";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Dispatch, memo, SetStateAction } from "react";
import { deleteColor } from "@/actions/Color";
import { notify } from "@/lib/utils";
import useColorStore from "@/store/useColorStore";

function DeleteColor({
  itemId,
  setModalOpen,
}: {
  itemId: string;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const data = { id: itemId };

  const { data: colors, setData, fetchData: refresh } = useColorStore();

  async function onSubmit() {
    setModalOpen(false);

    setData([
      ...colors.map((item) => {
        if (item.id === data.id) {
          const pendingItem = { ...item, isPending: true };
          return pendingItem;
        }
        return item;
      }),
    ]);

    const res: ActionResponse = await deleteColor(data);
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

export default memo(DeleteColor);
