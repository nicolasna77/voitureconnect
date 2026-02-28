import { Badge } from "@/components/ui/badge";
import { ScoreRing } from "@/components/ui/score-ring";

function getScoreLabel(score: number, locale: string) {
  if (locale === "fr") {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Bon";
    if (score >= 40) return "Moyen";
    return "Faible";
  }
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 40) return "Average";
  return "Poor";
}

export function ScoreDisplay({
  score,
  locale,
}: {
  score: number;
  locale: string;
}) {
  return (
    <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/40">
      <ScoreRing score={score} size={80} strokeWidth={7} />
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground font-medium">
          {locale === "fr" ? "Score de fiabilité" : "Reliability score"}
        </p>
        <Badge variant="secondary" className="text-sm px-2 py-0.5">
          {getScoreLabel(score, locale)}
        </Badge>
      </div>
    </div>
  );
}
