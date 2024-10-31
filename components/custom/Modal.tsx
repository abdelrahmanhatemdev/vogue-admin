"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export type ModalProps = {
  title: ReactNode;
  description: ReactNode;
  children: ReactNode;
}

import { Dispatch, memo, ReactNode, SetStateAction } from "react";


const Modal = memo(function Modal({
  title,
  description,
  children,
  open, 
  setOpen
}: {
  title: ModalProps["title"];
  description: ModalProps["description"];
  children?: ModalProps["children"];
  open?: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent onPointerDownOutside={() => setOpen(false)}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DialogDescription asChild>{description}</DialogDescription>
        {children}
      </DialogContent>
    </Dialog>
  );
})

export default Modal
