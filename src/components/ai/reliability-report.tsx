'use client';

import { useTranslations } from 'next-intl';
import { experimental_useObject as useObject } from '@ai-sdk/react';
import {
  AlertTriangle,
  DollarSign,
  Wrench,
  ShoppingCart,
  Gauge,
  CheckCircle2,
  XCircle,
  Info,
  TrendingUp,
  TrendingDown,
  Minus,
  Euro,
} from 'lucide-react';

import { reliabilityReportSchema } from '@/lib/ai/schemas';
import { ReportSkeleton } from './report-skeleton';
import {
  ReportSection,
  ScoreDisplay,
  FrequencyBadge,
  SeverityBadge,
  PriorityBadge,
  RecommendationBadge,
} from './report-section';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface AIReliabilityReportProps {
  generationId: number;
  locale: 'fr' | 'en';
}

export function AIReliabilityReport({ generationId, locale }: AIReliabilityReportProps) {
  const t = useTranslations('AI.report');

  const { object, submit, isLoading, error } = useObject({
    api: '/api/ai/report',
    schema: reliabilityReportSchema,
  });

  const handleGenerate = () => {
    submit({ generationId, locale });
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Erreur</AlertTitle>
        <AlertDescription>
          {locale === 'fr'
            ? 'Une erreur est survenue lors de la generation du rapport. Veuillez reessayer.'
            : 'An error occurred while generating the report. Please try again.'}
        </AlertDescription>
        <Button onClick={handleGenerate} variant="outline" className="mt-4">
          {locale === 'fr' ? 'Reessayer' : 'Try again'}
        </Button>
      </Alert>
    );
  }

  if (!object && !isLoading) {
    return (
      <div className="text-center py-12 space-y-4">
        <Gauge className="h-16 w-16 mx-auto text-muted-foreground" />
        <h3 className="text-lg font-semibold">{t('title')}</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          {locale === 'fr'
            ? 'Cliquez sur le bouton ci-dessous pour generer une analyse IA detaillee de la fiabilite de ce vehicule.'
            : 'Click the button below to generate a detailed AI analysis of this vehicle\'s reliability.'}
        </p>
        <Button onClick={handleGenerate} size="lg">
          {locale === 'fr' ? 'Generer le rapport' : 'Generate report'}
        </Button>
      </div>
    );
  }

  if (isLoading && !object) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
          <span>{t('loading')}</span>
        </div>
        <ReportSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Reliability Score */}
      {object?.reliabilityScore !== undefined && (
        <ReportSection
          title={t('reliabilityScore')}
          icon={<Gauge className="h-5 w-5" />}
        >
          <ScoreDisplay
            score={object.reliabilityScore}
            explanation={object.scoreExplanation}
          />
        </ReportSection>
      )}

      {/* Common Problems */}
      {object?.commonProblems && object.commonProblems.length > 0 && (
        <ReportSection
          title={t('commonProblems')}
          icon={<AlertTriangle className="h-5 w-5" />}
        >
          <div className="space-y-4">
            {object.commonProblems.map((problem, index) => {
              if (!problem) return null;
              return (
                <div
                  key={index}
                  className="border-b last:border-0 pb-4 last:pb-0"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="font-medium">{problem.title}</h4>
                    <div className="flex gap-2 shrink-0">
                      {problem.frequency && <FrequencyBadge frequency={problem.frequency} />}
                      {problem.severity && <SeverityBadge severity={problem.severity} />}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{problem.description}</p>
                  {problem.typicalMileage && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {locale === 'fr' ? 'Kilometrage typique: ' : 'Typical mileage: '}
                      {problem.typicalMileage}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </ReportSection>
      )}

      {/* Repair Costs */}
      {object?.repairCosts && object.repairCosts.length > 0 && (
        <ReportSection
          title={t('repairCosts')}
          icon={<DollarSign className="h-5 w-5" />}
        >
          <div className="space-y-2">
            {object.repairCosts.map((cost, index) => {
              if (!cost) return null;
              return (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                >
                  <div>
                    <p className="font-medium">{cost.item}</p>
                    <p className="text-xs text-muted-foreground">{cost.frequency}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {cost.minCost}€ - {cost.maxCost}€
                    </p>
                    {cost.laborHours && (
                      <p className="text-xs text-muted-foreground">
                        {cost.laborHours}h {locale === 'fr' ? 'de main d\'oeuvre' : 'labor'}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </ReportSection>
      )}

      {/* Maintenance Tips */}
      {object?.maintenanceTips && object.maintenanceTips.length > 0 && (
        <ReportSection
          title={t('maintenanceTips')}
          icon={<Wrench className="h-5 w-5" />}
        >
          <div className="space-y-4">
            {object.maintenanceTips.map((tip, index) => {
              if (!tip) return null;
              return (
                <div key={index} className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{tip.title}</h4>
                    {tip.priority && <PriorityBadge priority={tip.priority} />}
                  </div>
                  <p className="text-sm text-muted-foreground">{tip.description}</p>
                  {tip.interval && (
                    <p className="text-xs text-muted-foreground">
                      {locale === 'fr' ? 'Intervalle: ' : 'Interval: '}
                      {tip.interval}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </ReportSection>
      )}

      {/* Market Valuation */}
      {object?.marketValuation && (
        <ReportSection
          title={locale === 'fr' ? 'Estimation de valeur' : 'Market Valuation'}
          icon={<Euro className="h-5 w-5" />}
        >
          <div className="space-y-4">
            {/* Price Range */}
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-4 rounded-lg">
              <div className="text-center mb-3">
                <p className="text-sm text-muted-foreground mb-1">
                  {locale === 'fr' ? 'Prix moyen estime' : 'Estimated average price'}
                </p>
                <p className="text-3xl font-bold text-primary">
                  {object.marketValuation.averagePrice?.toLocaleString()} €
                </p>
              </div>
              <div className="flex justify-between text-sm">
                <div className="text-center">
                  <p className="text-muted-foreground">{locale === 'fr' ? 'Min' : 'Min'}</p>
                  <p className="font-semibold">{object.marketValuation.minPrice?.toLocaleString()} €</p>
                </div>
                <div className="text-center">
                  <p className="text-muted-foreground">{locale === 'fr' ? 'Max' : 'Max'}</p>
                  <p className="font-semibold">{object.marketValuation.maxPrice?.toLocaleString()} €</p>
                </div>
              </div>
            </div>

            {/* Price Explanation */}
            {object.marketValuation.priceExplanation && (
              <p className="text-sm text-muted-foreground">
                {object.marketValuation.priceExplanation}
              </p>
            )}

            {/* Market Trend */}
            {object.marketValuation.marketTrend && (
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <div className="shrink-0">
                  {object.marketValuation.marketTrend === 'rising' && (
                    <TrendingUp className="h-6 w-6 text-green-500" />
                  )}
                  {object.marketValuation.marketTrend === 'stable' && (
                    <Minus className="h-6 w-6 text-yellow-500" />
                  )}
                  {object.marketValuation.marketTrend === 'declining' && (
                    <TrendingDown className="h-6 w-6 text-red-500" />
                  )}
                </div>
                <div>
                  <p className="font-medium">
                    {locale === 'fr' ? 'Tendance du marche: ' : 'Market trend: '}
                    <span className={
                      object.marketValuation.marketTrend === 'rising' ? 'text-green-600' :
                      object.marketValuation.marketTrend === 'declining' ? 'text-red-600' :
                      'text-yellow-600'
                    }>
                      {locale === 'fr'
                        ? (object.marketValuation.marketTrend === 'rising' ? 'En hausse' :
                           object.marketValuation.marketTrend === 'declining' ? 'En baisse' : 'Stable')
                        : (object.marketValuation.marketTrend === 'rising' ? 'Rising' :
                           object.marketValuation.marketTrend === 'declining' ? 'Declining' : 'Stable')
                      }
                    </span>
                  </p>
                  {object.marketValuation.trendExplanation && (
                    <p className="text-sm text-muted-foreground">
                      {object.marketValuation.trendExplanation}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Depreciation Rate */}
            {object.marketValuation.depreciationRate && (
              <div className="text-sm">
                <span className="font-medium">
                  {locale === 'fr' ? 'Depreciation annuelle: ' : 'Annual depreciation: '}
                </span>
                <span className="text-muted-foreground">
                  {object.marketValuation.depreciationRate}
                </span>
              </div>
            )}

            {/* Best Time to Buy */}
            {object.marketValuation.bestTimeToBuy && (
              <div className="text-sm bg-green-50 dark:bg-green-950/20 p-3 rounded-lg">
                <span className="font-medium text-green-700 dark:text-green-400">
                  {locale === 'fr' ? 'Meilleur moment pour acheter: ' : 'Best time to buy: '}
                </span>
                <span className="text-green-600 dark:text-green-300">
                  {object.marketValuation.bestTimeToBuy}
                </span>
              </div>
            )}

            {/* Factors Affecting Value */}
            {object.marketValuation.factorsAffectingValue && object.marketValuation.factorsAffectingValue.length > 0 && (
              <div>
                <h5 className="font-medium mb-2">
                  {locale === 'fr' ? 'Facteurs influencant la valeur' : 'Factors affecting value'}
                </h5>
                <div className="space-y-2">
                  {object.marketValuation.factorsAffectingValue.map((factor, index) => {
                    if (!factor) return null;
                    return (
                      <div key={index} className="flex items-start gap-2 text-sm">
                        <span className={`shrink-0 mt-0.5 ${
                          factor.impact === 'positive' ? 'text-green-500' :
                          factor.impact === 'negative' ? 'text-red-500' :
                          'text-gray-400'
                        }`}>
                          {factor.impact === 'positive' ? '+' : factor.impact === 'negative' ? '-' : '•'}
                        </span>
                        <div>
                          <span className="font-medium">{factor.factor}: </span>
                          <span className="text-muted-foreground">{factor.description}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </ReportSection>
      )}

      {/* Buying Advice */}
      {object?.buyingAdvice && (
        <ReportSection
          title={t('buyingAdvice')}
          icon={<ShoppingCart className="h-5 w-5" />}
        >
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <RecommendationBadge recommendation={object.buyingAdvice.recommendation ?? "neutral"} />
            </div>

            <p className="text-sm">{object.buyingAdvice.summary}</p>

            {object.buyingAdvice.prosAndCons && (
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h5 className="font-medium text-green-600 flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" />
                    {locale === 'fr' ? 'Points positifs' : 'Pros'}
                  </h5>
                  <ul className="space-y-1 text-sm">
                    {object.buyingAdvice.prosAndCons.pros?.map((pro, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-green-600 mt-1">+</span>
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-2">
                  <h5 className="font-medium text-red-600 flex items-center gap-1">
                    <XCircle className="h-4 w-4" />
                    {locale === 'fr' ? 'Points negatifs' : 'Cons'}
                  </h5>
                  <ul className="space-y-1 text-sm">
                    {object.buyingAdvice.prosAndCons.cons?.map((con, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-red-600 mt-1">-</span>
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {object.buyingAdvice.idealBuyer && (
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-sm">
                  <span className="font-medium">
                    {locale === 'fr' ? 'Acheteur ideal: ' : 'Ideal buyer: '}
                  </span>
                  {object.buyingAdvice.idealBuyer}
                </p>
              </div>
            )}

            {object.buyingAdvice.thingsToCheck && object.buyingAdvice.thingsToCheck.length > 0 && (
              <div>
                <h5 className="font-medium flex items-center gap-1 mb-2">
                  <Info className="h-4 w-4" />
                  {locale === 'fr' ? 'Points a verifier' : 'Things to check'}
                </h5>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  {object.buyingAdvice.thingsToCheck.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </ReportSection>
      )}

      {/* Overall Summary */}
      {object?.overallSummary && (
        <ReportSection
          title={locale === 'fr' ? 'Resume' : 'Summary'}
          icon={<Info className="h-5 w-5" />}
        >
          <p className="text-sm leading-relaxed">{object.overallSummary}</p>
        </ReportSection>
      )}

      {/* Regenerate button */}
      {!isLoading && object && (
        <div className="text-center">
          <Button onClick={handleGenerate} variant="outline">
            {locale === 'fr' ? 'Regenerer le rapport' : 'Regenerate report'}
          </Button>
        </div>
      )}
    </div>
  );
}
