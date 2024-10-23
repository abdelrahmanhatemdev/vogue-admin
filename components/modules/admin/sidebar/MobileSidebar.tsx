"use client";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CiMenuBurger } from "react-icons/ci";
import Link from "next/link";

export default function SheetDemo() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <CiMenuBurger className="lg:hidden" />
      </SheetTrigger>
      <SheetContent>
        <SheetContent side="left">
          <ul className="p-4 border-e border-solid border-stone-800 w-full">
            <li>
              <SheetClose asChild>
                <Link className="font-bold " href="/admin">
                  Dashboard
                </Link>
              </SheetClose>
            </li>
            <li>
              <SheetClose asChild>
                <SheetClose asChild>
                  <Link className="font-bold " href="/admin/users">
                    Users
                  </Link>
                </SheetClose>
              </SheetClose>
            </li>
            <li>
              <SheetClose asChild>
                <Link className="font-bold " href="/admin/categories">
                  Categories
                </Link>
              </SheetClose>
            </li>
          </ul>
        </SheetContent>
      </SheetContent>
    </Sheet>
  );
}
