import Link from "next/link";
import { auth, signOut } from "../../../auth";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const LoginMenu = async () => {
  const session = await auth();
  console.log(session?.user);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="gap-4">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder-user.jpg" />
            <AvatarFallback></AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem className="border-b">
          <div className="px-4 py-3 text-sm text-gray-900 ">
            <div>{session?.user?.name}</div>
            <div className="font-medium truncate">{session?.user?.email}</div>
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem>
          <Link
            href="/user/setting"
            className="flex items-center gap-2"
            prefetch={false}
          >
            <div className="h-4 w-4" />
            <span>Parametre</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href="#" className="flex items-center gap-2" prefetch={false}>
            <div className="h-4 w-4" />
            <span>Cart</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href="#" className="flex items-center gap-2" prefetch={false}>
            <div className="h-4 w-4" />
            <span>Orders</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        <form
          action={async () => {
            "use server";
            await signOut();
          }}
        >
          <Button className="w-full" variant={"outline"} type="submit">
            Déconnexion
          </Button>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default LoginMenu;
