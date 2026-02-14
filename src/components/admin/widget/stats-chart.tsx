"use client";

import dynamic from "next/dynamic";
import { TrendingUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface MonthlyData {
  name: string;
  total: number;
}

interface StatsChartProps {
  data: MonthlyData[];
  title: string;
  description?: string;
  loading?: boolean;
  color?: string;
  className?: string;
  trend?: {
    percentage: number;
    period: string;
  };
}

// Loading skeleton for chart
function ChartSkeleton({ className = "col-span-4" }: { className?: string }) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-sm font-medium">
          <div className="h-4 w-[200px] animate-pulse bg-muted rounded" />
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[300px] flex items-center justify-center">
        <div className="h-full w-full animate-pulse bg-muted rounded" />
      </CardContent>
    </Card>
  );
}

// Inner chart component that imports Recharts
function StatsChartInner({
  data,
  title,
  description,
  loading = false,
  className = "col-span-4",
  trend,
}: StatsChartProps) {
  // Import Recharts only when this component renders (vercel-react-best-practices: bundle-dynamic-imports)
  const {
    Area,
    AreaChart,
    CartesianGrid,
    XAxis,
    ResponsiveContainer,
    Tooltip,
  } = require("recharts");

  if (loading) {
    return <ChartSkeleton className={className} />;
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value: string) => value.slice(0, 3)}
              stroke="#888888"
            />
            <Tooltip />
            <Area dataKey="total" type="natural" fillOpacity={0.4} />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
      {trend && (
        <CardFooter>
          <div className="flex w-full items-start gap-2 text-sm">
            <div className="grid gap-2">
              <div className="flex items-center gap-2 font-medium leading-none">
                {trend.percentage > 0 ? "En hausse de" : "En baisse de"}{" "}
                {Math.abs(trend.percentage)}% {trend.period}{" "}
                <TrendingUp className="h-4 w-4" aria-hidden="true" />
              </div>
              <div className="flex items-center gap-2 leading-none text-muted-foreground">
                {data[0]?.name} - {data[data.length - 1]?.name} {new Date().getFullYear()}
              </div>
            </div>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}

// Lazy load the entire chart component to reduce initial bundle (vercel-react-best-practices: bundle-dynamic-imports)
export const StatsChart = dynamic(
  () => Promise.resolve(StatsChartInner),
  {
    ssr: false,
    loading: () => <ChartSkeleton />,
  }
);
