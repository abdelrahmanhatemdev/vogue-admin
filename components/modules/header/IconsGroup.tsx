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
import { useRouter } from "next/navigation";


function IconsGroup() {
  // const { data: session } = useSession();
  // const user = session?.user;

  const router = useRouter();
  
    const handleLogOut = async () => {
      // await signOut({ redirect: false });
      router.push("/login");
    };

  return true ?
  // user && user?.role === "admin" 
   (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          className="focus:ring-0 focus:bg-transparent data-[state=open]:bg-transparent
            "
        >
          <Link
            href="/account"
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
            <DropdownMenuItem className="flex gap-2 cursor-pointer" onClick={handleLogOut}>
              <CiLogout />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  ) : (
    <></>
  );
}

export default memo(IconsGroup);
