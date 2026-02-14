"use client";

import { useQuery } from "@tanstack/react-query";
import { Coins } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

async function fetchBalance(): Promise<{ balance: number }> {
  const response = await fetch("/api/credits/balance");
  if (!response.ok) {
    throw new Error("Failed to fetch balance");
  }
  return response.json();
}

interface CreditBalanceProps {
  className?: string;
}

export function CreditBalance({ className }: CreditBalanceProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["creditBalance"],
    queryFn: fetchBalance,
    staleTime: 1000 * 60, // 1 minute
  });

  const balance = data?.balance ?? 0;

  return (
    <Link
      href="/credits"
      className={cn(
        "flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-sm font-medium transition-colors hover:bg-secondary/80",
        className
      )}
    >
      <Coins className="h-4 w-4 text-amber-500" aria-hidden="true" />
      {isLoading ? (
        <span className="w-6 h-4 bg-muted-foreground/20 animate-pulse rounded" />
      ) : (
        <span className="tabular-nums">{balance}</span>
      )}
    </Link>
  );
}
