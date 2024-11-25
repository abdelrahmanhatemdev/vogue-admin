"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

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
  className
}: {
  title: ModalState["title"];
  description: ModalState["description"];
  children?: ModalState["children"];
  modalOpen?: boolean;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  className?: string
}) {
  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen} modal={true}>
      <DialogContent
        onPointerDownOutside={() => setModalOpen(false)}
        aria-describedby={undefined}
        className={cn("w-[90vw] rounded-lg lg:w-lg", className)}
        
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
