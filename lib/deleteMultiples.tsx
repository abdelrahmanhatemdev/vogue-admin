import { deleteCategory } from "@/actions/Category";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Dispatch, SetStateAction, TransitionStartFunction, useTransition } from "react";
import { notify } from "./utils";
import { ModalState } from "@/components/custom/Modal";

interface DeleteMultipleProps {
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  setShowDeleteAll: Dispatch<SetStateAction<boolean>>;
  setModal: Dispatch<SetStateAction<ModalState>>;
  addOptimisticData: (
    action: Category[] | ((pendingState: Category[]) => Category[])
  ) => void;
  selectedRows: string[];
  isPending: boolean, 
  startTransition: TransitionStartFunction
}

function deleteMultiple({
  setModalOpen,
  setShowDeleteAll,
  setModal,
  selectedRows,
  addOptimisticData,
  isPending, 
  startTransition
}: DeleteMultipleProps) {
  setModalOpen(true);
  setModal({
    title: `Delete Categories`,
    description: (
      <p className="font-medium">
        Are you sure to
        {selectedRows.length === 1 ? (
          " delete the category "
        ) : (
          <strong> delete all categories </strong>
        )}
        permenantly ?
      </p>
    ),
    children: (
      <DialogFooter>
        <Button
          type="submit"
          variant="destructive"
          onClick={async () => {
            setModalOpen(false);
            setShowDeleteAll(false);
            startTransition(() => {
              addOptimisticData((prev: Category[]) => [
                ...prev.map((item) => {
                  if (selectedRows.includes(item.id)) {
                    const pendingItem = { ...item, isPending: !isPending };
                    return pendingItem;
                  }
                  return item;
                }),
              ]);
            });
            for (const row of selectedRows) {
              const data = { id: row };
              const res: ActionResponse = await deleteCategory(data);
              notify(res);
            }
          }}
        >
          Delete
        </Button>
      </DialogFooter>
    ),
  });
}

export default deleteMultiple;
