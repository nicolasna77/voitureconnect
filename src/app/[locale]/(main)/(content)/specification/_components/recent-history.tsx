"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "@/lib/auth-client";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { Clock, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface HistoryEntry {
  id: string;
  generationId: number;
  makeName: string;
  modelName: string;
  generationName: string;
  imageUrl: string | null;
  visitedAt: string;
}

export function RecentHistory() {
  const { data: sessionData } = useSession();

  const { data: history } = useQuery<HistoryEntry[]>({
    queryKey: ["viewHistory"],
    queryFn: async () => {
      const { data } = await axios.get("/api/history");
      return data;
    },
    enabled: !!sessionData?.user,
    staleTime: 30 * 1000,
  });

  if (!sessionData?.user || !history?.length) return null;

  const recent = history.slice(0, 5);

  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        <h2 className="text-sm font-medium text-muted-foreground">
          Consultés récemment
        </h2>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
        {recent.map((entry) => (
          <Link
            key={entry.id}
            href={`/specification/${entry.generationId}`}
            className="shrink-0"
          >
            <Card className="w-48 hover:border-primary/50 transition-colors cursor-pointer">
              <CardContent className="p-3">
                <div className="flex items-center gap-2.5 mb-2">
                  {entry.imageUrl ? (
                    <div className="relative w-8 h-8 rounded bg-white shrink-0 overflow-hidden">
                      <Image
                        src={entry.imageUrl}
                        alt={entry.makeName}
                        fill
                        sizes="32px"
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                      {entry.makeName.charAt(0)}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">
                      {entry.makeName} {entry.modelName}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {entry.generationName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <ChevronRight className="h-3 w-3 mr-0.5" />
                  Voir la fiche
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
