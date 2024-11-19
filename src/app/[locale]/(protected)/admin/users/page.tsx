"use client";

import { UsersTable } from "@/components/admin/UsersTable";
import { userApi } from "@/services/api";
import { useQuery } from "@tanstack/react-query";

export default function UsersAdminPage() {
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: userApi.getUsers,
  });

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Gestion des Utilisateurs</h1>
      <UsersTable users={users} />
    </div>
  );
}
