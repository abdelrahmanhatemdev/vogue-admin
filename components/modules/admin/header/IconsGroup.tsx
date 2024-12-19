import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "lucide-react";
import Link from "next/link";
import { memo } from "react";
import { CiLogout } from "react-icons/ci";
import { IoSettingsOutline } from "react-icons/io5";
import Logout from "@/components/modules/admin/auth/Logout";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/ui/sidebar";
import { useSession } from "next-auth/react";

function IconsGroup() {
  const { data: session } = useSession();
  const user = session?.user;
  const { state } = useSidebar();
  return !user ? (
    <></>
  ) : (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          className="focus:ring-0 focus:bg-transparent data-[state=open]:bg-transparent
            "
        >
          <Link
            href="/admin/account"
            aria-label={`Sidebar Account Dropdown`}
            className="w-full flex gap-2"
          >
            <User size={30} />
          </Link>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 -start-4">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem className="flex gap-2 cursor-pointer">
              <IoSettingsOutline />
              <span>Setting</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem className="flex gap-2 cursor-pointer">
              <CiLogout />
              <Logout />
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

export default memo(IconsGroup);
