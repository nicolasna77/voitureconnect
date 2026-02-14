"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import SignoutButton from "./signout-button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useSession } from "@/lib/auth-client";
import { Coins, Settings, Heart, Shield, FileText, Home } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

function MenuLink({
  href,
  icon: Icon,
  children,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <DropdownMenuItem asChild>
      <Link href={href} className="flex items-center gap-2 cursor-pointer">
        <Icon className="h-4 w-4" aria-hidden="true" />
        <span>{children}</span>
      </Link>
    </DropdownMenuItem>
  );
}

export default function LoginMenu() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return <Skeleton className="h-9 w-9 rounded-full" />;
  }

  if (!session?.user) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/login">Connexion</Link>
        </Button>
        <Button size="sm" asChild>
          <Link href="/register">S'inscrire</Link>
        </Button>
      </div>
    );
  }

  const user = session.user;
  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user.email?.charAt(0).toUpperCase() || "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size={"icon"}
          className="flex items-center gap-2 px-2"
        >
          <Avatar className="h-9 w-9">
            <AvatarImage
              src={user.image || undefined}
              alt={user.name || "Avatar"}
            />
            <AvatarFallback className="bg-secondary-foreground text-primary-foreground text-sm">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground truncate">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Navigation */}
        <MenuLink href="/" icon={Home}>
          Accueil
        </MenuLink>

        <MenuLink href="/specification" icon={FileText}>
          Fiches techniques
        </MenuLink>

        <DropdownMenuSeparator />

        {/* User actions */}
        <MenuLink href="/user/favorite" icon={Heart}>
          Mes favoris
        </MenuLink>
        <MenuLink href="/credits" icon={Coins}>
          Acheter des crédits
        </MenuLink>
        <MenuLink href="/setting/profile" icon={Settings}>
          Paramètres
        </MenuLink>

        {user.role === "ADMIN" && (
          <>
            <DropdownMenuSeparator />
            <MenuLink href="/admin" icon={Shield}>
              Administration
            </MenuLink>
          </>
        )}

        <DropdownMenuSeparator />
        <SignoutButton />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
