import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Transaction {
  className?: string;
  id: string;
  amount: number;
  buyer: {
    name: string;
    email: string;
  };
  seller: {
    name: string;
    email: string;
  };
  createdAt: string;
}

interface RecentTransactionsProps {
  className?: string;
  transactions: Transaction[];
  loading?: boolean;
}

export function RecentTransactions({
  className,
  transactions,
  loading = false,
}: RecentTransactionsProps) {
  if (loading) {
    return (
      <Card className={cn("col-span-3", className)}>
        <CardHeader>
          <CardTitle>Transactions Récentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="h-10 w-10 animate-pulse bg-muted rounded-full" />
                <div className="space-y-2">
                  <div className="h-4 w-[200px] animate-pulse bg-muted rounded" />
                  <div className="h-3 w-[150px] animate-pulse bg-muted rounded" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Transactions Récentes</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center gap-4">
                <Avatar>
                  <AvatarFallback>
                    {transaction.buyer.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    {transaction.buyer.name} → {transaction.seller.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Intl.NumberFormat("fr-FR", {
                      style: "currency",
                      currency: "EUR",
                    }).format(transaction.amount)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
