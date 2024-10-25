"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export type ModalProps = {
  title: string;
  description: string;
  children: JSX.Element;
}

import { Dispatch, SetStateAction } from "react";


export default function Modal({
  title,
  description,
  children,
  open, 
  setOpen, 
  item
}: {
  title: ModalProps["title"];
  description: ModalProps["description"];
  children?: ModalProps["children"];
  open?: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>
  item?: Category;
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent onPointerDownOutside={() => setOpen(false)}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DialogDescription>{description}</DialogDescription>
        {children}
      </DialogContent>
    </Dialog>
  );
}
