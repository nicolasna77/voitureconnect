"use client";

import { UsersTable } from "@/components/admin/UsersTable";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

export default function UsersAdminPage() {
  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-lg font-semibold">Gestion des Utilisateurs</h1>
      </header>
      <div className="p-6">
        <UsersTable />
      </div>
    </>
  );
}
