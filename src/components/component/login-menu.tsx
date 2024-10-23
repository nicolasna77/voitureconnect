import Link from "next/link";
import { auth, signOut } from "../../lib/auth";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import SignoutButton from "../auth/signout-button";

const LoginMenu = async () => {
  const session = await auth();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="gap-4 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src="/placeholder-user.jpg" />
            <AvatarFallback>
              {session?.user?.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem className="border-b">
          <div className="px-4 py-3 text-sm  ">
            <span className="font-medium block text-sm text-gray-900">
              {session?.user?.name}
            </span>
            <span className="font-medium block text-sm  text-gray-500   truncate">
              {session?.user?.email}
            </span>
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem>
          <Link
            href="/user/chat"
            className="flex items-center gap-2"
            prefetch={false}
          >
            <div className="h-4 w-4" />
            <span>Conversation</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem>
          <Link
            href="/user/ad"
            className="flex items-center gap-2"
            prefetch={false}
          >
            <div className="h-4 w-4" />
            <span>Mes annonces</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem>
          <Link
            href="/user/setting/profile"
            className="flex items-center gap-2"
            prefetch={false}
          >
            <div className="h-4 w-4" />
            <span>Parametre</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <SignoutButton />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default LoginMenu;
