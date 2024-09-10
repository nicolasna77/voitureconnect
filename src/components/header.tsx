import {
  Car,
  CarFront,
  CarIcon,
  CircleUser,
  Menu,
  MessageCircle,
  Package2,
  Search,
} from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import LoginMenu from "./component/login-menu";
import { auth } from "../../auth";
import { Input } from "./ui/input";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Header = async () => {
  const session = await auth();
  const link = [
    { name: "Dashboard", href: "/user/dashboard" },
    { name: "Rechercher", href: "/view" },
  ];

  return (
    <header className="sticky z-40 top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          <CarFront className="h-6 w-6" />
          <span className="sr-only">Acme Inc</span>
        </Link>
        {link.map((item, index) => (
          <Link
            href={item.href}
            key={index}
            className="text-foreground w-20 hover:underline transition-colors hover:text-foreground"
          >
            {item.name}
          </Link>
        ))}
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="#"
              className="flex items-center gap-2 text-lg font-semibold"
            >
              <Package2 className="h-6 w-6" />
              <span className="sr-only">Acme Inc</span>
            </Link>

            {link.map((item, index) => (
              <Link
                href={item.href}
                key={index}
                className="hover:text-foreground"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <div className="ml-auto gap-4 items-center flex ">
          <Button variant="outline">
            <Link href="/postProduct" prefetch={false}>
              Déposer une annonce
            </Link>
          </Button>
          <Button size="icon" variant={"ghost"}>
            <Link href="/user/chat" prefetch={false}>
              <MessageCircle className="h-6 w-6" />
              <span className="sr-only">Messagerie</span>
            </Link>
          </Button>
          {session ? (
            <LoginMenu />
          ) : (
            <Button variant="secondary" className="text-sm">
              <Link href="/login" prefetch={false}>
                Connexion
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
export default Header;
