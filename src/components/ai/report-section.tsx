'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ReportSectionProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function ReportSection({ title, icon, children, className }: ReportSectionProps) {
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

interface ScoreDisplayProps {
  score: number;
  explanation?: string;
}

export function ScoreDisplay({ score, explanation }: ScoreDisplayProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 border-green-600';
    if (score >= 60) return 'text-yellow-600 border-yellow-600';
    if (score >= 40) return 'text-orange-600 border-orange-600';
    return 'text-red-600 border-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Bon';
    if (score >= 40) return 'Moyen';
    return 'Faible';
  };

  return (
    <div className="flex items-center gap-6">
      <div
        className={cn(
          'flex items-center justify-center w-24 h-24 rounded-full border-4',
          getScoreColor(score)
        )}
      >
        <div className="text-center">
          <span className="text-3xl font-bold">{score}</span>
          <span className="text-sm">/100</span>
        </div>
      </div>
      <div className="flex-1">
        <Badge variant={score >= 60 ? 'default' : 'destructive'} className="mb-2">
          {getScoreLabel(score)}
        </Badge>
        {explanation && <p className="text-sm text-muted-foreground">{explanation}</p>}
      </div>
    </div>
  );
}

interface FrequencyBadgeProps {
  frequency: 'rare' | 'occasional' | 'common' | 'very_common';
}

export function FrequencyBadge({ frequency }: FrequencyBadgeProps) {
  const config = {
    rare: { label: 'Rare', variant: 'outline' as const },
    occasional: { label: 'Occasionnel', variant: 'secondary' as const },
    common: { label: 'Frequent', variant: 'default' as const },
    very_common: { label: 'Tres frequent', variant: 'destructive' as const },
  };

  const { label, variant } = config[frequency];
  return <Badge variant={variant}>{label}</Badge>;
}

interface SeverityBadgeProps {
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export function SeverityBadge({ severity }: SeverityBadgeProps) {
  const config = {
    low: { label: 'Faible', className: 'bg-green-100 text-green-800' },
    medium: { label: 'Moyen', className: 'bg-yellow-100 text-yellow-800' },
    high: { label: 'Eleve', className: 'bg-orange-100 text-orange-800' },
    critical: { label: 'Critique', className: 'bg-red-100 text-red-800' },
  };

  const { label, className } = config[severity];
  return <Badge className={className}>{label}</Badge>;
}

interface PriorityBadgeProps {
  priority: 'low' | 'medium' | 'high';
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const config = {
    low: { label: 'Basse', variant: 'outline' as const },
    medium: { label: 'Moyenne', variant: 'secondary' as const },
    high: { label: 'Haute', variant: 'destructive' as const },
  };

  const { label, variant } = config[priority];
  return <Badge variant={variant}>{label}</Badge>;
}

interface RecommendationBadgeProps {
  recommendation: 'highly_recommended' | 'recommended' | 'neutral' | 'caution' | 'not_recommended';
}

export function RecommendationBadge({ recommendation }: RecommendationBadgeProps) {
  const config = {
    highly_recommended: { label: 'Tres recommande', className: 'bg-green-600 text-white' },
    recommended: { label: 'Recommande', className: 'bg-green-100 text-green-800' },
    neutral: { label: 'Neutre', className: 'bg-gray-100 text-gray-800' },
    caution: { label: 'Attention', className: 'bg-orange-100 text-orange-800' },
    not_recommended: { label: 'Deconseille', className: 'bg-red-100 text-red-800' },
  };

  const { label, className } = config[recommendation];
  return <Badge className={className}>{label}</Badge>;
}
