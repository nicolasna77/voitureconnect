"use client";

import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { userApi } from "@/lib/actions/admin-user";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/use-debounce";
import { Role, User } from "@prisma/client";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useState } from "react";
import { Trash } from "lucide-react";
import PaginationComponent from "../component/pagination";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export function UsersTable() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const debouncedSearch = useDebounce(search, 300); // Ajout d'un délai de 300ms

  const { data } = useQuery({
    queryKey: ["users", page, debouncedSearch, roleFilter],
    queryFn: () =>
      userApi.getUsers({
        page,
        search: debouncedSearch,
        role: roleFilter === "ALL" ? "" : roleFilter,
      }),
  });

  const queryClient = useQueryClient();

  const updateRoleMutation = useMutation({
    mutationFn: userApi.updateUserRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Rôle mis à jour avec succès");
    },
    onError: () => {
      toast.error("Erreur lors de la modification du rôle", {
        description: "Veuillez réessayer plus tard",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: userApi.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Utilisateur supprimé avec succès");
      setUserToDelete(null);
    },
    onError: () => {
      toast.error("Erreur lors de la suppression", {
        description: "Veuillez réessayer plus tard",
      });
    },
  });

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleRoleFilter = (value: string) => {
    setRoleFilter(value);
    setPage(1);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Input
          aria-label="Rechercher un utilisateur"
          placeholder="Rechercher un utilisateur\u2026"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="max-w-sm"
        />
        <Select value={roleFilter} onValueChange={handleRoleFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrer par rôle" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tous les rôles</SelectItem>
            {Object.values(Role).map((role) => (
              <SelectItem key={role} value={role}>
                {role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Photo</TableHead>
            <TableHead>Nom</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Rôle</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.users.map((user: User) => (
            <TableRow key={user.id}>
              <TableCell className="max-w-[100px] truncate" title={user.id}>{user.id}</TableCell>
              <TableCell>
                <Avatar>
                  <AvatarFallback>{user.name?.[0]}</AvatarFallback>
                  <AvatarImage src={user.picture} alt={user.name || ""} />
                </Avatar>
              </TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Select
                  defaultValue={user.role ?? undefined}
                  onValueChange={(value) =>
                    updateRoleMutation.mutate({ userId: user.id, role: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(Role).map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <Button
                  size="icon"
                  variant="outline"
                  aria-label={`Supprimer ${user.name}`}
                  onClick={() => setUserToDelete(user)}
                >
                  <Trash className="w-4 h-4" aria-hidden="true" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {data?.pages > 1 && (
        <PaginationComponent
          page={page}
          totalPages={data.pages}
          handlePageChange={setPage}
        />
      )}
      <Dialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action
              est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUserToDelete(null)}>
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                userToDelete && deleteMutation.mutate(userToDelete.id)
              }
            >
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
