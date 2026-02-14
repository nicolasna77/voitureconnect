'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { experimental_useObject as useObject } from '@ai-sdk/react';
import Link from 'next/link';
import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Gauge,
  Loader2,
  Lock,
  Coins,
  Unlock,
} from 'lucide-react';

import { reliabilityReportSchema } from '@/lib/ai/schemas';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { useAIAccess } from '@/hooks/use-ai-access';

interface AIReliabilityWidgetProps {
  generationId: number;
  locale: 'fr' | 'en';
}

export function AIReliabilityWidget({ generationId, locale }: AIReliabilityWidgetProps) {
  const t = useTranslations('AI.report');
  const tCredits = useTranslations('Credits');
  const [isExpanded, setIsExpanded] = useState(false);

  const {
    data: accessState,
    isLoading: isLoadingAccess,
    isError: isAccessError,
    consume,
    isConsuming,
  } = useAIAccess(generationId);

  const { object, submit, isLoading, error } = useObject({
    api: '/api/ai/report',
    schema: reliabilityReportSchema,
  });

  const handleGenerate = () => {
    submit({ generationId, locale });
  };

  const handleUnlock = () => {
    consume();
  };

  // Show loading state while checking access
  if (isLoadingAccess) {
    return (
      <Card className="sticky top-4">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Gauge className="h-4 w-4" />
            {t('title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  // Show error state if access check failed - but allow generation anyway
  if (isAccessError) {
    return (
      <Card className="sticky top-4">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Gauge className="h-4 w-4" />
            {t('title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <AlertTriangle className="w-8 h-8 mx-auto text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {locale === 'fr' ? 'Service temporairement indisponible' : 'Service temporarily unavailable'}
          </p>
        </CardContent>
      </Card>
    );
  }

  const hasAccess = accessState?.hasAccess ?? false;
  const isAuthenticated = accessState?.isAuthenticated ?? false;
  const creditBalance = accessState?.creditBalance ?? 0;
  const creditCost = accessState?.creditCost ?? 1;
  const requiresCredits = accessState?.requiresCredits ?? true;

  // Show access gate if user doesn't have access
  if (!hasAccess && requiresCredits) {
    // Not authenticated
    if (!isAuthenticated) {
      return (
        <Card className="sticky top-4 border-2 border-primary/20 bg-primary/5">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Gauge className="h-4 w-4" />
              {t('title')}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <Lock className="w-10 h-10 mx-auto text-primary" aria-hidden="true" />
            <p className="text-sm text-muted-foreground">
              {locale === 'fr' ? 'Connectez-vous pour acceder a l\'analyse IA' : 'Login to access AI analysis'}
            </p>
            <Link href="/login">
              <Button size="sm" className="w-full">{tCredits('login')}</Button>
            </Link>
          </CardContent>
        </Card>
      );
    }

    // Authenticated but no access - need to unlock
    const canUnlock = creditBalance >= creditCost;

    return (
      <Card className="sticky top-4 border-2 border-primary/20 bg-primary/5">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Gauge className="h-4 w-4" />
            {t('title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <Lock className="w-10 h-10 mx-auto text-primary mb-2" aria-hidden="true" />
            <p className="text-sm font-medium">
              {locale === 'fr' ? 'Debloquer l\'analyse IA' : 'Unlock AI Analysis'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {locale === 'fr'
                ? 'Obtenez un rapport detaille sur la fiabilite de ce vehicule'
                : 'Get a detailed reliability report for this vehicle'}
            </p>
          </div>

          <div className="flex items-center justify-between p-3 bg-background rounded-lg text-sm">
            <div className="flex items-center gap-2">
              <Coins className="w-4 h-4 text-yellow-500" aria-hidden="true" />
              <span>{tCredits('yourBalance')}</span>
            </div>
            <span className="font-bold">{creditBalance} {tCredits('credits')}</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-background rounded-lg text-sm">
            <span>{tCredits('cost')}</span>
            <span className="font-bold">{creditCost} {tCredits('credit')}</span>
          </div>

          {canUnlock ? (
            <Button
              className="w-full"
              size="sm"
              onClick={handleUnlock}
              disabled={isConsuming}
            >
              {isConsuming ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" aria-hidden="true" />
              ) : (
                <Unlock className="w-4 h-4 mr-2" aria-hidden="true" />
              )}
              {isConsuming ? tCredits('unlocking') : tCredits('unlock')}
            </Button>
          ) : (
            <div className="space-y-2">
              <p className="text-xs text-center text-muted-foreground">
                {tCredits('insufficientCredits')}
              </p>
              <Link href="/credits" className="block">
                <Button className="w-full" size="sm" variant="default">
                  <Coins className="w-4 h-4 mr-2" aria-hidden="true" />
                  {tCredits('buyCredits')}
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 border-green-500 bg-green-50';
    if (score >= 60) return 'text-yellow-600 border-yellow-500 bg-yellow-50';
    if (score >= 40) return 'text-orange-600 border-orange-500 bg-orange-50';
    return 'text-red-600 border-red-500 bg-red-50';
  };

  const getScoreLabel = (score: number, locale: string) => {
    if (locale === 'fr') {
      if (score >= 80) return 'Excellent';
      if (score >= 60) return 'Bon';
      if (score >= 40) return 'Moyen';
      return 'Faible';
    }
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Average';
    return 'Poor';
  };

  return (
    <Card className="sticky top-4">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Gauge className="h-4 w-4" />
          {t('title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="text-sm text-destructive flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            {locale === 'fr' ? 'Erreur de generation' : 'Generation error'}
          </div>
        )}

        {!object && !isLoading && (
          <Button onClick={handleGenerate} className="w-full" size="sm">
            {locale === 'fr' ? 'Analyser la fiabilite' : 'Analyze reliability'}
          </Button>
        )}

        {isLoading && !object && (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}

        {object && (
          <div className="space-y-4">
            {/* Score Display */}
            {object.reliabilityScore !== undefined && (
              <div
                className={cn(
                  'flex items-center justify-between p-3 rounded-lg border-2',
                  getScoreColor(object.reliabilityScore)
                )}
              >
                <div>
                  <p className="text-xs font-medium opacity-80">
                    {locale === 'fr' ? 'Score' : 'Score'}
                  </p>
                  <p className="text-2xl font-bold">
                    {object.reliabilityScore}/100
                  </p>
                </div>
                <Badge variant="secondary">
                  {getScoreLabel(object.reliabilityScore, locale)}
                </Badge>
              </div>
            )}

            {/* Buying Recommendation */}
            {object.buyingAdvice?.recommendation && (
              <div className="text-sm">
                <p className="font-medium mb-1">
                  {locale === 'fr' ? 'Recommandation' : 'Recommendation'}
                </p>
                <Badge
                  className={cn(
                    object.buyingAdvice.recommendation === 'highly_recommended' && 'bg-green-600',
                    object.buyingAdvice.recommendation === 'recommended' && 'bg-green-500',
                    object.buyingAdvice.recommendation === 'neutral' && 'bg-gray-500',
                    object.buyingAdvice.recommendation === 'caution' && 'bg-orange-500',
                    object.buyingAdvice.recommendation === 'not_recommended' && 'bg-red-500'
                  )}
                >
                  {object.buyingAdvice.recommendation === 'highly_recommended' && (locale === 'fr' ? 'Tres recommande' : 'Highly recommended')}
                  {object.buyingAdvice.recommendation === 'recommended' && (locale === 'fr' ? 'Recommande' : 'Recommended')}
                  {object.buyingAdvice.recommendation === 'neutral' && (locale === 'fr' ? 'Neutre' : 'Neutral')}
                  {object.buyingAdvice.recommendation === 'caution' && (locale === 'fr' ? 'Attention' : 'Caution')}
                  {object.buyingAdvice.recommendation === 'not_recommended' && (locale === 'fr' ? 'Deconseille' : 'Not recommended')}
                </Badge>
              </div>
            )}

            {/* Expandable Details */}
            <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="w-full justify-between">
                  {locale === 'fr' ? 'Voir les details' : 'View details'}
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-3 pt-3">
                {/* Common Problems Summary */}
                {object.commonProblems && object.commonProblems.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">
                      {t('commonProblems')}
                    </p>
                    <ul className="space-y-1">
                      {object.commonProblems.slice(0, 3).map((problem, i) => {
                        if (!problem) return null;
                        return (
                          <li key={i} className="text-xs flex items-start gap-1">
                            <span className="text-orange-500 mt-0.5">•</span>
                            <span>{problem.title}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}

                {/* Repair Costs Summary */}
                {object.repairCosts && object.repairCosts.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">
                      {t('repairCosts')}
                    </p>
                    <ul className="space-y-1">
                      {object.repairCosts.slice(0, 3).map((cost, i) => {
                        if (!cost) return null;
                        return (
                          <li key={i} className="text-xs flex justify-between">
                            <span className="truncate mr-2">{cost.item}</span>
                            <span className="font-medium whitespace-nowrap">
                              {cost.minCost}-{cost.maxCost}€
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}

                {/* Summary */}
                {object.overallSummary && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">
                      {locale === 'fr' ? 'Resume' : 'Summary'}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-4">
                      {object.overallSummary}
                    </p>
                  </div>
                )}
              </CollapsibleContent>
            </Collapsible>

            {/* Regenerate */}
            {!isLoading && (
              <Button
                onClick={handleGenerate}
                variant="outline"
                size="sm"
                className="w-full"
              >
                {locale === 'fr' ? 'Regenerer' : 'Regenerate'}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
