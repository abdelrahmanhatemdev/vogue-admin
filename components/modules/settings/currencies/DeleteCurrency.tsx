"use client";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Dispatch, memo, SetStateAction, useTransition } from "react";
import { deleteCurrency } from "@/actions/Currency";
import { notify } from "@/lib/utils";
import { useRefresh } from "@/hooks/useData";

function DeleteCurrency({
  itemId,
  setModalOpen,
  addOptimisticData,
}: {
  itemId: string;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  addOptimisticData: (
    action: Currency[] | ((pendingState: Currency[]) => Currency[])
  ) => void;
}) {
  const data = { uuid: itemId };

  const [isPending, startTransition] = useTransition();

  async function onSubmit() {
    setModalOpen(false);
    startTransition(() => {
      addOptimisticData((prev: Currency[]) => [
        ...prev.map((item) => {
          if (item.uuid === data.uuid) {
            const pendingItem = { ...item, isPending: !isPending };
            return pendingItem;
          }
          return item;
        }),
      ]);
    });

    const res: ActionResponse = await deleteCurrency(data);
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

export default memo(DeleteCurrency);
