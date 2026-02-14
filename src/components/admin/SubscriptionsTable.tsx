"use client";

import { useQuery } from "@tanstack/react-query";
import { subscriptionApi } from "@/lib/actions/admin-dashboard";
import { useDebounce } from "@/hooks/use-debounce";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import PaginationComponent from "@/components/component/pagination";
import { PaginatedSubscriptions, SubscriptionRow } from "@/types/admin";

const planLabels: Record<string, string> = {
  BASIC: "Basic",
  PRO_STANDARD: "Pro Standard",
  PRO_PREMIUM: "Pro Premium",
};

const statusLabels: Record<string, string> = {
  active: "Actif",
  canceled: "Annulé",
  expired: "Expiré",
  past_due: "En retard",
};

function getPlanVariant(plan: string) {
  switch (plan) {
    case "PRO_PREMIUM":
      return "default" as const;
    case "PRO_STANDARD":
      return "secondary" as const;
    default:
      return "outline" as const;
  }
}

function getStatusVariant(status: string) {
  switch (status) {
    case "active":
      return "default" as const;
    case "canceled":
      return "destructive" as const;
    case "expired":
      return "secondary" as const;
    default:
      return "outline" as const;
  }
}

export function SubscriptionsTable() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const debouncedSearch = useDebounce(search, 300);

  const { data } = useQuery<PaginatedSubscriptions>({
    queryKey: ["admin-subscriptions", page, debouncedSearch, planFilter, statusFilter],
    queryFn: () =>
      subscriptionApi.getSubscriptions({
        page,
        search: debouncedSearch,
        plan: planFilter === "ALL" ? "" : planFilter,
        status: statusFilter === "ALL" ? "" : statusFilter,
      }),
  });

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const formatDate = (date: string) =>
    new Intl.DateTimeFormat("fr-FR").format(new Date(date));

  const formatAmount = (amount: number) =>
    new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(amount);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <Input
          aria-label="Rechercher par nom ou email"
          placeholder="Rechercher par nom ou email\u2026"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="max-w-sm"
        />
        <Select value={planFilter} onValueChange={(v) => { setPlanFilter(v); setPage(1); }}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrer par plan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tous les plans</SelectItem>
            <SelectItem value="BASIC">Basic</SelectItem>
            <SelectItem value="PRO_STANDARD">Pro Standard</SelectItem>
            <SelectItem value="PRO_PREMIUM">Pro Premium</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrer par statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tous les statuts</SelectItem>
            <SelectItem value="active">Actif</SelectItem>
            <SelectItem value="canceled">Annulé</SelectItem>
            <SelectItem value="expired">Expiré</SelectItem>
            <SelectItem value="past_due">En retard</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Utilisateur</TableHead>
            <TableHead>Plan</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Début</TableHead>
            <TableHead>Fin</TableHead>
            <TableHead>Montant</TableHead>
            <TableHead>Annuel</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.subscriptions.map((sub: SubscriptionRow) => (
            <TableRow key={sub.id}>
              <TableCell>
                <div>
                  <p className="font-medium">{sub.user.name}</p>
                  <p className="text-xs text-muted-foreground">{sub.user.email}</p>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={getPlanVariant(sub.plan)}>
                  {planLabels[sub.plan] || sub.plan}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(sub.status)}>
                  {statusLabels[sub.status] || sub.status}
                </Badge>
              </TableCell>
              <TableCell className="tabular-nums">{formatDate(sub.startDate)}</TableCell>
              <TableCell className="tabular-nums">{formatDate(sub.endDate)}</TableCell>
              <TableCell className="tabular-nums">{formatAmount(Number(sub.amount))}</TableCell>
              <TableCell>{sub.isAnnual ? "Oui" : "Non"}</TableCell>
            </TableRow>
          ))}
          {data?.subscriptions.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                Aucun abonnement trouvé
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {data && data.pages > 1 && (
        <PaginationComponent
          page={page}
          totalPages={data.pages}
          handlePageChange={setPage}
        />
      )}
    </div>
  );
}
