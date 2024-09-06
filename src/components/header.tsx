import { Car } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import LoginMenu from "./component/login-menu";
import { auth } from "../../auth";

const Header = async () => {
  const session = await auth();
  return (
    <header className="bg-primary-foreground z-30 fixed w-full text-primary px-4 lg:px-6 h-16 flex items-center">
      <Link href="/" className="flex items-center gap-2" prefetch={false}>
        <Car className="h-6 w-6" />
        <span className="text-xl font-bold">VoitureConnect</span>
      </Link>
      <nav className="ml-auto items-center flex gap-4 sm:gap-6">
        <Link
          href="/view"
          className="text-sm font-medium hover:underline underline-offset-4"
          prefetch={false}
        >
          Recherche
        </Link>
        <Link
          href="/user/dashboard"
          className="text-sm font-medium hover:underline underline-offset-4"
          prefetch={false}
        >
          Dashboard
        </Link>
        <Link
          href="/postProduct"
          className="text-sm font-medium hover:underline underline-offset-4"
          prefetch={false}
        >
          Déposer une annonce
        </Link>
        {!session ? (
          <Button variant={"outline"} className="text-sm">
            <Link href="/login" prefetch={false}>
              Sign In
            </Link>
          </Button>
        ) : (
          <LoginMenu />
        )}
      </nav>
    </header>
  );
};
export default Header;
