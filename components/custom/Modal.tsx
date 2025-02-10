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
  title?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
  onPointerDownOutsideClose?: boolean;
  showHeader?: boolean
};

import { Dispatch, memo, ReactNode, SetStateAction } from "react";

function Modal({
  title,
  description,
  children,
  modalOpen,
  setModalOpen,
  className,
  onPointerDownOutsideClose = false,
  showHeader = true
}: {
  title: ModalState["title"];
  description: ModalState["description"];
  children?: ModalState["children"];
  modalOpen?: boolean;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  className?: string;
  onPointerDownOutsideClose?: boolean;
  showHeader? : ModalState["showHeader"]
}) {
  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen} modal={true}>
      <DialogContent
        onPointerDownOutside={(e) => {
          if (!onPointerDownOutsideClose) {
            e.preventDefault();
          }
        }}
        className={cn("w-[90vw] rounded-lg lg:w-lg", className)}
      >
        {showHeader && <DialogHeader>
          <DialogTitle>{title && title}</DialogTitle>
        </DialogHeader>}

        {description ? (
          <DialogDescription asChild>{description}</DialogDescription>
        ) : (
          <></>
        )}

        {children}
      </DialogContent>
    </Dialog>
  );
}

export default memo(Modal);
