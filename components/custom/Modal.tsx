"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export type ModalState = {
  title: ReactNode;
  description: ReactNode;
  children: ReactNode;
};

import { Dispatch, memo, ReactNode, SetStateAction } from "react";

function Modal({
  title,
  description,
  children,
  modalOpen,
  setModalOpen,
}: {
  title: ModalState["title"];
  description: ModalState["description"];
  children?: ModalState["children"];
  modalOpen?: boolean;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      <DialogContent
        onPointerDownOutside={() => setModalOpen(false)}
        aria-describedby={undefined}
        className="w-[90vw] lg:w-lg rounded-lg"
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DialogDescription asChild>{description}</DialogDescription>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default memo(Modal);
