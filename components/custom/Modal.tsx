"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Dispatch, ReactNode, SetStateAction } from "react";

export default function Modal({
  title,
  description,
  children,
  open, 
  setOpen, 
  item
}: {
  title: string;
  description: string;
  children?: ReactNode;
  open?: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>
  item?: Category;
}) {
  return (
    <Dialog open={open} >
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
