"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";

interface Recall {
  campaignNumber: string;
  component: string;
  summary: string;
  consequence: string;
  remedy: string;
  date: string;
  manufacturer: string;
  modelYear: string;
}

interface RecallsResponse {
  recalls: Recall[];
  count: number;
}

export function RecallsSection({
  makeName,
  modelName,
}: {
  makeName: string;
  modelName: string;
}) {
  const [expanded, setExpanded] = useState(false);

  const { data, isLoading } = useQuery<RecallsResponse>({
    queryKey: ["recalls", makeName, modelName],
    queryFn: async () => {
      const { data } = await axios.get(
        `/api/car/recalls?make=${encodeURIComponent(makeName)}&model=${encodeURIComponent(modelName)}`
      );
      return data;
    },
    staleTime: 24 * 60 * 60 * 1000,
    enabled: !!makeName && !!modelName,
  });

  if (isLoading) {
    return (
      <Card className="animate-pulse motion-reduce:animate-none">
        <CardHeader>
          <div className="h-5 bg-muted rounded w-1/2" />
        </CardHeader>
        <CardContent>
          <div className="h-20 bg-muted rounded" />
        </CardContent>
      </Card>
    );
  }

  const recalls = data?.recalls || [];
  const visibleRecalls = expanded ? recalls : recalls.slice(0, 3);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <AlertTriangle className="h-5 w-5 text-amber-500" aria-hidden="true" />
          Rappels constructeur (NHTSA)
          {recalls.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {recalls.length}
            </Badge>
          )}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Données issues de la NHTSA (National Highway Traffic Safety Administration)
        </p>
      </CardHeader>
      <CardContent>
        {recalls.length === 0 ? (
          <div className="flex items-center gap-3 py-4 text-muted-foreground">
            <ShieldCheck className="h-5 w-5 text-green-500" />
            <p>Aucun rappel connu pour ce modèle.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {visibleRecalls.map((recall) => (
              <div
                key={recall.campaignNumber}
                className="rounded-lg border p-4 space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs font-mono shrink-0">
                      {recall.campaignNumber}
                    </Badge>
                    {recall.modelYear && (
                      <Badge variant="secondary" className="text-xs">
                        {recall.modelYear}
                      </Badge>
                    )}
                  </div>
                  <time
                    dateTime={recall.date}
                    className="text-xs text-muted-foreground shrink-0"
                  >
                    {new Intl.DateTimeFormat(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    }).format(new Date(recall.date))}
                  </time>
                </div>
                <p className="text-sm font-medium">{recall.component}</p>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {recall.summary}
                </p>
              </div>
            ))}

            {recalls.length > 3 && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full"
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? (
                  <>
                    <ChevronUp className="h-4 w-4 mr-1" />
                    Voir moins
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4 mr-1" />
                    Voir les {recalls.length - 3} autres rappels
                  </>
                )}
              </Button>
            )}

            <a
              href={`https://www.nhtsa.gov/recalls?nhtsaId=${encodeURIComponent(makeName)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 rounded"
            >
              Voir sur NHTSA.gov
              <ExternalLink className="h-3 w-3" aria-hidden="true" />
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
