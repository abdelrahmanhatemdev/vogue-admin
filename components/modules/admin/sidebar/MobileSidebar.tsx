"use client";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

import Sidebar from "./Sidebar";
import { Dispatch, SetStateAction, useState } from "react";
import { CiMenuBurger } from "react-icons/ci";
import Link from "next/link";

export default function MobileSidebar({
  className,
}: Readonly<{
  className?: string;
}>) {
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false)
  return (
    <div className={cn("", className)}>
      <Sheet open={open}>
        <SheetTrigger asChild>
          <CiMenuBurger className="lg:hidden" onClick={() => setOpen(true)}/>
        </SheetTrigger>
        <SheetContent side="left">
        <ul className="p-4 border-e border-solid border-stone-800 w-full">
          <li>
            <Link href="/admin" className="font-bold" onClick={close}>Dashboard</Link>
          </li>
          <li>
            <Link href="/admin/users" className="font-bold" onClick={close}>Users</Link>
          </li>
          <li>
            <Link href="/admin/categories" className="font-bold" onClick={close}>Categories</Link>
          </li>
        </ul>
        </SheetContent>
      </Sheet>
    </div>
  );
}
