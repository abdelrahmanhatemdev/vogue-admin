"use client";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Dispatch, memo, SetStateAction, useTransition } from "react";
import { deleteSubproduct } from "@/actions/Subproduct";
import { notify } from "@/lib/utils";
import { useRouter } from "next/navigation";

function DeleteSubproduct({
  itemId,
  setModalOpen,
  addOptimisticData,
  productSlug,
  redirect,
}: {
  itemId: string;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  addOptimisticData?: (
    action: Subproduct[] | ((pendingState: Subproduct[]) => Subproduct[])
  ) => void;
  productSlug?: string;
  redirect?: boolean;
}) {
  const data = { uuid: itemId };

  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  async function onSubmit() {
    setModalOpen(false);
    if (addOptimisticData) {
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
    }

    const res: ActionResponse = await deleteSubproduct(data);
    notify(res);

    if (redirect) {
      router.push(`/admin/products/${productSlug}`);
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

export default memo(DeleteSubproduct);
