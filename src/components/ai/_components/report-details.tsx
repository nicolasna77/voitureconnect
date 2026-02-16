import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  FileText,
  MessageSquare,
  Newspaper,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface ReportDetailsProps {
  locale: "fr" | "en";
  commonProblems?: ({ title?: string } | undefined)[] | null;
  repairCosts?:
    | ({ item?: string; minCost?: number; maxCost?: number } | undefined)[]
    | null;
  overallSummary?: string | null;
  sources?:
    | ({
        name?: string;
        type?: "study" | "recall" | "forum" | "press" | "official";
        description?: string;
      } | undefined)[]
    | null;
}

const SOURCE_ICONS = {
  study: <BookOpen className="h-3 w-3 text-blue-500 shrink-0" aria-hidden="true" />,
  recall: <Shield className="h-3 w-3 text-red-500 shrink-0" aria-hidden="true" />,
  forum: <MessageSquare className="h-3 w-3 text-green-500 shrink-0" aria-hidden="true" />,
  press: <Newspaper className="h-3 w-3 text-purple-500 shrink-0" aria-hidden="true" />,
  official: <FileText className="h-3 w-3 text-orange-500 shrink-0" aria-hidden="true" />,
} as const;

export function ReportDetails({
  locale,
  commonProblems,
  repairCosts,
  overallSummary,
  sources,
}: ReportDetailsProps) {
  const t = useTranslations("AI.report");
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" size="sm" className="w-full justify-between">
          {locale === "fr" ? "Voir les details" : "View details"}
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-3 pt-3">
        {/* Common Problems Summary */}
        {commonProblems && commonProblems.length > 0 && (
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">
              {t("commonProblems")}
            </p>
            <ul className="space-y-1">
              {commonProblems.slice(0, 3).map((problem, i) => {
                if (!problem) return null;
                return (
                  <li key={i} className="text-xs flex items-start gap-1">
                    <span className="text-orange-500 mt-0.5">&bull;</span>
                    <span>{problem.title}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Repair Costs Summary */}
        {repairCosts && repairCosts.length > 0 && (
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">
              {t("repairCosts")}
            </p>
            <ul className="space-y-1">
              {repairCosts.slice(0, 3).map((cost, i) => {
                if (!cost) return null;
                return (
                  <li key={i} className="text-xs flex justify-between">
                    <span className="truncate mr-2">{cost.item}</span>
                    <span className="font-medium whitespace-nowrap tabular-nums">
                      {cost.minCost}-{cost.maxCost}&euro;
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Summary */}
        {overallSummary && (
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">
              {locale === "fr" ? "Resume" : "Summary"}
            </p>
            <p className="text-xs text-muted-foreground line-clamp-4">
              {overallSummary}
            </p>
          </div>
        )}

        {/* Sources */}
        {sources && sources.length > 0 && (
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">
              {locale === "fr" ? "Sources" : "Sources"}
            </p>
            <ul className="space-y-2">
              {sources.map((source, i) => {
                if (!source) return null;
                return (
                  <li
                    key={i}
                    className="text-xs flex items-start gap-2 p-2 rounded-md bg-muted/50"
                  >
                    {source.type ? (
                      SOURCE_ICONS[source.type]
                    ) : (
                      <BookOpen className="h-3 w-3 text-muted-foreground shrink-0" aria-hidden="true" />
                    )}
                    <div className="min-w-0">
                      <span className="font-medium">{source.name}</span>
                      {source.description && (
                        <p className="text-muted-foreground mt-0.5 leading-relaxed">
                          {source.description}
                        </p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}
