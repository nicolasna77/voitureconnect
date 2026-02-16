'use client';

import { useTranslations } from 'next-intl';
import { experimental_useObject as useObject } from '@ai-sdk/react';
import {
  AlertTriangle,
  Gauge,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

import { reliabilityReportSchema } from '@/lib/ai/schemas';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAIAccess } from '@/hooks/use-ai-access';

import {
  AccessGateLoading,
  AccessGateError,
  AccessGateLogin,
  AccessGateUnlock,
} from './_components/access-gate';
import { ScoreDisplay } from './_components/score-display';
import { ReportDetails } from './_components/report-details';

interface AIReliabilityWidgetProps {
  generationId: number;
  locale: 'fr' | 'en';
}

export function AIReliabilityWidget({ generationId, locale }: AIReliabilityWidgetProps) {
  const t = useTranslations('AI.report');

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

  const title = t('title');

  // Access check states
  if (isLoadingAccess) {
    return <AccessGateLoading title={title} />;
  }

  if (isAccessError) {
    return <AccessGateError locale={locale} title={title} />;
  }

  const hasAccess = accessState?.hasAccess ?? false;
  const isAuthenticated = accessState?.isAuthenticated ?? false;
  const requiresCredits = accessState?.requiresCredits ?? true;

  // Access gate
  if (!hasAccess && requiresCredits) {
    if (!isAuthenticated) {
      return <AccessGateLogin locale={locale} title={title} />;
    }

    return (
      <AccessGateUnlock
        locale={locale}
        title={title}
        creditBalance={accessState?.creditBalance ?? 0}
        creditCost={accessState?.creditCost ?? 1}
        isConsuming={isConsuming}
        onUnlock={consume}
      />
    );
  }

  // Report view
  const handleGenerate = () => submit({ generationId, locale });

  return (
    <Card className="sticky top-4">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Gauge className="h-4 w-4" aria-hidden="true" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="text-sm text-destructive flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" aria-hidden="true" />
            {locale === 'fr' ? 'Erreur de generation' : 'Generation error'}
          </div>
        )}

        {!object && !isLoading && (
          <Button onClick={handleGenerate} className="w-full" size="sm">
            {locale === 'fr' ? 'Analyser la fiabilite' : 'Analyze reliability'}
          </Button>
        )}

        {isLoading && !object && (
          <div className="flex items-center justify-center py-4" role="status" aria-live="polite">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" aria-hidden="true" />
          </div>
        )}

        {object && (
          <div className="space-y-4">
            {object.reliabilityScore !== undefined && (
              <ScoreDisplay score={object.reliabilityScore} locale={locale} />
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

            <ReportDetails
              locale={locale}
              commonProblems={object.commonProblems}
              repairCosts={object.repairCosts}
              overallSummary={object.overallSummary}
              sources={object.sources}
            />

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
