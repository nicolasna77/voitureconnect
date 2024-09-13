import {
  Car,
  CarFront,
  CarIcon,
  CircleUser,
  Heart,
  LogsIcon,
  Menu,
  MessageCircle,
  Package2,
  Search,
  SearchCheck,
  SearchIcon,
} from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import LoginMenu from "./component/login-menu";
import { auth } from "../../auth";
import { Input } from "./ui/input";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ChatBubbleIcon } from "@radix-ui/react-icons";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu";
import React from "react";
import { cn } from "@/lib/utils";
import { FcLike, FcLikePlaceholder, FcServices } from "react-icons/fc";

import { Separator } from "./ui/separator";

const Header = async () => {
  const session = await auth();
  const link = [{ name: "Dashboard", href: "/user/dashboard" }];

  return (
    <header className="sticky z-40 top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          href="/"
          className="flex items-center text-primary font-extrabold gap-2 text-2xl  "
        >
          <span>CarConnect</span>
        </Link>

        <NavigationMenu>
          <NavigationMenuList>
            {link.map((item, index) => (
              <NavigationMenuItem key={index}>
                <Link href={item.href} legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    {item.name}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            ))}

            <NavigationMenuItem>
              <NavigationMenuTrigger>Services</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <a
                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                        href="/"
                      >
                        <FcServices className="h-6 w-6" />
                        <div className="mb-2 mt-4 text-lg font-medium">
                          Nos services
                        </div>
                        <p className="text-sm leading-tight text-muted-foreground">
                          Nos services sont disponible pour vous aider a trouver
                          ou vendre votre vehicule
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <ListItem href="/docs" title="Verification sinistre ou Km">
                    Verifié si votre vehicule a deja eu un sinistre
                  </ListItem>
                  <ListItem href="/docs/installation" title="Prix carte grise ">
                    How to install dependencies and structure your app.
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
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

      <div className="flex w-full items-center gap-2 md:ml-auto md:gap-2 lg:gap-2">
        <div className="ml-auto gap-3 items-center flex ">
          <Button variant="outline">
            <Link href="/postProduct" prefetch={false}>
              Déposer une annonce
            </Link>
          </Button>
          <Separator orientation="vertical" className="h-6 w-0.5 bg-primary" />
          <Button size="icon" className="rounded-full" variant={"ghost"}>
            <Link href="/search" prefetch={false}>
              <SearchIcon className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Link>
          </Button>
          <Button size="icon" className="rounded-full" variant={"ghost"}>
            <Link href="/user/chat" prefetch={false}>
              <Heart className="h-5 w-5" />
              <span className="sr-only">Like</span>
            </Link>
          </Button>
          <Button size="icon" className="rounded-full" variant={"ghost"}>
            <Link href="/user/chat" prefetch={false}>
              <MessageCircle className="h-5 w-5" />
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

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-semibold leading-none ">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
