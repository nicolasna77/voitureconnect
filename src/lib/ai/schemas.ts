import { z } from 'zod';

// Note: OpenAI Structured Output requires all properties to be required
// Use .nullable() instead of .optional() for fields that may not have a value

export const commonProblemSchema = z.object({
  title: z.string().describe('Title of the common problem'),
  description: z.string().describe('Detailed description of the problem'),
  frequency: z.enum(['rare', 'occasional', 'common', 'very_common']).describe('How frequently this problem occurs'),
  severity: z.enum(['low', 'medium', 'high', 'critical']).describe('Severity level of the problem'),
  typicalMileage: z.string().nullable().describe('Typical mileage when this problem appears, or null if unknown'),
});

export const repairCostSchema = z.object({
  item: z.string().describe('Repair item or part name'),
  minCost: z.number().describe('Minimum estimated cost in euros'),
  maxCost: z.number().describe('Maximum estimated cost in euros'),
  laborHours: z.number().nullable().describe('Estimated labor hours, or null if unknown'),
  frequency: z.string().describe('How often this repair is typically needed'),
});

export const maintenanceTipSchema = z.object({
  title: z.string().describe('Title of the maintenance tip'),
  description: z.string().describe('Detailed maintenance recommendation'),
  interval: z.string().nullable().describe('Recommended interval (km or time), or null if not applicable'),
  priority: z.enum(['low', 'medium', 'high']).describe('Priority level'),
});

export const marketValuationSchema = z.object({
  minPrice: z.number().describe('Minimum estimated market value in euros'),
  maxPrice: z.number().describe('Maximum estimated market value in euros'),
  averagePrice: z.number().describe('Average estimated market value in euros'),
  priceExplanation: z.string().describe('Explanation of factors affecting the price'),
  marketTrend: z.enum(['rising', 'stable', 'declining']).describe('Current market price trend'),
  trendExplanation: z.string().describe('Brief explanation of the market trend'),
  bestTimeToBuy: z.string().nullable().describe('Recommendation on the best time to buy, or null if no specific recommendation'),
  depreciationRate: z.string().nullable().describe('Estimated annual depreciation rate, or null if unknown'),
  factorsAffectingValue: z.array(z.object({
    factor: z.string().describe('Factor name (e.g., mileage, condition, options)'),
    impact: z.enum(['positive', 'neutral', 'negative']).describe('Impact on value'),
    description: z.string().describe('How this factor affects the value'),
  })).describe('Key factors that affect the vehicle value'),
});

export const reliabilityReportSchema = z.object({
  reliabilityScore: z.number().min(0).max(100).describe('Overall reliability score from 0 to 100'),
  scoreExplanation: z.string().describe('Brief explanation of the reliability score'),

  commonProblems: z.array(commonProblemSchema).describe('List of common known problems'),

  repairCosts: z.array(repairCostSchema).describe('Estimated repair costs for common repairs'),

  maintenanceTips: z.array(maintenanceTipSchema).describe('Specific maintenance recommendations'),

  marketValuation: marketValuationSchema.describe('Market value estimation for this vehicle'),

  buyingAdvice: z.object({
    recommendation: z.enum(['highly_recommended', 'recommended', 'neutral', 'caution', 'not_recommended']).describe('Overall buying recommendation'),
    summary: z.string().describe('Brief summary of buying advice'),
    prosAndCons: z.object({
      pros: z.array(z.string()).describe('Positive points about this vehicle'),
      cons: z.array(z.string()).describe('Negative points about this vehicle'),
    }),
    idealBuyer: z.string().describe('Description of who this vehicle is best suited for'),
    thingsToCheck: z.array(z.string()).describe('Specific things to check before buying'),
  }),

  overallSummary: z.string().describe('A comprehensive summary of the reliability analysis'),
});

export type ReliabilityReport = z.infer<typeof reliabilityReportSchema>;
export type CommonProblem = z.infer<typeof commonProblemSchema>;
export type RepairCost = z.infer<typeof repairCostSchema>;
export type MaintenanceTip = z.infer<typeof maintenanceTipSchema>;
export type MarketValuation = z.infer<typeof marketValuationSchema>;
