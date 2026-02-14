"use client";

import { signOut } from "@/lib/auth-client";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

const SignoutButton = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <DropdownMenuItem
      onClick={handleSignOut}
      className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
    >
      <LogOut className="h-4 w-4" aria-hidden="true" />
      <span>Déconnexion</span>
    </DropdownMenuItem>
  );
};

export default SignoutButton;
