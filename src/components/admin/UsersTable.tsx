import { useQueryClient, useMutation } from "@tanstack/react-query";
import { userApi } from "@/services/api";
import { toast } from "@/hooks/use-toast";
import { User } from "@prisma/client";
import { Button } from "../ui/button";
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
  SelectItem,
  SelectContent,
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

export function UsersTable({ users }: { users: User[] }) {
  const queryClient = useQueryClient();
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const updateRoleMutation = useMutation({
    mutationFn: userApi.updateUserRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({ title: "Rôle mis à jour avec succès" });
    },
    onError: () => {
      toast({
        title: "Erreur lors de la modification du rôle",
        description: "Veuillez réessayer plus tard",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: userApi.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({ title: "Utilisateur supprimé avec succès" });
      setUserToDelete(null);
    },
    onError: () => {
      toast({
        title: "Erreur lors de la suppression",
        description: "Veuillez réessayer plus tard",
      });
    },
  });

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Nom</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Rôle</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.id}</TableCell>
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
                    <SelectItem value="ADMIN">ADMIN</SelectItem>
                    <SelectItem value="USER">USER</SelectItem>
                    <SelectItem value="PRO">PRO</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <Button
                  size={"icon"}
                  variant={"outline"}
                  onClick={() => setUserToDelete(user)}
                  className="flex items-center gap-2"
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

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
    </>
  );
}
