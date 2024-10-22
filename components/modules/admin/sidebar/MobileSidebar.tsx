"use client";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

import Sidebar from "./Sidebar";
import { Dispatch, SetStateAction } from "react";
import { CiMenuBurger } from "react-icons/ci";
import Link from "next/link";

export default function MobileSidebar({
  className,
}: Readonly<{
  className?: string;
}>) {
  return (
    <div className={cn("", className)}>
      <Sheet>
        <SheetTrigger asChild>
          <CiMenuBurger className="lg:hidden" />
        </SheetTrigger>
        <SheetContent side="left">
          <Sidebar />
        </SheetContent>
      </Sheet>
    </div>
  );
}
