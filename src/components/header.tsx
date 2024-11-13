"use server";
import { Heart, Menu, SearchIcon } from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "./ui/button";
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
import { getTranslations } from "next-intl/server";
import { auth } from "@/lib/auth";
import LocaleSwitcher from "./local-switcher";

const Header = async () => {
  const session = await auth();
  const t = await getTranslations("Header");

  const link = [
    { name: t("navigation.pro"), href: "/pro", isAdmin: false },
    {
      name: "admin",
      href: "/admin",
      isAdmin: session?.user?.role === "ADMIN",
    },
    { name: t("navigation.specs"), href: "/specification" },
  ];
  return (
    <header className="sticky z-40 top-0 flex h-16 items-center gap-4 border-b bg-white px-4 md:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 lg:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">{t("navigation.menu")}</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="/"
              className="flex items-center text-primary gap-2 text-2xl font-semibold"
            >
              CarConnect
            </Link>
            {link
              .filter((item) => !item.hasOwnProperty("isAdmin") || item.isAdmin)
              .map((item, index) => (
                <Link
                  href={item.href}
                  key={index}
                  className="hover:text-foreground"
                >
                  {item.name}
                </Link>
              ))}

            <Link href={"/search"} prefetch={false} className="flex gap-2">
              <SearchIcon className="h-5 w-5" />
              <span>{t("navigation.search")}</span>
            </Link>
            <Link href="/user/favorite" className="flex gap-2" prefetch={false}>
              <Heart className="h-5 w-5" />
              <span>{t("navigation.favorites")}</span>
            </Link>
            <Link
              href="/postProduct"
              prefetch={false}
              className="w-full rounded-md border border-border text-center py-2 px-4"
            >
              {t("navigation.postAd")}
            </Link>
          </nav>
          <div className="flex bottom-4  justify-center">
            <LocaleSwitcher />
          </div>
        </SheetContent>
      </Sheet>
      <Link href="/" className="text-primary font-extrabold text-2xl">
        CarConnect
      </Link>
      <nav className="hidden lg:flex lg:items-center lg:gap-5">
        <NavigationMenu>
          <NavigationMenuList>
            {link
              .filter((item) => !item.hasOwnProperty("isAdmin") || item.isAdmin)
              .map((item, index) => (
                <NavigationMenuItem key={index}>
                  <Link href={item.href} legacyBehavior passHref>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      {item.name}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}

            <NavigationMenuItem>
              <NavigationMenuTrigger>
                {t("navigation.services")}
              </NavigationMenuTrigger>
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
                          {t("services.title")}
                        </div>
                        <p className="text-sm leading-tight text-muted-foreground">
                          {t("services.description")}
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <ListItem
                    href="/docs"
                    title={t("services.accidentCheck.title")}
                  >
                    {t("services.accidentCheck.description")}
                  </ListItem>
                  <ListItem
                    href="/valorCg"
                    title={t("services.registrationPrice.title")}
                  >
                    {t("services.registrationPrice.description")}
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </nav>

      <div className="flex w-full items-center gap-2 md:ml-auto">
        <div className="ml-auto flex items-center gap-3 ">
          <div className=" hidden lg:flex items-center gap-3">
            <LocaleSwitcher />
            <Link
              href="/postProduct"
              prefetch={false}
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              {t("navigation.postAd")}
            </Link>
            <Separator
              orientation="vertical"
              className="h-6 w-0.5 bg-primary"
            />

            <Link
              href="/search"
              prefetch={false}
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "rounded-full"
              )}
            >
              <SearchIcon className="h-5 w-5" />
              <span className="sr-only">Recherche</span>
            </Link>
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
