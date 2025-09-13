"use client";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Dispatch, memo, SetStateAction } from "react";
import { deleteBrand } from "@/actions/Brand";
import { notify } from "@/lib/utils";
import useBrandStore from "@/store/useBrandStore";

function DeleteBrand({
  itemId,
  setModalOpen,
}: {
  itemId: string;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const data = { id: itemId };

  const { fetchData: refresh, data: brands, setData } = useBrandStore();

  async function onSubmit() {
    setModalOpen(false);

    setData([
      ...brands.map((item) => {
        if (item.id === data.id) {
          const pendingItem = { ...item, isPending: true };
          return pendingItem;
        }
        return item;
      }),
    ]);

    const res: ActionResponse = await deleteBrand(data);
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

export default memo(DeleteBrand);
