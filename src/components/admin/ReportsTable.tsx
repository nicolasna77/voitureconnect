"use client";

import { useState } from "react";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { reportApi } from "@/lib/actions/admin-reports";
import { toast } from "sonner";
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
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Check, X, Trash2 } from "lucide-react";
import PaginationComponent from "../component/pagination";

const STATUS_OPTIONS = ["PENDING", "RESOLVED", "DISMISSED", "ALL"] as const;

const statusBadgeVariant = (status: string) => {
  switch (status) {
    case "PENDING":
      return "default";
    case "RESOLVED":
      return "secondary";
    case "DISMISSED":
      return "outline";
    default:
      return "default";
  }
};

interface Report {
  id: string;
  reason: string;
  status: string;
  createdAt: string;
  comment: {
    id: string;
    content: string;
    user: { id: string; name: string; picture: string };
  };
  reporter: { id: string; name: string; picture: string };
}

export function ReportsTable() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("PENDING");
  const [reportToDelete, setReportToDelete] = useState<Report | null>(null);

  const { data } = useQuery({
    queryKey: ["admin-reports", page, statusFilter],
    queryFn: () => reportApi.getReports({ page, status: statusFilter }),
  });

  const queryClient = useQueryClient();

  const handleMutation = useMutation({
    mutationFn: reportApi.handleReport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-reports"] });
      toast.success("Action effectuée avec succès");
      setReportToDelete(null);
    },
    onError: () => {
      toast.error("Erreur lors de l'action", {
        description: "Veuillez réessayer plus tard",
      });
    },
  });

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    setPage(1);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Select value={statusFilter} onValueChange={handleStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrer par statut" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((status) => (
              <SelectItem key={status} value={status}>
                {status === "ALL" ? "Tous" : status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Commentaire</TableHead>
            <TableHead>Auteur</TableHead>
            <TableHead>Signaleur</TableHead>
            <TableHead>Raison</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.reports?.map((report: Report) => (
            <TableRow key={report.id}>
              <TableCell className="max-w-[200px] truncate" title={report.comment.content}>
                {report.comment.content}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage
                      src={report.comment.user.picture}
                      alt={report.comment.user.name}
                    />
                    <AvatarFallback>
                      {report.comment.user.name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{report.comment.user.name}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage
                      src={report.reporter.picture}
                      alt={report.reporter.name}
                    />
                    <AvatarFallback>
                      {report.reporter.name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{report.reporter.name}</span>
                </div>
              </TableCell>
              <TableCell className="max-w-[150px] truncate" title={report.reason}>
                {report.reason}
              </TableCell>
              <TableCell>
                <Badge variant={statusBadgeVariant(report.status)}>
                  {report.status}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {new Date(report.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {report.status === "PENDING" && (
                  <div className="flex items-center gap-1">
                    <Button
                      size="icon"
                      variant="outline"
                      title="Rejeter"
                      onClick={() =>
                        handleMutation.mutate({
                          reportId: report.id,
                          action: "dismiss",
                        })
                      }
                      disabled={handleMutation.isPending}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      title="Résoudre"
                      onClick={() =>
                        handleMutation.mutate({
                          reportId: report.id,
                          action: "resolve",
                        })
                      }
                      disabled={handleMutation.isPending}
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      title="Supprimer le commentaire"
                      onClick={() => setReportToDelete(report)}
                      disabled={handleMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                )}
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

      {/* Delete comment confirmation */}
      <Dialog
        open={!!reportToDelete}
        onOpenChange={() => setReportToDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer le commentaire</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce commentaire ? Cette action
              est irréversible et supprimera également tous les signalements
              associés.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReportToDelete(null)}>
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                reportToDelete &&
                handleMutation.mutate({
                  reportId: reportToDelete.id,
                  action: "delete_comment",
                })
              }
              disabled={handleMutation.isPending}
            >
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
