"use client";

import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import Link from "next/link";
import {
  Coins,
  ArrowUpCircle,
  ArrowDownCircle,
  Gift,
  RotateCcw,
  Car,
  Calendar,
  ExternalLink,
  Sparkles,
  ShoppingCart,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface CreditTransaction {
  id: string;
  type: "PURCHASE" | "CONSUMPTION" | "REFUND" | "BONUS";
  amount: number;
  description: string | null;
  createdAt: string;
}

interface CreditHistoryResponse {
  balance: number;
  transactions: CreditTransaction[];
}

interface VehicleDetails {
  make: string;
  model: string;
  serie: string | null;
  trim: string;
  years: string | null;
}

interface UnlockedSpec {
  id: string;
  specificationId: number;
  specificationType: string;
  creditCost: number;
  accessedAt: string;
  vehicle: VehicleDetails;
}

interface UnlockedResponse {
  unlocked: UnlockedSpec[];
}

async function fetchCreditHistory(): Promise<CreditHistoryResponse> {
  const response = await fetch("/api/credits/history");
  if (!response.ok) {
    throw new Error("Failed to fetch credit history");
  }
  return response.json();
}

async function fetchUnlockedSpecs(locale: string): Promise<UnlockedResponse> {
  const response = await fetch(`/api/credits/unlocked?locale=${locale}`);
  if (!response.ok) {
    throw new Error("Failed to fetch unlocked specs");
  }
  return response.json();
}

const transactionIcons = {
  PURCHASE: ArrowUpCircle,
  CONSUMPTION: ArrowDownCircle,
  REFUND: RotateCcw,
  BONUS: Gift,
} as const;

const transactionColors = {
  PURCHASE: "text-emerald-500",
  CONSUMPTION: "text-red-500",
  REFUND: "text-blue-500",
  BONUS: "text-amber-500",
} as const;

function CreditsSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function UserCreditsPage() {
  const t = useTranslations("Credits");
  const locale = useLocale();

  const {
    data: historyData,
    isLoading: historyLoading,
    error: historyError,
  } = useQuery({
    queryKey: ["creditHistory"],
    queryFn: fetchCreditHistory,
  });

  const { data: unlockedData, isLoading: unlockedLoading } = useQuery({
    queryKey: ["unlockedSpecs", locale],
    queryFn: () => fetchUnlockedSpecs(locale),
  });

  if (historyLoading) {
    return <CreditsSkeleton />;
  }

  if (historyError) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-destructive">{t("history.error")}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Balance Card */}
      <Card className="overflow-hidden">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="relative">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg">
                <Coins
                  className="h-10 w-10 text-white"
                  aria-hidden="true"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-emerald-500 border-2 border-background flex items-center justify-center">
                <Sparkles
                  className="h-3 w-3 text-white"
                  aria-hidden="true"
                />
              </div>
            </div>

            <div className="flex-1 space-y-2">
              <div>
                <p className="text-sm text-muted-foreground">
                  {t("yourBalance")}
                </p>
                <p className="text-4xl font-bold tabular-nums">
                  {historyData?.balance ?? 0}{" "}
                  <span className="text-lg font-normal text-muted-foreground">
                    {t("credits")}
                  </span>
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                {t("balanceDescription")}
              </p>
            </div>

            <Button asChild className="gap-2">
              <Link href="/credits">
                <ShoppingCart className="h-4 w-4" aria-hidden="true" />
                {t("buyCredits")}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Unlocked Specifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="h-5 w-5 text-primary" aria-hidden="true" />
            {t("unlocked.title")}
          </CardTitle>
          <CardDescription>
            {t("unlocked.description")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {unlockedLoading ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-24 w-full rounded-lg" />
              ))}
            </div>
          ) : unlockedData?.unlocked && unlockedData.unlocked.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {unlockedData.unlocked.map((spec) => (
                <Link
                  key={spec.id}
                  href={`/specification/${spec.specificationId}`}
                  className="group flex items-start gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Car className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium truncate">
                        {spec.vehicle.make} {spec.vehicle.model}
                      </p>
                      <ExternalLink
                        className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-hidden="true"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {spec.vehicle.serie && `${spec.vehicle.serie} - `}
                      {spec.vehicle.trim}
                    </p>
                    <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                      {spec.vehicle.years && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" aria-hidden="true" />
                          {spec.vehicle.years}
                        </span>
                      )}
                      <Badge variant="secondary" className="text-xs">
                        {spec.creditCost} {t("credit")}
                      </Badge>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <Car
                className="mx-auto h-12 w-12 text-muted-foreground/50"
                aria-hidden="true"
              />
              <p className="mt-2 text-muted-foreground">
                {t("unlocked.noSpecs")}
              </p>
              <Button asChild variant="outline" className="mt-4">
                <Link href="/specification">{t("unlocked.browseSpecs")}</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle>{t("history.transactions")}</CardTitle>
          <CardDescription>{t("history.transactionsDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          {historyData?.transactions && historyData.transactions.length > 0 ? (
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("history.type")}</TableHead>
                    <TableHead className="hidden sm:table-cell">
                      {t("history.description")}
                    </TableHead>
                    <TableHead>{t("history.date")}</TableHead>
                    <TableHead className="text-right">
                      {t("history.amount")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {historyData.transactions.map((transaction) => {
                    const Icon = transactionIcons[transaction.type];
                    const colorClass = transactionColors[transaction.type];

                    return (
                      <TableRow key={transaction.id}>
                        <TableCell>
                          <div className={`flex items-center gap-2 ${colorClass}`}>
                            <Icon className="h-4 w-4" aria-hidden="true" />
                            <span className="font-medium">
                              {t(`history.types.${transaction.type}`)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-muted-foreground">
                          {transaction.description || "-"}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(transaction.createdAt).toLocaleDateString(
                            locale === "fr" ? "fr-FR" : "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </TableCell>
                        <TableCell
                          className={`text-right font-semibold tabular-nums ${colorClass}`}
                        >
                          {transaction.amount > 0 ? "+" : ""}
                          {transaction.amount}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="py-8 text-center">
              <Coins
                className="mx-auto h-12 w-12 text-muted-foreground/50"
                aria-hidden="true"
              />
              <p className="mt-2 text-muted-foreground">
                {t("history.noTransactions")}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
