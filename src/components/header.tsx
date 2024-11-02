"use server";
import { Heart, Menu, SearchIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
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
import { FcServices } from "react-icons/fc";
import { Separator } from "./ui/separator";
import LoginMenu from "./auth/login-menu";
import { Session } from "next-auth";
import { auth } from "@/lib/auth";

const Header = async () => {
  const session = await auth();
  const link = [
    { name: "Pro", href: "/pro" },
    { name: "Fiche technique", href: "/specification" },
  ];
  return (
    <header className="sticky z-40 top-0 flex h-16 items-center gap-4 border-b bg-white px-4 md:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Menu de navigation</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="/"
              className="flex items-center text-primary gap-2 text-2xl font-semibold"
            >
              CarConnect
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

            <Link href={"/search"} prefetch={false} className="flex  gap-2">
              <SearchIcon className="h-5 w-5" />
              <span>Recherche</span>
            </Link>
            <Link
              href="/user/favorite"
              className="flex  gap-2"
              prefetch={false}
            >
              <Heart className="h-5 w-5" />
              <span>Mes favoris</span>
            </Link>
            <Link
              href="/postProduct"
              prefetch={false}
              className="w-full rounded-md border border-border text-center py-2 px-4"
            >
              Déposer une annonce
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
      <Link href="/" className="text-primary font-extrabold text-2xl">
        CarConnect
      </Link>
      <nav className="hidden md:flex md:items-center md:gap-5 lg:gap-6">
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
                          Nos services sont disponibles pour vous aider à
                          trouver ou vendre votre véhicule
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <ListItem href="/docs" title="Vérification sinistre ou Km">
                    Vérifiez si votre véhicule a déjà eu un sinistre
                  </ListItem>
                  <ListItem href="/valorCg" title="Prix carte grise">
                    Calculez le prix de votre carte grise
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </nav>

      <div className="flex w-full items-center gap-2 md:ml-auto">
        <div className="ml-auto flex items-center gap-3 ">
          <div className=" hidden md:flex items-center gap-3">
            <Button variant="outline">
              <Link href="/postProduct" prefetch={false}>
                Déposer une annonce
              </Link>
            </Button>
            <Separator
              orientation="vertical"
              className="h-6 w-0.5 bg-primary"
            />
            <Button size="icon" className="rounded-full" variant="ghost">
              <Link href="/search" prefetch={false}>
                <SearchIcon className="h-5 w-5" />
                <span className="sr-only">Recherche</span>
              </Link>
            </Button>
          </div>
          <div className="flex justify-end ml-auto">
            <LoginMenu session={session as Session} />
          </div>
        </div>
      </div>
    </header>
  );
};
export default Header;

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => (
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
        <div className="text-sm font-semibold leading-none">{title}</div>
        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
          {children}
        </p>
      </a>
    </NavigationMenuLink>
  </li>
));
ListItem.displayName = "ListItem";
