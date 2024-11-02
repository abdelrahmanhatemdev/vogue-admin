"use client";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CiMenuBurger } from "react-icons/ci";
import Link from "next/link";
import { SidebarLinks } from "./AdminSidebar";
import { usePathname } from "next/navigation";



export default function MobileSidebar() {
  const currentPath = usePathname()
  return (
    <></>
    // <Sheet>
    //   <SheetTrigger asChild>
    //     <CiMenuBurger className="lg:hidden" />
    //   </SheetTrigger>
    //   <SheetContent>
    //     <SheetContent side="left">
    //       <ul className="p-4 border-e border-solid border-stone-800 w-full flex flex-col gap-2">
    //         {SidebarLinks.map((link) => (
    //           <li key={link.title}>
    //             <SheetClose asChild>
    //               <Link
    //                 className={"flex items-center gap-2 " + (currentPath === link.link ? "font-bold": "font-medium")}
    //                 href={`${link.link}`}
    //               >
    //                 {link.icon}
    //                 <span>{link.title}</span>
    //               </Link>
    //             </SheetClose>
    //           </li>
    //         ))}
    //       </ul>
    //     </SheetContent>
    //   </SheetContent>
    // </Sheet>
  );
}
