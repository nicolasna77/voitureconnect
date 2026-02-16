import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

function getScoreColor(score: number) {
  if (score >= 80) return "text-green-600 border-green-500 bg-green-50";
  if (score >= 60) return "text-yellow-600 border-yellow-500 bg-yellow-50";
  if (score >= 40) return "text-orange-600 border-orange-500 bg-orange-50";
  return "text-red-600 border-red-500 bg-red-50";
}

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
    <div
      className={cn(
        "flex items-center justify-between p-3 rounded-lg border-2",
        getScoreColor(score),
      )}
    >
      <div>
        <p className="text-xs font-medium opacity-80">Score</p>
        <p className="text-2xl font-bold tabular-nums">{score}/100</p>
      </div>
      <Badge variant="secondary">{getScoreLabel(score, locale)}</Badge>
    </div>
  );
}
