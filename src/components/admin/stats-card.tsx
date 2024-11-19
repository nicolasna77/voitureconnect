import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  className?: string;
  title: string;
  value: number | string;
  icon?: LucideIcon;
  description?: string;
  loading?: boolean;
}

export function StatsCard({
  className,
  title,
  value,
  icon: Icon,
  description,
  loading = false,
}: StatsCardProps) {
  if (loading) {
    return (
      <Card className={cn(className)}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            <Skeleton className="h-4 w-[150px]" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-[100px]" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn(className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
